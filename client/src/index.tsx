import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.scss'
import { PlaylistProvider } from './usePlaylist'

const socketUrl =
  process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5000/'

ReactDOM.render(
  <React.StrictMode>
    <PlaylistProvider url={socketUrl}>
      <App />
    </PlaylistProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
