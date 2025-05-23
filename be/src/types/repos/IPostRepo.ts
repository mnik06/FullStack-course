import { TPost } from '../db/Post';

export interface IPostRepo {
  createPost(data: Partial<TPost>): Promise<TPost>;
  getPosts(): Promise<TPost[]>;
  getPostById(id: string): Promise<TPost | null>;
  updatePostById(id: string, data: Partial<TPost>): Promise<TPost | null>;
} 