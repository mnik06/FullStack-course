import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';
import { IWebSocketsService } from './IWebSocketsService';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

export function getWebsocketsService(): IWebSocketsService {
  const pubClient = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    lazyConnect: true
  });
  const subClient = pubClient.duplicate();

  // socket id to socket
  const connections: Map<string, Socket> = new Map();
  // room name to socket ids
  const rooms: Map<string, Set<string>> = new Map();

  let socketServer: Server;

  return {
    getSocketServer() {
      return socketServer;
    },

    async startSocketsServer() {
      const adapter = createAdapter(pubClient, subClient);

      socketServer = new Server({
        adapter,
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        } 
      });

      await pubClient.connect();

      socketServer.listen(parseInt(process.env.WEBSOCKETS_PORT));

      this.listenConnections();
    },

    addAuthMiddleware(userProfileRepo, identityService) {
      socketServer.use(async (socket, next) => {
        try {
          const token = socket.handshake.auth.token;

          if (!token) {
            return next(new Error('No token provided'));
          }
  
          const user = await identityService.getUserByAccessToken(token);
  
          if (!user) {
            return next(new Error('Invalid token'));
          }
  
          const userProfile = await userProfileRepo.getUserProfileBySubId(user.subId);
  
          if (!userProfile) {
            return next(new Error('User not found'));
          }
  
          socket.user = userProfile;

          next();

        } catch {
          return next(new Error('Unknown error'));
        }
      });
    },

    listenConnections() {
      socketServer.on('connection', (socket) => {
        this.addConnection(socket);

        socket.on('disconnect', () => {
          this.removeConnection(socket);
        });
      });

      this.subscribeToBroker();
    },

    subscribeToBroker() {
      subClient.psubscribe('room:*');
      subClient.on('pmessage', (_pattern, channel, message) => {
        this.handleBrokerMessage(channel, JSON.parse(message));
      });
    },

    publishMessageToBroker(message, room) {
      pubClient.publish(`room:${room}`, JSON.stringify(message));
    },

    handleBrokerMessage(channel, message) {
      const roomName = channel.replace('room:', '');

      rooms.get(roomName)?.forEach((socketId) => {
        connections.get(socketId)?.emit(message.type, message.data);
      });
    },

    sendMessage(message, room) {
      this.publishMessageToBroker(message, room);
    },

    sendMessageToUser(userId, message) {
      this.sendMessage(message, `user:${userId}`);
    },

    joinRoom(room: string, socketId: string) {
      const roomSet = rooms.get(room) ?? new Set();

      roomSet.add(socketId);
      rooms.set(room, roomSet);
    },

    leaveRoom(room: string, socketId: string) {
      const roomSet = rooms.get(room) ?? new Set();

      roomSet.delete(socketId);
      rooms.set(room, roomSet);
    },

    addConnection(socket) {
      connections.set(socket.id, socket);
      this.joinRoom(`user:${(socket.user as TUserProfile).id}`, socket.id);
    },

    removeConnection(socket) {
      rooms.forEach((roomSet) => {
        roomSet.delete(socket.id);
      });

      connections.delete(socket.id);
    }
  };
}