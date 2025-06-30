import { GenerateMacCommand, KMSClient, VerifyMacCommand } from '@aws-sdk/client-kms';
import { ISignatureService } from 'src/types/services/ISignatureService';

export function kmsService(): ISignatureService {
  const kms = new KMSClient({ region: process.env.AWS_REGION });
  const MAC_ALGORITHM = 'HMAC_SHA_512';
  const KEY_ID = 'c2a79305-148e-4936-8a53-1409a3ae89c0';

  return {
    createMessage (keys) {
      return Buffer.from(keys.sort().join(':'));
    },

    async sign (keys) {
      const res = await kms.send(new GenerateMacCommand({
        KeyId: KEY_ID,
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
          KeyId: KEY_ID,
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