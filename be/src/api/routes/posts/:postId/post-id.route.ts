import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { updatePostById } from 'src/controllers/post/update-post-by-id';
import { getPostById } from 'src/controllers/post/get-post-by-id';
import { deletePost } from 'src/controllers/post/delete-post';

import { GetPostByIdRespSchema } from 'src/api/routes/schemas/post/GetPostByIdRespSchema';
import { UpdatePostReqSchema } from 'src/api/routes/schemas/post/UpdatePostReqSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

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
      params: z.object({
        postId: z.string().uuid()
      }),
      response: {
        200: GetPostByIdRespSchema
      },
      body: UpdatePostReqSchema
    }
  }, (req) => {
    return updatePostById({
      postRepo: fastify.repos.postRepo,
      postId: req.params.postId,
      userId: req.user?.id as string,
      data: req.body
    });
  });

  fastify.delete('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid()
      }),
      response: {
        200: z.object({
          success: z.boolean()
        })
      }
    }
  }, (req) => {
    return deletePost({
      postRepo: fastify.repos.postRepo,
      postId: req.params.postId,
      userId: req.user?.id as string
    });
  });
};

export default routes;