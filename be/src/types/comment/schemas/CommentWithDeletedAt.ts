import { z } from 'zod';
import { CommentSchema } from './Comment';

export const CommentWithDeletedAtSchema = CommentSchema.extend({
  deletedAt: z.date().nullable(),
  user: z.undefined()
});

export type TCommentWithDeletedAt = z.infer<typeof CommentWithDeletedAtSchema>;
