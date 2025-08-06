import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { TCommentUpsertData } from 'src/types/comment/schemas/CommentUpsertData';
import { HttpError } from 'src/api/errors/HttpError';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { IWebsocketsService } from 'src/services/websockets/IWebsocketsService';

export async function createNewComment(params: {
  commentRepo: ICommentRepo;
  postRepo: IPostRepo;
  data: TCommentUpsertData;
  user: TUserProfile;
  postId: string;
  websocketsService: IWebsocketsService;
}) {
  const post = await params.postRepo.getPostById(params.postId);

  if (!post) {
    throw new HttpError({
      statusCode: 404,
      message: 'Post not found'
    });
  }

  const comment = await params.commentRepo.createComment({
    ...params.data,
    postId: params.postId,
    userId: params.user.id
  });

  params.websocketsService.sendMessageToUser(post.userId, {
    type: 'added_comment_to_post',
    data: {
      addedBy: comment.user.name
    }
  });
  
  params.websocketsService.sendMessageToRoom(`post:${post.id}`, {
    type: 'added_comment_to_post',
    data: {
      addedBy: comment.user.name
    }
  });

  return comment;
}