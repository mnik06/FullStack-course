import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPostFilters } from 'src/types/post/schemas/PostFilters';

export async function getPosts(params: {
  postRepo: IPostRepo;
  query: TPostFilters
}) {
  return params.postRepo.getPosts(params.query);
} 