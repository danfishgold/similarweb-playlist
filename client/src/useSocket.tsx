import React from 'react'
import io, { Socket } from 'socket.io-client'

const SocketContext = React.createContext<null | Socket>(null)
SocketContext.displayName = 'SocketContext'

export default function useSocket(url: string) {
  const socket = React.useContext(SocketContext)
  if (!socket) {
    throw new Error(`useSocket can only be used inside a <SocketProvider>`)
  }

  return socket
}

type ProviderProps = React.PropsWithChildren<{ url: string }>

export function SocketProvider({ url, ...props }: ProviderProps) {
  const socket = React.useRef(io(url))
  return <SocketContext.Provider value={socket.current} {...props} />
}
