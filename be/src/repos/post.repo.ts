import { and, asc, count, desc, eq, getTableColumns, or, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { commentTable, postTable } from 'src/services/drizzle/schema';

import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost } from 'src/types/post/schemas/Post';
import { PostSchemaWithComments } from 'src/types/post/schemas/PostWithComments';
import { PostSchemaWithCommentsCount } from 'src/types/post/schemas/PostWithCommentsCount';
import { getPaginationService } from 'src/services/pagination/pagination.service';

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

      const queryColumns = {
        ...getTableColumns(postTable),
        commentsCount: count(commentTable)
      };
      const sortByColumn = queryColumns[params.sortBy || 'createdAt'];

      const filters = and(
        params.search
          ? or(
            sql`SIMILARITY(${postTable.title}, ${params.search}) > 0.3`,
            sql`to_tsvector('english', ${postTable.description}) @@ plainto_tsquery('english', ${params.search})`
          ) 
          : undefined
      );

      const qb = db
        .select(queryColumns)
        .from(postTable)
        .where(filters)
        .leftJoin(commentTable, eq(postTable.id, commentTable.postId))
        .groupBy(postTable.id)
        .orderBy(params.sortOrder === 'desc' ? desc(sortByColumn) : asc(sortByColumn))
        .$dynamic();

      const postsCount = await db.$count(postTable, filters);
      const posts = await paginationService.withPagination(
        qb, 
        params
      );

      return {
        data: PostSchemaWithCommentsCount.array().parse(posts),
        meta: paginationService.calculatePaginationMeta({ ...params, total: postsCount })
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