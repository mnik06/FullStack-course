import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { restoreSoftDeletedUser } from 'src/controllers/archive/restore-soft-deleted-user';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      params: z.object({
        userId: z.string()
      }),
      response: {
        200: z.object({
          success: z.boolean()
        })
      }
    },
    preHandler: [requirePermission('manage_archive')]
  }, (req) => {
    return restoreSoftDeletedUser({
      commentRepo: fastify.repos.commentRepo,
      postRepo: fastify.repos.postRepo,
      transactionManager: fastify.transactionManager,
      userProfileRepo: fastify.repos.userProfileRepo,
      userId: req.params.userId
    });
  });
};

export default routes;