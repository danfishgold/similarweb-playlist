import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'
import { Playlist } from 'shared/src/playlist'
import { Server } from 'socket.io'
import playlistReducer, { MutationMessage } from './reducer'
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
const io = wrapIO<MutationMessage>(
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
let connectionCount = 0

app.get('/playlist', (req, res) => {
  res.json(playlist)
})

io.on('connection', (socket) => {
  connectionCount += 1
  socket.emit('playlist', { playlist })

  socket.on('mutation', (mutation: MutationMessage) => {
    playlist = playlistReducer(playlist, mutation)
    io.emit('playlist', { playlist, mutation })
  })

  socket.on('disconnect', () => {
    connectionCount -= 1
    if (connectionCount == 0) {
      playlist = { previousSongs: [], currentAndNextSongs: [] }
    } else if (connectionCount < 0) {
      console.warn(`Connection count was ${connectionCount}. Reset to 0`)
      connectionCount = 0
    }
  })
})

server.listen(process.env.PORT || 5000, () => {
  console.log('server is listening on http://localhost:5000')
})
