import { z } from 'zod';

export const ResendInviteReqSchema = z.object({
  redirectUrl: z.string()
});

export type TResendInviteReq = z.infer<typeof ResendInviteReqSchema>;
