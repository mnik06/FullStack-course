export enum EWebsocketMessageType {
  added_comment_to_post = 'added_comment_to_post',
}

export type TWebsocketMessage = keyof typeof EWebsocketMessageType;

export interface IWebsocketMessage {
  type: TWebsocketMessage;
  data: any;
}

