import { z } from 'zod';

export const IdentityUserSchema = z.object({
  subId: z.string(),
  email: z.string(),
  isActive: z.boolean().optional()
});

export type TIdentityUser = z.infer<typeof IdentityUserSchema>;