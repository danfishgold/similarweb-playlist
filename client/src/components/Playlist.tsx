import React from 'react'
import { Playlist as PlaylistType, Song } from 'shared/src/playlist'

type Props = { playlist: PlaylistType; addCRJ: () => void }

export default function Playlist({ playlist, addCRJ }: Props) {
  return (
    <div>
      <h2>Up next</h2>
      {playlist.currentAndNextSongs.length === 0 ? (
        <Placeholder>
          No songs yet. Add YouTube links above or{' '}
          <button onClick={addCRJ}>add some CRJ</button>
        </Placeholder>
      ) : (
        <UpcomingSongs items={playlist.currentAndNextSongs} />
      )}
    </div>
  )
}

function Placeholder({ children }: React.PropsWithChildren<{}>) {
  return <div>{children}</div>
}

function UpcomingSongs({ items }: { items: Song[] }) {
  return (
    <ul>
      {items.map((song, index) => (
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
  return (
    <li>
      <strong>{song.title}</strong>
      {playlistPosition === 'current' && (
        <button onClick={() => {}}>skip</button>
      )}
      {playlistPosition !== 'current' && (
        <button onClick={() => {}}>remove</button>
      )}
      {playlistPosition !== 'current' && (
        <button onClick={() => {}}>play now</button>
      )}
      {playlistPosition === 'future' && (
        <button onClick={() => {}}>play next</button>
      )}
      {JSON.stringify(song)}
    </li>
  )
}
