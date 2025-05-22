import { ICommentRepo } from 'src/types/repos/ICommentRepo';

export function getComments(params: {
  commentRepo: ICommentRepo;
}) {
  return params.commentRepo.getComments();
} 