import { z } from 'zod';

export const UpsertPostReqSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  tagIds: z.array(z.string()).optional()
}); 

export type TUpsertPostReq = z.infer<typeof UpsertPostReqSchema>;