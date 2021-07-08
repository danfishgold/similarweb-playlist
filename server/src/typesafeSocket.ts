import { Message } from 'shared/src/messages'
import { Server, Socket as OriginalSocket } from 'socket.io'

type IO = {
  onConnection: (handler: (socket: Socket) => void) => void
  emit: <T extends keyof Message>(type: T, payload: Message[T]) => void
}

export type Socket = {
  emit: <T extends keyof Message>(type: T, payload: Message[T]) => void
  on: <T extends keyof Message>(
    type: T,
    handler: (mutation: Message[T]) => void,
  ) => void
}

export function wrapIO(io: Server): IO {
  return {
    onConnection: (handler) => {
      io.on('connection', (originalSocket) =>
        handler(wrapSocket(originalSocket)),
      )
    },
    emit: io.emit.bind(io),
  }
}

function wrapSocket(socket: OriginalSocket): Socket {
  return {
    emit: socket.emit.bind(socket),
    on: socket.on.bind(socket) as any,
  }
}
