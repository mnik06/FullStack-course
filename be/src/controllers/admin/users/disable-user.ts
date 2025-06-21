import { HttpError } from 'src/api/errors/HttpError';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';

export async function disableUser(params: {
  identityService: IIdentityService,
  userProfileRepo: IUserProfileRepo,
  id: string
}) {
  try {
    const { user } = await params.userProfileRepo.getUserProfileById(params.id);

    await params.identityService.disableUser(user.email);
    await params.userProfileRepo.updateUserProfileById(params.id, { isActive: false });
  } catch (error) {
    throw new HttpError(400, 'Failed to disable user', error);
  }

  return { success: true };
}