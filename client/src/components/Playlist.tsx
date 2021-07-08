import React from 'react'
import { Playlist as PlaylistType, Song } from 'shared/src/playlist'

type Props = { playlist: PlaylistType }

export default function Playlist({ playlist }: Props) {
  return (
    <div>
      <h2>Up next</h2>
      {playlist.currentAndNextSongs.length === 0 ? (
        <Placeholder />
      ) : (
        <UpcomingSongs items={playlist.currentAndNextSongs} />
      )}
    </div>
  )
}

function Placeholder() {
  return <div>No songs yet. Add YouTube links above</div>
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
