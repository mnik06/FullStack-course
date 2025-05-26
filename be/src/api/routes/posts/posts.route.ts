import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { createPost } from 'src/controllers/post/create-post';
import { getPosts } from 'src/controllers/post/get-posts';

import { CreatePostReqSchema } from 'src/api/routes/schemas/post/CreatePostReqSchema';
import { GetPostByIdRespSchema } from 'src/api/routes/schemas/post/GetPostByIdRespSchema';
import { GetPostsRespSchema } from 'src/api/routes/schemas/post/GetPostsRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: {
        200: GetPostsRespSchema
      }
    }
  }, () => {
    return getPosts({
      postRepo: fastify.repos.postRepo,
      commentRepo: fastify.repos.commentRepo
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
      commentRepo: fastify.repos.commentRepo,
      data: req.body
    });
  });
};

export default routes; 