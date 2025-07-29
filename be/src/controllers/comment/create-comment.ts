import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { TCommentUpsertData } from 'src/types/comment/schemas/CommentUpsertData';
import { TComment } from 'src/types/comment/schemas/Comment';

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

  return comment as TComment;
}