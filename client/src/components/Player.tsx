import React from 'react'
import YouTube, { YouTubeProps } from 'react-youtube'
import { Song } from 'shared/src/playlist'
import { skipCurrentSong } from '../reducer'
import { usePlaylist } from '../usePlaylist'

export default function Player() {
  const [{ playlist }, dispatch] = usePlaylist()
  const firstPlaylistSong = playlist[0] ?? null
  const [currentlyPlaying, setCurrentlyPlaying] = React.useState<Song | null>(
    null,
  )
  const onEnd = () => dispatch(skipCurrentSong())
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
    <div className='player'>
      <YouTube
        videoId={currentlyPlaying?.videoId}
        onReady={onReady}
        onEnd={onEnd}
        opts={{ width: '100%', height: 'auto', playerVars: { autoplay: 1 } }}
        containerClassName={'youtubeContainer'}
      />
    </div>
  )
}
