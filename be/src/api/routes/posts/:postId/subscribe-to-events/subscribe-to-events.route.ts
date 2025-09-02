import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { subscribeToPostEvents } from 'src/controllers/post/subscribe-to-post-events';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid()
      }),
      response: {
        200: z.object({
          success: z.boolean()
        })
      }
    }
  }, (req) => {
    return subscribeToPostEvents({
      postId: req.params.postId,
      userId: (req.user as TUserProfile).id,
      websocketsService: fastify.websocketsService
    });
  });
};

export default routes;