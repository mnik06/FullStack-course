import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { restoreSoftDeletedComment } from 'src/controllers/archive/restore-soft-deleted-comment';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      params: z.object({
        commentId: z.string()
      }),
      response: {
        200: z.object({
          success: z.boolean()
        })
      }
    },
    preHandler: [requirePermission('manage_archive')]
  }, (req) => {
    return restoreSoftDeletedComment({
      commentRepo: fastify.repos.commentRepo,
      commentId: req.params.commentId,
      postRepo: fastify.repos.postRepo,
      userProfileRepo: fastify.repos.userProfileRepo
    });
  });
};

export default routes;