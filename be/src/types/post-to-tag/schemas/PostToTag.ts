import { z } from 'zod';

export const PostToTagSchema = z.object({
  id: z.string(),
  postId: z.string(),
  tagId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TPostToTag = z.infer<typeof PostToTagSchema>;
