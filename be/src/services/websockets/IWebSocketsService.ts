import { Socket, Server } from 'socket.io';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { IWebsocketMessage } from 'src/types/websockets/WebsocketsTypes';

export interface IWebSocketsService {
  getSocketServer(): Server;
  startSocketsServer(): Promise<void>;
  addAuthMiddleware(userProfileRepo: IUserProfileRepo, identityService: IIdentityService): void;
  listenConnections(): void;
  subscribeToBroker(): void;
  publishMessageToBroker(message: IWebsocketMessage, room: string): void;
  handleBrokerMessage(channel: string, message: IWebsocketMessage): void;
  sendMessage(message: IWebsocketMessage, room: string): void;
  sendMessageToUser(userId: string, message: IWebsocketMessage): void;
  joinRoom(room: string, socketId: string): void;
  leaveRoom(room: string, socketId: string): void;
  addConnection(socket: Socket): void;
  removeConnection(socket: Socket): void;
}
