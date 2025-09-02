import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { HttpError } from 'src/api/errors/HttpError';
import { createNewArchiveHelper } from 'src/controllers/common/create-new-archive-helper';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { IWebsocketsService } from 'src/services/websockets/IWebsocketsService';
import { notifyCommentsUpdated } from 'src/controllers/common/comment/notify-post-comments-updated';

export async function deleteCommentHardAndArchive(params: {
  commentId: string,
  postId: string,
  commentRepo: ICommentRepo,
  postRepo: IPostRepo,
  archiveRepo: IArchiveRepo,
  user: TUserProfile,
  websocketsService: IWebsocketsService
}) {
  const comment = await params.commentRepo.getCommentById(params.commentId);

  if (!comment) {
    throw new HttpError({
      statusCode: 404,
      message: 'Comment not found'
    });
  }

  await params.commentRepo.deleteCommentHard(params.commentId);
  await createNewArchiveHelper({
    archiveRepo: params.archiveRepo,
    entityType: 'comment',
    entityId: params.commentId,
    user: params.user,
    data: comment
  });

  await notifyCommentsUpdated({
    postId: params.postId,
    postRepo: params.postRepo,
    websocketsService: params.websocketsService,
    userId: params.user.id
  });

  return { success: true };
}
