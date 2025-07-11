import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { TCommentUpsertData } from 'src/types/comment/schemas/CommentUpsertData';

export function createCommentHelper(params: {
  commentRepo: ICommentRepo;
  data: TCommentUpsertData;
  user: TUserProfile;
  postId: string;
}) {
  return params.commentRepo.createComment({
    ...params.data,
    postId: params.postId,
    userId: params.user.id,
    createdAt: params.data.createdAt ? new Date(params.data.createdAt) : undefined,
    updatedAt: params.data.updatedAt ? new Date(params.data.updatedAt) : undefined
  });
} 