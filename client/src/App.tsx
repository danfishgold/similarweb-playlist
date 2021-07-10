import React from 'react'
import Player from './components/Player'
import Playlist from './components/Playlist'
import SongInput from './components/SongInput'
import { markAsPlayed } from './reducer'
import { usePlaylist } from './usePlaylist'

function App() {
  const [playlist, dispatch] = usePlaylist()
  console.log(playlist)

  const onCurrentSongEnd = () => {
    dispatch(markAsPlayed([playlist[0].id]))
  }

  return (
    <main>
      <Player
        firstPlaylistSong={playlist[0] ?? null}
        onEnd={onCurrentSongEnd}
      />
      <div className='sidebar'>
        <SongInput />
        <Playlist />
      </div>
    </main>
  )
}

export default App
