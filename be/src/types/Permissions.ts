import { TCommentPermission } from 'src/types/comment/CommentPermissions';
import { TPostPermission } from 'src/types/post/PostPermissions';
import { TUserProfilePermission } from 'src/types/user-profile/UserProfilePermissions';

export type TPermission = 
  | TPostPermission
  | TCommentPermission
  | TUserProfilePermission;

export interface IPermissionEntry {
  action: TPermission;
  requireResourceCheck?: boolean;
}
