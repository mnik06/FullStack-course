import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requirePermission } from 'src/api/hooks/require-permission.hook';

import { updatePostById } from 'src/controllers/post/update-post-by-id';
import { getPostById } from 'src/controllers/post/get-post-by-id';
import { deletePost } from 'src/controllers/post/delete-post';

import { GetPostByIdRespSchema } from 'src/api/routes/schemas/post/GetPostByIdRespSchema';
import { UpdatePostReqSchema } from 'src/api/routes/schemas/post/UpdatePostReqSchema';

const PostByIdParamsSchema = z.object({
  postId: z.string().uuid()
});
type TPostByIdParams = z.infer<typeof PostByIdParamsSchema>;

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  const checkIsPostOwner = async (request: FastifyRequest) => {
    const post = await fastify.repos.postRepo
      .getPostById((request.params as TPostByIdParams).postId);

    return post?.userId === request.user?.id as string;
  };

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
      body: UpdatePostReqSchema
    },
    preHandler: [requirePermission('manage_post', checkIsPostOwner)]
  }, (req) => {
    return updatePostById({
      postRepo: fastify.repos.postRepo,
      postId: req.params.postId,
      data: req.body
    });
  });

  fastify.delete('/', {
    schema: {
      params: PostByIdParamsSchema,
      response: {
        200: z.object({
          success: z.boolean()
        })
      }
    },
    preHandler: [requirePermission('manage_post', checkIsPostOwner)]
  }, (req) => {
    return deletePost({
      postRepo: fastify.repos.postRepo,
      postId: req.params.postId
    });
  });
};

export default routes;