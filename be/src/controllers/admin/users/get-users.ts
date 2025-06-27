import { HttpError } from 'src/api/errors/HttpError';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { TUserProfileFilters } from 'src/types/user-profile/UserProfileFilters';

export async function getUsers(params: {
  userProfileRepo: IUserProfileRepo,
  query: TUserProfileFilters,
  identityService: IIdentityService
}) {
  const { data, ...rest } = await params.userProfileRepo.getAllUserProfiles(params.query);

  try {
    const usersWithActiveField = await Promise.all(data.map(user => {
      return params.identityService.getUserByEmail(user.email)
        .then((identityUser) => ({ ...user, isActive: identityUser.isActive ?? false }));
    }));

    return {
      data: usersWithActiveField,
      ...rest
    };
  } catch (error) {
    throw new HttpError(400, 'Failed to get users from identity service', error);
  }
}