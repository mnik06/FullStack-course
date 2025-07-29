import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { getTags } from 'src/controllers/tags/get-tags';
import { GetTagsRespSchema } from 'src/api/routes/schemas/tags/GetTagsRespSchema';
import { TagFiltersSchema } from 'src/types/tag/schemas/TagFilters';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      querystring: TagFiltersSchema,
      response: {
        200: GetTagsRespSchema
      }
    }
  }, (req) => {
    return getTags({
      tagRepo: fastify.repos.tagRepo,
      filters: req.query
    });
  });
};

export default routes;