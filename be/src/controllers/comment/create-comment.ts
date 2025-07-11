import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { createCommentHelper } from 'src/controllers/common/comment/create-comment-helper';
import { TCommentUpsertData } from 'src/types/comment/schemas/CommentUpsertData';
import { HttpError } from 'src/api/errors/HttpError';

export async function createNewComment(params: {
  commentRepo: ICommentRepo;
  data: TCommentUpsertData;
  user: TUserProfile;
  postId: string;
}) {
  const comment = await createCommentHelper({
    commentRepo: params.commentRepo,
    data: params.data,
    postId: params.postId,
    user: params.user
  });

  if (!comment) {
    throw new HttpError({
      statusCode: 404,
      message: 'User not found'
    });
  } 

  return comment;
}