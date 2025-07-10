import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { count, desc, eq } from 'drizzle-orm';
import { userTable } from 'src/services/drizzle/schema';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';
import { TUserProfile, UserProfileSchema } from 'src/types/user-profile/schemas/UserProfile';
import { getPaginationService } from 'src/services/pagination/pagination.service';
import { getSearchService } from 'src/services/search/search.service';

export function getUserProfileRepo(db: NodePgDatabase): IUserProfileRepo {
  return {
    async createUserProfile(data) {
      const [user] = await db.insert(userTable).values(data as TUserProfile).returning();
      return UserProfileSchema.parse(user);
    },

    async updateUserProfileById(id, data) {
      const [user] = await db.update(userTable).set(data).where(eq(userTable.id, id)).returning();

      if (!user) {
        return null;
      }

      return UserProfileSchema.parse(user);
    },

    async getUserProfileById(id) {
      const [user] = await db.select().from(userTable).where(eq(userTable.id, id));

      if (!user) {
        return null;
      }

      return UserProfileSchema.parse(user);
    },

    async getUserProfileBySubId(subId) {
      const [user] = await db.select().from(userTable).where(eq(userTable.subId, subId));

      if (!user) {
        return null;
      }

      return UserProfileSchema.parse(user);
    },

    async getUserProfileByEmail(email) {
      const [user] = await db.select().from(userTable).where(eq(userTable.email, email));

      if (!user) {
        return null;
      }

      return UserProfileSchema.parse(user);
    },

    async getAllUserProfiles(filters = {}) {
      const paginationService = getPaginationService();
      const searchService = getSearchService();

      const searchFilters = searchService.getSearchFilters({
        searchQuery: filters.search,
        trgmSearchColumns: [userTable.email, userTable.name]
      });

      const qb = db
        .select()
        .from(userTable)
        .where(searchFilters)
        .orderBy(desc(userTable.createdAt))
        .groupBy(userTable.id)
        .$dynamic();

      const totalQb = db
        .select({ count: count() })
        .from(userTable)
        .where(searchFilters)
        .$dynamic();

      const [users, total] = await Promise.all([
        paginationService.withPagination(qb, filters),
        totalQb
      ]);

      const paginationMeta = paginationService.calculatePaginationMeta({
        total: total[0].count,
        ...filters
      });

      return { data: UserProfileSchema.array().parse(users), meta: paginationMeta };
    },

    async deleteUserSoft(id) {
      const [user] = await db
        .update(userTable)
        .set({ deletedAt: new Date() })
        .where(eq(userTable.id, id))
        .returning();

      return !!user;
    },

    async deleteUserHard(id) {
      const [user] = await db.delete(userTable).where(eq(userTable.id, id)).returning();
      return !!user;
    }
  };
} 