import { TPost, TPostSortBy, TPostWithComments, TPostWithCommentsCount } from 'src/types/db/Post';
import { TSorting } from 'src/types/Sorting';

export interface IPostRepo {
  createPost(data: Partial<TPost>): Promise<TPostWithComments>;
  getPosts(query: TSorting<TPostSortBy>): Promise<TPostWithCommentsCount[]>;
  getPostById(id: string): Promise<TPostWithComments | null>;
  updatePostById(id: string, data: Partial<TPost>): Promise<TPostWithComments | null>;
  deletePost(id: string): Promise<boolean>;
} 