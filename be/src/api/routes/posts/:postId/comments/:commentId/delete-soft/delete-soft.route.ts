import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { deleteCommentSoft } from 'src/controllers/comment/delete-comment-soft';
import { getPostService } from 'src/services/post/post.service';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
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
      commentId: req.params.commentId,
      postId: req.params.postId,
      commentRepo: fastify.repos.commentRepo,
      postRepo: fastify.repos.postRepo,
      websocketsService: fastify.websocketsService,
      user: req.user as TUserProfile
    });
  });
};

export default routes;