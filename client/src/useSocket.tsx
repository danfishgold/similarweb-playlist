import React from 'react'
import { PlaylistMessage } from 'shared/src/messages'
import { Song } from 'shared/src/playlist'
import io, { Socket } from 'socket.io-client'

const SocketContext = React.createContext<null | Socket>(null)
SocketContext.displayName = 'SocketContext'

export default function useSocket(
  url: string,
  onPlaylistMessage: (playlistMessage: PlaylistMessage) => void,
) {
  const socket = React.useRef(io())
  React.useEffect(() => {
    socket.current = io(url)
    socket.current.on('playlist', onPlaylistMessage)
  }, [url, onPlaylistMessage])

  return {
    addSong(song: Song) {
      socket.current.emit('mutation', { type: 'addSong', song })
    },
  }
}
