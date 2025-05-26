import { z } from 'zod';
import { CommentSchema } from 'src/types/db/Comment';

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional().nullable(),
  updatedAt: z.date(),
  createdAt: z.date()
});
export type TPost = z.infer<typeof PostSchema>; 

export const PostSchemaWithCommentsCount = PostSchema.extend({
  commentsCount: z.number()
});
export type TPostWithCommentsCount = z.infer<typeof PostSchemaWithCommentsCount>;

export const PostSchemaWithComments = PostSchema.extend({
  comments: z.array(CommentSchema)
});
export type TPostWithComments = z.infer<typeof PostSchemaWithComments>;
