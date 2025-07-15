import { and, asc, count, desc, eq, exists, getTableColumns, inArray, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { commentTable, postTable, postToTagTable, tagTable, userTable } from 'src/services/drizzle/schema';
import { getPaginationService } from 'src/services/pagination/pagination.service';
import { getFiltersService } from 'src/services/filters/filters.service';

import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost } from 'src/types/post/schemas/Post';
import { PostSchemaWithComments } from 'src/types/post/schemas/PostWithComments';
import { PostSchemaWithCommentsCount } from 'src/types/post/schemas/PostWithCommentsCount';
import { getSearchService } from 'src/services/search/search.service';
import { jsonAggBuildObject, totalCountOver } from 'src/repos/common/helpers';

const getIsPostNotDeletedFilter = () => {
  return isNull(postTable.deletedAt);
};

const getIsCommentNotDeletedFilter = () => {
  return isNull(commentTable.deletedAt);
};

const getTagFilters = (db: NodePgDatabase, tagIds: string[]) => {
  return tagIds?.length
    ? exists(
      db
        .select({ id: postToTagTable.id })
        .from(postToTagTable)
        .where(and(inArray(postToTagTable.tagId, tagIds), eq(postToTagTable.postId, postTable.id)))
    )
    : undefined;
};

export function getPostRepo(db: NodePgDatabase): IPostRepo {
  return {
    async createPost(data) {
      const [user] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, data.userId as string));

      if (!user) {
        return null;
      }

      const [post] = await db
        .insert(postTable)
        .values(data as TPost)
        .returning();

      return PostSchemaWithComments.parse({ ...post, user, tags: [], comments: [] });
    },

    async getPosts(params = {}) {
      const paginationService = getPaginationService();
      const filtersService = getFiltersService();
      const searchService = getSearchService();

      const querySelection = {
        ...getTableColumns(postTable),
        user: userTable,
        commentsCount: count(commentTable.id),
        tags: jsonAggBuildObject(getTableColumns(tagTable))
      };
      const sortByColumn = querySelection[params.sortBy || 'createdAt'];

      const numericFilters = filtersService.getNumericFilters(
        postTable,
        querySelection, 
        params.numericFilters || []
      );
      const searchFilters = searchService.getSearchFilters({
        searchQuery: params.search,
        trgmSearchColumns: [postTable.title],
        tsVectorSearchColumns: [postTable.description]
      });
      const tagFilters = getTagFilters(db, params.tagIds || []);
      const isPostNotDeletedFilter = getIsPostNotDeletedFilter();
      const isCommentNotDeletedFilter = getIsCommentNotDeletedFilter();

      const postsQb = db
        .select({
          ...querySelection, 
          totalCount: totalCountOver()
        })
        .from(postTable)
        .where(and(
          searchFilters,
          tagFilters,
          isPostNotDeletedFilter,
          ...numericFilters.whereFilters
        ))
        .leftJoin(userTable, eq(postTable.userId, userTable.id))
        .leftJoin(
          commentTable, 
          and(eq(postTable.id, commentTable.postId), isCommentNotDeletedFilter)
        )
        .leftJoin(postToTagTable, eq(postTable.id, postToTagTable.postId))
        .leftJoin(tagTable, eq(postToTagTable.tagId, tagTable.id))
        .groupBy(postTable.id, userTable.id)
        .having(and(...numericFilters.havingFilters))
        .orderBy(params.sortOrder === 'asc' ? asc(sortByColumn) : desc(sortByColumn))
        .$dynamic();
        
      const posts = await paginationService.withPagination(
        postsQb, 
        params
      );

      return {
        data: PostSchemaWithCommentsCount.array().parse(posts),
        meta: paginationService.calculatePaginationMeta({
          ...params, 
          total: posts[0]?.totalCount || 0 
        })
      };
    },

    async getPostsWithCommentsByUserId(userId: string) {
      const isPostNotDeletedFilter = getIsPostNotDeletedFilter();
      const isCommentNotDeletedFilter = getIsCommentNotDeletedFilter();

      const [posts, comments] = await Promise.all([
        db
          .select({
            ...getTableColumns(postTable),
            user: userTable,
            tags: jsonAggBuildObject(getTableColumns(tagTable))
          })
          .from(postTable)
          .where(and(eq(postTable.userId, userId), isPostNotDeletedFilter))
          .leftJoin(userTable, eq(postTable.userId, userTable.id))
          .leftJoin(postToTagTable, eq(postTable.id, postToTagTable.postId))
          .leftJoin(tagTable, eq(postToTagTable.tagId, tagTable.id))
          .groupBy(postTable.id, userTable.id),
        
        db
          .select({
            ...getTableColumns(commentTable),
            user: userTable
          })
          .from(commentTable)
          .where(isCommentNotDeletedFilter)
          .leftJoin(userTable, eq(commentTable.userId, userTable.id))
      ]);

      const commentsByPostId = comments.reduce((acc, comment) => {
        if (!acc[comment.postId]) {
          acc[comment.postId] = [];
        }
        
        acc[comment.postId].push(comment);
        return acc;
      }, {} as Record<string, typeof comments>);

      return PostSchemaWithComments.array().parse(posts.map((post) => ({
        ...post,
        comments: commentsByPostId[post.id] || []
      })));
    },

    async getPostById(id) {
      const isPostNotDeletedFilter = getIsPostNotDeletedFilter();
      const isCommentNotDeletedFilter = getIsCommentNotDeletedFilter();

      const [[post], comments] = await Promise.all([
        db
          .select({
            ...getTableColumns(postTable),
            user: userTable,
            tags: jsonAggBuildObject(getTableColumns(tagTable))
          })
          .from(postTable)
          .leftJoin(userTable, eq(postTable.userId, userTable.id))
          .leftJoin(postToTagTable, eq(postTable.id, postToTagTable.postId))
          .leftJoin(tagTable, eq(postToTagTable.tagId, tagTable.id))
          .groupBy(postTable.id, userTable.id)
          .where(and(eq(postTable.id, id), isPostNotDeletedFilter)),
        db
          .select({
            ...getTableColumns(commentTable),
            user: userTable
          })
          .from(commentTable)
          .where(and(eq(commentTable.postId, id), isCommentNotDeletedFilter))
          .leftJoin(userTable, eq(commentTable.userId, userTable.id))
      ]);

      if (!post) {
        return null;
      }

      return PostSchemaWithComments.parse({
        ...post,
        comments
      });
    },

    async updatePostById(id, data) {
      const isPostNotDeletedFilter = getIsPostNotDeletedFilter();

      const [post] = await db
        .update(postTable)
        .set(data as TPost)
        .where(and(eq(postTable.id, id), isPostNotDeletedFilter))
        .returning();

      if (!post) {
        return null;
      }

      const [[user], comments, tags] = await Promise.all([
        db
          .select({
            ...getTableColumns(userTable)
          })
          .from(userTable)
          .where(eq(userTable.id, post.userId)),
        db
          .select({
            ...getTableColumns(commentTable),
            user: userTable
          })
          .from(commentTable)
          .where(eq(commentTable.postId, id))
          .leftJoin(userTable, eq(commentTable.userId, userTable.id)),
        db
          .select({
            ...getTableColumns(tagTable)
          })
          .from(tagTable)
          .leftJoin(postToTagTable, eq(tagTable.id, postToTagTable.tagId))
          .where(eq(postToTagTable.postId, id))
      ]);

      return PostSchemaWithComments.parse({
        ...post,
        comments,
        user,
        tags
      });
    },

    async deletePostHard(id) {
      const [post] = await db.delete(postTable).where(eq(postTable.id, id)).returning();

      return !!post;
    },

    async deletePostSoft(id) {
      const [post] = await db
        .update(postTable)
        .set({ deletedAt: new Date() })
        .where(eq(postTable.id, id))
        .returning();

      await db.update(commentTable)
        .set({ deletedAt: new Date() })
        .where(eq(commentTable.postId, id));

      return !!post;
    }
  };
} 