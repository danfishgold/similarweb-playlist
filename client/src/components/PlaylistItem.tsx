import React from 'react'
import { Song } from 'shared/src/playlist'
import moveDownIcon from '../icons/ArrowDown.svg'
import moveUpIcon from '../icons/ArrowUp.svg'
import removeIcon from '../icons/Delete.svg'
import skipIcon from '../icons/PlaybackNext.svg'
import playNowIcon from '../icons/PlaybackPlay.svg'
import playNextIcon from '../icons/PlayNext.svg'
import * as actions from '../reducer'
import { usePlaylist } from '../usePlaylist'

type Props = {
  song: Song
  playlistPosition: 'current' | 'next' | 'future'
  isLastSong: boolean
}

export default function PlaylistItem({
  song,
  playlistPosition,
  isLastSong,
}: Props) {
  const [, dispatch] = usePlaylist()

  const skip = () => dispatch(actions.skipCurrentSong())
  const remove = () => dispatch(actions.removeSong(song.id))
  const playNow = () => dispatch(actions.playNow(song.id))
  const playNext = () => dispatch(actions.playNext(song.id))
  const moveUp = () => dispatch(actions.moveUp(song.id))
  const moveDown = () => dispatch(actions.moveDown(song.id))

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
          {playlistPosition === 'future' && (
            <IconButton
              onClick={playNext}
              title='Play Next'
              icon={playNextIcon}
            />
          )}
          {playlistPosition === 'future' && (
            <IconButton onClick={moveUp} title='Move Up' icon={moveUpIcon} />
          )}
          {playlistPosition !== 'current' && !isLastSong && (
            <IconButton
              onClick={moveDown}
              title='Move Down'
              icon={moveDownIcon}
            />
          )}
          {playlistPosition !== 'current' && (
            <IconButton onClick={playNow} title='Play Now' icon={playNowIcon} />
          )}
          {playlistPosition !== 'current' && (
            <IconButton onClick={remove} title='Remove' icon={removeIcon} />
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

function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`

  return `${minutes}:${secondsString}`
}
