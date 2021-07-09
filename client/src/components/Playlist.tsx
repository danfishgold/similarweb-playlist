import React from 'react'
import { Playlist as PlaylistType, Song } from 'shared/src/playlist'
import crj from '../crj'
import { addSongs, markAsPlayed, moveSong, removeSong } from '../reducer'
import { usePlaylist } from '../usePlaylist'

type Props = {}

export default function Playlist({}: Props) {
  const [playlist, dispatch] = usePlaylist()
  const addCRJ = () => dispatch(addSongs(crj))
  return (
    <div>
      <h2>Up next</h2>
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
    <li>
      <strong>{song.title}</strong>
      {playlistPosition === 'current' && <button onClick={skip}>skip</button>}
      {playlistPosition !== 'current' && (
        <button onClick={remove}>remove</button>
      )}
      {playlistPosition !== 'current' && (
        <button onClick={playNow}>play now</button>
      )}
      {playlistPosition === 'future' && (
        <button onClick={playNext}>play next</button>
      )}
      {playlistPosition !== 'current' && song.id !== lastSongId && (
        <button onClick={playLast}>play last</button>
      )}
      {JSON.stringify(song)}
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
