import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { updateCommentById } from 'src/controllers/comment/update-comment-by-id';
import { deleteComment } from 'src/controllers/comment/delete-comment';
import { HttpError } from 'src/api/errors/HttpError';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

import { GetCommentByIdRespSchema } from 'src/api/routes/schemas/comment/GetCommentByIdRespSchema';
import { UpdateCommentReqSchema } from 'src/api/routes/schemas/comment/UpdateCommentsReqSchema';

const CommentByIdParamsSchema = z.object({
  postId: z.string().uuid(),
  commentId: z.string().uuid()
});
type TCommentByIdParams = z.infer<typeof CommentByIdParamsSchema>;

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.addHook('onRequest', async (req) => {
    if (req.method === 'GET') {
      return;
    }

    const post = await fastify.repos.postRepo
      .getPostById((req.params as TCommentByIdParams).postId);

    if (post && post.userId !== req.user?.id as string) {
      throw new HttpError(403, 'Permission denied');
    }

    return true;
  });

  fastify.patch('/', {
    schema: {
      params: CommentByIdParamsSchema,
      response: {
        200: GetCommentByIdRespSchema
      },
      body: UpdateCommentReqSchema
    }
  }, (req) => {
    return updateCommentById({
      commentRepo: fastify.repos.commentRepo,
      commentId: req.params.commentId,
      data: req.body,
      user: req.user as TUserProfile
    });
  });

  fastify.delete('/', {
    schema: {
      params: CommentByIdParamsSchema,
      response: {
        200: z.object({
          success: z.boolean()
        })
      }
    }
  }, (req) => {
    return deleteComment({
      commentRepo: fastify.repos.commentRepo,
      commentId: req.params.commentId
    });
  });
};

export default routes;