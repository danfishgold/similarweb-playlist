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
  debounceTime,
  children,
}: React.PropsWithChildren<{ url: string; debounceTime: number }>) {
  const [playlist, dispatch] = React.useReducer(playlistReducer, {
    previousSongs: [],
    currentAndNextSongs: [],
  })

  const socket = React.useRef(wrapIO(io()))
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null)
  React.useEffect(() => {
    socket.current = wrapIO(io(url))
    socket.current.on('playlist', ({ playlist }) => {
      debounceTimeout.current = setTimeout(
        () => dispatch(setPlaylist(playlist)),
        debounceTime,
      )
    })
  }, [url, debounceTime])

  const dispatchLocallyAndToSocket = React.useCallback(
    (action: MutationMessage) => {
      dispatch(action)
      socket.current.emit('mutation', action)
      debounceTimeout.current && clearTimeout(debounceTimeout.current)
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
