import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost } from 'src/types/db/Post';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';

import { populatePostWithComments } from 'src/utils/post';

export async function createPost(params: {
  postRepo: IPostRepo;
  commentRepo: ICommentRepo;
  data: Partial<TPost>;
}) {
  const post = await params.postRepo.createPost(params.data);

  return populatePostWithComments(post, params.commentRepo);
} 