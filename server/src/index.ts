import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'
import { MutationMessage } from 'shared/src/messages'
import { Playlist } from 'shared/src/playlist'
import { Server } from 'socket.io'
import playlistReducer from './mutations'
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

let playlist: Playlist = []
let connectionCount = 0

app.get('/playlist', (req, res) => {
  res.json(playlist)
})

io.on('connection', (socket) => {
  connectionCount += 1
  socket.emit('playlist', { playlist, fromCurrentUser: false })

  socket.on('mutation', (mutation: MutationMessage) => {
    playlist = playlistReducer(playlist, mutation)
    socket.emit('playlist', { playlist, mutation, fromCurrentUser: true })
    socket.broadcast('playlist', { playlist, mutation, fromCurrentUser: false })
  })

  socket.on('disconnect', () => {
    connectionCount -= 1
    if (connectionCount == 0) {
      playlist = []
    } else if (connectionCount < 0) {
      console.warn(`Connection count was ${connectionCount}. Reset to 0`)
      connectionCount = 0
    }
  })
})

server.listen(process.env.PORT || 5000, () => {
  console.log('server is listening on http://localhost:5000')
})
