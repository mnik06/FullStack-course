import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

interface IOptions {
  skip: string[];
}

const plugin: FastifyPluginAsync<IOptions> = async function (fastify, opts) {
  fastify.addHook('onRoute', async (routeOptions) => {
    const skip = (opts.skip || []).some((url) => routeOptions.url.includes(url));
    if (skip) {
      return;
    }
    fastify.log.info(`Route: ${routeOptions.method} ${routeOptions.url}`);
  });
};

export default fp<IOptions>(plugin, '5.x');