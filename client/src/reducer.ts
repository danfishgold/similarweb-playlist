import { createAction } from '@reduxjs/toolkit'
import { MutationMessage } from 'shared/src/messages'
import { Playlist, Song } from 'shared/src/playlist'

export const addSongs = createAction('addSongs', withPayloadType<Song[]>())
export const removeSong = createAction('removeSong', withPayloadType<string>())
export const moveSong = createAction(
  'moveSong',
  withPayloadType<{ songId: string; toAfterId: string }>(),
)
export const markAsPlayed = createAction(
  'markAsPlayed',
  withPayloadType<string[]>(),
)
export const setPlaylist = createAction(
  'setPlaylist',
  withPayloadType<{ playlist: Playlist; mutation?: MutationMessage }>(),
)

type OutgoingSocketMessage =
  | ReturnType<typeof addSongs>
  | ReturnType<typeof removeSong>
  | ReturnType<typeof moveSong>
  | ReturnType<typeof markAsPlayed>

export type Action = OutgoingSocketMessage | ReturnType<typeof setPlaylist>

export function isOutgoingSocketMessage(
  action: Action,
): action is OutgoingSocketMessage {
  return ['addSongs', 'removeSong', 'moveSong', 'markAsPlayed'].includes(
    action.type,
  )
}

export default function playlistReducer(
  playlist: Playlist,
  action: Action,
): Playlist {
  switch (action.type) {
    case addSongs.type: {
      return [...playlist, ...action.payload]
    }
    case moveSong.type: {
      const oldIndex = playlist.findIndex(
        (song) => song.id === action.payload.songId,
      )
      if (oldIndex === -1) {
        throw new Error(
          `Tried to move song with id ${action.payload.songId}, which isn't in the playlist`,
        )
      }

      const toAfterIndex = playlist.findIndex(
        (song) => song.id === action.payload.toAfterId,
      )
      if (toAfterIndex === -1) {
        throw new Error(
          `Tried to move song with id ${action.payload.songId} to after song id ${action.payload.toAfterId}, which isn't in the playlist`,
        )
      }

      const newIndex = toAfterIndex + 1

      if (newIndex > oldIndex) {
        return [
          ...playlist.slice(0, oldIndex),
          ...playlist.slice(oldIndex + 1, newIndex),
          playlist[oldIndex],
          ...playlist.slice(newIndex),
        ]
      } else {
        return [
          ...playlist.slice(0, newIndex),
          playlist[oldIndex],
          ...playlist.slice(newIndex, oldIndex),
          ...playlist.slice(oldIndex + 1),
        ]
      }
    }
    case removeSong.type: {
      return playlist.filter((song) => song.id !== action.payload)
    }
    case markAsPlayed.type: {
      return playlist.filter((song) => !action.payload.includes(song.id))
    }
    case setPlaylist.type: {
      return action.payload.playlist
    }
  }
}

function withPayloadType<T>() {
  return (t: T) => ({ payload: t })
}

export function partition<T>(array: T[], fn: (item: T) => boolean): [T[], T[]] {
  let trues = []
  let falses = []
  for (const item of array) {
    if (fn(item)) {
      trues.push(item)
    } else {
      falses.push(item)
    }
  }

  return [trues, falses]
}
