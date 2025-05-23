import { TIdentityUser } from '../IdentityUser';

export interface IIdentityService {
  getUserByAccessToken(token: string): Promise<TIdentityUser>;
}