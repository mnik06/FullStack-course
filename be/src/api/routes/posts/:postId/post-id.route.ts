import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requirePermission } from 'src/api/hooks/require-permission.hook';

import { updatePostById } from 'src/controllers/post/update-post-by-id';
import { getPostById } from 'src/controllers/post/get-post-by-id';
import { getPostService } from 'src/services/post/post.service';

import { GetPostByIdRespSchema } from 'src/api/routes/schemas/post/GetPostByIdRespSchema';
import { UpsertPostReqSchema } from 'src/api/routes/schemas/post/UpsertPostReqSchema';

const PostByIdParamsSchema = z.object({
  postId: z.string().uuid()
});

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  const postService = getPostService();

  fastify.get('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid()
      }),
      response: {
        200: GetPostByIdRespSchema
      }
    }
  }, (req) => {
    return getPostById({
      postRepo: fastify.repos.postRepo,
      postId: req.params.postId
    });
  });

  fastify.patch('/', {
    schema: {
      params: PostByIdParamsSchema,
      response: {
        200: GetPostByIdRespSchema
      },
      body: UpsertPostReqSchema
    },
    preHandler: [requirePermission('manage_post', (req) => postService.checkIsPostOwner(fastify, req))]
  }, (req) => {
    return updatePostById({
      postRepo: fastify.repos.postRepo,
      postToTagRepo: fastify.repos.postToTagRepo,
      postId: req.params.postId,
      data: req.body
    });
  });
};

export default routes;