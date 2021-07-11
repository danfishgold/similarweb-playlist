import { Song } from 'shared/src/playlist'
import { v4 as uuid } from 'uuid'

const fakeCrj: Song[] = [
  {
    videoId: 'kV9sNmujCPk',
    title: 'Carly Rae Jepsen - E·MO·TION',
    thumbnail: {
      url: 'https://i.ytimg.com/vi/kV9sNmujCPk/mqdefault.jpg',
      width: 320,
      height: 180,
    },
    durationInSeconds: 198,
    id: uuid(),
  },
  {
    videoId: 'TeccAtqd5K8',
    title: 'Carly Rae Jepsen - Run Away With Me',
    thumbnail: {
      url: 'https://i.ytimg.com/vi/TeccAtqd5K8/mqdefault.jpg',
      width: 320,
      height: 180,
    },
    durationInSeconds: 253,
    id: uuid(),
  },
  {
    videoId: 'NY1RsDpRmIU',
    title: 'Carly Rae Jepsen - Want You In My Room',
    thumbnail: {
      url: 'https://i.ytimg.com/vi/NY1RsDpRmIU/mqdefault.jpg',
      width: 320,
      height: 180,
    },
    durationInSeconds: 184,
    id: uuid(),
  },
  {
    videoId: 'CnGjfxJqf6I',
    title: 'Carly Rae Jepsen - Now That I Found You',
    thumbnail: {
      url: 'https://i.ytimg.com/vi/CnGjfxJqf6I/mqdefault.jpg',
      width: 320,
      height: 180,
    },
    durationInSeconds: 275,
    id: uuid(),
  },
  {
    videoId: 'k7SwCMINvK8',
    title: 'Carly Rae Jepsen - The Sound',
    thumbnail: {
      url: 'https://i.ytimg.com/vi/k7SwCMINvK8/mqdefault.jpg',
      width: 320,
      height: 180,
    },
    durationInSeconds: 173,
    id: uuid(),
  },
  {
    videoId: 'OQTM9zYV59g',
    title: 'Carly Rae Jepsen - Heartbeat',
    thumbnail: {
      url: 'https://i.ytimg.com/vi/OQTM9zYV59g/mqdefault.jpg',
      width: 320,
      height: 180,
    },
    durationInSeconds: 254,
    id: uuid(),
  },
  {
    videoId: '_2hdlmg_4GE',
    title: 'Carly Rae Jepsen - Now I Don’t Hate California After All',
    thumbnail: {
      url: 'https://i.ytimg.com/vi/_2hdlmg_4GE/mqdefault.jpg',
      width: 320,
      height: 180,
    },
    durationInSeconds: 295,
    id: uuid(),
  },
]

export default () => fakeCrj

export const crjCount = fakeCrj.length
