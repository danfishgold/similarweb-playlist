import React from 'react'
import { Player } from './components/Player'
import { Playlist } from './components/Playlist'
import { SongInput } from './components/SongInput'

function App() {
  return (
    <main>
      <SongInput />
      <Playlist />
      <Player />
    </main>
  )
}

export default App
