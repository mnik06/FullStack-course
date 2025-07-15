import { EErrorCodes } from 'src/api/errors/EErrorCodes';
import { HttpError } from 'src/api/errors/HttpError';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { TComment } from 'src/types/comment/schemas/Comment';
import { IPostRepo } from 'src/types/repos/IPostRepo';

export async function createCommentFromExistingData(params: {
  commentRepo: ICommentRepo;
  postRepo: IPostRepo;
  comment: TComment;
  postId: string;
  throwErrorIfOwnerNotFound?: boolean;
  throwErrorIfPostNotFound?: boolean;
  skipDuplicate?: boolean;
}) {
  const postForComment = await params.postRepo.getPostById(params.postId);

  if (!postForComment) {
    if (params.throwErrorIfPostNotFound) {
      throw new HttpError({
        statusCode: 404,
        message: 'Post not found',
        errorCode: EErrorCodes.POST_NOT_FOUND
      });
    }

    return null;
  }

  const comment = await params.commentRepo.createComment({
    id: params.comment.id,
    text: params.comment.text,
    postId: params.postId,
    userId: params.comment.user.id,
    createdAt: new Date(params.comment.createdAt),
    updatedAt: new Date(params.comment.updatedAt)
  }, params.skipDuplicate);

  if (!comment) {
    if (params.throwErrorIfOwnerNotFound) {
      throw new HttpError({
        statusCode: 404,
        message: 'Comment owner not found',
        errorCode: EErrorCodes.COMMENT_OWNER_NOT_FOUND
      });
    }

    return null;
  }

  return comment;  
}