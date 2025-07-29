import { EErrorCodes } from 'src/api/errors/EErrorCodes';
import { HttpError } from 'src/api/errors/HttpError';
import { ITransactionManager } from 'src/types/ITransactionManager';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { IPostRepo } from 'src/types/repos/IPostRepo';

export async function restoreSoftDeletedPost(params: {
  postId: string,
  postRepo: IPostRepo,
  commentRepo: ICommentRepo,
  transactionManager: ITransactionManager,
}) {
  // TODO: add user check
  const post = await params.postRepo.getPostById(params.postId, false);

  if (!post) {
    throw new HttpError({
      statusCode: 404,
      message: 'Post not found',
      errorCode: EErrorCodes.POST_NOT_FOUND
    });
  }

  const comments = await params.commentRepo.getCommentsByPostIds([params.postId], false);

  await params.transactionManager.execute(async ({ sharedTx }) => {
    await params.postRepo.restoreSoftDeletedPosts([params.postId], sharedTx);

    if (comments.length) {
      await params.commentRepo.restoreSoftDeletedComments(comments.map((c) => c.id), sharedTx);
    }
  });

  return { success: true };
}