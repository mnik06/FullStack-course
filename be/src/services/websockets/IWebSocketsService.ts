import { Socket, Server } from 'socket.io';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { IWebsocketMessage } from 'src/types/websockets/WebsocketsTypes';

export interface IWebsocketsService {
  getSocketServer(): Server;
  startSocketsServer(): Promise<void>;
  addAuthMiddleware(userProfileRepo: IUserProfileRepo, identityService: IIdentityService): void;
  listenConnections(): void;
  subscribeToBroker(): void;
  publishMessageToBroker(room: string, message: IWebsocketMessage): void;
  handleBrokerMessage(channel: string, message: IWebsocketMessage): void;
  sendMessageToRoom(room: string, message: IWebsocketMessage): void;
  sendMessageToAll(message: IWebsocketMessage): void;
  sendMessageToUser(userId: string, message: IWebsocketMessage): void;
  joinRoom(room: string, socketId: string): void;
  leaveRoom(room: string, socketId: string): void;
  addUserToRoom(userId: string, room: string): void;
  addConnection(socket: Socket): void;
  removeConnection(socket: Socket): void;
}
