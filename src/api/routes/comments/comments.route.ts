import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { createComment } from 'src/controllers/comment/create-comment';
import { getComments } from 'src/controllers/comment/get-comments';

import { CreateCommentReqSchema } from 'src/api/routes/schemas/comment/CreateCommentReqSchema';
import { GetCommentByIdRespSchema } from 'src/api/routes/schemas/comment/GetCommentByIdRespSchema';
import { GetCommentsRespSchema } from 'src/api/routes/schemas/comment/GetCommentsRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: {
        200: GetCommentsRespSchema
      }
    }
  }, () => {
    return getComments({
      commentRepo: fastify.repos.commentRepo
    });
  });

  fastify.post('/', {
    schema: {
      response: {
        200: GetCommentByIdRespSchema
      },
      body: CreateCommentReqSchema
    }
  }, (req) => {
    return createComment({
      commentRepo: fastify.repos.commentRepo,
      data: req.body
    });
  });

};

export default routes; 