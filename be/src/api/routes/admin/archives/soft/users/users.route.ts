import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getSoftDeletedUsers } from 'src/controllers/archive/get-soft-deleted-users';
import { GetSoftDeletedUsersRespSchema } from 'src/api/routes/schemas/archive/GetSoftDeletedUsersRespSchema';
import { requirePermission } from 'src/api/hooks/require-permission.hook';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: {
        200: GetSoftDeletedUsersRespSchema
      }
    },
    preHandler: [requirePermission('manage_archive')]
  }, () => {
    return getSoftDeletedUsers({
      userProfileRepo: fastify.repos.userProfileRepo
    });
  });
};

export default routes;