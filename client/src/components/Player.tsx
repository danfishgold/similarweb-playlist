import React from 'react'
import YouTube, { YouTubeProps } from 'react-youtube'
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

  const onReady: YouTubeProps['onReady'] = (event) => {
    player.current = event.target
  }

  return (
    <div>
      <YouTube
        videoId={currentlyPlaying?.url}
        onReady={onReady}
        onEnd={onEnd}
        opts={{ playerVars: { autoplay: 0 } }}
      />
    </div>
  )
}
