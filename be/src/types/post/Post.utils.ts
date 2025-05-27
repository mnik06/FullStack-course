import { z } from 'zod';

export const PostSortBySchema = z.enum(['createdAt', 'title', 'commentsCount']);
export type TPostSortBy = z.infer<typeof PostSortBySchema>;

