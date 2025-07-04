import { z } from 'zod';

export const TagFiltersSchema = z.object({
  search: z.string().optional()
});

export type TTagFilters = z.infer<typeof TagFiltersSchema>;