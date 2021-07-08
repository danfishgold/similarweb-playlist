import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { PlaylistProvider } from './usePlaylist'

const socketUrl =
  process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5000/'

ReactDOM.render(
  <React.StrictMode>
    <PlaylistProvider url={socketUrl} debounceTime={400}>
      <App />
    </PlaylistProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
