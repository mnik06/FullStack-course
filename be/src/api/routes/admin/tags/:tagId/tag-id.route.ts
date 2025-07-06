import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { deleteTag } from 'src/controllers/tags/delete-tag';
import { GetTagByIdRespSchema } from 'src/api/routes/schemas/tags/GetTagByIdRespSchema';
import { UpdateTagReqSchema } from 'src/api/routes/schemas/tags/UpdateTagReqSchema';
import { updateTag } from 'src/controllers/tags/update-tag-by-id';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.patch('/', {
    schema: {
      params: z.object({
        tagId: z.string()
      }),
      body: UpdateTagReqSchema,
      response: {
        200: GetTagByIdRespSchema
      }
    }
  }, req => {
    return updateTag({
      tagId: req.params.tagId,
      data: req.body,
      tagRepo: fastify.repos.tagRepo
    });
  });

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