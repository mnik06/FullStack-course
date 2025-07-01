import { TIdentityUser } from '../IdentityUser';

export interface IIdentityService {
  getUserByAccessToken(token: string): Promise<TIdentityUser>;
  getUserByEmail(email: string): Promise<TIdentityUser>;
  createNewUser(params: { email: string, password: string }): Promise<TIdentityUser>;
  createNewPendingUser(params: { email: string }): Promise<TIdentityUser>;
  setUserPassword(params: {
    email: string,
    password: string
  }): Promise<void>;
  disableUser(email: string): Promise<void>;
  enableUser(email: string): Promise<void>;
}