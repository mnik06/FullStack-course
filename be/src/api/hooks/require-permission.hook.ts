import { FastifyRequest } from 'fastify';
import { TUserRole } from 'src/types/user-profile/schemas/UserProfile';
import { HttpError } from 'src/api/errors/HttpError';
import { IPermissionEntry, TPermission } from 'src/types/Permissions';
import { EErrorCodes } from 'src/api/errors/EErrorCodes';

const rolePermissions: Record<TUserRole, IPermissionEntry[]> = {
  admin: [
    { action: 'create_post' },
    { action: 'read_post' },
    { action: 'manage_post' },
    { action: 'create_comment' },
    { action: 'read_comment' },
    { action: 'manage_comment' },
    { action: 'manage_users' }
  ],
  user: [
    { action: 'create_post' },
    { action: 'read_post' },
    { action: 'manage_post', requireResourceCheck: true },
    { action: 'create_comment' },
    { action: 'read_comment' },
    { action: 'manage_comment', requireResourceCheck: true }
  ]
};

export function hasPermission(role: TUserRole, permission: TPermission): boolean {
  return rolePermissions[role]?.some((entry) => entry.action === permission);
}

export function requirePermission(
  action: TPermission, 
  resourceCheck?: (request: FastifyRequest) => Promise<boolean>
) {
  return async (request: FastifyRequest) => {
    const permissionEntry = rolePermissions[request.user?.role as TUserRole]
      ?.find((entry) => entry.action === action);

    const isPermissionValid = hasPermission(request.user?.role as TUserRole, action);
    const isResourceCheckValid = permissionEntry?.requireResourceCheck
      ? await resourceCheck?.(request)
      : true;

    if (!permissionEntry || !isPermissionValid || !isResourceCheckValid) {
      throw new HttpError(403, 'Permission denied', undefined, EErrorCodes.PERMISSION_DENIED);
    }
  };
}
