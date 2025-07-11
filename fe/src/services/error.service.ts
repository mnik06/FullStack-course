import { createHashedObject } from '@/core/helpers'

interface IErrorConfig {
  message: string
  code: TApiErrorCodes
}

class ErrorService {
  get apiCodes (): Record<string, IErrorConfig> {
    return {
      USER_ALREADY_EXISTS: {
        message: 'User already exists',
        code: 1001
      },
      PERMISSION_DENIED: {
        message: 'Permission denied',
        code: 1002
      },
      INVALID_SIGNATURE: {
        message: 'Invalid signature',
        code: 1003
      },
      INVITE_EXPIRED: {
        message: 'Invite expired',
        code: 1004
      },
      USER_NOT_FOUND: {
        message: 'User not found',
        code: 1006
      },
      USER_ALREADY_INVITED: {
        message: 'User with this email is already invited',
        code: 1007
      },
      POST_OWNER_NOT_FOUND: {
        message: 'Post owner not found',
        code: 1008
      },
      COMMENT_OWNER_NOT_FOUND: {
        message: 'Comment owner not found',
        code: 1009
      }
    }
  }

  get hashedCodes (): Record<string, IErrorConfig> {
    return createHashedObject(Object.values(this.apiCodes), 'code')
  }
}

export const errorService = new ErrorService()
