import { z } from 'zod';

export const InviteUserReqSchema = z.object({
  email: z.string().email(),
  redirectUrl: z.string()
});

export type TInviteUserReq = z.infer<typeof InviteUserReqSchema>;
