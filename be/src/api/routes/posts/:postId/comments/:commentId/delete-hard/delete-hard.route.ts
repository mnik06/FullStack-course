import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { deleteCommentHardAndArchive } from 'src/controllers/comment/delete-comment-hard-and-archive';
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
    return deleteCommentHardAndArchive({
      commentId: req.params.commentId,
      postId: req.params.postId,
      commentRepo: fastify.repos.commentRepo,
      postRepo: fastify.repos.postRepo,
      archiveRepo: fastify.repos.archiveRepo,
      user: req.user as TUserProfile,
      websocketsService: fastify.websocketsService
    });
  });
};

export default routes;