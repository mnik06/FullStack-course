import { z } from 'zod';
import { CommentSchema } from './Comment';

export const CommentUpsertData = CommentSchema.pick({
  text: true,
  createdAt: true,
  updatedAt: true
}).partial(); 

export type TCommentUpsertData = z.infer<typeof CommentUpsertData>;
