import React from 'react'
import { Playlist } from 'shared/src/playlist'
import { io } from 'socket.io-client'
import playlistReducer, { MutationMessage, setPlaylist } from './reducer'
import { wrapIO } from './typesafeSocket'

const PlaylistContext = React.createContext<Playlist | null>(null)
PlaylistContext.displayName = 'PlaylistContext'

const PlaylistDispatchContext = React.createContext<
  ((action: MutationMessage) => void) | null
>(null)
PlaylistDispatchContext.displayName = 'PlaylistDispatchContext'

export function PlaylistProvider({
  url,
  children,
}: React.PropsWithChildren<{ url: string }>) {
  const [playlist, dispatch] = React.useReducer(playlistReducer, {
    previousSongs: [],
    currentAndNextSongs: [],
  })

  const socket = React.useRef(wrapIO(io()))
  React.useEffect(() => {
    socket.current = wrapIO(io(url))
    socket.current.on('playlist', ({ playlist }) => {
      dispatch(setPlaylist(playlist))
    })
  }, [url])

  const dispatchLocallyAndToSocket = React.useCallback(
    (action: MutationMessage) => {
      dispatch(action)
      socket.current.emit('mutation', action)
    },
    [],
  )

  return (
    <PlaylistContext.Provider value={playlist}>
      <PlaylistDispatchContext.Provider value={dispatchLocallyAndToSocket}>
        {children}
      </PlaylistDispatchContext.Provider>
    </PlaylistContext.Provider>
  )
}

export function usePlaylist() {
  const playlist = React.useContext(PlaylistContext)

  if (!playlist) {
    throw new Error('TODO')
  }

  return playlist
}

export function usePlaylistDispatch() {
  const dispatch = React.useContext(PlaylistDispatchContext)

  if (!dispatch) {
    throw new Error('TODO')
  }

  return dispatch
}
