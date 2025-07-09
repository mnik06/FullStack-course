import { TComment } from 'src/types/comment/schemas/Comment';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

export interface ICommentRepo {
  createComment(data: Partial<TComment>, user: TUserProfile): Promise<TComment>;
  getCommentById(id: string): Promise<TComment | null>;
  getCommentsByPostId(postId: string): Promise<TComment[]>;
  updateCommentById(
    id: string, 
    data: Partial<TComment>, 
  ): Promise<TComment | null>;
  deleteCommentSoft(id: string): Promise<boolean>;
  deleteCommentHard(id: string): Promise<boolean>;
} 