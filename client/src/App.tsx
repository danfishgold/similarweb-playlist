import React from 'react'
import Player from './components/Player'
import Playlist from './components/Playlist'
import { markAsPlayed } from './reducer'
import { usePlaylist } from './usePlaylist'

function App() {
  const [playlist, dispatch] = usePlaylist()
  console.log(playlist.currentAndNextSongs)

  const onCurrentSongEnd = () => {
    dispatch(markAsPlayed([playlist.currentAndNextSongs[0].id]))
  }

  return (
    <main>
      <Playlist />
      <Player
        firstPlaylistSong={playlist.currentAndNextSongs[0] ?? null}
        onEnd={onCurrentSongEnd}
      />
    </main>
  )
}

export default App
