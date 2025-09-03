import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { restoreSoftDeletedPost } from 'src/controllers/archive/restore-soft-deleted-post';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      params: z.object({
        postId: z.string()
      }),
      response: {
        200: z.object({
          success: z.boolean()
        })
      }
    },
    preHandler: [requirePermission('manage_archive')]
  }, (req) => {
    return restoreSoftDeletedPost({
      postRepo: fastify.repos.postRepo,
      postId: req.params.postId,
      commentRepo: fastify.repos.commentRepo,
      userProfileRepo: fastify.repos.userProfileRepo,
      transactionManager: fastify.transactionManager
    });
  });
};

export default routes;