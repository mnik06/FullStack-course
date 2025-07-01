import { EErrorCodes } from 'src/api/errors/EErrorCodes';
import { HttpError } from 'src/api/errors/HttpError';
import { sendInviteWithRedirectUrl } from 'src/controllers/common/send-invite-with-redirect-url';
import { IMailService } from 'src/types/services/IMailService';
import { ISignatureService } from 'src/types/services/ISignatureService';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';

export async function resendInviteByUserId(params: {
  userProfileRepo: IUserProfileRepo;
  mailService: IMailService;
  signatureService: ISignatureService;
  data: { userId: string; redirectUrl: string }
}) {
  const existingUser = await params.userProfileRepo.getUserProfileById(params.data.userId);

  if (!existingUser) {
    throw new HttpError({
      statusCode: 404,
      message: 'User not found',
      errorCode: EErrorCodes.USER_NOT_FOUND
    });
  }

  if (!existingUser.isPending) {
    throw new HttpError({ statusCode: 400, message: 'User is not pending' });
  }

  return sendInviteWithRedirectUrl({ 
    userEmail: existingUser.email, 
    redirectUrl: params.data.redirectUrl, 
    mailService: params.mailService, 
    signatureService: params.signatureService 
  });
}