import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { SignupReqSchema } from 'src/api/routes/schemas/auth/SignupReqSchema';
import { signup } from 'src/controllers/auth/signup';

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
      body: SignupReqSchema
    }
  }, (req) => {
    return signup({
      userProfileRepo: fastify.repos.userProfileRepo,
      identityService: fastify.identityService,
      data: req.body
    });
  });
};

export default routes; 