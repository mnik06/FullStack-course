import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { resendInviteByUserId } from 'src/controllers/admin/users/resend-invite-by-user-id';

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
    return resendInviteByUserId({ 
      userProfileRepo: fastify.repos.userProfileRepo,
      data: { ...req.body, userId: req.params.userId },
      mailService: fastify.mailService,
      signatureService: fastify.signatureService
    });
  });
};

export default routes; 