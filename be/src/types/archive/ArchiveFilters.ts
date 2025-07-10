import { z } from 'zod';
import { ArchiveEntityType } from './schemas/Archive';

export const ArchiveFiltersSchema = z.object({
  entityType: ArchiveEntityType.optional()
});
export type TArchiveFilters = z.infer<typeof ArchiveFiltersSchema>;
