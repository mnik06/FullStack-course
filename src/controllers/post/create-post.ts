import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost } from 'src/types/db/Post';

export function createPost(params: {
  postRepo: IPostRepo;
  data: Partial<TPost>;
}) {
  return params.postRepo.createPost(params.data);
} 