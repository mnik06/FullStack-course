import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { restoreUserFromArchive } from 'src/controllers/archive/restore-user-from-archive';

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
    return restoreUserFromArchive({
      archiveId: req.params.archiveId,
      userProfileRepo: fastify.repos.userProfileRepo,
      archiveRepo: fastify.repos.archiveRepo,
      identityService: fastify.identityService,
      postRepo: fastify.repos.postRepo,
      postToTagRepo: fastify.repos.postToTagRepo,
      tagRepo: fastify.repos.tagRepo,
      commentRepo: fastify.repos.commentRepo,
      transactionManager: fastify.transactionManager
    });
  });
};

export default routes;