import { z } from 'zod';
import { UserProfileSchema } from './UserProfile';

export const UserProfileWithDeletedAtSchema = UserProfileSchema.extend({
  deletedAt: z.date().nullable()
});
export type TUserProfileWithDeletedAt = z.infer<typeof UserProfileWithDeletedAtSchema>;
