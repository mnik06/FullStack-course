import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requirePermission } from 'src/api/hooks/require-permission.hook';

import { updateCommentById } from 'src/controllers/comment/update-comment-by-id';
import { deleteComment } from 'src/controllers/comment/delete-comment';

import { GetCommentByIdRespSchema } from 'src/api/routes/schemas/comment/GetCommentByIdRespSchema';
import { UpdateCommentReqSchema } from 'src/api/routes/schemas/comment/UpdateCommentsReqSchema';

const CommentByIdParamsSchema = z.object({
  postId: z.string().uuid(),
  commentId: z.string().uuid()
});
type TCommentByIdParams = z.infer<typeof CommentByIdParamsSchema>;

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  const checkIsCommentOwner = async (request: FastifyRequest) => {
    const comment = await fastify.repos.commentRepo
      .getCommentById((request.params as TCommentByIdParams).commentId);

    return comment?.userId === request.user?.id as string;
  };
  
  fastify.patch('/', {
    schema: {
      params: CommentByIdParamsSchema,
      response: {
        200: GetCommentByIdRespSchema
      },
      body: UpdateCommentReqSchema
    },
    preHandler: [requirePermission('manage_comment', checkIsCommentOwner)]
  }, (req) => {
    return updateCommentById({
      commentRepo: fastify.repos.commentRepo,
      commentId: req.params.commentId,
      data: req.body
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
    },
    preHandler: [requirePermission('manage_comment', checkIsCommentOwner)]
  }, (req) => {
    return deleteComment({
      commentRepo: fastify.repos.commentRepo,
      commentId: req.params.commentId
    });
  });
};

export default routes;