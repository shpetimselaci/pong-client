class Socket {
  private ws?: WebSocket

  connect() {
    this.ws = new WebSocket('wss://heroic-vial-345017.appspot.com')
  }

  send<T>(message: T) {
    if (this.ws?.CONNECTING) {
      throw new Error('Socket is connecting')
    }
    this.ws?.send(JSON.stringify(message))
  }

  onListener(
    message: keyof WebSocketEventMap,
    listener: (
      this: WebSocket,
      ev: Event | CloseEvent | MessageEvent<any>
    ) => any
  ) {
    this.ws?.addEventListener(message, listener)
  }

  onMessage<T>(onMessageFn: (event: MessageEvent<T>) => void) {
    this.ws?.addEventListener('message', onMessageFn)
  }
}

export default new Socket()
