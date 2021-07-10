import { createAction } from '@reduxjs/toolkit'
import { MutationMessage, PlaylistMessage } from 'shared/src/messages'
import { Playlist, Song } from 'shared/src/playlist'
import crj from './crj'
import * as mutations from './mutations'

export const addSong = createAction('addSong', withPayloadType<Song>())
export const setPlaylistToCRJ = createAction('setPlaylistToCRJ')
export const removeSong = createAction('removeSong', withPayloadType<string>())
export const playNext = createAction('playNext', withPayloadType<string>())
export const moveUp = createAction('moveUp', withPayloadType<string>())
export const moveDown = createAction('moveDown', withPayloadType<string>())
export const skipCurrentSong = createAction('skipCurrentSong')
export const playNow = createAction('playNow', withPayloadType<string>())
export const receivePlaylistFromSocket = createAction(
  'receivePlaylistFromSocket',
  withPayloadType<PlaylistMessage>(),
)
export const setServerSyncInControls = createAction(
  'setServerSyncInControls',
  withPayloadType<ServerSyncType>(),
)
export const socketDisconnected = createAction('socketDisconnected')

export type State = {
  playlist: Playlist
  lastLocalMutation: MutationMessage | null
  serverSync: ServerSync
}

export type ServerSyncType = 'full' | 'partial' | 'none'

type ServerSync =
  | { type: 'none'; becauseDisconnected: boolean }
  | { type: 'partial'; serverPlaylist: Playlist }
  | { type: 'full' }

export type Action =
  | ReturnType<typeof addSong>
  | ReturnType<typeof setPlaylistToCRJ>
  | ReturnType<typeof removeSong>
  | ReturnType<typeof playNext>
  | ReturnType<typeof moveUp>
  | ReturnType<typeof moveDown>
  | ReturnType<typeof skipCurrentSong>
  | ReturnType<typeof playNow>
  | ReturnType<typeof receivePlaylistFromSocket>
  | ReturnType<typeof setServerSyncInControls>
  | ReturnType<typeof socketDisconnected>

export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case addSong.type: {
      const mutation = mutations.addSongs([action.payload])
      return {
        ...state,
        playlist: mutations.updatePlaylist(state.playlist, mutation),
        lastLocalMutation: mutation,
      }
    }
    case setPlaylistToCRJ.type: {
      const mutation = mutations.addSongs(crj)
      return {
        ...state,
        playlist: mutations.updatePlaylist(state.playlist, mutation),
        lastLocalMutation: mutation,
      }
    }
    case removeSong.type: {
      const mutation = mutations.removeSong(action.payload)
      return {
        ...state,
        playlist: mutations.updatePlaylist(state.playlist, mutation),
        lastLocalMutation: mutation,
      }
    }
    case playNext.type: {
      const mutation = mutations.moveSong({
        songId: action.payload,
        toAfterId: state.playlist[0].id,
      })
      return {
        ...state,
        playlist: mutations.updatePlaylist(state.playlist, mutation),
        lastLocalMutation: mutation,
      }
    }
    case moveUp.type: {
      const currentIndex = state.playlist.findIndex(
        (song) => song.id === action.payload,
      )
      if (currentIndex === -1 || currentIndex < 2) {
        return state
      }
      const mutation = mutations.moveSong({
        songId: action.payload,
        toAfterId: state.playlist[currentIndex - 2].id,
      })
      return {
        ...state,
        playlist: mutations.updatePlaylist(state.playlist, mutation),
        lastLocalMutation: mutation,
      }
    }
    case moveDown.type: {
      const currentIndex = state.playlist.findIndex(
        (song) => song.id === action.payload,
      )
      if (currentIndex === -1 || currentIndex >= state.playlist.length - 2) {
        return state
      }
      const mutation = mutations.moveSong({
        songId: action.payload,
        toAfterId: state.playlist[currentIndex + 1].id,
      })
      return {
        ...state,
        playlist: mutations.updatePlaylist(state.playlist, mutation),
        lastLocalMutation: mutation,
      }
    }
    case skipCurrentSong.type: {
      const mutation = mutations.markAsPlayed([state.playlist[0].id])
      return {
        ...state,
        playlist: mutations.updatePlaylist(state.playlist, mutation),
        lastLocalMutation: mutation,
      }
    }
    case playNow.type: {
      const songs = allSongIdsUntil(action.payload, state.playlist)
      const mutation = mutations.markAsPlayed(songs)
      return {
        ...state,
        playlist: mutations.updatePlaylist(state.playlist, mutation),
        lastLocalMutation: mutation,
      }
    }
    case receivePlaylistFromSocket.type: {
      switch (state.serverSync.type) {
        case 'full': {
          return { ...state, playlist: action.payload.playlist }
        }
        case 'partial': {
          const serverPlaylist = action.payload.playlist
          const isFirstPlaylistMessage = !action.payload.mutation
          if (isFirstPlaylistMessage) {
            return {
              ...state,
              playlist: action.payload.playlist,
              serverSync: { ...state.serverSync, serverPlaylist },
            }
          } else if (
            action.payload.mutation?.type === 'addSongs' &&
            !action.payload.fromCurrentUser
          ) {
            return {
              ...state,
              playlist: mutations.updatePlaylist(
                state.playlist,
                action.payload.mutation,
              ),
              serverSync: { ...state.serverSync, serverPlaylist },
            }
          } else {
            return {
              ...state,
              serverSync: { ...state.serverSync, serverPlaylist },
            }
          }
        }
        case 'none': {
          return state
        }
      }
    }
    case setServerSyncInControls.type: {
      const newServerSync = serverSyncFromUserInput(
        action.payload,
        state.playlist,
      )
      return {
        ...state,
        playlist:
          state.serverSync.type === 'partial' && newServerSync.type === 'full'
            ? state.serverSync.serverPlaylist
            : state.playlist,
        serverSync: newServerSync,
      }
    }
    case socketDisconnected.type: {
      return {
        ...state,
        serverSync: { type: 'none', becauseDisconnected: true },
      }
    }
  }
}

function serverSyncFromUserInput(
  type: ServerSyncType,
  playlist: Playlist,
): ServerSync {
  switch (type) {
    case 'full': {
      return { type: 'full' }
    }
    case 'partial': {
      return { type: 'partial', serverPlaylist: playlist }
    }
    case 'none': {
      return { type: 'none', becauseDisconnected: false }
    }
  }
}

function withPayloadType<T>() {
  return (t: T) => ({ payload: t })
}

function allSongIdsUntil(id: string, playlist: Playlist): string[] {
  const index = playlist.findIndex((aSong) => aSong.id === id)
  if (index === -1) {
    throw new Error(`Song with id ${id} not in playlist`)
  }

  return playlist.slice(0, index).map((song) => song.id)
}
