import { TUser } from 'src/types/user/schemas/User';

export interface IUserRepo {
  createUser(data: Partial<TUser>): Promise<{ user: TUser }>;
}
