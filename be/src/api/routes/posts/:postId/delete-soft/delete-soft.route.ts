import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { deletePostSoft } from 'src/controllers/post/delete-post-soft';
import { requirePermission } from 'src/api/hooks/require-permission.hook';
import { getPostService } from 'src/services/post/post.service';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();
  const postService = getPostService();
  
  fastify.delete('/', {
    schema: {
      params: z.object({
        postId: z.string()
      })
    },
    preHandler: [requirePermission('manage_post', (req) => postService.checkIsPostOwner(fastify, req))]
  }, (req) => {
    return deletePostSoft({
      postRepo: fastify.repos.postRepo,
      postId: req.params.postId
    });
  });
};

export default routes;