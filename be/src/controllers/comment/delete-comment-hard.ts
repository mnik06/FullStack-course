import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { HttpError } from 'src/api/errors/HttpError';

export async function deleteCommentHard(params: {
  commentRepo: ICommentRepo,
  commentId: string
}) {
  const isCommentFound = await params.commentRepo.deleteCommentHard(params.commentId);

  if (!isCommentFound) {
    throw new HttpError({
      statusCode: 404,
      message: 'Comment not found'
    });
  }

  return { success: true };
}
