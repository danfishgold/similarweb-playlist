import React from 'react'
import Player from './components/Player'
import Playlist from './components/Playlist'
import SongInput from './components/SongInput'

function App() {
  return (
    <main>
      <Player />
      <div className='sidebar'>
        <SongInput />
        <Playlist />
      </div>
    </main>
  )
}

export default App
