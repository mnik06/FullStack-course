import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { updateCommentById } from 'src/controllers/comment/update-comment-by-id';
import { getCommentById } from 'src/controllers/comment/get-comment-by-id';

import { GetCommentByIdRespSchema } from 'src/api/routes/schemas/comment/GetCommentByIdRespSchema';
import { UpdateCommentReqSchema } from 'src/api/routes/schemas/comment/UpdateCommentsReqSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      params: z.object({
        commentId: z.string().uuid()
      })
    }
  }, (req) => {
    return getCommentById({
      commentRepo: fastify.repos.commentRepo,
      commentId: req.params.commentId
    });
  });

  fastify.patch('/', {
    schema: {
      params: z.object({
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
};

export default routes;