import { z } from 'zod';
import { PostSchema } from './Post';

export const PostUpsertData = PostSchema
  .pick({
    title: true,
    description: true,
    createdAt: true,
    updatedAt: true
  })
  .extend({ tagIds: z.array(z.string()) })
  .partial();

export type TPostUpsertData = z.infer<typeof PostUpsertData>;