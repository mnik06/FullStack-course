import { HttpError } from 'src/api/errors/HttpError';
import { EErrorCodes } from 'src/api/errors/EErrorCodes';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';

export async function disableUser(params: {
  identityService: IIdentityService,
  userProfileRepo: IUserProfileRepo,
  id: string
}) {
  const user = await params.userProfileRepo.getUserProfileById(params.id);

  if (!user) {
    throw new HttpError({
      statusCode: 404,
      message: 'User not found',
      errorCode: EErrorCodes.USER_NOT_FOUND
    });
  }

  await params.identityService.disableUser(user.email);

  return { success: true };
}