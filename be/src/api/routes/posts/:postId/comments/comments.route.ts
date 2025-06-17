import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { createComment } from 'src/controllers/comment/create-comment';
import { getCommentsByPostId } from 'src/controllers/comment/get-comments-by-post-id';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

import { CreateCommentReqSchema } from 'src/api/routes/schemas/comment/CreateCommentReqSchema';
import { GetCommentsRespSchema } from 'src/api/routes/schemas/comment/GetCommentsRespSchema';
import { GetCommentByIdRespSchema } from 'src/api/routes/schemas/comment/GetCommentByIdRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid()
      }),
      response: {
        200: GetCommentsRespSchema
      }
    }
  }, (req) => {
    return getCommentsByPostId({
      commentRepo: fastify.repos.commentRepo,
      postId: req.params.postId
    });
  });

  fastify.post('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid()
      }),
      body: CreateCommentReqSchema,
      response: {
        200: GetCommentByIdRespSchema
      }
    }
  }, (req) => {
    return createComment({
      commentRepo: fastify.repos.commentRepo,
      data: {
        ...req.body,
        postId: req.params.postId,
        userId: req.user?.id as string
      },
      user: req.user as TUserProfile
    });
  });
};

export default routes; 