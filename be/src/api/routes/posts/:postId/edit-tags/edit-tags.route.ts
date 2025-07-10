import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requirePermission } from 'src/api/hooks/require-permission.hook';

import { EditTagsRespSchema } from 'src/api/routes/schemas/post/EditTagsRespSchema';
import { editPostTags } from 'src/controllers/post/edit-post-tags';
import { getPostService } from 'src/services/post/post.service';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();
  const postService = getPostService();

  fastify.post('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid()
      }),
      response: {
        200: EditTagsRespSchema
      },
      body: z.object({
        tagIds: z.array(z.string().uuid())
      })
    },
    preHandler: [requirePermission('manage_post', (req) => postService.checkIsPostOwner(fastify, req))]
  }, (req) => {
    return editPostTags({
      postRepo: fastify.repos.postRepo,
      postToTagRepo: fastify.repos.postToTagRepo,
      postId: req.params.postId,
      tagIds: req.body.tagIds
    });
  });
};

export default routes;