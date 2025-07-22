import { TComment } from 'src/types/comment/schemas/Comment';
import { TTransaction } from 'src/types/ITransactionManager';

export interface ICommentRepo {
  createComment(data: Partial<TComment>): Promise<TComment | null>;
  createMultipleComments(data: Partial<TComment>[], transaction: TTransaction): Promise<boolean>;
  getCommentById(id: string): Promise<TComment | null>;
  getCommentsByPostId(postId: string): Promise<TComment[]>;
  getComments(params?: { userId?: string }): Promise<TComment[]>;
  updateCommentById(
    id: string, 
    data: Partial<TComment>, 
  ): Promise<TComment | null>;
  deleteCommentSoft(id: string): Promise<boolean>;
  deleteCommentHard(id: string): Promise<boolean>;
} 