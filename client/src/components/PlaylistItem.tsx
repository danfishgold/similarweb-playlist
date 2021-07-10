import React from 'react'
import { Playlist, Song } from 'shared/src/playlist'
import removeIcon from '../icons/Delete.svg'
import skipIcon from '../icons/PlaybackNext.svg'
import playNowIcon from '../icons/PlaybackPlay.svg'
import playLastIcon from '../icons/PlayLast.svg'
import playNextIcon from '../icons/PlayNext.svg'
import { markAsPlayed, moveSong, removeSong } from '../reducer'
import { usePlaylist } from '../usePlaylist'

type Props = {
  song: Song
  playlistPosition: 'current' | 'next' | 'future'
}

export default function PlaylistItem({ song, playlistPosition }: Props) {
  const [playlist, dispatch] = usePlaylist()

  const lastSongId = lastSongIdInPlaylist(playlist)
  const skip = () => dispatch(markAsPlayed([song.id]))
  const remove = () => dispatch(removeSong(song.id))
  const playNow = () => dispatch(markAsPlayed(allSongsUntil(song.id, playlist)))
  const playNext = () => {
    dispatch(
      moveSong({
        songId: song.id,
        toAfterId: playlist[0].id,
      }),
    )
  }
  const playLast = () =>
    dispatch(
      moveSong({
        songId: song.id,
        toAfterId: lastSongId,
      }),
    )

  return (
    <li
      className={`playlist-item ${
        playlistPosition === 'current' ? 'playlist-item--current' : ''
      }`}
    >
      <img
        className='playlist-item__thumbnail'
        src={song.thumbnail.url}
        width={song.thumbnail.width}
        height={song.thumbnail.height}
        alt=''
      />
      <div className='playlist-item__info'>
        <strong className='playlist-item__info__title'>{song.title}</strong>
        <time
          className='playlist-item__info__duration'
          dateTime={`${formatDuration(song.durationInSeconds)}:00`}
        >
          {formatDuration(song.durationInSeconds)}
        </time>
        <div className='playlist-item__info__button-row'>
          {playlistPosition === 'current' && (
            <IconButton onClick={skip} title='Skip' icon={skipIcon} />
          )}
          {playlistPosition !== 'current' && (
            <IconButton onClick={remove} title='Remove' icon={removeIcon} />
          )}
          {playlistPosition !== 'current' && (
            <IconButton onClick={playNow} title='Play Now' icon={playNowIcon} />
          )}
          {playlistPosition === 'future' && (
            <IconButton
              onClick={playNext}
              title='Play Next'
              icon={playNextIcon}
            />
          )}
          {playlistPosition !== 'current' && song.id !== lastSongId && (
            <IconButton
              onClick={playLast}
              title='Play Last'
              icon={playLastIcon}
            />
          )}
        </div>
      </div>
    </li>
  )
}

function IconButton({
  icon,
  title,
  onClick,
}: {
  icon: string
  title: string
  onClick: () => void
}) {
  return (
    <button
      className='icon-button'
      title={title}
      aria-label={title}
      onClick={onClick}
    >
      <img src={icon} alt='' />
    </button>
  )
}

function allSongsUntil(id: string, playlist: Playlist): string[] {
  const index = playlist.findIndex((aSong) => aSong.id === id)
  if (index === -1) {
    throw new Error('TODO')
  }

  return playlist.slice(0, index).map((song) => song.id)
}

function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`

  return `${minutes}:${secondsString}`
}

function lastSongIdInPlaylist(playlist: Playlist): string {
  return playlist[playlist.length - 1].id
}
