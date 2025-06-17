 
import { preHandlerAsyncHookHandler } from 'fastify';
import { HttpError } from 'src/api/errors/HttpError';

export const userProfileHook: preHandlerAsyncHookHandler = async function (request) {
  const token = request.headers.authorization?.split(' ')[1];

  if (request.routeOptions?.config?.skipAuth) {
    return;
  } else if (!token) {
    throw new HttpError(401, 'Unauthorized');
  }
  
  const identityUser = await request.server.identityService.getUserByAccessToken(token);

  if (!identityUser) {
    throw new HttpError(401, 'Unauthorized');
  }

  const userProfileRes = await request.server.repos.userProfileRepo.getUserProfileBySubId(
    identityUser.subId
  );

  if (!userProfileRes.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  request.user = userProfileRes.user;
};