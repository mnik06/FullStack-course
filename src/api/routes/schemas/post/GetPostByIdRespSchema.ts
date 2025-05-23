import { z } from 'zod';
import { CommentSchema } from 'src/types/db/Comment';

export const GetPostByIdRespSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional().nullable(),
  updatedAt: z.date(),
  createdAt: z.date(),
  comments: z.array(CommentSchema)
});
