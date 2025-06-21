import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';
import { TUserProfileFilters } from 'src/types/user-profile/UserProfileFilters';

export function getUsers(params: {
  userProfileRepo: IUserProfileRepo,
  query: TUserProfileFilters
}) {
  return params.userProfileRepo.getAllUserProfiles(params.query);
}