import { z } from 'zod';
import { IdentityUserSchema } from 'src/types/IdentityUser';

export const UserSchema =  IdentityUserSchema.extend({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TUser = z.infer<typeof UserSchema>;