import React from 'react'
import { Song } from 'shared/src/playlist'

type Props = {
  firstPlaylistSong: Song | null
  onEnd: () => void
}

export default function Player({ firstPlaylistSong, onEnd }: Props) {
  const [currentlyPlaying, setCurrentlyPlaying] = React.useState<Song | null>(
    null,
  )
  const player = React.useRef<any>()
  React.useEffect(() => {
    if (currentlyPlaying?.id !== firstPlaylistSong?.id) {
      setCurrentlyPlaying(firstPlaylistSong)
      if (firstPlaylistSong) {
        player.current?.playVideo()
      }
    }
  }, [currentlyPlaying, firstPlaylistSong])

  return <div>player</div>
}
