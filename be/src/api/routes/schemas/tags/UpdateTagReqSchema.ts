import { z } from 'zod';

export const UpdateTagReqSchema = z.object({
  name: z.string()
});

export type TUpdateTagReq = z.infer<typeof UpdateTagReqSchema>;