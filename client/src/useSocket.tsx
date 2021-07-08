import React from 'react'
import { PlaylistMessage } from 'shared/src/messages'
import { Song } from 'shared/src/playlist'
import io from 'socket.io-client'
import { wrapIO } from './typesafeSocket'

export default function useSocket(
  url: string,
  onPlaylistMessage: (playlistMessage: PlaylistMessage) => void,
) {
  const socket = React.useRef(wrapIO(io()))
  React.useEffect(() => {
    socket.current = wrapIO(io(url))
    socket.current.on('playlist', onPlaylistMessage)
  }, [url, onPlaylistMessage])

  return {
    addSongs(songs: Song[]) {
      socket.current.emit('mutation', { type: 'addSongs', songs })
    },
    markAsPlayed(songIds: string[]) {
      socket.current.emit('mutation', { type: 'markAsPlayed', songIds })
    },
  }
}
