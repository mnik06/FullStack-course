import { IWebsocketsService } from 'src/services/websockets/IWebsocketsService';
import { IPostRepo } from 'src/types/repos/IPostRepo';

export async function notifyCommentsUpdated(params: {
  postId: string,
  postRepo: IPostRepo,
  websocketsService: IWebsocketsService
}) {
  const post = await params.postRepo.getPostById(params.postId);

  if (post) {
    params.websocketsService.sendMessageToRoom(`post:${params.postId}`, {
      type: 'post_comments_updated',
      data: { postId: params.postId, comments: post.comments }
    });
  
    params.websocketsService.sendMessageToAll({
      type: 'post_comments_count_updated',
      data: { postId: params.postId, commentsCount: post.comments.length }
    });
  }
}