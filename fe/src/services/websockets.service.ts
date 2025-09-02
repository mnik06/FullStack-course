import { io, Socket } from 'socket.io-client'

class WebsocketsService {
  private socket: Socket

  get isConnected () {
    return this.socket?.connected
  }

  connect () {
    this.socket = io(import.meta.env.VITE_WEBSOCKETS_URL, {
      auth: async (cb) => {
        const token = (await authService.getAccessToken())?.toString()

        cb({ token })
      }
    })
  }

  disconnect () {
    this.socket.disconnect()
  }

  listenEvent (event: TApiWebsocketMessageType, cb: (data: any) => void) {
    if (!this.socket) return

    this.socket.on(event, cb)
  }

  sendEvent (event: TApiWebsocketMessageType, data: any) {
    if (!this.socket) return

    this.socket.emit(event, data)
  }
}

export const websocketsService = new WebsocketsService()
