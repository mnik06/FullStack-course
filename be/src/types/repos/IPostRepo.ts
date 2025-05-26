import { TPost } from 'src/types/db/Post';

export interface IPostRepo {
  createPost(data: Partial<TPost>): Promise<TPost>;
  getPosts(): Promise<TPost[]>;
  getPostById(id: string): Promise<TPost | null>;
  updatePostById(id: string, data: Partial<TPost>): Promise<TPost | null>;
  deletePost(id: string): Promise<boolean>;
} 