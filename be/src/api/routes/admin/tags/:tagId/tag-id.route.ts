import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { deleteTag } from 'src/controllers/admin/tags/delete-tag';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.delete('/', {
    schema: {
      params: z.object({
        tagId: z.string()
      }),
      response: {
        200: z.object({
          success: z.boolean()
        })
      }
    },
    preHandler: [requirePermission('manage_tags')]
  }, (req) => {
    return deleteTag({
      tagId: req.params.tagId,
      tagRepo: fastify.repos.tagRepo
    });
  });
};

export default routes;