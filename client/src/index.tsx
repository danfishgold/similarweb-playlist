import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { SocketProvider } from './useSocket'

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider url={'http://localhost:5000'}>
      <App />
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
