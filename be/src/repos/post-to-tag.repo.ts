import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { postToTagTable, tagTable } from 'src/services/drizzle/schema';
import { IPostToTagRepo } from 'src/types/repos/IPostToTagRepo';
import { and, eq, inArray, notInArray } from 'drizzle-orm';
import { TagSchema } from 'src/types/tag/schemas/Tag';

export function getPostToTagRepo(db: NodePgDatabase): IPostToTagRepo {
  return {
    async updateTagsForPost(postId, tagIds = []) {
      if (!tagIds.length) {
        await db
          .delete(postToTagTable)
          .where(eq(postToTagTable.postId, postId));

        return [];
      }

      await db.transaction(async (tx) => {
        await tx
          .delete(postToTagTable)
          .where(and(
            eq(postToTagTable.postId, postId),
            notInArray(postToTagTable.tagId, tagIds)
          ));

        await tx.insert(postToTagTable)
          .values(tagIds.map((tagId) => ({ postId, tagId })))
          .onConflictDoNothing({ target:  [postToTagTable.postId, postToTagTable.tagId] });
      });

      const tags = await db.select()
        .from(tagTable)
        .where(inArray(tagTable.id, tagIds));

      return TagSchema.array().parse(tags);
    }
  };
}