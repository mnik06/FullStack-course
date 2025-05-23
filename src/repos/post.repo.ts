import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost, PostSchema } from 'src/types/db/Post';
import { postTable } from 'src/services/drizzle/schema';

export function getPostRepo(db: NodePgDatabase): IPostRepo {
  return {
    async createPost(data) {
      const post = await db.insert(postTable).values(data as TPost).returning();
      return PostSchema.parse(post[0]);
    },

    async getPosts() {
      const posts = await db
        .select()
        .from(postTable)
        .groupBy(postTable.id);
      return posts.map(post => PostSchema.parse(post));
    },

    async getPostById(id) {
      const post = await db.select().from(postTable).where(eq(postTable.id, id));
      return post.length > 0 ? PostSchema.parse(post[0]) : null;
    },

    async updatePostById(id, data) {
      const posts = await db
        .update(postTable)
        .set(data as TPost)
        .where(eq(postTable.id, id))
        .returning();
      return posts.length > 0 ? PostSchema.parse(posts[0]) : null;
    }
  };
} 