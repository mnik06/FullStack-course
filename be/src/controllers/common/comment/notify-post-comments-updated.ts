/* eslint-disable max-len */
import { IWebsocketsService } from 'src/services/websockets/IWebsocketsService';
import { IPostRepo } from 'src/types/repos/IPostRepo';

export async function notifyCommentsUpdated(params: {
  postId: string,
  userId: string,
  postRepo: IPostRepo,
  websocketsService: IWebsocketsService
}) {
  const post = await params.postRepo.getPostById(params.postId);

  if (post) {
    // WEBSOCKETS - Ти відправляєш по вебсокету всі коментарі поста. Це може зайняти багато ресурсів якщо коментаів багато. 
    // До того ж, якщо в тебе буде пагінація на коментарях, то твоя логіка не буде працювати.
    // Тому краще відправляти 1 коментар на створення, а на видалення можна передати id коментаря і на фронті видалити його. 
    params.websocketsService.sendMessageToRoom(`post:${params.postId}`, {
      type: 'post_comments_updated',
      data: { postId: params.postId, comments: post.comments }
    }, [params.userId]);
  
    params.websocketsService.sendMessageToAll({
      type: 'post_comments_count_updated',
      data: { postId: params.postId, commentsCount: post.comments.length },
      skipUserIds: [params.userId]
    }, [params.userId]);
  }
}