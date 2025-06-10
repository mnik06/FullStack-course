import { z } from 'zod';

export const SignupReqSchema = z.object({
  email: z.string().email(),
  // TODO: change password schema to be more secure
  password: z.string().min(8),
  name: z.string()
  
});

export type TSignupReq = z.infer<typeof SignupReqSchema>;
