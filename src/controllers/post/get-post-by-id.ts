import { IPostRepo } from 'src/types/repos/IPostRepo';

export function getPostById(params: {
  postRepo: IPostRepo;
  postId: string;
}) {
  return params.postRepo.getPostById(params.postId);
} 