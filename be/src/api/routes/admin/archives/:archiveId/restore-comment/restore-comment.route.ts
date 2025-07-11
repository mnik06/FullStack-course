import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { restoreCommentFromArchive } from 'src/controllers/archive/restore-comment-from-archive';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();
  
  fastify.post('/', {
    schema: {
      params: z.object({
        archiveId: z.string()
      }),
      response: {
        200: z.object({
          success: z.boolean()
        })
      }
    },
    preHandler: [requirePermission('manage_archive')]
  }, (req) => {
    return restoreCommentFromArchive({
      archiveId: req.params.archiveId,
      commentRepo: fastify.repos.commentRepo,
      archiveRepo: fastify.repos.archiveRepo,
      userProfileRepo: fastify.repos.userProfileRepo
    });
  });
};

export default routes;