import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

import { tagTable } from 'src/services/drizzle/schema';
import { ITagRepo } from 'src/types/repos/ITagRepo';
import { TTag } from 'src/types/tag/schemas/Tag';
import { TagSchema } from 'src/types/tag/schemas/Tag';

export function getTagRepo(db: NodePgDatabase): ITagRepo {
  return {
    async getTags() {
      const tags = await db.select().from(tagTable);

      return TagSchema.array().parse(tags);
    },

    async createTag(data) {
      const [tag] = await db.insert(tagTable).values(data as TTag).returning();
      
      return TagSchema.parse(tag);
    },

    async deleteTagById(id) {
      const [tag] = await db.delete(tagTable).where(eq(tagTable.id, id)).returning();

      return !!tag;
    }
  };
}