import { z } from 'zod';
import { CommentSchema } from 'src/types/comment/schemas/Comment';
import { PostSchema } from './Post';

export const PostSchemaWithComments = PostSchema.extend({
  comments: z.array(CommentSchema)
});
export type TPostWithComments = z.infer<typeof PostSchemaWithComments>;