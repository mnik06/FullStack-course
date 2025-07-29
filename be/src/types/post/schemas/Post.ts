import { z } from 'zod';
import { UserProfileSchema } from 'src/types/user-profile/schemas/UserProfile';
import { TagSchema } from 'src/types/tag/schemas/Tag';

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  readingTime: z.number(),
  updatedAt: z.date(),
  createdAt: z.date(),
  userId: z.string().uuid(),
  user: UserProfileSchema,
  tags: z.array(TagSchema)
});
export type TPost = z.infer<typeof PostSchema>; 

