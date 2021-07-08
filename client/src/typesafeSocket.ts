import { Message } from 'shared/src/messages'
import { Socket as OriginalSocket } from 'socket.io-client'

export type Socket = {
  emit: <T extends keyof Message>(type: T, payload: Message[T]) => void
  on: <T extends keyof Message>(
    type: T,
    handler: (mutation: Message[T]) => void,
  ) => void
}

export function wrapIO(io: OriginalSocket): Socket {
  return io as Socket
}
