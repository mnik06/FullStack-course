import { TComment } from 'src/types/comment/schemas/Comment';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

export interface ICommentRepo {
  createComment(data: Partial<TComment>, user: TUserProfile): Promise<TComment>;
  getCommentsByPostId(postId: string): Promise<TComment[]>;
  updateCommentById(
    id: string, 
    data: Partial<TComment>, 
    user: TUserProfile
  ): Promise<TComment | null>;
  deleteComment(id: string): Promise<boolean>;
} 