import { HttpError } from 'src/api/errors/HttpError';
import { TSignupReq } from 'src/api/routes/schemas/auth/SignupReqSchema';
import { IUserRepo } from 'src/types/repos/IUserRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';

export async function signup(params: {
  userRepo: IUserRepo;
  identityService: IIdentityService
  data: TSignupReq
}) {
  const { email, password, name } = params.data;

  const identityUser = await params.identityService.createNewUser({
    email,
    password,
    userAttributes: { name }
  });

  if (!identityUser) {
    throw new HttpError(400, 'Failed to create user in identity platform');
  }

  const user = await params.userRepo.createUser({
    ...identityUser,
    name
  });

  return user;
}