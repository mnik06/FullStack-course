import { z } from 'zod';

export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});

export type TTag = z.infer<typeof TagSchema>;
