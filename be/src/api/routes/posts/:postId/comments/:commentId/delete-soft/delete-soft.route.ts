import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { deleteCommentSoft } from 'src/controllers/comment/delete-comment-soft';
import { getPostService } from 'src/services/post/post.service';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();
  const postService = getPostService();

  fastify.delete('/', {
    schema: {
      params: z.object({
        commentId: z.string(),
        postId: z.string()
      }),
      response: {
        200: z.object({
          success: z.boolean()
        })
      }
    },
    preHandler: [requirePermission('manage_comment', (req) => postService.checkIsCommentOwner(fastify, req))]
  }, (req) => {
    return deleteCommentSoft({
      commentRepo: fastify.repos.commentRepo,
      commentId: req.params.commentId
    });
  });
};

export default routes;