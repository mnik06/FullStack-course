import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';

import { CreateTagReqSchema } from 'src/api/routes/schemas/admin/tags/CreateTagReqSchema';
import { createTag } from 'src/controllers/admin/tags/create-tag';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      body: CreateTagReqSchema
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