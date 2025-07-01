import { GenerateMacCommand, KMSClient, VerifyMacCommand } from '@aws-sdk/client-kms';
import { ISignatureService } from 'src/types/services/ISignatureService';

export function kmsService(): ISignatureService {
  const kms = new KMSClient({ region: process.env.AWS_REGION });
  const MAC_ALGORITHM = 'HMAC_SHA_512';

  return {
    createMessage (keys) {
      return Buffer.from(keys.sort().join(':'));
    },

    async sign (keys) {
      const res = await kms.send(new GenerateMacCommand({
        KeyId: process.env.HMAC_KEY_ID,
        Message: this.createMessage(keys),
        MacAlgorithm: MAC_ALGORITHM
      }));

      if (!res.Mac) {
        throw new Error('Failed to generate MAC');
      }

      return Buffer.from(res.Mac).toString('base64url');
    },
    
    async verify (signature, keys) {
      try {
        const res = await kms.send(new VerifyMacCommand({
          KeyId: process.env.HMAC_KEY_ID,
          Message: this.createMessage(keys),
          Mac: Buffer.from(signature, 'base64url'),
          MacAlgorithm: MAC_ALGORITHM
        }));
    
        return !!res.MacValid;
      } catch {
        return false;
      }
    }
  };
}