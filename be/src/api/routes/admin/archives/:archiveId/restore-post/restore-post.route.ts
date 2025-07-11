import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { restorePostFromArchive } from 'src/controllers/archive/restore-post-from-archive';
import { requirePermission } from 'src/api/hooks/require-permission.hook';

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
    return restorePostFromArchive({
      archiveId: req.params.archiveId,
      postRepo: fastify.repos.postRepo,
      commentRepo: fastify.repos.commentRepo,
      archiveRepo: fastify.repos.archiveRepo,
      postToTagRepo: fastify.repos.postToTagRepo,
      tagRepo: fastify.repos.tagRepo,
      userProfileRepo: fastify.repos.userProfileRepo
    });
  });
};

export default routes;