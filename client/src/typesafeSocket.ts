import { Message } from 'shared/src/messages'
import { Socket as OriginalSocket } from 'socket.io-client'

export type Socket<MutationMessage> = {
  emit: <MutationMessage, T extends keyof Message<MutationMessage>>(
    type: T,
    payload: Message<MutationMessage>[T],
  ) => void
  on: <T extends keyof Message<MutationMessage>>(
    type: T,
    handler: (mutation: Message<MutationMessage>[T]) => void,
  ) => void
}

export function wrapIO<MutationMessage>(
  io: OriginalSocket,
): Socket<MutationMessage> {
  return io as Socket<MutationMessage>
}
