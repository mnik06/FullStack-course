import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requirePermission } from 'src/api/hooks/require-permission.hook';

import { updateCommentById } from 'src/controllers/comment/update-comment-by-id';

import { GetCommentByIdRespSchema } from 'src/api/routes/schemas/comment/GetCommentByIdRespSchema';
import { UpdateCommentReqSchema } from 'src/api/routes/schemas/comment/UpdateCommentsReqSchema';
import { getPostService } from 'src/services/post/post.service';

const CommentByIdParamsSchema = z.object({
  postId: z.string().uuid(),
  commentId: z.string().uuid()
});

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();
  const postService = getPostService();

  fastify.patch('/', {
    schema: {
      params: CommentByIdParamsSchema,
      response: {
        200: GetCommentByIdRespSchema
      },
      body: UpdateCommentReqSchema
    },
    preHandler: [requirePermission('manage_comment', (req) => postService.checkIsCommentOwner(fastify, req))]
  }, (req) => {
    return updateCommentById({
      commentRepo: fastify.repos.commentRepo,
      commentId: req.params.commentId,
      data: req.body
    });
  });
};

export default routes;