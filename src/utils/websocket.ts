class Socket {
  private ws: WebSocket

  constructor() {
    this.ws = new WebSocket('wss://b5a2-37-35-67-20.eu.ngrok.io')
  }

  send<T>(message: T) {
    if (this.ws.CONNECTING) {
      throw new Error('Socket is connecting')
    }
    this.ws.send(JSON.stringify(message))

    this.ws.addEventListener('message', function (event) {})
  }

  onListener(
    message: keyof WebSocketEventMap,
    listener: (
      this: WebSocket,
      ev: Event | CloseEvent | MessageEvent<any>
    ) => any
  ) {
    this.ws.addEventListener(message, listener)
  }

  onMessage<T>(onMessageFn: (event: MessageEvent<T>) => void) {
    this.ws.addEventListener('message', onMessageFn)
  }
}

export default Socket