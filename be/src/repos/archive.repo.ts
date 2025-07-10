import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { archiveTable } from 'src/services/drizzle/schema';
import { TArchive, ArchiveSchema } from 'src/types/archive/schemas/Archive';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';

export function getArchiveRepo(db: NodePgDatabase): IArchiveRepo {
  return {
    async createArchive(data) {
      const [archive] = await db.insert(archiveTable).values(data as TArchive).returning();

      return ArchiveSchema.parse(archive);
    },
    
    async getArchiveById(id) {
      const [archive] = await db.select().from(archiveTable).where(eq(archiveTable.id, id));

      if (!archive) {
        return null;
      }

      return ArchiveSchema.parse(archive);
    },

    async getArchives(filters = {}) {
      const entityTypeFilters = filters.entityType 
        ? eq(archiveTable.entityType, filters.entityType) 
        : undefined;

      const archives = await db
        .select()
        .from(archiveTable)
        .where(entityTypeFilters);

      return ArchiveSchema.array().parse(archives);
    },

    async getArchiveByEntityId(entityId) {
      const [archive] = await db
        .select()
        .from(archiveTable)
        .where(eq(archiveTable.entityId, entityId));

      if (!archive) {
        return null;
      }

      return ArchiveSchema.parse(archive);
    },

    async deleteArchiveById(id) {
      const [archive] = await db.delete(archiveTable).where(eq(archiveTable.id, id)).returning();

      return !!archive;
    }
  };
}