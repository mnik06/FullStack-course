import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { TPostWithComments } from 'src/types/post/schemas/PostWithComments';
import { TComment } from 'src/types/comment/schemas/Comment';

export interface IUserProfileArchiveData {
  user: TUserProfile;
  posts: TPostWithComments[];
  comments: TComment[];
}
