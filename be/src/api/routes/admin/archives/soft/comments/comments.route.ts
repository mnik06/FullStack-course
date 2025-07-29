import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { GetSoftDeletedCommentsRespSchema } from 'src/api/routes/schemas/archive/GetSoftDeletedCommentsRespSchema';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { getSoftDeletedComments } from 'src/controllers/archive/get-soft-deleted-comments';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: {
        200: GetSoftDeletedCommentsRespSchema
      }
    },
    preHandler: [requirePermission('manage_archive')]
  }, () => {
    return getSoftDeletedComments({
      commentRepo: fastify.repos.commentRepo
    });
  });
};

export default routes;