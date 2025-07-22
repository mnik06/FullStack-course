import { z } from 'zod';
import { CommentSchema } from './Comment';

export const CommentWithDeletedAtSchema = CommentSchema.extend({
  deletedAt: z.date().nullable(),
  user: CommentSchema.pick({
    user: true
  }).optional()
});

export type TCommentWithDeletedAt = z.infer<typeof CommentWithDeletedAtSchema>;
