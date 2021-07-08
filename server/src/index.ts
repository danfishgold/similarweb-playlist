import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'
import { MutationMessage, updatePlaylist } from 'shared/src/messages'
import { Playlist } from 'shared/src/playlist'
import { Server } from 'socket.io'
import { wrapIO } from './typesafeSocket'

const app = express()
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? undefined
        : 'http://localhost:3000',
  }),
)

const server = http.createServer(app)
const io = wrapIO(
  new Server(server, {
    cors: {
      origin:
        process.env.NODE_ENV === 'production'
          ? undefined
          : 'http://localhost:3000',
    },
  }),
)

let playlist: Playlist = {
  previousSongs: [],
  currentAndNextSongs: [],
}

app.get('/playlist', (req, res) => {
  res.json(playlist)
})

io.onConnection((socket) => {
  socket.emit('playlist', { playlist })

  socket.on('mutation', (mutation: MutationMessage) => {
    console.log(mutation)
    playlist = updatePlaylist(playlist, mutation)
    io.emit('playlist', { playlist, mutation })
  })
})

server.listen(process.env.PORT || 5000, () => {
  console.log('server is listening on http://localhost:5000')
})
