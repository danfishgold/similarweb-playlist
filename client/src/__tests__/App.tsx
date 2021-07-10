import { getByRole, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Song } from 'shared/src/playlist'
import App from '../App'
import crj from '../crj'
import { buildSong, renderWithPlaylistProvider } from '../test/testUtils'
import * as youtube from '../youtube'

test('song addition works', async () => {
  jest
    .spyOn(youtube, 'fetchSongForVideoIdOrSearchQuery')
    .mockImplementation((query: string) =>
      Promise.resolve(buildSong({ overrides: { title: query } })),
    )
  const { playlist, socket } = renderWithPlaylistProvider(<App />)

  expect(playlist.current).toHaveLength(0)

  // via CRJ button
  userEvent.click(screen.getByRole('button', { name: /add some crj/i }))
  expect(playlist.current).toHaveLength(crj.length)

  // via search box
  const searchBox = screen.getByRole('textbox', { name: /search/i })
  userEvent.type(searchBox, 'pizza')
  userEvent.click(screen.getByRole('button', { name: /add song/i }))
  await waitFor(() => expect(searchBox).toHaveValue(''))
  expect(playlist.current).toHaveLength(crj.length + 1)

  // via socket
  socket.emit('playlist', { playlist: [...playlist.current, buildSong()] })
  await waitFor(() => expect(playlist.current).toHaveLength(crj.length + 2))
})

test('playlist mutation works and is emitted to the socket', async () => {
  const { playlist, socket } = renderWithPlaylistProvider(<App />)

  // adding songs
  userEvent.click(screen.getByRole('button', { name: /add some crj/i }))
  expect(socket.emitted).toHaveBeenLastCalledWith('mutation', {
    type: 'addSongs',
    payload: crj,
  })
  expect(playlist.current).toEqual(crj)

  // removing songs
  expect(crj.length).toBeGreaterThan(5)
  for (let index = 5; index < crj.length; index++) {
    userEvent.click(getByRole(nthLI(5), 'button', { name: /remove/i }))
    expect(socket.emitted).toHaveBeenLastCalledWith('mutation', {
      type: 'removeSong',
      payload: crj[index].id,
    })
  }
  expect(playlist.current).toEqual(crj.slice(0, 5))

  // moving songs
  userEvent.click(getByRole(nthLI(2), 'button', { name: /move down/i }))
  expect(socket.emitted).toHaveBeenLastCalledWith('mutation', {
    type: 'moveSong',
    payload: {
      songId: crj[2].id,
      toAfterId: crj[3].id,
    },
  })
  expect(playlist.current).toEqual(jumbledCRJ(0, 1, 3, 2, 4))

  userEvent.click(getByRole(nthLI(4), 'button', { name: /move up/i }))
  expect(socket.emitted).toHaveBeenLastCalledWith('mutation', {
    type: 'moveSong',
    payload: {
      songId: crj[4].id,
      toAfterId: crj[3].id,
    },
  })
  expect(playlist.current).toEqual(jumbledCRJ(0, 1, 3, 4, 2))

  userEvent.click(getByRole(nthLI(3), 'button', { name: /play next/i }))
  expect(socket.emitted).toHaveBeenLastCalledWith('mutation', {
    type: 'moveSong',
    payload: {
      songId: crj[4].id,
      toAfterId: crj[0].id,
    },
  })
  expect(playlist.current).toEqual(jumbledCRJ(0, 4, 1, 3, 2))

  // skipping songs
  userEvent.click(getByRole(nthLI(0), 'button', { name: /skip/i }))
  expect(socket.emitted).toHaveBeenLastCalledWith('mutation', {
    type: 'markAsPlayed',
    payload: [crj[0].id],
  })
  expect(playlist.current).toEqual(jumbledCRJ(4, 1, 3, 2))

  userEvent.click(getByRole(nthLI(2), 'button', { name: /play now/i }))
  expect(socket.emitted).toHaveBeenLastCalledWith('mutation', {
    type: 'markAsPlayed',
    payload: [crj[4].id, crj[1].id],
  })
  expect(playlist.current).toEqual(jumbledCRJ(3, 2))
})

function jumbledCRJ(...indices: number[]): Song[] {
  return indices.map((index) => crj[index])
}

function nthLI(n: number): HTMLElement {
  return screen.getAllByRole('listitem')[n]
}
