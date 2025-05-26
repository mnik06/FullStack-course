import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost } from 'src/types/db/Post';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { HttpError } from 'src/api/errors/HttpError';

import { populatePostWithComments } from 'src/utils/post';
export async function updatePostById(params: {
  postRepo: IPostRepo;
  commentRepo: ICommentRepo;
  postId: string;
  data: Partial<TPost>;
}) {
  const post = await params.postRepo.updatePostById(params.postId, params.data);
  
  if (!post) {
    throw new HttpError(404, 'Post not found');
  }

  return populatePostWithComments(post, params.commentRepo);
} 