import { z } from 'zod';

export const GetPostsRespSchema = z.array(z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional().nullable(),
  updatedAt: z.date(),
  createdAt: z.date(),
  commentsCount: z.number()
}));

export type TGetPostsResp = z.infer<typeof GetPostsRespSchema>