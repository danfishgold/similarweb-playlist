import { queryByText, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import crj from '../../crj'
import { buildPlaylist, renderWithPlaylistProvider } from '../../test/testUtils'
import Playlist from '../Playlist'

describe('when the playlist is empty', () => {
  test('the placeholder is shown', () => {
    const { container } = renderWithPlaylistProvider(<Playlist />)
    const placeholder = container.getElementsByClassName('placeholder')
    expect(placeholder).toHaveLength(1)
  })

  test('the CRJ button adds the CRJ songs', () => {
    const { playlist } = renderWithPlaylistProvider(<Playlist />)
    userEvent.click(screen.getByRole('button', { name: /just add some crj/i }))
    expect(playlist.current).toEqual(crj)
  })
})

test("there's only one current item", async () => {
  const { playlist, socket, container } = renderWithPlaylistProvider(
    <Playlist />,
  )
  const songs = buildPlaylist(4)
  socket.emit('playlist', { playlist: songs })
  await waitFor(() => expect(playlist.current).toHaveLength(4))

  const currentSongs = container.getElementsByClassName(
    'playlist-item--current',
  )
  expect(currentSongs).toHaveLength(1)
  const currentSong = currentSongs[0] as HTMLElement

  expect(queryByText(currentSong, songs[0].title)).toBeInTheDocument()
})

test('the number of items is the same as the length of the playlist', async () => {
  const { playlist, socket, container } = renderWithPlaylistProvider(
    <Playlist />,
  )
  const songCount = 4
  const songs = buildPlaylist(songCount)
  socket.emit('playlist', { playlist: songs })
  await waitFor(() => expect(playlist.current).toHaveLength(4))

  const songItems = screen.getAllByRole('listitem')
  expect(songItems).toHaveLength(songCount)
})
