import { z } from 'zod';

export const PaginationSchema = z.object({
  offset: z.coerce.number().optional(),
  limit: z.coerce.number().max(100).optional()
});
export type TPagination = z.infer<typeof PaginationSchema>;

export const PaginationMetadataSchema = PaginationSchema.extend({
  total: z.number().optional(),
  totalPages: z.number().optional(),
  page: z.number().optional()
});
export type TPaginationMetadata = z.infer<typeof PaginationMetadataSchema>;

export type TPaginationResponse<T> = {
  data: T;
  meta: TPaginationMetadata;
}
