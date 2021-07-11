import React from 'react'
import Player from './components/Player'
import Playlist from './components/Playlist'
import SongInput from './components/SongInput'
import SyncControls from './components/SyncControls'

function App() {
  return (
    <main>
      <Player />
      <div className='sidebar'>
        <SongInput />
        <Playlist />
      </div>
      <SyncControls />
    </main>
  )
}

export default App
