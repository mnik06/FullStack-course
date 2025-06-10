import { TSignupReq } from 'src/api/routes/schemas/auth/SignupReqSchema';
import { getCognitoService } from 'src/services/cognito/cognito.service';
import { IUserRepo } from 'src/types/repos/IUserRepo';

export async function signup(params: {
  userRepo: IUserRepo;
  data: TSignupReq
}) {
  const cognitoService = getCognitoService();
  const { email, password, name } = params.data;

  const createUserRes = await cognitoService.createNewUser({
    email,
    password,
    userAttributes: { name }
  });

  const user = await params.userRepo.createUser({
    email,
    name,
    cognitoId: cognitoService.transformAttributes(createUserRes.User?.Attributes ?? []).sub
  });

  return user;
}