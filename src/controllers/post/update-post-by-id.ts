import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost } from 'src/types/db/Post';

export async function updatePostById(params: {
  postRepo: IPostRepo;
  postId: string;
  data: Partial<TPost>;
}) {
  const post = await params.postRepo.updatePostById(params.postId, params.data);
  if (!post) {
    throw new Error('Post not found');
  }

  return post;
} 