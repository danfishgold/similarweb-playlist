import { Message } from 'shared/src/messages'
import * as actualSocket from '../typesafeSocket'

export default function mockSocket(): {
  emit: <T extends keyof Message>(type: T, payload: Message[T]) => void
  emitted: jest.Mock
} {
  const emitted = jest.fn()
  const callbacks: Record<string, (payload: any) => void> = {}

  const mockedIO = {
    emit: emitted,
    on(type: string, callback: (payload: any) => void) {
      callbacks[type] = callback
    },
  }

  jest.spyOn(actualSocket, 'wrapIO').mockImplementation(() => mockedIO)

  return {
    emit: <T extends keyof Message>(type: T, payload: Message[T]) => {
      callbacks[type]?.(payload)
    },
    emitted,
  }
}
