/* eslint-disable max-len */
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
  }, getUserProfile); // CODE REVIEW - не треба виносити це в окремий метод, так як він нічого не робить, ти можеш просто повернути тут req.user.
};

export default routes; 