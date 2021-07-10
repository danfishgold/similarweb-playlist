import React from 'react'
import { Song } from 'shared/src/playlist'
import crj from '../crj'
import { addSongs } from '../reducer'
import { usePlaylist } from '../usePlaylist'
import PlaylistItem from './PlaylistItem'

export default function Playlist() {
  const [playlist] = usePlaylist()
  return (
    <div className='playlist'>
      {playlist.length === 0 ? (
        <Placeholder />
      ) : (
        <PlaylistItems songs={playlist} />
      )}
    </div>
  )
}

function Placeholder() {
  const [, dispatch] = usePlaylist()
  const addCRJ = () => dispatch(addSongs(crj))

  return (
    <div className='placeholder'>
      Your playlist is empty. Search for songs to add them to the playlist or{' '}
      <button className='text-button' onClick={addCRJ}>
        just add some CRJ
      </button>
    </div>
  )
}

function PlaylistItems({ songs }: { songs: Song[] }) {
  return (
    <ul>
      {songs.map((song, index) => (
        <PlaylistItem
          song={song}
          playlistPosition={playlistPositionForIndex(index)}
          key={song.id}
        />
      ))}
    </ul>
  )
}

function playlistPositionForIndex(
  index: number,
): 'current' | 'next' | 'future' {
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
