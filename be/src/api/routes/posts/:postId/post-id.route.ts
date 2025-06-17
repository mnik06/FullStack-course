import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { updatePostById } from 'src/controllers/post/update-post-by-id';
import { getPostById } from 'src/controllers/post/get-post-by-id';
import { deletePost } from 'src/controllers/post/delete-post';
import { HttpError } from 'src/api/errors/HttpError';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

import { GetPostByIdRespSchema } from 'src/api/routes/schemas/post/GetPostByIdRespSchema';
import { UpdatePostReqSchema } from 'src/api/routes/schemas/post/UpdatePostReqSchema';

const PostByIdParamsSchema = z.object({
  postId: z.string().uuid()
});
type TPostByIdParams = z.infer<typeof PostByIdParamsSchema>;

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.addHook('onRequest', async (req) => {
    if (req.method === 'GET') {
      return;
    }

    const post = await fastify.repos.postRepo.getPostById((req.params as TPostByIdParams).postId);

    if (post && post.userId !== req.user?.id as string) {
      throw new HttpError(403, 'Permission denied');
    }

    return true;
  });

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
    }
  }, (req) => {
    return updatePostById({
      postRepo: fastify.repos.postRepo,
      postId: req.params.postId,
      data: req.body,
      user: req.user as TUserProfile
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
    }
  }, (req) => {
    return deletePost({
      postRepo: fastify.repos.postRepo,
      postId: req.params.postId
    });
  });
};

export default routes;