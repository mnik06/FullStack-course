import { z } from 'zod';

export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TTag = z.infer<typeof TagSchema>;
