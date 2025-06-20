import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';

import { GetAllUserProfilesRespSchema } from 'src/api/routes/schemas/user-profile/GetAllUserProfilesRespSchema';
import { getAllUserProfiles } from 'src/controllers/user-profile/get-all-user-profiles';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: {
        200: GetAllUserProfilesRespSchema
      }
    },
    preHandler: [requirePermission('manage_users')]
  }, () => {
    return getAllUserProfiles({ userProfileRepo: fastify.repos.userProfileRepo });
  });
};

export default routes; 