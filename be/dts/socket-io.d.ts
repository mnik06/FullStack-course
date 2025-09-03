import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

declare module 'socket.io' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Socket {
    user?: TUserProfile;
  }
}

