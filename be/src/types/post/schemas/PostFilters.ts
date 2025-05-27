import { z } from 'zod';
import { PaginationSchema } from 'src/types/Pagination';
import { PostSortBySchema } from 'src/types/post/Post.utils';
import { SortOrderSchema } from 'src/types/Sorting';

export const PostFiltersSchema = PaginationSchema.extend({
  search: z.string().optional(),
  sortBy: PostSortBySchema.optional(),
  sortOrder: SortOrderSchema.optional()
});

export type TPostFilters = z.infer<typeof PostFiltersSchema>;