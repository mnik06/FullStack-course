export interface ISignatureService {
  sign(keys: (string | number)[]): Promise<string>;
  verify(signature: string, keys: (string | number)[]): Promise<boolean>;
  createMessage(keys: (string | number)[]): Buffer;
}