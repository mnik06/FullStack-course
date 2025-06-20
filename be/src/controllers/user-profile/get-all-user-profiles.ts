import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';

export function getAllUserProfiles(params: {
  userProfileRepo: IUserProfileRepo
}) {
  return params.userProfileRepo.getAllUserProfiles();
}