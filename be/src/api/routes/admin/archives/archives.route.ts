import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getArchives } from 'src/controllers/archive/get-archives';
import { ArchiveFiltersSchema } from 'src/types/archive/ArchiveFilters';
import { GetArchivesRespSchema } from 'src/api/routes/schemas/archive/GetArchivesRespSchema';
import { requirePermission } from 'src/api/hooks/require-permission.hook';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      querystring: ArchiveFiltersSchema,
      response: {
        200: GetArchivesRespSchema
      }
    },
    preHandler: [requirePermission('manage_archive')]
  }, (req) => {
    return getArchives({
      archiveRepo: fastify.repos.archiveRepo,
      query: req.query
    });
  });
};

export default routes;