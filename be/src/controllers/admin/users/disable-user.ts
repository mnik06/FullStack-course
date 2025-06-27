import { HttpError } from 'src/api/errors/HttpError';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';

export async function disableUser(params: {
  identityService: IIdentityService,
  userProfileRepo: IUserProfileRepo,
  id: string
}) {
  const user = await params.userProfileRepo.getUserProfileById(params.id);

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  await params.identityService.disableUser(user.email);

  return { success: true };
}