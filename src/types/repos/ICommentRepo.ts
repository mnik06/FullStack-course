import { TComment } from '../db/Comment';

export interface ICommentRepo {
  createComment(data: Partial<TComment>): Promise<TComment>;
  getComments(): Promise<TComment[]>;
  getCommentById(id: string): Promise<TComment | null>;
  updateCommentById(id: string, data: Partial<TComment>): Promise<TComment | null>;
} 