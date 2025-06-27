export interface IMailService {
  send(
    params: { to: string, from: string, templateId: string, vars: Record<string, string> }
  ): Promise<void>;
}