import { count, eq, getTableColumns } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost, PostSchemaWithComments, PostSchemaWithCommentsCount } from 'src/types/db/Post';
import { commentTable, postTable } from 'src/services/drizzle/schema';

export function getPostRepo(db: NodePgDatabase): IPostRepo {
  return {
    async createPost(data) {
      const post = await db
        .insert(postTable)
        .values(data as TPost)
        .returning();

      return PostSchemaWithComments.parse({ ...post[0], comments: [] });
    },

    async getPosts() {
      const posts = await db
        .select({
          ...getTableColumns(postTable),
          commentsCount: count(commentTable.id)
        })
        .from(postTable)
        .leftJoin(commentTable, eq(postTable.id, commentTable.postId))
        .groupBy(postTable.id);

        return PostSchemaWithCommentsCount.array().parse(posts);
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