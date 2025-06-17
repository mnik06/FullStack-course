import { z } from 'zod';
import { UserProfileSchema } from 'src/types/user-profile/schemas/UserProfile';

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional().nullable(),
  readingTime: z.number(),
  updatedAt: z.date(),
  createdAt: z.date(),
  userId: z.string().uuid(),
  user: UserProfileSchema
});
export type TPost = z.infer<typeof PostSchema>; 

