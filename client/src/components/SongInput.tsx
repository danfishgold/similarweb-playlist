import React from 'react'
import { addSongs } from '../reducer'
import { usePlaylist } from '../usePlaylist'
import fetchSongForVideoIdOrSearchQuery from '../youtube'

type Metadata =
  | { type: 'notSubmitted' }
  | { type: 'submitting' }
  | { type: 'failed'; error: Error }

export default function SongInput() {
  const [inputValue, setInputValue] = React.useState('')
  const [songFetching, setSongFetching] = React.useState<Metadata>({
    type: 'notSubmitted',
  })
  const [, dispatch] = usePlaylist()

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
    <form className='song-input' onSubmit={onSubmit}>
      <input
        placeholder='Search'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={songFetching.type === 'submitting'}
      />
      <button>
        {songFetching.type === 'submitting' ? 'Searching' : 'Add song'}
      </button>
      {songFetching.type === 'failed' && (
        <p>Something went wrong. Try again later</p>
      )}
    </form>
  )
}
