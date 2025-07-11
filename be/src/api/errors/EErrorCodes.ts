export enum EErrorCodes {
  GENERAL_ERROR = 1000,
  USER_ALREADY_EXISTS = 1001,
  PERMISSION_DENIED = 1002,
  INVALID_SIGNATURE = 1003,
  INVITE_EXPIRED = 1004,
  USER_ALREADY_ACTIVATED = 1005,
  USER_NOT_FOUND = 1006,
  USER_ALREADY_INVITED = 1007,
  POST_OWNER_NOT_FOUND = 1008
}

export function getErrorCodesDescription() {
  const codes = Object.values(EErrorCodes).filter(value => typeof value === 'number');
  const names = Object.values(EErrorCodes).filter(value => typeof value !== 'number');
  return codes.map((c, i) => `- ${names[i]} -> ${c}`).join('\n');
}