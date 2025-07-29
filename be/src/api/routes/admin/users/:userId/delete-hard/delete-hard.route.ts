import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';

import { deleteUserHardAndArchive } from 'src/controllers/admin/users/delete-user-hard-and-archive';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.delete('/', {
    schema: {
      response: {
        200: z.object({
          success: z.boolean()
        })
      },
      params: z.object({
        userId: z.string()
      })
    },
    preHandler: [requirePermission('manage_users')]
  }, (req) => {
    return deleteUserHardAndArchive({ 
      userProfileRepo: fastify.repos.userProfileRepo,
      identityService: fastify.identityService,
      postRepo: fastify.repos.postRepo,
      commentRepo: fastify.repos.commentRepo,
      archiveRepo: fastify.repos.archiveRepo,
      userIdToDelete: req.params.userId,
      user: req.user as TUserProfile
    });
  });
};

export default routes; 