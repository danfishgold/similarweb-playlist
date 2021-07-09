import React from 'react'
import { addSongs } from '../reducer'
import { usePlaylist } from '../usePlaylist'
import fetchSongForVideoIdOrSearchQuery from '../youtube'

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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setSongFetching({ type: 'submitting' })
    fetchSongForVideoIdOrSearchQuery(inputValue)
      .then((song) => {
        dispatch(addSongs([song]))
        setSongFetching({ type: 'notSubmitted' })
        setInputValue('')
      })
      .catch((error) => {
        console.error(error)
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
      <button>Add</button>
      {songFetching.type === 'failed' && (
        <p>Something went wrong. Try again later</p>
      )}
    </form>
  )
}
