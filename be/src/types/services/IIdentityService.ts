import { TIdentityUser } from '../IdentityUser';

export interface IIdentityService {
  getUserByAccessToken(token: string): Promise<TIdentityUser>;
  createNewUser(params: {
    email: string, 
    password: string, 
    userAttributes?: Record<string, string>
  }): Promise<TIdentityUser>;
}