import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost } from 'src/types/db/Post';
import { HttpError } from 'src/api/errors/HttpError';

export async function updatePostById(params: {
  postRepo: IPostRepo;
  postId: string;
  data: Partial<TPost>;
}) {
  const post = await params.postRepo.updatePostById(params.postId, params.data);
  
  if (!post) {
    throw new HttpError(404, 'Post not found');
  }

  return post;
} 