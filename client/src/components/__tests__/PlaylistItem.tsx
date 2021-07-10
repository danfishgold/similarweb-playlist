import { screen } from '@testing-library/react'
import React from 'react'
import {
  buildPlaylist,
  buildSong,
  renderWithFakePlaylistProvider,
} from '../../test/testUtils'
import PlaylistItem from '../PlaylistItem'

function buttonNamed(name: string | RegExp): HTMLElement | null {
  return screen.queryByRole('button', { name })
}

describe('mutation buttons', () => {
  test('it shows the right buttons for the currently playing song', () => {
    const playlist = buildPlaylist(3)
    renderWithFakePlaylistProvider(
      <PlaylistItem song={playlist[0]} playlistPosition='current' />,
      playlist,
    )
    expect(buttonNamed(/play now/i)).not.toBeInTheDocument()
    expect(buttonNamed(/play next/i)).not.toBeInTheDocument()
    expect(buttonNamed(/play last/i)).not.toBeInTheDocument()
    expect(buttonNamed(/remove/i)).not.toBeInTheDocument()
    expect(buttonNamed(/skip/i)).toBeInTheDocument()
  })

  test('it shows the right buttons for the next song', () => {
    const playlist = buildPlaylist(3)
    renderWithFakePlaylistProvider(
      <PlaylistItem song={playlist[1]} playlistPosition='next' />,
      playlist,
    )
    expect(buttonNamed(/play now/i)).toBeInTheDocument()
    expect(buttonNamed(/play next/i)).not.toBeInTheDocument()
    expect(buttonNamed(/play last/i)).toBeInTheDocument()
    expect(buttonNamed(/remove/i)).toBeInTheDocument()
    expect(buttonNamed(/skip/i)).not.toBeInTheDocument()
  })

  test('it shows the right buttons for future songs', () => {
    const playlist = buildPlaylist(4)
    renderWithFakePlaylistProvider(
      <PlaylistItem song={playlist[2]} playlistPosition='future' />,
      playlist,
    )
    expect(buttonNamed(/play now/i)).toBeInTheDocument()
    expect(buttonNamed(/play next/i)).toBeInTheDocument()
    expect(buttonNamed(/play last/i)).toBeInTheDocument()
    expect(buttonNamed(/remove/i)).toBeInTheDocument()
    expect(buttonNamed(/skip/i)).not.toBeInTheDocument()
  })

  test("it doesn't show the play last button if it's already the last song", () => {
    const playlist = buildPlaylist(4)
    renderWithFakePlaylistProvider(
      <PlaylistItem song={playlist[3]} playlistPosition='future' />,
      playlist,
    )
    expect(buttonNamed(/play now/i)).toBeInTheDocument()
    expect(buttonNamed(/play next/i)).toBeInTheDocument()
    expect(buttonNamed(/play last/i)).not.toBeInTheDocument()
    expect(buttonNamed(/remove/i)).toBeInTheDocument()
    expect(buttonNamed(/skip/i)).not.toBeInTheDocument()
  })
})

test('it shows the thumbnail, title and duration of the song', () => {
  const song = buildSong({ overrides: { durationInSeconds: 65 } })
  const { container } = renderWithFakePlaylistProvider(
    <PlaylistItem song={song} playlistPosition='current' />,
    [song],
  )

  expect(screen.getByText(song.title)).toBeInTheDocument()
  expect(screen.getByText('1:05')).toBeInTheDocument()
  expect(
    container.getElementsByClassName('playlist-item__thumbnail'),
  ).toHaveLength(1)
})
