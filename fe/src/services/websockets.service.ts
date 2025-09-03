import { notificationHandler } from '@/core/helpers'
import { router } from '@/router'
import { routeNames } from '@/router/route-names'
import { io, Socket } from 'socket.io-client'

class WebsocketsService {
  private socket: Socket

  GLOBAL_HANDLERS: TPartialRecord<TApiWebsocketMessageType, (data: any) => void> = {
    user_post_commented: (data) => {
      const postUrl = new URL(
        router.resolve({ name: routeNames.postInfo, params: { id: data.postId } }).href,
        window.location.origin
      ).href

      notificationHandler({
        text: `${data.commentedByName} commented on your post<br> <a class="underline text-primary" href="${postUrl}" target="_blank">View post</a>`,
        type: 'success'
      }, {
        dangerouslyUseHTMLString: true,
        duration: 5000
      })
    }
  }

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

  removeListener (event: TApiWebsocketMessageType, cb?: (data: any) => void) {
    if (!this.socket) return

    this.socket.off(event, cb)
  }

  attachGlobalHandlers () {
    Object.keys(this.GLOBAL_HANDLERS).forEach((event) => {
      this.listenEvent(event, this.GLOBAL_HANDLERS[event])
    })
  }

  disconnectGlobalHandlers () {
    Object.keys(this.GLOBAL_HANDLERS).forEach((event) => {
      this.removeListener(event, this.GLOBAL_HANDLERS[event])
    })
  }
}

export const websocketsService = new WebsocketsService()
