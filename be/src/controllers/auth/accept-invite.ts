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
    throw new HttpError(404, 'User not found');
  }

  if (!userProfile.isPending) {
    throw new HttpError(400, 'User already activated', EErrorCodes.USER_ALREADY_ACTIVATED);
  }

  if (Number(expireAt) < Date.now()) {
    throw new HttpError(400, 'Invite expired', EErrorCodes.INVITE_EXPIRED);
  }

  const isSignatureValid = await params.signatureService.verify(
    signature, 
    [email, expireAt]
  );

  if (!isSignatureValid) {
    throw new HttpError(400, 'Invalid signature', EErrorCodes.INVALID_SIGNATURE);
  }

  await Promise.all([
    params.identityService.setUserPassword({ email, password }),
    params.userProfileRepo.updateUserProfileById(userProfile.id, {
      ...userProfile,
      name,
      isPending: false
    })
  ]);

  return { success: true };
}