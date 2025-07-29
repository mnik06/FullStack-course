import { z } from 'zod';
import { PaginationSchema } from 'src/types/Pagination';
import { PostSortBySchema } from 'src/types/post/Post.utils';
import { SortOrderSchema } from 'src/types/Sorting';
import { zodParamsArray } from 'src/core/helpers';

export const PostFiltersSchema = PaginationSchema.extend({
  search: z.string().optional(),
  sortBy: PostSortBySchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  numericFilters: zodParamsArray(z.string()),
  tagIds: zodParamsArray(z.string())
});

export type TPostFilters = z.infer<typeof PostFiltersSchema>;