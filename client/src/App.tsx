import React from 'react'
import { Song } from 'shared/src/playlist'
import { v4 as uuid } from 'uuid'
import Player from './components/Player'
import Playlist from './components/Playlist'
import SongInput from './components/SongInput'
import { addSongs, markAsPlayed } from './reducer'
import { usePlaylist, usePlaylistDispatch } from './usePlaylist'

function App() {
  const playlist = usePlaylist()
  const dispatch = usePlaylistDispatch()

  const onAddSong = (song: Song) => {
    dispatch(addSongs([song]))
  }

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
          url: 'FLkj9zr0-sQ',
          thumbnailUrl: '',
        },
        {
          id: uuid(),
          title: 'A2',
          durationInSeconds: 1,
          url: '_2hdlmg_4GE',
          thumbnailUrl: '',
        },
        {
          id: uuid(),
          title: 'A3',
          durationInSeconds: 1,
          url: '_2hdlmg_4GE',
          thumbnailUrl: '',
        },
        {
          id: uuid(),
          title: 'A4',
          durationInSeconds: 1,
          url: '_2hdlmg_4GE',
          thumbnailUrl: '',
        },
        {
          id: uuid(),
          title: 'A5',
          durationInSeconds: 1,
          url: '_2hdlmg_4GE',
          thumbnailUrl: '',
        },
        {
          id: uuid(),
          title: 'A6',
          durationInSeconds: 1,
          url: '_2hdlmg_4GE',
          thumbnailUrl: '',
        },
        {
          id: uuid(),
          title: 'A7',
          durationInSeconds: 1,
          url: '_2hdlmg_4GE',
          thumbnailUrl: '',
        },
      ]),
    )
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
