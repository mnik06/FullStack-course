import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost } from 'src/types/post/schemas/Post';

export async function createPost(params: {
  postRepo: IPostRepo;
  data: Partial<TPost>;
}) {
  const post = await params.postRepo.createPost(params.data);

  return post;
} 