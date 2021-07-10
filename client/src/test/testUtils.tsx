import { build, fake } from '@jackfranklin/test-data-bot'
import { render, RenderOptions } from '@testing-library/react'
import React, { PropsWithChildren } from 'react'
import { Playlist, Song } from 'shared/src/playlist'
import { v4 as uuid } from 'uuid'
import * as playlistHook from '../usePlaylist'
import { PlaylistProvider } from '../usePlaylist'
import { mockPlaylistProvider } from './fakeUsePlaylist'
import mockSocket from './mockSocket'

export const buildSong = build<Song>({
  fields: {
    id: fake(() => uuid()),
    videoId: fake((f) => f.random.alphaNumeric(11)),
    title: fake((f) => f.lorem.words(3)),
    durationInSeconds: fake((f) => f.random.number({ min: 40, max: 500 })),
    thumbnail: {
      url: 'http://placekitten.com/320/180',
      width: 320,
      height: 180,
    },
  },
})

export function buildPlaylist(length: number): Playlist {
  return Array(length)
    .fill(undefined)
    .map(() => buildSong())
}

export function renderWithFakePlaylistProvider(
  ui: React.ReactElement,
  playlist: Playlist,
  options?: RenderOptions,
) {
  const [PlaylistProvider, usePlaylist, dispatch] =
    mockPlaylistProvider(playlist)
  jest.spyOn(playlistHook, 'usePlaylist').mockImplementation(usePlaylist)
  const renderResult = render(ui, {
    ...options,
    wrapper: PlaylistProvider,
  })

  return { ...renderResult, dispatch }
}

export function renderWithPlaylistProvider(
  ui: React.ReactElement,
  playlist: Playlist,
  options?: RenderOptions,
) {
  const socket = mockSocket()
  const wrapper = ({ children }: PropsWithChildren<{}>) => (
    <PlaylistProvider url=''>{children}</PlaylistProvider>
  )

  const renderResult = render(ui, { ...options, wrapper })
  socket.emit('playlist', { playlist })
  return { ...renderResult, socket }
}
