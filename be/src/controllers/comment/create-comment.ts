import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { TCommentUpsertData } from 'src/types/comment/schemas/CommentUpsertData';
import { HttpError } from 'src/api/errors/HttpError';
import { EErrorCodes } from 'src/api/errors/EErrorCodes';

export async function createNewComment(params: {
  commentRepo: ICommentRepo;
  data: TCommentUpsertData;
  user: TUserProfile;
  postId: string;
}) {
  const comment = await params.commentRepo.createComment({
    ...params.data,
    postId: params.postId,
    userId: params.user.id
  });

  if (!comment) {
    throw new HttpError({
      statusCode: 404,
      message: 'Comment owner not found',
      errorCode: EErrorCodes.COMMENT_OWNER_NOT_FOUND
    });
  } 

  return comment;
}