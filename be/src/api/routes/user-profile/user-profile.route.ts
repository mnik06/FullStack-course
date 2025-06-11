import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { getUserProfile } from 'src/controllers/user-profile/get-user-profile';
import { GetUserProfileRespSchema } from 'src/api/routes/schemas/user-profile/GetUserProfileRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: {
        200: GetUserProfileRespSchema
      }
    }
  }, getUserProfile);
};

export default routes; 