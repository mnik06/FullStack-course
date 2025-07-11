import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { restorePostFromArchive } from 'src/controllers/post/restore-post-from-archive';
import { requirePermission } from 'src/api/hooks/require-permission.hook';

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
    return restorePostFromArchive({
      postId: req.params.postId,
      postRepo: fastify.repos.postRepo,
      commentRepo: fastify.repos.commentRepo,
      archiveRepo: fastify.repos.archiveRepo,
      postToTagRepo: fastify.repos.postToTagRepo,
      userProfileRepo: fastify.repos.userProfileRepo,
      tagRepo: fastify.repos.tagRepo
    });
  });
};

export default routes;