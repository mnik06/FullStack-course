import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

import { tagTable } from 'src/services/drizzle/schema';
import { ITagRepo } from 'src/types/repos/ITagRepo';
import { TTag } from 'src/types/tag/schemas/Tag';
import { TagSchema } from 'src/types/tag/schemas/Tag';
import { getSearchService } from 'src/services/search/search.service';

export function getTagRepo(db: NodePgDatabase): ITagRepo {
  return {
    async getTags(filters) {
      const searchService = getSearchService();

      const searchFilters = searchService.getSearchFilters({
        searchQuery: filters.search,
        trgmSearchColumns: [tagTable.name]
      });

      const tags = await db
        .select()
        .from(tagTable)
        .where(searchFilters);

      return TagSchema.array().parse(tags);
    },

    async createTag(data) {
      const [tag] = await db.insert(tagTable).values(data as TTag).returning();
      
      return TagSchema.parse(tag);
    },

    async updateTagById(id, data) {
      const [tag] = await db
        .update(tagTable)
        .set(data as TTag)
        .where(eq(tagTable.id, id))
        .returning();

      if (!tag) {
        return null;
      }

      return TagSchema.parse(tag);
    },

    async deleteTagById(id) {
      const [tag] = await db.delete(tagTable).where(eq(tagTable.id, id)).returning();

      return !!tag;
    }
  };
}