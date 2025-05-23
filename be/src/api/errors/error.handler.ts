import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpError } from './HttpError';
import util from 'util';
import { EErrorCodes } from './EErrorCodes';

/*
We use HttpError only if we want to throw an error with a specific status code and error code.
So no need to write try/catch block for every route.
But take into account that logs will be used to build error metrics.
Metric label format will be next {error.type}_${error.cause.type}
*/

const isProduction = process.env.NODE_ENV === 'production';

export const errorHandler = function (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);

  let errorCode = EErrorCodes.GENERAL_ERROR;
  let statusCode = 400;
  let message = 'Bad Request';

  if (error instanceof HttpError) {
    if (error.errorCode) {
      errorCode = error.errorCode;
    }

    statusCode = error.statusCode;
    message = error.message;
  }

  // handle fastify errors
  if ('statusCode' in error) {
    statusCode = error.statusCode as number;
  }

  return reply.status(statusCode).send({
    code: errorCode,
    message,
    ...isProduction ? {} : { info: util.inspect(error) }
  });
};