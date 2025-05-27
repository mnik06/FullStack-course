import { z } from 'zod';
import { PostSchema } from './Post';

export const PostSchemaWithCommentsCount = PostSchema.extend({
  commentsCount: z.number()
});
export type TPostWithCommentsCount = z.infer<typeof PostSchemaWithCommentsCount>;