import { TPost } from 'src/types/post/schemas/Post';
import { TSorting } from 'src/types/Sorting';
import { TPagination, TPaginationResponse } from 'src/types/Pagination';
import { TPostWithComments } from 'src/types/post/schemas/PostWithComments';
import { TPostWithCommentsCount } from 'src/types/post/schemas/PostWithCommentsCount';
import { TPostSortBy } from 'src/types/post/Post.utils';

export interface IPostRepo {
  createPost(data: Partial<TPost>): Promise<TPostWithComments>;
  getPosts(
    query: TSorting<TPostSortBy> & TPagination
  ): Promise<TPaginationResponse<TPostWithCommentsCount[]>>;
  getPostById(id: string): Promise<TPostWithComments | null>;
  updatePostById(id: string, data: Partial<TPost>): Promise<TPostWithComments | null>;
  deletePost(id: string): Promise<boolean>;
} 