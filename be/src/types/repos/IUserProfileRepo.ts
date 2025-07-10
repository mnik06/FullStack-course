import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { TUserProfileFilters } from 'src/types/user-profile/UserProfileFilters';
import { TPaginationResponse } from 'src/types/Pagination';

export interface IUserProfileRepo {
  createUserProfile(data: Partial<TUserProfile>): Promise<TUserProfile>;
  updateUserProfileById(id: string, data: Partial<TUserProfile>): Promise<TUserProfile | null>;
  getUserProfileById(id: string): Promise<TUserProfile | null>;
  getUserProfileBySubId(subId: string): Promise<TUserProfile | null>;
  getUserProfileByEmail(email: string): Promise<TUserProfile | null>;
  getAllUserProfiles(filters: TUserProfileFilters): Promise<TPaginationResponse<TUserProfile[]>>;
  deleteUserSoft(id: string): Promise<boolean>;
  deleteUserHard(id: string): Promise<boolean>;
}
