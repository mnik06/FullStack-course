export enum EErrorCodes {
  GENERAL_ERROR = 1000,
  USER_ALREADY_EXISTS = 1001,
  PERMISSION_DENIED = 1002,
}

export function getErrorCodesDescription() {
  const codes = Object.values(EErrorCodes).filter(value => typeof value === 'number');
  const names = Object.values(EErrorCodes).filter(value => typeof value !== 'number');
  return codes.map((c, i) => `- ${names[i]} -> ${c}`).join('\n');
}