import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { updateCommentById } from 'src/controllers/comment/update-comment-by-id';
import { deleteComment } from 'src/controllers/comment/delete-comment';

import { GetCommentByIdRespSchema } from 'src/api/routes/schemas/comment/GetCommentByIdRespSchema';
import { UpdateCommentReqSchema } from 'src/api/routes/schemas/comment/UpdateCommentsReqSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.patch('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid(),
        commentId: z.string().uuid()
      }),
      response: {
        200: GetCommentByIdRespSchema
      },
      body: UpdateCommentReqSchema
    }
  }, (req) => {
    return updateCommentById({
      commentRepo: fastify.repos.commentRepo,
      commentId: req.params.commentId,
      data: req.body
    });
  });

  fastify.delete('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid(),
        commentId: z.string().uuid()
      }),
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