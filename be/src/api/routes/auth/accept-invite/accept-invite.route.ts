import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { AcceptInviteReqSchema } from 'src/api/routes/schemas/auth/AcceptInviteReqSchema';
import { acceptInvite } from 'src/controllers/auth/accept-invite';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.addHook('onRoute', (routeOptions) => {
    if (!routeOptions.config) {
      routeOptions.config = {};
    }
    
    routeOptions.config.skipAuth = true;
  });

  fastify.post('/', {
    schema: {
      body: AcceptInviteReqSchema
    }
  }, (req) => {
    return acceptInvite({
      userProfileRepo: fastify.repos.userProfileRepo,
      identityService: fastify.identityService,
      signatureService: fastify.signatureService,
      data: req.body
    });
  });
};

export default routes; 