import { IPostRepo } from 'src/types/repos/IPostRepo';

export async function getPosts(params: {
  postRepo: IPostRepo;
}) {
  return params.postRepo.getPosts();
} 