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

  const comment = await params.commentRepo.createComment({
    ...params.data,
    postId: params.postId,
    userId: params.user.id
  });

  await notifyCommentsUpdated({
    postId: params.postId,
    postRepo: params.postRepo,
    websocketsService: params.websocketsService,
    userId: params.user.id
  });

  return comment;
}