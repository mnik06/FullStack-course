import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

export interface IUserProfileRepo {
  createUserProfile(data: Partial<TUserProfile>): Promise<{ user: TUserProfile }>;
  getUserProfileBySubId(subId: string): Promise<{ user: TUserProfile }>;
  getAllUserProfiles(): Promise<{ users: TUserProfile[] }>;
}
