import { TPost } from 'src/types/post/schemas/Post';
import { TPaginationResponse } from 'src/types/Pagination';
import { TPostWithComments } from 'src/types/post/schemas/PostWithComments';
import { TPostWithCommentsCount } from 'src/types/post/schemas/PostWithCommentsCount';
import { TPostFilters } from 'src/types/post/schemas/PostFilters';
import { TTransaction } from 'src/types/ITransactionManager';

export interface IPostRepo {
  createPost(data: Partial<TPost>): Promise<TPostWithComments>;
  createMultiplePosts(
    data: Partial<TPost>[], 
    transaction: TTransaction
  ): Promise<boolean>;
  getPosts(query?: Partial<TPostFilters>): Promise<TPaginationResponse<TPostWithCommentsCount[]>>;
  getPostsWithCommentsByUserId(userId: string): Promise<TPostWithComments[]>;
  getPostById(id: string): Promise<TPostWithComments | null>;
  updatePostById(
    id: string, 
    data: Partial<TPost>
  ): Promise<TPostWithComments | null>;
  deletePostHard(id: string): Promise<boolean>;
  deletePostSoft(id: string): Promise<boolean>;
} 