import { build, fake } from '@jackfranklin/test-data-bot'
import { act, render, RenderOptions } from '@testing-library/react'
import React, { PropsWithChildren } from 'react'
import { Playlist, Song } from 'shared/src/playlist'
import { v4 as uuid } from 'uuid'
import { Action } from '../reducer'
import * as playlistHook from '../usePlaylist'
import { PlaylistProvider, usePlaylist } from '../usePlaylist'
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

export function renderWithPlaylistProvider(
  ui: React.ReactElement,
  options?: RenderOptions,
) {
  const socket = mockSocket()
  const playlist = { current: [] }
  const dispatch = { current: (action: Action) => {} }
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
  return { ...renderResult, socket, playlist }
}

export function renderWithStaticPlaylist(
  ui: React.ReactElement,
  playlist: Playlist,
  options?: RenderOptions,
) {
  jest
    .spyOn(playlistHook, 'usePlaylist')
    .mockImplementation(() => [
      { playlist, lastLocalMutation: null, serverSync: { type: 'full' } },
      () => {},
    ])

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
  const [actualState, actualDispatch] = usePlaylist()
  playlist.current = actualState.playlist
  dispatch.current = (action: Action) => act(() => actualDispatch(action))
  return <>{children}</>
}
