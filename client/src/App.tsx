import React from 'react'
import { PlaylistMessage } from 'shared/src/messages'
import { Playlist as PlaylistType, Song } from 'shared/src/playlist'
import Player from './components/Player'
import Playlist from './components/Playlist'
import SongInput from './components/SongInput'
import useSocket from './useSocket'

function App() {
  const [playlist, setPlaylist] = React.useState<PlaylistType>({
    previousSongs: [],
    currentAndNextSongs: [],
  })

  const onPlaylistMessage = React.useCallback(
    ({ playlist }: PlaylistMessage) => {
      setPlaylist(playlist)
    },
    [],
  )
  const socket = useSocket(
    process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5000/',
    onPlaylistMessage,
  )

  const onAddSong = (song: Song) => {
    setPlaylist((playlist) => ({
      ...playlist,
      currentAndNextSongs: [...playlist.currentAndNextSongs, song],
    }))
    socket.addSong(song)
  }

  return (
    <main>
      <SongInput onAddSong={onAddSong} />
      <Playlist playlist={playlist} />
      <Player firstPlaylistSong={playlist.currentAndNextSongs[0] ?? null} />
    </main>
  )
}

export default App
