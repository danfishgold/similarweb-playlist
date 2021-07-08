import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'
import { Message } from 'shared/src/messages'
import { Playlist } from 'shared/src/playlist'
import { Server } from 'socket.io'

const app = express()
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))

if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: 'http://localhost:3000' }))
}

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
})

let playlist: Playlist = {
  previousSongs: [],
  currentAndNextSongs: [],
}

app.get('/playlist', (req, res) => {
  res.json(playlist)
})

io.on('connection', (socket) => {
  socket.send(playlist)

  socket.on('message', (message: Message) => {
    switch (message.type) {
      case 'addSong': {
        playlist.currentAndNextSongs.push(message.song)
        socket.broadcast.emit('message', playlist)
      }
    }
  })
})

server.listen(process.env.PORT || 5000, () => {
  console.log('server is listening on http://localhost:5000')
})
