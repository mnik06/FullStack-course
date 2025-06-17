import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { TComment } from 'src/types/comment/schemas/Comment';
import { HttpError } from 'src/api/errors/HttpError';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

export async function updateCommentById(params: {
  commentRepo: ICommentRepo;
  commentId: string;
  data: Partial<TComment>;
  user: TUserProfile;
}) {
  const comment = await params.commentRepo.updateCommentById(
    params.commentId, 
    params.data, 
    params.user
  );
  
  if (!comment) {
    throw new HttpError(404, 'Comment not found');
  }

  return comment;
} 