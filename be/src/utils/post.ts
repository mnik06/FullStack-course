// TODO: Check if this is the best way to do this
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { TPost } from 'src/types/db/Post';
import { TComment } from 'src/types/db/Comment';

export async function populatePostWithComments(
  post: TPost,
  commentRepo: ICommentRepo
): Promise<TPost & { comments: TComment[] }> {
  const comments = await commentRepo.getCommentsByPostId(post.id);
  
  return {
    ...post,
    comments
  };
}