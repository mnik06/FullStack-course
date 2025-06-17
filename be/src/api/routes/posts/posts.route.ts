import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { createPost } from 'src/controllers/post/create-post';
import { getPosts } from 'src/controllers/post/get-posts';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

import { CreatePostReqSchema } from 'src/api/routes/schemas/post/CreatePostReqSchema';
import { GetPostByIdRespSchema } from 'src/api/routes/schemas/post/GetPostByIdRespSchema';
import { GetPostsRespSchema } from 'src/api/routes/schemas/post/GetPostsRespSchema';
import { PostFiltersSchema } from 'src/types/post/schemas/PostFilters';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      querystring: PostFiltersSchema,
      response: {
        200: GetPostsRespSchema
      }
    }
  }, (req) => {
    return getPosts({
      postRepo: fastify.repos.postRepo,
      query: req.query
    });
  });

  fastify.post('/', {
    schema: {
      response: {
        200: GetPostByIdRespSchema
      },
      body: CreatePostReqSchema
    }
  }, (req) => {
    return createPost({
      postRepo: fastify.repos.postRepo,
      data: {
        ...req.body,
        userId: req.user?.id as string
      },
      user: req.user as TUserProfile
    });
  });
};

export default routes; 