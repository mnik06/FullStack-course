import { IPostRepo } from 'src/types/repos/IPostRepo';

export function getPosts(params: {
  postRepo: IPostRepo;
}) {
  return params.postRepo.getPosts();
} 