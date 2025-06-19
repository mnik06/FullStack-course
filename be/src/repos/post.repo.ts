import { and, asc, count, desc, eq, getTableColumns, or, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { commentTable, postTable, userTable } from 'src/services/drizzle/schema';
import { getPaginationService } from 'src/services/pagination/pagination.service';
import { getFiltersService } from 'src/services/filters/filters.service';

import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost } from 'src/types/post/schemas/Post';
import { PostSchemaWithComments } from 'src/types/post/schemas/PostWithComments';
import { PostSchemaWithCommentsCount } from 'src/types/post/schemas/PostWithCommentsCount';

export function getPostRepo(db: NodePgDatabase): IPostRepo {
  return {
    async createPost(data, user) {
      const [post] = await db
        .insert(postTable)
        .values(data as TPost)
        .returning();

      return PostSchemaWithComments.parse({ ...post, user, comments: [] });
    },

    async getPosts(params = {}) {
      const paginationService = getPaginationService();
      const filtersService = getFiltersService();

      const querySelection = {
        ...getTableColumns(postTable),
        user: userTable,
        commentsCount: count(commentTable.id)
      };
      const sortByColumn = querySelection[params.sortBy || 'createdAt'];
      const filters = filtersService.getNumericFilters(
        postTable,
        querySelection, 
        params.numericFilters || []
      );

      const qb = db
        .select({
          ...querySelection, 
          totalCount: sql<number>`cast(count(*) over() as int)` 
        })
        .from(postTable)
        .where(
          and(
            params.search
              ? or(
                sql`WORD_SIMILARITY(${params.search}, ${postTable.title}) > 0.5`,
                sql`to_tsvector('english', ${postTable.description}) @@ plainto_tsquery(${params.search})`
              ) 
              : undefined,
            ...filters.whereFilters
          )
        )
        .leftJoin(userTable, eq(postTable.userId, userTable.id))
        .leftJoin(commentTable, eq(postTable.id, commentTable.postId))
        .groupBy(postTable.id, userTable.id)
        .having(and(...filters.havingFilters))
        .orderBy(params.sortOrder === 'desc' ? desc(sortByColumn) : asc(sortByColumn))
        .$dynamic();

      const posts = await paginationService.withPagination(
        qb, 
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
            user: userTable
          })
          .from(postTable)
          .leftJoin(userTable, eq(postTable.userId, userTable.id))
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

      const [[user], comments] = await Promise.all([
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
          .leftJoin(userTable, eq(commentTable.userId, userTable.id))
      ]);

      return PostSchemaWithComments.parse({
        ...post,
        comments,
        user
      });
    },

    async deletePost(id) {
      const [post] = await db.delete(postTable).where(eq(postTable.id, id)).returning();
      return !!post;
    }
  };
} 