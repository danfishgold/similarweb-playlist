import React from 'react'
import { Song } from 'shared/src/playlist'
import { v4 as uuid } from 'uuid'
type Props = { onAddSong: (song: Song) => void }

type Metadata =
  | { type: 'notSubmitted' }
  | { type: 'submitting' }
  | { type: 'failed'; error: Error }

export default function SongInput({ onAddSong }: Props) {
  const [inputValue, setInputValue] = React.useState('')
  const [metadata, setMetadata] = React.useState<Metadata>({
    type: 'notSubmitted',
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onAddSong({
      url: inputValue,
      title: 'pizza',
      thumbnailUrl: 'pizza',
      durationInSeconds: 1,
      id: uuid(),
    })
    setInputValue('')
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder='Enter Video ID'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button>Add</button>
    </form>
  )
}
