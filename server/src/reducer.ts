import { createAction } from '@reduxjs/toolkit'
import { Playlist, Song } from 'shared/src/playlist'

export type MutationMessage = ReturnType<
  typeof mutations[keyof typeof mutations]
>

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
  withPayloadType<Playlist>(),
)

const mutations = {
  addSongs,
  removeSong,
  moveSong,
  markAsPlayed,
  setPlaylist,
}

export default function playlistReducer(
  playlist: Playlist,
  message: MutationMessage,
): Playlist {
  switch (message.type) {
    case addSongs.type: {
      return {
        ...playlist,
        currentAndNextSongs: [
          ...playlist.currentAndNextSongs,
          ...message.payload,
        ],
      }
    }
    case moveSong.type: {
      const oldIndex = playlist.currentAndNextSongs.findIndex(
        (song) => song.id === message.payload.songId,
      )
      if (oldIndex === -1) {
        throw new Error(
          `Tried to move song with id ${message.payload.songId}, which isn't in the playlist`,
        )
      }

      const toAfterIndex = playlist.currentAndNextSongs.findIndex(
        (song) => song.id === message.payload.toAfterId,
      )
      if (toAfterIndex === -1) {
        throw new Error(
          `Tried to move song with id ${message.payload.songId} to after song id ${message.payload.toAfterId}, which isn't in the playlist`,
        )
      }

      const newIndex = toAfterIndex + 1

      if (newIndex > oldIndex) {
        return {
          ...playlist,
          currentAndNextSongs: [
            ...playlist.currentAndNextSongs.slice(0, oldIndex),
            ...playlist.currentAndNextSongs.slice(oldIndex + 1, newIndex),
            playlist.currentAndNextSongs[oldIndex],
            ...playlist.currentAndNextSongs.slice(newIndex),
          ],
        }
      } else {
        return {
          ...playlist,
          currentAndNextSongs: [
            ...playlist.currentAndNextSongs.slice(0, newIndex),
            playlist.currentAndNextSongs[oldIndex],
            ...playlist.currentAndNextSongs.slice(newIndex + 1, oldIndex),
            ...playlist.currentAndNextSongs.slice(oldIndex),
          ],
        }
      }
    }
    case removeSong.type: {
      return {
        ...playlist,
        currentAndNextSongs: playlist.currentAndNextSongs.filter(
          (song) => song.id !== message.payload,
        ),
      }
    }
    case markAsPlayed.type: {
      const [songsToRemove, filteredNext] = partition(
        playlist.currentAndNextSongs,
        (song) => message.payload.includes(song.id),
      )

      return {
        previousSongs: [...playlist.previousSongs, ...songsToRemove],
        currentAndNextSongs: filteredNext,
      }
    }
    case setPlaylist.type: {
      return message.payload
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
