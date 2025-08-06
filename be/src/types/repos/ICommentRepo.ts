import { TComment } from 'src/types/comment/schemas/Comment';
import { TCommentWithDeletedAt } from 'src/types/comment/schemas/CommentWithDeletedAt';
import { TTransaction } from 'src/types/ITransactionManager';

export interface ICommentRepo {
  createComment(data: Partial<TComment>): Promise<TComment>;
  createMultipleComments(data: Partial<TComment>[], transaction: TTransaction): Promise<boolean>;
  getCommentById(id: string, skipDeleted?: boolean): Promise<TComment | null>;
  getCommentsByPostIds(postId: string[], skipDeleted?: boolean): Promise<TComment[]>;
  getComments(params?: { userId?: string }): Promise<TComment[]>;
  getCommentsByUserId(userId: string, skipDeleted?: boolean): Promise<TComment[]>;
  getSoftDeletedComments(): Promise<TCommentWithDeletedAt[]>;
  updateCommentById(
    id: string, 
    data: Partial<TComment>, 
  ): Promise<TComment | null>;
  deleteCommentSoft(id: string): Promise<boolean>;
  deleteCommentHard(id: string): Promise<boolean>;
  restoreSoftDeletedComments(ids: string[], transaction?: TTransaction): Promise<boolean>;
} 