import { EErrorCodes } from 'src/api/errors/EErrorCodes';
import { HttpError } from 'src/api/errors/HttpError';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';

export async function restoreSoftDeletedComment(params: {
  commentId: string;
  commentRepo: ICommentRepo;
}) {
  // TODO: add posts and users check
  const comment = await params.commentRepo.getCommentById(params.commentId, false);

  if (!comment) {
    throw new HttpError({
      statusCode: 404,
      message: 'Comment not found',
      errorCode: EErrorCodes.COMMENT_NOT_FOUND
    });
  }

  await params.commentRepo.restoreSoftDeletedComments([params.commentId]);

  return { success: true };
}