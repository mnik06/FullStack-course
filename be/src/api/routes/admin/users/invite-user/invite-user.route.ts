import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { createInviteForNewUser } from 'src/controllers/admin/users/create-invite-for-new-user';

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
        email: z.string().email(),
        redirectUrl: z.string()
      })
    },
    preHandler: [requirePermission('manage_users')]
  }, (req) => {
    return createInviteForNewUser({ 
      userProfileRepo: fastify.repos.userProfileRepo,
      data: req.body,
      identityService: fastify.identityService,
      mailService: fastify.mailService,
      signatureService: fastify.signatureService
    });
  });
};

export default routes; 