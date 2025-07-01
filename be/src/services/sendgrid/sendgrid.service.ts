import sgMail from '@sendgrid/mail';
import { IMailService } from 'src/types/services/IMailService';
import { HttpError } from 'src/api/errors/HttpError';

export function getSendgridService(): IMailService {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
        throw new HttpError({
          statusCode: 400,
          message: 'Failed to send email',
          cause: error
        });
      }
    }
  };
}