import React from 'react'
import { PlaylistMessage } from 'shared/src/messages'
import { Playlist as PlaylistType, Song } from 'shared/src/playlist'
import { v4 as uuid } from 'uuid'
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
    setPlaylist({
      ...playlist,
      currentAndNextSongs: [...playlist.currentAndNextSongs, song],
    })
    socket.addSongs([song])
  }

  const onCurrentSongEnd = () => {
    setPlaylist({
      ...playlist,
      previousSongs: [
        ...playlist.previousSongs,
        playlist.currentAndNextSongs[0],
      ],
      currentAndNextSongs: playlist.currentAndNextSongs.slice(1),
    })
    socket.markAsPlayed([playlist.currentAndNextSongs[0].id])
  }

  const addCRJ = () => {
    socket.addSongs([
      {
        id: uuid(),
        title: 'boop',
        durationInSeconds: 1,
        url: 'FLkj9zr0-sQ',
        thumbnailUrl: '',
      },
      {
        id: uuid(),
        title: 'boop',
        durationInSeconds: 1,
        url: '_2hdlmg_4GE',
        thumbnailUrl: '',
      },
    ])
  }

  return (
    <main>
      <SongInput onAddSong={onAddSong} />
      <Playlist playlist={playlist} addCRJ={addCRJ} />
      <Player
        firstPlaylistSong={playlist.currentAndNextSongs[0] ?? null}
        onEnd={onCurrentSongEnd}
      />
    </main>
  )
}

export default App
