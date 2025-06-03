import { and, asc, count, desc, eq, getTableColumns, or, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { commentTable, postTable } from 'src/services/drizzle/schema';
import { getPaginationService } from 'src/services/pagination/pagination.service';
import { getFiltersService } from 'src/services/filters/filters.service';

import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost } from 'src/types/post/schemas/Post';
import { PostSchemaWithComments } from 'src/types/post/schemas/PostWithComments';
import { PostSchemaWithCommentsCount } from 'src/types/post/schemas/PostWithCommentsCount';

export function getPostRepo(db: NodePgDatabase): IPostRepo {
  return {
    async createPost(data) {
      const post = await db
        .insert(postTable)
        .values(data as TPost)
        .returning();

      return PostSchemaWithComments.parse({ ...post[0], comments: [] });
    },

    async getPosts(params) {
      const paginationService = getPaginationService();
      const filtersService = getFiltersService();

      const querySelection = {
        ...getTableColumns(postTable),
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
        .leftJoin(commentTable, eq(postTable.id, commentTable.postId))
        .groupBy(postTable.id)
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
      const posts = await db
        .select({
          ...getTableColumns(postTable),
          comments: commentTable
        })
        .from(postTable)
        .leftJoin(commentTable, eq(postTable.id, commentTable.postId))
        .where(eq(postTable.id, id));

      if (!posts.length) {
        return null;
      }

      return PostSchemaWithComments.parse({
        ...posts[0],
        comments: posts.flatMap(post => post.comments).filter(Boolean)
      });
    },

    async updatePostById(id, data) {
      const posts = await db
        .update(postTable)
        .set(data as TPost)
        .where(eq(postTable.id, id))
        .returning();

      if (!posts.length) {
        return null;
      }

      const comments = await db
        .select()
        .from(commentTable)
        .where(eq(commentTable.postId, id));

      return PostSchemaWithComments.parse({
        ...posts[0],
        comments
      });
    },

    async deletePost(id) {
      const posts = await db.delete(postTable).where(eq(postTable.id, id)).returning();
      return posts.length > 0;
    }
  };
} 