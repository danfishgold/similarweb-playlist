import { Song } from 'shared/src/playlist'
import { fetchSongForVideoIdOrSearchQuery } from '../youtube'

const fakeUUID = 'pizza'

const testSong: Song = {
  id: fakeUUID,
  videoId: 'FLkj9zr0-sQ',
  title: 'Carly Rae Jepsen - When I Needed You',
  durationInSeconds: 222,
  thumbnail: {
    url: 'https://i.ytimg.com/vi/FLkj9zr0-sQ/mqdefault.jpg',
    width: 320,
    height: 180,
  },
}

jest.mock('uuid', () => ({ v4: () => fakeUUID }))

test('gets info about the video for an id', async () => {
  const query = testSong.videoId
  const song = await fetchSongForVideoIdOrSearchQuery(query)
  expect(song).toEqual(testSong)
})

test('gets info about the video for a youtube url', async () => {
  const query = `https://youtube.com/watch?v=${testSong.videoId}`
  const song = await fetchSongForVideoIdOrSearchQuery(query)
  expect(song).toEqual(testSong)
})

test('gets info about the video for a youtu.be url', async () => {
  const query = `https://youtu.be/${testSong.videoId}`
  const song = await fetchSongForVideoIdOrSearchQuery(query)
  expect(song).toEqual(testSong)
})

test('searches for videos for freeform input', async () => {
  const query = 'When I Needed You'
  const song = await fetchSongForVideoIdOrSearchQuery(query)
  expect(song).toMatchInlineSnapshot(`
    Object {
      "durationInSeconds": 222,
      "id": "pizza",
      "thumbnail": Object {
        "height": 180,
        "url": "https://i.ytimg.com/vi/FLkj9zr0-sQ/mqdefault.jpg",
        "width": 320,
      },
      "title": "Carly Rae Jepsen - When I Needed You",
      "videoId": "FLkj9zr0-sQ",
    }
  `)
})

test('throws if there are no search results', async () => {
  const query = 'fsdlkfj vdskfjl kjdfslkj sdlfjsdl jfdls jfldkj sdl'
  await expect(
    fetchSongForVideoIdOrSearchQuery(query),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"Got 0 items from YouTube"`)
})
