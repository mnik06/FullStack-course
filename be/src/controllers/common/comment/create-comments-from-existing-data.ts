import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { TComment } from 'src/types/comment/schemas/Comment';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TTransaction } from 'src/types/ITransactionManager';

export async function createCommentsFromExistingData(params: {
  commentRepo: ICommentRepo;
  postRepo: IPostRepo;
  comments: TComment[];
  transaction: TTransaction;
}) {
  const preparedComments: Partial<TComment>[] = [];

  for (const comment of params.comments) {
    const postForComment = await params.postRepo.getPostById(comment.postId);

    if (postForComment) {
      preparedComments.push({
        id: comment.id,
        text: comment.text,
        postId: comment.postId,
        userId: comment.user.id,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt)
      });
    }
  }

  // Do not create comments if post for a comment does not exist
  if (!preparedComments.length) {
    return;
  }

  await params.commentRepo.createMultipleComments(preparedComments, params.transaction);
}