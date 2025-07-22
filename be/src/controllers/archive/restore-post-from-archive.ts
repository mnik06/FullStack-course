import { IPostToTagRepo } from 'src/types/repos/IPostToTagRepo';

import { HttpError } from 'src/api/errors/HttpError';
import { TPostWithComments } from 'src/types/post/schemas/PostWithComments';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { ITagRepo } from 'src/types/repos/ITagRepo';
import { EErrorCodes } from 'src/api/errors/EErrorCodes';
import { createPostsFromExistingData } from 'src/controllers/common/post/create-posts-from-existing-data';
import { ITransactionManager } from 'src/types/ITransactionManager';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';

export async function restorePostFromArchive(params: {
  archiveId: string,
  postRepo: IPostRepo,
  commentRepo: ICommentRepo,
  archiveRepo: IArchiveRepo,
  postToTagRepo: IPostToTagRepo,
  tagRepo: ITagRepo,
  transactionManager: ITransactionManager,
  userProfileRepo: IUserProfileRepo
}) {
  const postArchive = await params.archiveRepo.getArchiveById(params.archiveId);

  if (!postArchive) {
    throw new HttpError({
      statusCode: 404,
      message: 'Post archive not found'
    });
  }

  const postOwner = await params.userProfileRepo.getUserProfileById(postArchive.data.user.id);

  if (!postOwner) {
    throw new HttpError({
      statusCode: 404,
      message: 'Post owner not found',
      errorCode: EErrorCodes.POST_OWNER_NOT_FOUND
    });
  }

  await params.transactionManager.execute(async ({ sharedTx }) => {
    await createPostsFromExistingData({
      posts: [postArchive.data] as TPostWithComments[],
      postRepo: params.postRepo,
      postToTagRepo: params.postToTagRepo,
      tagRepo: params.tagRepo,
      commentRepo: params.commentRepo,
      transaction: sharedTx
    });

    await params.archiveRepo.deleteArchiveById(postArchive.id);
  });

  return { success: true };
}