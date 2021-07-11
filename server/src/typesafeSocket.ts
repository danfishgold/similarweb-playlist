import { Message } from 'shared/src/messages'
import { Server, Socket as OriginalSocket } from 'socket.io'

type IOEvents = { connection: Socket }
type SocketEvents = {
  disconnect: void
} & Message

type IO = {
  on: <T extends keyof IOEvents>(
    type: T,
    handler: (payload: IOEvents[T]) => void,
  ) => void
  emit: <T extends keyof Message>(type: T, payload: Message[T]) => void
}

export type Socket = {
  emit: <T extends keyof Message>(type: T, payload: Message[T]) => void
  broadcast: <T extends keyof Message>(type: T, payload: Message[T]) => void
  on: <T extends keyof SocketEvents>(
    type: T,
    handler: (payload: SocketEvents[T]) => void,
  ) => void
}

export function wrapIO(io: Server): IO {
  return {
    on: (type, handler) => {
      if (type === 'connection') {
        io.on('connection', (originalSocket) =>
          handler(wrapSocket(originalSocket)),
        )
      } else {
        io.on(type, handler as any)
      }
    },
    emit: io.emit.bind(io),
  }
}

function wrapSocket(socket: OriginalSocket): Socket {
  return {
    emit: socket.emit.bind(socket),
    broadcast: socket.broadcast.emit.bind(socket.broadcast),
    on: socket.on.bind(socket) as any,
  }
}
