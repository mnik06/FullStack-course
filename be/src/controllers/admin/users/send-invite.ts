import { HttpError } from 'src/api/errors/HttpError';
import { TInviteUserReq } from 'src/api/routes/schemas/admin/users/InviteUserReqSchema';
import { TResendInviteReq } from 'src/api/routes/schemas/admin/users/ResendInviteReqSchema';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { IMailService } from 'src/types/services/IMailService';

export async function sendInvite(params: {
  userProfileRepo: IUserProfileRepo;
  identityService: IIdentityService;
  mailService: IMailService;
  data: TInviteUserReq | TResendInviteReq & { userId: string };
}) {
  if ('email' in params.data) {
    await params.identityService.createNewPendingUser({ email: params.data.email });
    await params.userProfileRepo.createUserProfile({ email: params.data.email, isPending: true });
  } else {
    const userProfile = await params.userProfileRepo.getUserProfileById(params.data.userId);

    if (!userProfile) {
      throw new HttpError(404, 'User not found');
    }

    if (!userProfile.isPending) {
      throw new HttpError(400, 'User is not pending');
    }
  }

  await params.mailService.send('', '', '', {});

  return { success: true };
}
