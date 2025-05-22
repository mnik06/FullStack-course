import { z } from 'zod';

export const CommentSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  updatedAt: z.date(),
  createdAt: z.date()
});

export type TComment = z.infer<typeof CommentSchema>; 