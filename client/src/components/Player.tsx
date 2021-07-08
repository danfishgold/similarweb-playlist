import React from 'react'
import { Song } from 'shared/src/playlist'

type Props = {
  firstPlaylistSong: Song | null
}

export default function Player({ firstPlaylistSong }: Props) {
  const [currentlyPlaying, setCurrentlyPlaying] = React.useState<Song | null>(
    null,
  )

  React.useEffect(() => {
    if (currentlyPlaying?.id !== firstPlaylistSong?.id) {
      setCurrentlyPlaying(firstPlaylistSong)
    }
  }, [currentlyPlaying, firstPlaylistSong])

  return (
    <div>
      <iframe title='player'></iframe>
    </div>
  )
}
