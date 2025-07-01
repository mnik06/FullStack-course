import { HttpError } from 'src/api/errors/HttpError';
import { EErrorCodes } from 'src/api/errors/EErrorCodes';
import { TAcceptInviteReq } from 'src/api/routes/schemas/auth/AcceptInviteReqSchema';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { ISignatureService } from 'src/types/services/ISignatureService';

export async function acceptInvite(params: {
  userProfileRepo: IUserProfileRepo;
  identityService: IIdentityService;
  signatureService: ISignatureService;
  data: TAcceptInviteReq;
}) {
  const { email, name, password, signature, expireAt } = params.data;

  const userProfile = await params.userProfileRepo.getUserProfileByEmail(email);

  if (!userProfile) {
    throw new HttpError({
      statusCode: 404,
      message: 'User not found',
      errorCode: EErrorCodes.USER_NOT_FOUND
    });
  }

  if (!userProfile.isPending) {
    throw new HttpError({
      statusCode: 400,
      message: 'User already activated',
      errorCode: EErrorCodes.USER_ALREADY_ACTIVATED
    });
  }

  if (Number(expireAt) < Date.now()) {
    throw new HttpError({
      statusCode: 400,
      message: 'Invite expired',
      errorCode: EErrorCodes.INVITE_EXPIRED
    });
  }

  const isSignatureValid = await params.signatureService.verify(
    signature, 
    [email, expireAt]
  );

  if (!isSignatureValid) {
    throw new HttpError({
      statusCode: 400,
      message: 'Invalid signature',
      errorCode: EErrorCodes.INVALID_SIGNATURE
    });
  }

  await params.identityService.setUserPassword({ email, password });
  await params.userProfileRepo.updateUserProfileById(userProfile.id, {
    ...userProfile,
    name,
    isPending: false
  });

  return { success: true };
}