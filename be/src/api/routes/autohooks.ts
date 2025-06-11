import { FastifyPluginAsync } from 'fastify';
import { userProfileHook } from 'src/api/hooks/user-profile.hook';

const hooks: FastifyPluginAsync = async function (fastify) {
  fastify.addHook('preHandler', userProfileHook);
};

export default hooks;