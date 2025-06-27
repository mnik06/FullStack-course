import { HttpError } from 'src/api/errors/HttpError';
import { TInviteUserReq } from 'src/api/routes/schemas/admin/users/InviteUserReqSchema';
import { TResendInviteReq } from 'src/api/routes/schemas/admin/users/ResendInviteReqSchema';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { IMailService } from 'src/types/services/IMailService';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

export async function sendInvite(params: {
  userProfileRepo: IUserProfileRepo;
  identityService: IIdentityService;
  mailService: IMailService;
  data: TInviteUserReq | TResendInviteReq & { userId: string };
}) {
  let userToInvite: TUserProfile;

  if ('email' in params.data) {
    await params.identityService.createNewPendingUser({ email: params.data.email });

    userToInvite = await params.userProfileRepo.createUserProfile({ 
      email: params.data.email,
      isPending: true 
    });
  } else {
    const existingUser = await params.userProfileRepo.getUserProfileById(params.data.userId);

    if (!existingUser) {
      throw new HttpError(404, 'User not found');
    }

    if (!existingUser.isPending) {
      throw new HttpError(400, 'User is not pending');
    }

    userToInvite = existingUser;
  }

  await params.mailService.send({
    to: userToInvite.email,
    from: 'm.nikitchenko@softonix.org',
    templateId: 'd-2436aac938a34d85a01b87d01c6f7349',
    vars: {
      redirectUrl: params.data.redirectUrl
    }
  });

  return { success: true };
}
