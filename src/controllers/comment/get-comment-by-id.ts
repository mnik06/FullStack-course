import { ICommentRepo } from 'src/types/repos/ICommentRepo';

export function getCommentById(params: {
  commentRepo: ICommentRepo;
  commentId: string;
}) {
  return params.commentRepo.getCommentById(params.commentId);
} 