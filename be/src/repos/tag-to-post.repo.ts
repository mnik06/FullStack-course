import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { TPostToTag } from 'src/types/post-to-tag/schemas/PostToTag';
import { postToTagTable } from 'src/services/drizzle/schema';
import { PostToTagSchema } from 'src/types/post-to-tag/schemas/PostToTag';
import { IPostToTagRepo } from 'src/types/repos/IPostToTagRepo';
import { eq } from 'drizzle-orm';

export function getPostToTagRepo(db: NodePgDatabase): IPostToTagRepo {
  return {
    async createPostToTag(data) {
      const [postToTag] = await db.insert(postToTagTable).values(data as TPostToTag).returning();
      
      return PostToTagSchema.parse(postToTag);
    },

    async deletePostToTag(id) {
      const [postToTag] = await db
        .delete(postToTagTable)
        .where(eq(postToTagTable.id, id))
        .returning();
      
      return !!postToTag;
    }
  };
}