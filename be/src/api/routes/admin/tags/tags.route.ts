import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';

import { CreateTagReqSchema } from 'src/api/routes/schemas/admin/tags/CreateTagReqSchema';
import { createTag } from 'src/controllers/admin/tags/create-tag';
import { getTags } from 'src/controllers/admin/tags/get-tags';
import { GetTagsRespSchema } from 'src/api/routes/schemas/admin/tags/GetTagsRespSchema';
import { GetTagByIdRespSchema } from 'src/api/routes/schemas/admin/tags/GetTagByIdRespSchema';
import { TagFiltersSchema } from 'src/types/tag/schemas/TagFilters';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      querystring: TagFiltersSchema,
      response: {
        200: GetTagsRespSchema
      }
    },
    preHandler: [requirePermission('manage_tags')]
  }, (req) => {
    return getTags({
      tagRepo: fastify.repos.tagRepo,
      filters: req.query
    });
  });

  fastify.post('/', {
    schema: {
      body: CreateTagReqSchema,
      response: {
        200: GetTagByIdRespSchema
      }
    },
    preHandler: [requirePermission('manage_tags')]
  }, (req) => {
    return createTag({
      data: req.body,
      tagRepo: fastify.repos.tagRepo
    });
  });
};

export default routes;