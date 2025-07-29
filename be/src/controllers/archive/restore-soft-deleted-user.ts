import { EErrorCodes } from 'src/api/errors/EErrorCodes';
import { HttpError } from 'src/api/errors/HttpError';
import { ITransactionManager } from 'src/types/ITransactionManager';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';

export async function restoreSoftDeletedUser(params: {
  userId: string,
  userProfileRepo: IUserProfileRepo,
  commentRepo: ICommentRepo,
  postRepo: IPostRepo,
  transactionManager: ITransactionManager,
}) {
  const user = await params.userProfileRepo.getUserProfileById(params.userId);

  if (!user) {
    throw new HttpError({
      statusCode: 404,
      message: 'User not found',
      errorCode: EErrorCodes.USER_NOT_FOUND
    });
  }

  const posts = await params.postRepo.getPostsWithCommentsByUserId(params.userId, false);
  const comments = await params.commentRepo.getCommentsByUserId(params.userId, false);
  const commentsForPosts = await params.commentRepo.getCommentsByPostIds(
    posts.map((p) => p.id), 
    false
  );

  await params.transactionManager.execute(async ({ sharedTx }) => {
    await params.userProfileRepo.restoreSoftDeletedUserProfile(params.userId, sharedTx);

    if (posts.length) {
      await params.postRepo.restoreSoftDeletedPosts(posts.map((p) => p.id), sharedTx);
    }

    if (comments.length) {
      await params.commentRepo.restoreSoftDeletedComments(comments.map((c) => c.id), sharedTx);
    }

    if (commentsForPosts.length) {
      await params.commentRepo.restoreSoftDeletedComments(
        commentsForPosts.map((c) => c.id), 
        sharedTx
      );
    }
  });

  return { success: true };
}