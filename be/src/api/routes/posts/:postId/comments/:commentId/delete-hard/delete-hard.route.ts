import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { deleteCommentHard } from 'src/controllers/comment/delete-comment-hard';
import { getPostService } from 'src/services/post/post.service';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

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
    return deleteCommentHard({
      commentRepo: fastify.repos.commentRepo,
      commentId: req.params.commentId,
      archiveRepo: fastify.repos.archiveRepo,
      user: req.user as TUserProfile
    });
  });
};

export default routes;