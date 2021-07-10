import React, { PropsWithChildren } from 'react'
import { Playlist } from 'shared/src/playlist'
import { Action } from '../reducer'

const Context = React.createContext<
  [Playlist, (action: Action) => void] | null
>(null)

export function mockPlaylistProvider(
  playlist: Playlist,
): [
  ({ children }: PropsWithChildren<{}>) => JSX.Element,
  () => [Playlist, (action: Action) => void],
  jest.Mock,
] {
  const dispatch = jest.fn()

  const fakeProvider = ({ children }: PropsWithChildren<{}>) => (
    <Context.Provider value={[playlist, dispatch]} children={children} />
  )

  const fakeUsePlaylist = (): [Playlist, (action: Action) => void] => {
    const values = React.useContext(Context)

    if (!values) {
      throw new Error(
        'Tests for components that have usePlaylist should be rendered using renderWithPlaylist',
      )
    }

    return values
  }

  return [fakeProvider, fakeUsePlaylist, dispatch]
}
