import { Message } from 'shared/src/messages'
import { Socket as OriginalSocket } from 'socket.io-client'
import { EventEmitter } from 'stream'

type Event = Message & { disconnect: void }

export type Socket = {
  emit: <T extends keyof Message>(type: T, payload: Message[T]) => void
  on: <T extends keyof Event>(
    type: T,
    handler: (payload: Event[T]) => void,
  ) => void
  removeAllListeners: (type: keyof Event) => void
}

export function wrapIO(io: OriginalSocket): Socket {
  return io as OriginalSocket & EventEmitter as Socket
}
