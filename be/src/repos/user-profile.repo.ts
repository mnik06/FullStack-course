import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { userTable } from 'src/services/drizzle/schema';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';
import { TUserProfile, UserProfileSchema } from 'src/types/user-profile/schemas/UserProfile';
import { getPaginationService } from 'src/services/pagination/pagination.service';
import { getSearchService } from 'src/services/search/search.service';

export function getUserProfileRepo(db: NodePgDatabase): IUserProfileRepo {
  return {
    async createUserProfile(data) {
      const user = await db.insert(userTable).values(data as TUserProfile).returning();
      return { user: UserProfileSchema.parse(user[0]) };
    },

    async getUserProfileBySubId(subId) {
      const user = await db.select().from(userTable).where(eq(userTable.subId, subId));
      return { user: UserProfileSchema.parse(user[0]) };
    },

    async getAllUserProfiles(filters = {}) {
      const paginationService = getPaginationService();
      const searchService = getSearchService();

      const searchFilters = searchService.getSearchFilters({
        searchQuery: filters.search,
        trgmSearchColumns: [userTable.email, userTable.name]
      });

      const query = db
        .select()
        .from(userTable)
        .where(searchFilters)
        .$dynamic();

      const users = await paginationService.withPagination(query, filters);

      return { users: UserProfileSchema.array().parse(users) };
    }
  };
} 