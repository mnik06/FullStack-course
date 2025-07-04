import { TCommentPermission } from 'src/types/comment/CommentPermissions';
import { TPostPermission } from 'src/types/post/PostPermissions';
import { TUserProfilePermission } from 'src/types/user-profile/UserProfilePermissions';
import { TTagPermission } from './tag/TagPermissions';

export type TPermission = 
  | TPostPermission
  | TCommentPermission
  | TUserProfilePermission
  | TTagPermission;

export interface IPermissionEntry {
  action: TPermission;
  requireResourceCheck?: boolean;
}
