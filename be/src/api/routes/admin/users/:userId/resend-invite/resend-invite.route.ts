import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { sendInvite } from 'src/controllers/admin/users/send-invite';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      response: {
        200: z.object({
          success: z.boolean()
        })
      },
      body: z.object({
        redirectUrl: z.string()
      }),
      params: z.object({
        userId: z.string()
      })
    },
    preHandler: [requirePermission('manage_users')]
  }, (req) => {
    return sendInvite({ 
      userProfileRepo: fastify.repos.userProfileRepo,
      data: { ...req.body, userId: req.params.userId },
      identityService: fastify.identityService,
      mailService: fastify.mailService
    });
  });
};

export default routes; 