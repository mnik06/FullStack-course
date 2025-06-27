import { ISignatureService } from 'src/types/services/ISignatureService';

export function kmsService(): ISignatureService {
  return {
    sign: async (payload: Record<string, string>) => {
      console.log('payload', payload);
      return 'test';
      // return await kms.sign(payload);
    }
  };
}