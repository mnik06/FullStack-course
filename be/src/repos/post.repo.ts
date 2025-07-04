import { and, asc, count, desc, eq, getTableColumns, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { commentTable, postTable, postToTagTable, tagTable, userTable } from 'src/services/drizzle/schema';
import { getPaginationService } from 'src/services/pagination/pagination.service';
import { getFiltersService } from 'src/services/filters/filters.service';

import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost } from 'src/types/post/schemas/Post';
import { PostSchemaWithComments } from 'src/types/post/schemas/PostWithComments';
import { PostSchemaWithCommentsCount } from 'src/types/post/schemas/PostWithCommentsCount';
import { getSearchService } from 'src/services/search/search.service';
import { jsonAggBuildObject, totalCountOver } from './common/helpers';

export function getPostRepo(db: NodePgDatabase): IPostRepo {
  return {
    async createPost(data, user) {
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
      const tagFilters = params.tagIds?.length
        ? inArray(postToTagTable.tagId, params.tagIds)
        : undefined;

      const postsQb = db
        .select({
          ...querySelection, 
          totalCount: totalCountOver()
        })
        .from(postTable)
        .where(and(searchFilters, tagFilters, ...numericFilters.whereFilters))
        .leftJoin(userTable, eq(postTable.userId, userTable.id))
        .leftJoin(commentTable, eq(postTable.id, commentTable.postId))
        .leftJoin(postToTagTable, eq(postTable.id, postToTagTable.postId))
        .leftJoin(tagTable, eq(postToTagTable.tagId, tagTable.id))
        .groupBy(postTable.id, userTable.id)
        .having(and(...numericFilters.havingFilters))
        .orderBy(params.sortOrder === 'desc' ? desc(sortByColumn) : asc(sortByColumn))
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

    async getPostById(id) {
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
          .groupBy(postTable.id, userTable.id, tagTable.id)
          .where(eq(postTable.id, id)),
        db
          .select({
            ...getTableColumns(commentTable),
            user: userTable
          })
          .from(commentTable)
          .where(eq(commentTable.postId, id))
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
      const [post] = await db
        .update(postTable)
        .set(data as TPost)
        .where(eq(postTable.id, id))
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

    async deletePost(id) {
      const [post] = await db.delete(postTable).where(eq(postTable.id, id)).returning();
      return !!post;
    }
  };
} 