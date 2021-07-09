import React from 'react'
import { v4 as uuid } from 'uuid'
import Player from './components/Player'
import Playlist from './components/Playlist'
import SongInput from './components/SongInput'
import { addSongs, markAsPlayed } from './reducer'
import { usePlaylist } from './usePlaylist'

function App() {
  const [playlist, dispatch] = usePlaylist()

  const onCurrentSongEnd = () => {
    dispatch(markAsPlayed([playlist.currentAndNextSongs[0].id]))
  }

  const addCRJ = () => {
    dispatch(
      addSongs([
        {
          id: uuid(),
          title: 'A1',
          durationInSeconds: 1,
          videoId: 'FLkj9zr0-sQ',
          thumbnailUrl: '',
        },
        {
          id: uuid(),
          title: 'A2',
          durationInSeconds: 1,
          videoId: '_2hdlmg_4GE',
          thumbnailUrl: '',
        },
        {
          id: uuid(),
          title: 'A3',
          durationInSeconds: 1,
          videoId: '_2hdlmg_4GE',
          thumbnailUrl: '',
        },
        {
          id: uuid(),
          title: 'A4',
          durationInSeconds: 1,
          videoId: '_2hdlmg_4GE',
          thumbnailUrl: '',
        },
        {
          id: uuid(),
          title: 'A5',
          durationInSeconds: 1,
          videoId: '_2hdlmg_4GE',
          thumbnailUrl: '',
        },
        {
          id: uuid(),
          title: 'A6',
          durationInSeconds: 1,
          videoId: '_2hdlmg_4GE',
          thumbnailUrl: '',
        },
        {
          id: uuid(),
          title: 'A7',
          durationInSeconds: 1,
          videoId: '_2hdlmg_4GE',
          thumbnailUrl: '',
        },
      ]),
    )
  }

  return (
    <main>
      <SongInput />
      <Playlist playlist={playlist} addCRJ={addCRJ} />
      <Player
        firstPlaylistSong={playlist.currentAndNextSongs[0] ?? null}
        onEnd={onCurrentSongEnd}
      />
    </main>
  )
}

export default App
