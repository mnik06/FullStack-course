import { TPost } from 'src/types/post/schemas/Post';
import { TPaginationResponse } from 'src/types/Pagination';
import { TPostWithComments } from 'src/types/post/schemas/PostWithComments';
import { TPostWithCommentsCount } from 'src/types/post/schemas/PostWithCommentsCount';
import { TPostFilters } from 'src/types/post/schemas/PostFilters';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

export interface IPostRepo {
  createPost(data: Partial<TPost>, user: TUserProfile): Promise<TPostWithComments>;
  getPosts(query?: Partial<TPostFilters>): Promise<TPaginationResponse<TPostWithCommentsCount[]>>;
  getPostById(id: string): Promise<TPostWithComments | null>;
  updatePostById(
    id: string, 
    data: Partial<TPost>
  ): Promise<TPostWithComments | null>;
  deletePost(id: string): Promise<boolean>;
} 