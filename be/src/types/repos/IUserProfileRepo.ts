import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { TUserProfileFilters } from 'src/types/user-profile/UserProfileFilters';
import { TPaginationResponse } from 'src/types/Pagination';
import { TTransaction } from 'src/types/ITransactionManager';
import { TUserProfileWithDeletedAt } from 'src/types/user-profile/schemas/UserProfileWithDeletedAt';

export interface IUserProfileRepo {
  createUserProfile(data: Partial<TUserProfile>, transaction?: TTransaction): Promise<TUserProfile>;
  updateUserProfileById(id: string, data: Partial<TUserProfile>): Promise<TUserProfile | null>;
  getUserProfileById(id: string): Promise<TUserProfile | null>;
  getUserProfileBySubId(subId: string): Promise<TUserProfile | null>;
  getUserProfileByEmail(email: string): Promise<TUserProfile | null>;
  getAllUserProfiles(filters: TUserProfileFilters): Promise<TPaginationResponse<TUserProfile[]>>;
  getSoftDeletedUserProfiles(): Promise<TUserProfileWithDeletedAt[]>;
  deleteUserSoft(id: string): Promise<boolean>;
  deleteUserHard(id: string): Promise<boolean>;
  restoreSoftDeletedUserProfile(id: string, transaction?: TTransaction): Promise<boolean>;
}
