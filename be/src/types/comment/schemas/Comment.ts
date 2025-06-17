import { z } from 'zod';
import { UserProfileSchema } from 'src/types/user-profile/schemas/UserProfile';

export const CommentSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
  postId: z.string().uuid(),
  userId: z.string().uuid(),
  user: UserProfileSchema
});

export type TComment = z.infer<typeof CommentSchema>; 