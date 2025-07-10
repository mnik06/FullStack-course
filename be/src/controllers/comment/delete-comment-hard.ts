import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { HttpError } from 'src/api/errors/HttpError';
import { createNewArchive } from '../common/create-new-archive';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

export async function deleteCommentHard(params: {
  commentRepo: ICommentRepo,
  commentId: string,
  archiveRepo: IArchiveRepo,
  user: TUserProfile
}) {
  const comment = await params.commentRepo.getCommentById(params.commentId);

  if (!comment) {
    throw new HttpError({
      statusCode: 404,
      message: 'Comment not found'
    });
  }

  await params.commentRepo.deleteCommentHard(params.commentId);
  await createNewArchive({
    archiveRepo: params.archiveRepo,
    entityType: 'comment',
    entityId: params.commentId,
    user: params.user,
    data: comment
  });

  return { success: true };
}
