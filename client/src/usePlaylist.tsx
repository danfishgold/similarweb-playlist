import React from 'react'
import { Playlist } from 'shared/src/playlist'
import { io } from 'socket.io-client'
import playlistReducer, {
  Action,
  isOutgoingSocketMessage,
  setPlaylist,
} from './reducer'
import { wrapIO } from './typesafeSocket'
import useDelay from './useDelay'

const PlaylistContext = React.createContext<
  [Playlist, (action: Action) => void] | null
>(null)
PlaylistContext.displayName = 'PlaylistContext'

export function PlaylistProvider({
  url,
  delayTime = 250,
  children,
}: React.PropsWithChildren<{ url: string; delayTime?: number }>) {
  const [playlist, dispatch] = React.useReducer(playlistReducer, {
    previousSongs: [],
    currentAndNextSongs: [],
  })

  const socket = React.useRef(wrapIO(io()))
  const [possiblyDelay, resetDelay] = useDelay(delayTime)
  React.useEffect(() => {
    socket.current = wrapIO(io(url))
    socket.current.on('playlist', ({ playlist }) =>
      possiblyDelay(() => dispatch(setPlaylist({ playlist }))),
    )
  }, [url, possiblyDelay])

  const dispatchLocallyAndToSocket = React.useCallback(
    (action: Action) => {
      dispatch(action)
      if (isOutgoingSocketMessage(action)) {
        socket.current.emit('mutation', action)
        resetDelay()
      }
    },
    [resetDelay],
  )

  return (
    <PlaylistContext.Provider value={[playlist, dispatchLocallyAndToSocket]}>
      {children}
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
