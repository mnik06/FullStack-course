import { HttpError } from 'src/api/errors/HttpError';
import { TSignupReq } from 'src/api/routes/schemas/auth/SignupReqSchema';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';

export async function signup(params: {
  userProfileRepo: IUserProfileRepo;
  identityService: IIdentityService
  data: TSignupReq
}) {
  const { email, password, name } = params.data;

  const identityUser = await params.identityService.createNewUser({
    email,
    password
  });

  if (!identityUser) {
    throw new HttpError(400, 'Failed to create user in identity platform');
  }

  await params.userProfileRepo.createUserProfile({
    ...identityUser,
    name
  });

  return { success: true };
}