import { z } from 'zod';
import { IdentityUserSchema } from 'src/types/IdentityUser';

export const UserRoleSchema = z.enum(['admin', 'user']);
export type TUserRole = z.infer<typeof UserRoleSchema>;

export const UserProfileSchema = IdentityUserSchema.extend({
  id: z.string(),
  name: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isPending: z.boolean(),
  role: UserRoleSchema
});

export type TUserProfile = z.infer<typeof UserProfileSchema>;

export const UserProfileSchemaWithActiveField = UserProfileSchema.extend({
  isActive: z.boolean()
});

export type TUserProfileWithActiveField = z.infer<typeof UserProfileSchemaWithActiveField>;