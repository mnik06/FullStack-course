import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getSoftDeletedPosts } from 'src/controllers/archive/get-soft-deleted-posts';
import { GetSoftDeletedPostsRespSchema } from 'src/api/routes/schemas/archive/GetSoftDeletedPostsRespSchema';
import { requirePermission } from 'src/api/hooks/require-permission.hook';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: {
        200: GetSoftDeletedPostsRespSchema
      }
    },
    preHandler: [requirePermission('manage_archive')]
  }, () => {
    return getSoftDeletedPosts({
      postRepo: fastify.repos.postRepo
    });
  });
};

export default routes;