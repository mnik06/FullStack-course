import { z } from 'zod';

export const SignupReqSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
