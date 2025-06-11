import { FastifyRequest } from 'fastify';
import { UserProfileSchema } from 'src/types/user-profile/schemas/UserProfile';

export function getUserProfile(req: FastifyRequest) {
  return { user: UserProfileSchema.parse(req.user) };
}
