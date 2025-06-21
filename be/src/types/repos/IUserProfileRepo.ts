import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { TUserProfileFilters } from 'src/types/user-profile/UserProfileFilters';
import { TPaginationResponse } from 'src/types/Pagination';

export interface IUserProfileRepo {
  createUserProfile(data: Partial<TUserProfile>): Promise<{ user: TUserProfile }>;
  getUserProfileBySubId(subId: string): Promise<{ user: TUserProfile }>;
  getAllUserProfiles(filters: TUserProfileFilters): Promise<TPaginationResponse<TUserProfile[]>>;
}
