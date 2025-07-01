import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { IMailService } from 'src/types/services/IMailService';
import { sendInviteWithRedirectUrl } from 'src/controllers/common/send-invite-with-redirect-url';
import { ISignatureService } from 'src/types/services/ISignatureService';

export async function createInviteForNewUser(params: {
  userProfileRepo: IUserProfileRepo;
  identityService: IIdentityService;
  mailService: IMailService;
  signatureService: ISignatureService;
  data: { email: string; redirectUrl: string }
}) {
  const identityUser = await params.identityService
    .createNewPendingUser({ email: params.data.email });

  const userToInvite = await params.userProfileRepo.createUserProfile({ 
    email: params.data.email,
    subId: identityUser.subId,
    isPending: true 
  });

  await sendInviteWithRedirectUrl({
    userEmail: userToInvite.email,
    redirectUrl: params.data.redirectUrl,
    mailService: params.mailService,
    signatureService: params.signatureService
  });
}