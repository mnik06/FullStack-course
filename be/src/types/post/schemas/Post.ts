import { z } from 'zod';

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional().nullable(),
  readingTime: z.number(),
  updatedAt: z.date(),
  createdAt: z.date(),
  userId: z.string().uuid()
});
export type TPost = z.infer<typeof PostSchema>; 

