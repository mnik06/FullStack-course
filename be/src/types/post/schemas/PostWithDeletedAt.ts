import { z } from 'zod';
import { PostSchema } from './Post';

export const PostWithDeletedAtSchema = PostSchema.extend({
  deletedAt: z.date().nullable(),
  user: z.undefined(),
  tags: z.undefined()
});

export type TPostWithDeletedAt = z.infer<typeof PostWithDeletedAtSchema>;
