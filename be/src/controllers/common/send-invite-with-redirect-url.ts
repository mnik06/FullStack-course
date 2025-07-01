import { ISignatureService } from 'src/types/services/ISignatureService';
import { IMailService } from 'src/types/services/IMailService';

export async function sendInviteWithRedirectUrl(params: {
  userEmail: string;
  redirectUrl: string;
  mailService: IMailService;
  signatureService: ISignatureService;
}) {
  const expireAt = Date.now() + 1000 * 60 * 60;
  const signature = await params.signatureService.sign([params.userEmail, expireAt]);
  const finalRedirectUrl = `${params.redirectUrl}?email=${params.userEmail}&signature=${signature}&expireAt=${expireAt}`;

  await params.mailService.send({
    to: params.userEmail,
    from: 'm.nikitchenko@softonix.org',
    templateId: process.env.INVITES_EMAIL_TEMPLATE_ID,
    vars: {
      redirectUrl: finalRedirectUrl
    }
  });

  return { success: true };
}