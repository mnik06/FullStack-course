import { UserProfileSchema } from 'src/types/user-profile/schemas/UserProfile';
import { z } from 'zod';

export const GetUsersRespSchema = z.object({
  users: UserProfileSchema.array()
});
