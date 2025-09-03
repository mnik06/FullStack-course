import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';
import { IWebsocketsService } from './IWebsocketsService';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

export function getWebsocketsService(): IWebsocketsService {
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

    publishMessageToBroker(room, message, skipUserIds) {
      pubClient.publish(`room:${room}`, JSON.stringify({ ...message, skipUserIds }));
    },

    handleBrokerMessage(channel, message) {
      const roomName = channel.replace('room:', '');

      let socketIds = roomName === '*' ? Array.from(connections.keys()) : rooms.get(roomName);

      if (message.skipUserIds) {
        socketIds = Array.from(socketIds || []).filter((socketId) => {
          return !message.skipUserIds?.some(userId => rooms.get(`user:${userId}`)?.has(socketId));
        });
      }

      socketIds?.forEach((socketId) => {
        connections.get(socketId)?.emit(message.type, message.data);
      });
    },

    sendMessageToRoom(room, message, skipUserIds) {
      this.publishMessageToBroker(room, message, skipUserIds);
    },

    sendMessageToAll(message, skipUserIds) {
      this.publishMessageToBroker('*', message, skipUserIds);
    },

    sendMessageToUser(userId, message) {
      this.sendMessageToRoom(`user:${userId}`, message);
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

    addUserToRoom(userId: string, room: string) {
      const userSocket = Array.from(rooms.get(`user:${userId}`) ?? [])[0];

      if (userSocket) {
        this.joinRoom(room, userSocket);
      }
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