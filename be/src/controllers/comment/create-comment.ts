import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { TComment } from 'src/types/comment/schemas/Comment';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

export function createComment(params: {
  commentRepo: ICommentRepo;
  data: Partial<TComment>;
  user: TUserProfile;
}) {
  return params.commentRepo.createComment(params.data, params.user);
} 