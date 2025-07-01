import { z } from 'zod';
import { SignupReqSchema } from 'src/api/routes/schemas/auth/SignupReqSchema';

export const AcceptInviteReqSchema = SignupReqSchema.extend({
  signature: z.string(),
  expireAt: z.number()
});

export type TAcceptInviteReq = z.infer<typeof AcceptInviteReqSchema>;
