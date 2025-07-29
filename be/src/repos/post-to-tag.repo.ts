import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { postToTagTable, tagTable } from 'src/services/drizzle/schema';
import { IPostToTagRepo } from 'src/types/repos/IPostToTagRepo';
import { and, eq, inArray, notInArray } from 'drizzle-orm';
import { TagSchema } from 'src/types/tag/schemas/Tag';
import { TTransaction } from 'src/types/ITransactionManager';

export function getPostToTagRepo(db: NodePgDatabase): IPostToTagRepo {
  return {
    async updateTagsForPost(postId, tagIds = [], transaction) {
      const dbToUse = transaction || db;

      if (!tagIds.length) {
        await dbToUse
          .delete(postToTagTable)
          .where(eq(postToTagTable.postId, postId));

        return [];
      }

      const updateTags = async (tx: TTransaction) => {
        await tx
          .delete(postToTagTable)
          .where(and(
            eq(postToTagTable.postId, postId),
            notInArray(postToTagTable.tagId, tagIds)
          ));

        await tx.insert(postToTagTable)
          .values(tagIds.map((tagId) => ({ postId, tagId })))
          .onConflictDoNothing({ target: [postToTagTable.postId, postToTagTable.tagId] });
      };

      if (transaction) {
        await updateTags(transaction);
      } else {
        await dbToUse.transaction(updateTags);
      }

      const tags = await dbToUse.select()
        .from(tagTable)
        .where(inArray(tagTable.id, tagIds));

      return TagSchema.array().parse(tags);
    }
  };
}