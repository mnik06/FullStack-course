import { z } from 'zod';
import { CommentSchema } from './Comment';

export const CommentWithDeletedAtSchema = CommentSchema.extend({
  deletedAt: z.date().nullable()
});

export type TCommentWithDeletedAt = z.infer<typeof CommentWithDeletedAtSchema>;
