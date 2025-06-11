import { z } from 'zod';
import { IdentityUserSchema } from 'src/types/IdentityUser';

export const UserProfileSchema = IdentityUserSchema.extend({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TUserProfile = z.infer<typeof UserProfileSchema>;