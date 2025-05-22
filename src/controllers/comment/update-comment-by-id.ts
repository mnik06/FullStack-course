import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { TComment } from 'src/types/db/Comment';

export async function updateCommentById(params: {
  commentRepo: ICommentRepo;
  commentId: string;
  data: Partial<TComment>;
}) {
  const comment = await params.commentRepo.updateCommentById(params.commentId, params.data);
  if (!comment) {
    throw new Error('Comment not found');
  }

  return comment;
} 