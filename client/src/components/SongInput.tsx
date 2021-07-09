import React from 'react'
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
  const [metadata, setMetadata] = React.useState<Metadata>({
    type: 'notSubmitted',
  })
  const [_, dispatch] = usePlaylist()

  const videoId = parseVideoIdFromInput(inputValue)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    dispatch(
      addSongs([
        {
          url: inputValue,
          title: 'pizza',
          thumbnailUrl: 'pizza',
          durationInSeconds: 1,
          id: uuid(),
        },
      ]),
    )
    setInputValue('')
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
