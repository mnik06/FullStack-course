import { IWebsocketsService } from 'src/services/websockets/IWebsocketsService';

export function addUserToRoom(params: {
  websocketsService: IWebsocketsService;
  userId: string;
  room: string;
}) {
  params.websocketsService.addUserToRoom(params.userId, params.room);
}