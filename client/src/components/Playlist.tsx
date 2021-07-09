import React from 'react'
import { Playlist as PlaylistType, Song } from 'shared/src/playlist'
import crj from '../crj'
import removeIcon from '../icons/Delete.svg'
import skipIcon from '../icons/PlaybackNext.svg'
import playNowIcon from '../icons/PlaybackPlay.svg'
import playLastIcon from '../icons/PlayLast.svg'
import playNextIcon from '../icons/PlayNext.svg'
import { addSongs, markAsPlayed, moveSong, removeSong } from '../reducer'
import { usePlaylist } from '../usePlaylist'

export default function Playlist() {
  const [playlist, dispatch] = usePlaylist()
  const addCRJ = () => dispatch(addSongs(crj))
  return (
    <div className='playlist'>
      <h2>Playlist</h2>
      {playlist.currentAndNextSongs.length === 0 ? (
        <Placeholder>
          No songs yet. Add YouTube links above or{' '}
          <button onClick={addCRJ}>add some CRJ</button>
        </Placeholder>
      ) : (
        <UpcomingSongs songs={playlist.currentAndNextSongs} />
      )}
    </div>
  )
}

function Placeholder({ children }: React.PropsWithChildren<{}>) {
  return <div>{children}</div>
}

function UpcomingSongs({ songs }: { songs: Song[] }) {
  return (
    <ul>
      {songs.map((song, index) => (
        <SongItem
          song={song}
          playlistPosition={playlistPositionForIndex(index)}
          key={song.id}
        />
      ))}
    </ul>
  )
}

type PlaylistPosition = 'current' | 'next' | 'future'

function playlistPositionForIndex(index: number): PlaylistPosition {
  switch (index) {
    case 0: {
      return 'current'
    }
    case 1: {
      return 'next'
    }
    default: {
      return 'future'
    }
  }
}

type SongProps = {
  song: Song
  playlistPosition: PlaylistPosition
}

function SongItem({ song, playlistPosition }: SongProps) {
  const [playlist, dispatch] = usePlaylist()

  const lastSongId = lastSongIdInPlaylist(playlist)
  const skip = () => dispatch(markAsPlayed([song.id]))
  const remove = () => dispatch(removeSong(song.id))
  const playNow = () => dispatch(markAsPlayed(allSongsUntil(song.id, playlist)))
  const playNext = () => {
    dispatch(
      moveSong({
        songId: song.id,
        toAfterId: playlist.currentAndNextSongs[0].id,
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
        src={song.thumbnail.url}
        width={song.thumbnail.width}
        height={song.thumbnail.height}
        alt=''
      />
      <div className='playlist-item__info'>
        <strong className='playlist-item__info__title'>{song.title}</strong>
        <span className='playlist-item__info__duration'>
          {formatDuration(song.durationInSeconds)}
        </span>
        <div className='playlist-item__info__button-row'>
          {playlistPosition === 'current' && (
            <button onClick={skip} aria-label='skip'>
              <img src={skipIcon} alt='' />
            </button>
          )}
          {playlistPosition !== 'current' && (
            <button onClick={remove} aria-label='remove'>
              <img src={removeIcon} alt='' />
            </button>
          )}
          {playlistPosition !== 'current' && (
            <button onClick={playNow} aria-label='play now'>
              <img src={playNowIcon} alt='' />
            </button>
          )}
          {playlistPosition === 'future' && (
            <button onClick={playNext} aria-label='play next'>
              <img src={playNextIcon} alt='' />
            </button>
          )}
          {playlistPosition !== 'current' && song.id !== lastSongId && (
            <button onClick={playLast} aria-label='play last'>
              <img src={playLastIcon} alt='' />
            </button>
          )}
        </div>
      </div>
    </li>
  )
}
function allSongsUntil(id: string, playlist: PlaylistType): string[] {
  const index = playlist.currentAndNextSongs.findIndex(
    (aSong) => aSong.id === id,
  )
  if (index === -1) {
    throw new Error('TODO')
  }

  return playlist.currentAndNextSongs.slice(0, index).map((song) => song.id)
}

function lastSongIdInPlaylist(playlist: PlaylistType): string {
  return playlist.currentAndNextSongs[playlist.currentAndNextSongs.length - 1]
    .id
}
function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`

  return `${minutes}:${secondsString}`
}
