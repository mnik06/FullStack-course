import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { TComment } from 'src/types/comment/schemas/Comment';

export function createComment(params: {
  commentRepo: ICommentRepo;
  data: Partial<TComment>;
}) {
  return params.commentRepo.createComment(params.data);
} 