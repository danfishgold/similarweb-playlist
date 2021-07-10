import { queryByText, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import crj from '../../crj'
import { addSongs } from '../../reducer'
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

test("there's only one current item", () => {
  const { playlist, dispatch, container } = renderWithPlaylistProvider(
    <Playlist />,
  )
  const songs = buildPlaylist(4)
  dispatch.current(addSongs(songs))

  const currentSongs = container.getElementsByClassName(
    'playlist-item--current',
  )
  expect(currentSongs).toHaveLength(1)
  const currentSong = currentSongs[0] as HTMLElement

  expect(queryByText(currentSong, songs[0].title)).toBeInTheDocument()
})

test('the number of items is the same as the length of the playlist', () => {
  const { playlist, dispatch, container } = renderWithPlaylistProvider(
    <Playlist />,
  )
  const songCount = 4
  const songs = buildPlaylist(songCount)
  dispatch.current(addSongs(songs))

  const songItems = screen.getAllByRole('listitem')
  expect(songItems).toHaveLength(songCount)
})
