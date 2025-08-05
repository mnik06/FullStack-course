export enum EWebsocketMessageType {
  TEST = 'TEST',
}
export type TWebsocketMessage = keyof typeof EWebsocketMessageType;

export interface IWebsocketMessage {
  type: TWebsocketMessage;
  data: any;
}

