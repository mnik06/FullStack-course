import { TComment } from '../db/Comment';

export interface ICommentRepo {
  createComment(data: Partial<TComment>): Promise<TComment>;
  getCommentsByPostId(postId: string): Promise<TComment[]>;
  updateCommentById(id: string, data: Partial<TComment>): Promise<TComment | null>;
} 