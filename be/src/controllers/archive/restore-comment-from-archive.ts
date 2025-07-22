import { HttpError } from 'src/api/errors/HttpError';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { TComment } from 'src/types/comment/schemas/Comment';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { ITransactionManager } from 'src/types/ITransactionManager';
import { EErrorCodes } from 'src/api/errors/EErrorCodes';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';
import { createCommentsFromExistingData } from 'src/controllers/common/comment/create-comments-from-existing-data';

export async function restoreCommentFromArchive(params: {
  archiveId: string;
  commentRepo: ICommentRepo;
  archiveRepo: IArchiveRepo;
  postRepo: IPostRepo;
  transactionManager: ITransactionManager;
  userProfileRepo: IUserProfileRepo;
}) {
  const commentArchive = await params.archiveRepo.getArchiveById(params.archiveId);
  
  if (!commentArchive) {
    throw new HttpError({
      statusCode: 404,
      message: 'Comment archive not found'
    });
  }

  const post = await params.postRepo.getPostById(commentArchive.data.postId);

  if (!post) {
    throw new HttpError({
      statusCode: 404,
      message: 'Post not found',
      errorCode: EErrorCodes.POST_NOT_FOUND
    });
  }

  const commentOwner = await params.userProfileRepo.getUserProfileById(commentArchive.data.user.id);

  if (!commentOwner) {
    throw new HttpError({
      statusCode: 404,
      message: 'Comment owner not found',
      errorCode: EErrorCodes.COMMENT_OWNER_NOT_FOUND
    });
  }

  await params.transactionManager.execute(async ({ sharedTx }) => {
    await createCommentsFromExistingData({
      commentRepo: params.commentRepo,
      postRepo: params.postRepo,
      comments: [commentArchive.data] as TComment[],
      transaction: sharedTx
    });

    await params.archiveRepo.deleteArchiveById(commentArchive.id, sharedTx);
  });

  return { success: true };
}