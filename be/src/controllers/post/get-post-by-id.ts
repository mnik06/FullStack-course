import { HttpError } from 'src/api/errors/HttpError';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { IPostRepo } from 'src/types/repos/IPostRepo';

import { populatePostWithComments } from 'src/utils/post';

export async function getPostById(params: {
  postRepo: IPostRepo;
  commentRepo: ICommentRepo;
  postId: string;
}) {
  const post = await params.postRepo.getPostById(params.postId);
  
  if (!post) {
    throw new HttpError(404, 'Post not found');
  }

  return populatePostWithComments(post, params.commentRepo);
} 