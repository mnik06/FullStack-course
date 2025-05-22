import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { THealthMetrics, HealthMetricsSchema } from 'src/types/HealthMetrics';
import z from 'zod';

const healthCheckResponseSchema = z.array(HealthMetricsSchema.omit({ errorMessage: true }));

interface IOptions {
  healthChecksPromises: [() => Promise<THealthMetrics>] | [];
  path: string;
}

const plugin: FastifyPluginAsync<IOptions> = async function (fastify, opts) {
  fastify.get(opts.path, { logLevel: 'silent' }, async (_req, reply) => {
    const healthChecks = await Promise.all(opts.healthChecksPromises.map((check) => check()));
    const statusCode = healthChecks.some((healthCheck) => !healthCheck.isOk) ? 500 : 200;
    reply.status(statusCode).send(healthCheckResponseSchema.parse(healthChecks));
  });
};

export default fp(plugin, '5.x');