import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { userTable } from 'src/services/drizzle/schema';
import { IUserRepo } from 'src/types/repos/IUserRepo';
import { TUser, UserSchema } from 'src/types/user/schemas/User';

export function getUserRepo(db: NodePgDatabase): IUserRepo {
  return {
    async createUser(data) {
      const user = await db.insert(userTable).values(data as TUser).returning();
      return { user: UserSchema.parse(user[0]) };
    }
  };
} 