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

export function updatePlaylist(
  playlist: Playlist,
  mutation: MutationMessage,
): Playlist {
  switch (mutation.type) {
    case addSongs.type: {
      return [...playlist, ...mutation.payload]
    }
    case moveSong.type: {
      const oldIndex = playlist.findIndex(
        (song) => song.id === mutation.payload.songId,
      )
      if (oldIndex === -1) {
        throw new Error(
          `Tried to move song with id ${mutation.payload.songId}, which isn't in the playlist`,
        )
      }

      const toAfterIndex = playlist.findIndex(
        (song) => song.id === mutation.payload.toAfterId,
      )
      if (toAfterIndex === -1) {
        throw new Error(
          `Tried to move song with id ${mutation.payload.songId} to after song id ${mutation.payload.toAfterId}, which isn't in the playlist`,
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
      return playlist.filter((song) => song.id !== mutation.payload)
    }
    case markAsPlayed.type: {
      return playlist.filter((song) => !mutation.payload.includes(song.id))
    }
  }
}

function withPayloadType<T>() {
  return (t: T) => ({ payload: t })
}
