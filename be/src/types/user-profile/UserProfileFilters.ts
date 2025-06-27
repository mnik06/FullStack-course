import { z } from 'zod';
import { PaginationSchema } from 'src/types/Pagination';

export const UserProfileFiltersSchema = PaginationSchema.extend({
  search: z.string().optional()
});

export type TUserProfileFilters = z.infer<typeof UserProfileFiltersSchema>;