import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost } from 'src/types/db/Post';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';

import { populatePostWithComments } from 'src/utils/post';

export async function updatePostById(params: {
  postRepo: IPostRepo;
  commentRepo: ICommentRepo;
  postId: string;
  data: Partial<TPost>;
}) {
  const post = await params.postRepo.updatePostById(params.postId, params.data);
  if (!post) {
    throw new Error('Post not found');
  }

  return populatePostWithComments(post, params.commentRepo);
} 