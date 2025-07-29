import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';

export async function getSoftDeletedUsers(params: {
  userProfileRepo: IUserProfileRepo,
}) {
  return await params.userProfileRepo.getSoftDeletedUserProfiles();
}
