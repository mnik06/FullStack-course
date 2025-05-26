import { TPostSortBy } from 'src/types/db/Post';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TSorting } from 'src/types/Sorting';

export async function getPosts(params: {
  postRepo: IPostRepo;
  query: TSorting<TPostSortBy>
}) {
  return params.postRepo.getPosts(params.query);
} 