import { TPostSortBy } from 'src/types/db/Post';
import { TPagination } from 'src/types/Pagination';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TSorting } from 'src/types/Sorting';

export async function getPosts(params: {
  postRepo: IPostRepo;
  query: TSorting<TPostSortBy> & TPagination
}) {
  return params.postRepo.getPosts(params.query);
} 