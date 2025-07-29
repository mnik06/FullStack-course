import { TCommentPermission } from 'src/types/comment/CommentPermissions';
import { TPostPermission } from 'src/types/post/PostPermissions';
import { TUserProfilePermission } from 'src/types/user-profile/UserProfilePermissions';
import { TTagPermission } from './tag/TagPermissions';
import { TArchivePermission } from 'src/types/archive/ArchivePermissions';

export type TPermission = 
  | TPostPermission
  | TCommentPermission
  | TUserProfilePermission
  | TTagPermission
  | TArchivePermission;

export interface IPermissionEntry {
  action: TPermission;
  requireResourceCheck?: boolean;
}
