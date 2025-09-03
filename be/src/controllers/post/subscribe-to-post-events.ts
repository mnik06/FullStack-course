import { IWebsocketsService } from 'src/services/websockets/IWebsocketsService';
import { addUserToRoom } from 'src/controllers/common/websockets/add-user-to-room';

export function subscribeToPostEvents(params: {
  postId: string;
  userId: string;
  websocketsService: IWebsocketsService;
}) {
  addUserToRoom({
    websocketsService: params.websocketsService,
    userId: params.userId,
    room: `post:${params.postId}`
  });

  return { success: true };
}
