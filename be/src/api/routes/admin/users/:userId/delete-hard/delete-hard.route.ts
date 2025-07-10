import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';

import { deleteUserHard } from 'src/controllers/admin/users/delete-user-hard';

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
    return deleteUserHard({ 
      userProfileRepo: fastify.repos.userProfileRepo,
      identityService: fastify.identityService,
      userId: req.params.userId
    });
  });
};

export default routes; 