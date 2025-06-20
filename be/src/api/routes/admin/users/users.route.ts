import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';

import { getUsers } from 'src/controllers/admin/users/get-users';
import { GetUsersRespSchema } from 'src/api/routes/schemas/admin/users/GetUsersRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: {
        200: GetUsersRespSchema
      }
    },
    preHandler: [requirePermission('manage_users')]
  }, () => {
    return getUsers({ userProfileRepo: fastify.repos.userProfileRepo });
  });
};

export default routes; 