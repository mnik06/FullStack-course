import { ICommentRepo } from 'src/types/repos/ICommentRepo';

export function getCommentsByPostId(params: {
  commentRepo: ICommentRepo;
  postId: string
}) {
  return params.commentRepo.getCommentsByPostIds([params.postId]);
} 