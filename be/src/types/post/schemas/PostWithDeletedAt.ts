import { z } from 'zod';
import { PostSchema } from './Post';

export const PostWithDeletedAtSchema = PostSchema.extend({
  deletedAt: z.date().nullable()
});

export type TPostWithDeletedAt = z.infer<typeof PostWithDeletedAtSchema>;
