import {
  parse as parseDuration,
  toSeconds as durationToSeconds,
} from 'iso8601-duration'
import React from 'react'
import { Song } from 'shared/src/playlist'
import { v4 as uuid } from 'uuid'
import { addSongs } from '../reducer'
import { usePlaylist } from '../usePlaylist'

type Props = {}

type Metadata =
  | { type: 'notSubmitted' }
  | { type: 'submitting' }
  | { type: 'failed'; error: Error }

export default function SongInput({}: Props) {
  const [inputValue, setInputValue] = React.useState('')
  const [songFetching, setSongFetching] = React.useState<Metadata>({
    type: 'notSubmitted',
  })
  const [_, dispatch] = usePlaylist()

  const videoId = parseVideoIdFromInput(inputValue)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setSongFetching({ type: 'submitting' })
    fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.REACT_APP_YOUTUBE_DATA_API_KEY}&part=snippet,contentDetails`,
    )
      .then((response) => response.json())
      .then(parseSongFromYouTubeApiResponse)
      .then((song) => {
        dispatch(addSongs([song]))
        setSongFetching({ type: 'notSubmitted' })
        setInputValue('')
      })
      .catch((error) => {
        setSongFetching({ type: 'failed', error })
      })
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder='Enter Video ID'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button disabled={!videoId}>Add</button>
      {inputValue && !videoId && <p>Enter a valid YouTube URL or video ID</p>}
      {songFetching.type === 'failed' && (
        <p>Something went wrong. Try again later</p>
      )}
    </form>
  )
}

const youtubeIdRegex = /^[A-Za-z0-9_-]{11}$/

function parseVideoIdFromInput(inputValue: string): string | null {
  try {
    const url = new URL(inputValue)
    switch (url.host) {
      case 'www.youtube.com': {
        if (url.pathname !== '/watch') {
          return null
        }
        return url.searchParams.get('v')
      }
      case 'www.youtu.be': {
        if (!youtubeIdRegex.test(url.pathname.slice(1))) {
          return null
        }

        return url.pathname.slice(1)
      }
      default: {
        return null
      }
    }
  } catch {
    if (!youtubeIdRegex.test(inputValue)) {
      return null
    }

    return inputValue
  }
}

type YouTubeApiRepsonse = { error: string } | { items: YouTubeApiItem[] }
type YouTubeApiItem = {
  snippet: {
    id: string
    title: string
    thumbnails: { default: { url: string } }
  }
  contentDetails: { duration: string }
}
const youTubeApiDurationRegex = /^$/

function parseSongFromYouTubeApiResponse(response: YouTubeApiRepsonse): Song {
  if ('error' in response) {
    throw new Error(response.error)
  }

  if (response.items.length !== 1) {
    throw new Error(`Got ${response.items.length} items from YouTube`)
  }

  const item = response.items[0]
  const duration = durationToSeconds(
    parseDuration(item.contentDetails.duration),
  )

  return {
    videoId: item.snippet.id,
    title: item.snippet.title,
    thumbnailUrl: item.snippet.thumbnails.default.url,
    durationInSeconds: duration,
    id: uuid(),
  }
}
