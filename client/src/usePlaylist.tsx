import React from 'react'
import { io } from 'socket.io-client'
import reducer, {
  Action,
  receivePlaylistFromSocket,
  socketDisconnected,
  State,
} from './reducer'
import { Socket, wrapIO } from './typesafeSocket'
import useDelay from './useDelay'

const PlaylistContext = React.createContext<
  [State, (action: Action) => void] | null
>(null)
PlaylistContext.displayName = 'PlaylistContext'

export function PlaylistProvider({
  url,
  delayTime = 250,
  children,
}: React.PropsWithChildren<{ url: string; delayTime?: number }>) {
  const [state, dispatch] = React.useReducer(reducer, {
    playlist: [],
    lastLocalMutation: null,
    serverSync: { type: 'full' },
  })

  const socket = React.useRef<Socket | null>()
  const [possiblyDelay, resetDelay] = useDelay(delayTime)

  // Create socket and subscribe to incoming messages
  React.useEffect(() => {
    if (state.serverSync.type === 'none') {
      socket.current = null
      return
    }

    if (!socket.current) {
      socket.current = wrapIO(io(url))
    }
    socket.current.removeAllListeners('playlist')
    socket.current.on('playlist', (payload) => {
      possiblyDelay(() => dispatch(receivePlaylistFromSocket(payload)))
    })

    socket.current.removeAllListeners('disconnect')
    socket.current.on('disconnect', () => {
      dispatch(socketDisconnected())
    })
  }, [url, possiblyDelay, state.serverSync.type])

  // Outgoing socket messages. This is a hack
  React.useEffect(() => {
    if (!state.lastLocalMutation) {
      return
    } else if (state.serverSync.type === 'none') {
      return
    } else if (
      state.serverSync.type === 'partial' &&
      state.lastLocalMutation.type !== 'addSongs'
    ) {
      return
    }
    socket.current?.emit('mutation', state.lastLocalMutation)
    resetDelay()
  }, [state.lastLocalMutation, resetDelay])

  return (
    <PlaylistContext.Provider value={[state, dispatch]}>
      {children}
    </PlaylistContext.Provider>
  )
}

export function usePlaylist() {
  const playlist = React.useContext(PlaylistContext)

  if (!playlist) {
    throw new Error(`usePlaylist can't be used outside of a PlaylistProvider`)
  }

  return playlist
}
