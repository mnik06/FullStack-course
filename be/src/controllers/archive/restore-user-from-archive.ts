import { HttpError } from 'src/api/errors/HttpError';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { IUserProfileArchiveData } from 'src/types/user-profile/UserProfileArchiveData';
import { createPostsFromExistingData } from 'src/controllers/common/post/create-posts-from-existing-data';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { IPostToTagRepo } from 'src/types/repos/IPostToTagRepo';
import { ITagRepo } from 'src/types/repos/ITagRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { createCommentsFromExistingData } from 'src/controllers/common/comment/create-comments-from-existing-data';
import { ITransactionManager } from 'src/types/ITransactionManager';
import { TPostWithComments } from 'src/types/post/schemas/PostWithComments';
import { TComment } from 'src/types/comment/schemas/Comment';

export async function restoreUserFromArchive(params: {
  archiveId: string;
  userProfileRepo: IUserProfileRepo;
  archiveRepo: IArchiveRepo;
  identityService: IIdentityService;
  postRepo: IPostRepo;
  postToTagRepo: IPostToTagRepo;
  tagRepo: ITagRepo;
  commentRepo: ICommentRepo;
  transactionManager: ITransactionManager;
}) {
  const userArchive = await params.archiveRepo.getArchiveById(params.archiveId);

  if (!userArchive) {
    throw new HttpError({
      statusCode: 404,
      message: 'User archive not found'
    });
  }

  const { user, posts, comments } = userArchive.data as IUserProfileArchiveData;

  await params.identityService.enableUser(user.email);

  await params.transactionManager.execute(async ({ sharedTx }) => {
    await params.userProfileRepo.createUserProfile({
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt)
    }, sharedTx);

    if (posts?.length) {
      await createPostsFromExistingData({
        posts: posts as TPostWithComments[],
        postRepo: params.postRepo,
        postToTagRepo: params.postToTagRepo,
        tagRepo: params.tagRepo,
        commentRepo: params.commentRepo,
        transaction: sharedTx
      });
    }
    
    if (comments?.length) {
      await createCommentsFromExistingData({
        comments: comments as TComment[],
        commentRepo: params.commentRepo,
        postRepo: params.postRepo,
        transaction: sharedTx
      });
    }

    await params.archiveRepo.deleteArchiveById(userArchive.id, sharedTx);
  });

  return { success: true };
}
