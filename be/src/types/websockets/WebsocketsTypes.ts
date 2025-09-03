export enum EWebsocketMessageType {
  post_comments_updated = 'post_comments_updated',
  post_comments_count_updated = 'post_comments_count_updated',

  // User based events
  user_post_commented = 'user_post_commented'
}

export type TWebsocketMessage = keyof typeof EWebsocketMessageType;

export interface IWebsocketMessage {
  type: TWebsocketMessage;
  data: any;
  skipUserIds?: string[];
}
