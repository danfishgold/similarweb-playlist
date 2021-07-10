import { build, fake } from '@jackfranklin/test-data-bot'
import { render, RenderOptions } from '@testing-library/react'
import React, { PropsWithChildren } from 'react'
import { Playlist, Song } from 'shared/src/playlist'
import { v4 as uuid } from 'uuid'
import { Action } from '../reducer'
import * as playlistHook from '../usePlaylist'
import { PlaylistProvider, usePlaylist } from '../usePlaylist'
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
  initialPlaylist: Playlist,
  options?: RenderOptions,
) {
  const socket = mockSocket()
  const playlist = { current: [] }
  const dispatch = { current: () => {} }
  const wrapper = ({ children }: PropsWithChildren<{}>) => {
    return (
      <PlaylistProvider url=''>
        <Snitch playlist={playlist} dispatch={dispatch}>
          {children}
        </Snitch>
      </PlaylistProvider>
    )
  }

  const renderResult = render(ui, { ...options, wrapper })
  socket.emit('playlist', { playlist: initialPlaylist })
  return { ...renderResult, socket, playlist, dispatch }
}

export function renderWithStaticPlaylist(
  ui: React.ReactElement,
  playlist: Playlist,
  options?: RenderOptions,
) {
  jest
    .spyOn(playlistHook, 'usePlaylist')
    .mockImplementation(() => [playlist, () => {}])

  return render(ui)
}

function Snitch({
  playlist,
  dispatch,
  children,
}: PropsWithChildren<{
  playlist: { current: Playlist }
  dispatch: { current: (action: Action) => void }
}>) {
  const [actualPlaylist, actualDispatch] = usePlaylist()
  playlist.current = actualPlaylist
  dispatch.current = actualDispatch
  return <>{children}</>
}
