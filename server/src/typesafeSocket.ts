import { Message } from 'shared/src/messages'
import { Server, Socket as OriginalSocket } from 'socket.io'

type IOEvents<MutationMessage> = { connection: Socket<MutationMessage> }
type SocketEvents<MutationMessage> = {
  disconnect: void
} & Message<MutationMessage>

type IO<MutationMessage> = {
  on: <T extends keyof IOEvents<MutationMessage>>(
    type: T,
    handler: (payload: IOEvents<MutationMessage>[T]) => void,
  ) => void
  emit: <T extends keyof Message<MutationMessage>>(
    type: T,
    payload: Message<MutationMessage>[T],
  ) => void
}

export type Socket<MutationMessage> = {
  emit: <T extends keyof Message<MutationMessage>>(
    type: T,
    payload: Message<MutationMessage>[T],
  ) => void
  on: <T extends keyof SocketEvents<MutationMessage>>(
    type: T,
    handler: (payload: SocketEvents<MutationMessage>[T]) => void,
  ) => void
}

export function wrapIO<MutationMessage>(io: Server): IO<MutationMessage> {
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

function wrapSocket<MutationMessage>(
  socket: OriginalSocket,
): Socket<MutationMessage> {
  return {
    emit: socket.emit.bind(socket),
    on: socket.on.bind(socket) as any,
  }
}
