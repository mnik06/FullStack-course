import { TComment } from 'src/types/comment/schemas/Comment';

export interface ICommentRepo {
  createComment(data: Partial<TComment>): Promise<TComment | null>;
  getCommentById(id: string): Promise<TComment | null>;
  getCommentsByPostId(postId: string): Promise<TComment[]>;
  updateCommentById(
    id: string, 
    data: Partial<TComment>, 
  ): Promise<TComment | null>;
  deleteCommentSoft(id: string): Promise<boolean>;
  deleteCommentHard(id: string): Promise<boolean>;
} 