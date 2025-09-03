import { EErrorCodes } from 'src/api/errors/EErrorCodes';
import { HttpError } from 'src/api/errors/HttpError';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';

export async function restoreSoftDeletedComment(params: {
  commentId: string;
  commentRepo: ICommentRepo;
  postRepo: IPostRepo;
  userProfileRepo: IUserProfileRepo;
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

  const post = await params.postRepo.getPostById(comment.postId);  

  if (!post) {
    throw new HttpError({
      statusCode: 404,
      message: 'Post not found',
      errorCode: EErrorCodes.POST_NOT_FOUND
    });
  }

  const commentOwner = await params.userProfileRepo.getUserProfileById(comment.userId);

  if (!commentOwner) {
    throw new HttpError({
      statusCode: 404,
      message: 'Comment owner not found',
      errorCode: EErrorCodes.COMMENT_OWNER_NOT_FOUND
    });
  }

  await params.commentRepo.restoreSoftDeletedComments([params.commentId]);

  return { success: true };
}