import { TPost, TPostWithComments, TPostWithCommentsCount } from 'src/types/post/schemas/Post';

export interface IPostRepo {
  createPost(data: Partial<TPost>): Promise<TPostWithComments>;
  getPosts(): Promise<TPostWithCommentsCount[]>;
  getPostById(id: string): Promise<TPostWithComments | null>;
  updatePostById(id: string, data: Partial<TPost>): Promise<TPostWithComments | null>;
  deletePost(id: string): Promise<boolean>;
} 