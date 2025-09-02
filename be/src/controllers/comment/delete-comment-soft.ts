import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { HttpError } from 'src/api/errors/HttpError';
import { IWebsocketsService } from 'src/services/websockets/IWebsocketsService';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { notifyCommentsUpdated } from 'src/controllers/common/comment/notify-post-comments-updated';

export async function deleteCommentSoft(params: {
  commentId: string
  postId: string,
  commentRepo: ICommentRepo,
  postRepo: IPostRepo,
  websocketsService: IWebsocketsService
}) {
  const isCommentFound = await params.commentRepo.deleteCommentSoft(params.commentId);

  if (!isCommentFound) {
    throw new HttpError({
      statusCode: 404,
      message: 'Comment not found'
    });
  }

  notifyCommentsUpdated({
    postId: params.postId,
    postRepo: params.postRepo,
    websocketsService: params.websocketsService
  });

  return { success: true };
}
