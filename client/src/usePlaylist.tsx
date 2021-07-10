import React from 'react'
import { io } from 'socket.io-client'
import reducer, { Action, setPlaylistToSocketVersion, State } from './reducer'
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
  })

  const socket = React.useRef<Socket | null>()
  const [possiblyDelay, resetDelay] = useDelay(delayTime)

  // Incoming socket messages
  React.useEffect(() => {
    socket.current = wrapIO(io(url))
    socket.current.on('playlist', ({ playlist }) =>
      possiblyDelay(() => dispatch(setPlaylistToSocketVersion({ playlist }))),
    )
  }, [url, possiblyDelay])

  // Outgoing socket messages
  React.useEffect(() => {
    if (state.lastLocalMutation) {
      socket.current?.emit('mutation', state.lastLocalMutation)
      resetDelay()
    }
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
