import { UserProfileSchema } from 'src/types/user-profile/schemas/UserProfile';
import { z } from 'zod';

export const GetAllUserProfilesRespSchema = z.object({
  users: UserProfileSchema.array()
});
