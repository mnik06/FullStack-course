import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';

import { getUsers } from 'src/controllers/admin/users/get-users';
import { GetUsersRespSchema } from 'src/api/routes/schemas/admin/users/GetUsersRespSchema';
import { UserProfileFiltersSchema } from 'src/types/user-profile/UserProfileFilters';
const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: {
        200: GetUsersRespSchema
      },
      querystring: UserProfileFiltersSchema
    },
    preHandler: [requirePermission('manage_users')]
  }, (req) => {
    return getUsers({ 
      userProfileRepo: fastify.repos.userProfileRepo ,
      query: req.query
    });
  });
};

export default routes; 