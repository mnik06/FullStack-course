import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { disableUser } from 'src/controllers/admin/users/disable-user';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
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
    return disableUser({
      identityService: fastify.identityService,
      userProfileRepo: fastify.repos.userProfileRepo,
      id: req.params.userId
    });
  });
};

export default routes; 