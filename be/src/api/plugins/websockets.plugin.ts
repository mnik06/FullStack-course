import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const plugin: FastifyPluginAsync = async function (fastify) {
  await fastify.websocketsService.startSocketsServer();
  fastify.websocketsService.addAuthMiddleware(
    fastify.repos.userProfileRepo, 
    fastify.identityService
  );
};

export default fp(plugin);