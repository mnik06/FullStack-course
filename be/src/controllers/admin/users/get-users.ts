import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';

export function getUsers(params: {
  userProfileRepo: IUserProfileRepo
}) {
  return params.userProfileRepo.getAllUserProfiles();
}