import { HttpError } from 'src/api/errors/HttpError';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { createNewArchiveHelper } from 'src/controllers/common/create-new-archive-helper';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

export async function deleteUserHardAndArchive(params: {
  identityService: IIdentityService;
  userProfileRepo: IUserProfileRepo;
  postRepo: IPostRepo;
  commentRepo: ICommentRepo;
  archiveRepo: IArchiveRepo;
  userIdToDelete: string;
  user: TUserProfile;
}) {
  const userToDelete = await params.userProfileRepo.getUserProfileById(params.userIdToDelete);

  if (!userToDelete) {
    throw new HttpError({
      statusCode: 404,
      message: 'User not found'
    });
  }

  const userPosts = await params.postRepo.getPostsWithCommentsByUserId(params.userIdToDelete);
  const userComments = await params.commentRepo.getComments({ userId: params.userIdToDelete });

  await params.identityService.disableUser(userToDelete.email);
  await params.userProfileRepo.deleteUserHard(params.userIdToDelete);

  await createNewArchiveHelper({
    archiveRepo: params.archiveRepo,
    entityType: 'user',
    entityId: params.userIdToDelete,
    user: params.user,
    data: {
      user: userToDelete,
      posts: userPosts,
      comments: userComments
    }
  });

  return { success: true };
}