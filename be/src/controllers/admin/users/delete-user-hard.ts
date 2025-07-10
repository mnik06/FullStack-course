import { HttpError } from 'src/api/errors/HttpError';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';

export async function deleteUserHard(params: {
  identityService: IIdentityService;
  userProfileRepo: IUserProfileRepo;
  userId: string;
}) {
  const user = await params.userProfileRepo.getUserProfileById(params.userId);

  if (!user) {
    throw new HttpError({
      statusCode: 404,
      message: 'User not found'
    });
  }

  await params.identityService.deleteUser(user.email);
  await params.userProfileRepo.deleteUserHard(params.userId);

  return { success: true };
}