export interface ISignatureService {
  sign(payload: Record<string, string | number>): Promise<string>;
}