import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requirePermission } from 'src/api/hooks/require-permission.hook';

import { EditTagsRespSchema } from 'src/api/routes/schemas/post/EditTagsRespSchema';
import { editPostTags } from 'src/controllers/post/edit-post-tags';

const PostByIdParamsSchema = z.object({
  postId: z.string().uuid()
});
type TPostByIdParams = z.infer<typeof PostByIdParamsSchema>;

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  const checkIsPostOwner = async (request: FastifyRequest) => {
    const post = await fastify.repos.postRepo
      .getPostById((request.params as TPostByIdParams).postId);

    return post?.userId === request.user?.id as string;
  };

  fastify.post('/', {
    schema: {
      params: PostByIdParamsSchema,
      response: {
        200: EditTagsRespSchema
      },
      body: z.object({
        tagIds: z.array(z.string().uuid())
      })
    },
    preHandler: [requirePermission('manage_post', checkIsPostOwner)]
  }, (req) => {
    return editPostTags({
      postRepo: fastify.repos.postRepo,
      postToTagRepo: fastify.repos.postToTagRepo,
      postId: req.params.postId,
      tagIds: req.body.tagIds
    });
  });
};

export default routes;