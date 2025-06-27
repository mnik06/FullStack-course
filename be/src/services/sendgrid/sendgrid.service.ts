import { IMailService } from 'src/types/services/IMailService';
import sgMail from '@sendgrid/mail';
import { HttpError } from 'src/api/errors/HttpError';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export function getSendgridService(): IMailService {
  return {
    async send({ to, from, templateId, vars }) {
      try {
        await sgMail.send({
          to,
          from,
          templateId,
          dynamicTemplateData: vars
        });
      } catch (error) {
        throw new HttpError(400, 'Failed to send email', error);
      }
    }
  };
}