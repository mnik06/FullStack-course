import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { deletePostHardAndArchive } from 'src/controllers/post/delete-post-hard-and-archive';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { getPostService } from 'src/services/post/post.service';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();
  const postService = getPostService();

  fastify.delete('/', {
    schema: {
      params: z.object({
        postId: z.string()
      }),
      response: {
        200: z.object({
          success: z.boolean()
        })
      }
    },
    preHandler: [requirePermission('manage_post', (req) => postService.checkIsPostOwner(fastify, req))]
  }, (req) => {
    return deletePostHardAndArchive({
      postRepo: fastify.repos.postRepo,
      postId: req.params.postId,
      archiveRepo: fastify.repos.archiveRepo,
      user: req.user as TUserProfile
    });
  });
};

export default routes;