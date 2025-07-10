import { z } from 'zod';

export const ArchiveEntityType = z.enum(['post', 'comment', 'user']);
export type TArchiveEntityType = z.infer<typeof ArchiveEntityType>;

export const ArchiveSchema = z.object({
  id: z.string(),
  deletedAt: z.date(),
  deletedBy: z.string(),
  entityId: z.string(),
  entityType: ArchiveEntityType,
  data: z.object({})
});
export type TArchive = z.infer<typeof ArchiveSchema>;
