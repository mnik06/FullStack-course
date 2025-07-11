import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { deleteArchive } from 'src/controllers/archive/delete-archive';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.delete('/', {
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
    return deleteArchive({
      archiveRepo: fastify.repos.archiveRepo,
      archiveId: req.params.archiveId
    });
  });
};

export default routes;