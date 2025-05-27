import { TPost, TPostWithComments, TPostWithCommentsCount } from 'src/types/post/schemas/Post';
import { TSorting } from 'src/types/Sorting';
import { TPagination, TPaginationResponse } from 'src/types/Pagination';

export interface IPostRepo {
  createPost(data: Partial<TPost>): Promise<TPostWithComments>;
  getPosts(
    query: TSorting<TPostSortBy> & TPagination
  ): Promise<TPaginationResponse<TPostWithCommentsCount[]>>;
  getPostById(id: string): Promise<TPostWithComments | null>;
  updatePostById(id: string, data: Partial<TPost>): Promise<TPostWithComments | null>;
  deletePost(id: string): Promise<boolean>;
} 