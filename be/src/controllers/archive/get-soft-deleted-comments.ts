import { ICommentRepo } from 'src/types/repos/ICommentRepo';

export async function getSoftDeletedComments(params: {
  commentRepo: ICommentRepo,
}) {
  return await params.commentRepo.getSoftDeletedComments();
}
