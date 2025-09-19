import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { TCommentUpsertData } from 'src/types/comment/schemas/CommentUpsertData';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { IWebsocketsService } from 'src/services/websockets/IWebsocketsService';
import { notifyCommentsUpdated } from 'src/controllers/common/comment/notify-post-comments-updated';

export async function createNewComment(params: {
  commentRepo: ICommentRepo;
  postRepo: IPostRepo;
  data: TCommentUpsertData;
  user: TUserProfile;
  postId: string;
  websocketsService: IWebsocketsService;
}) {
  const post = await params.postRepo.getPostById(params.postId);

  const comment = await params.commentRepo.createComment({
    ...params.data,
    postId: params.postId,
    userId: params.user.id
  });

  // WEBSOCKETS - Треба додати try/catch всюди де використовуєш вебсокети, 
  // щоб запобігти падіння сервера якщо вебсокет не доступний. 
  
  await notifyCommentsUpdated({
    postId: params.postId,
    postRepo: params.postRepo,
    websocketsService: params.websocketsService,
    userId: params.user.id
  });

  if (post && post.userId !== params.user.id) {
    params.websocketsService.sendMessageToUser(post.userId, {
      type: 'user_post_commented',
      data: {
        commentedByName: params.user.name,
        postId: params.postId
      }
    });
  }

  return comment;
}