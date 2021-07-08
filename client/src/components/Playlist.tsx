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
      {items.map((song) => (
        <SongItem song={song} key={song.id} />
      ))}
    </ul>
  )
}

function SongItem({ song }: { song: Song }) {
  return <li>{JSON.stringify(song)}</li>
}
