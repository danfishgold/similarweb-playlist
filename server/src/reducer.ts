import { MutationMessage } from 'shared/src/messages'
import { Playlist } from 'shared/src/playlist'

export default function playlistReducer(
  playlist: Playlist,
  message: MutationMessage,
): Playlist {
  switch (message.type) {
    case 'addSongs': {
      return {
        ...playlist,
        currentAndNextSongs: [
          ...playlist.currentAndNextSongs,
          ...message.payload,
        ],
      }
    }
    case 'moveSong': {
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
            ...playlist.currentAndNextSongs.slice(newIndex, oldIndex),
            ...playlist.currentAndNextSongs.slice(oldIndex + 1),
          ],
        }
      }
    }
    case 'removeSong': {
      return {
        ...playlist,
        currentAndNextSongs: playlist.currentAndNextSongs.filter(
          (song) => song.id !== message.payload,
        ),
      }
    }
    case 'markAsPlayed': {
      const [songsToRemove, filteredNext] = partition(
        playlist.currentAndNextSongs,
        (song) => message.payload.includes(song.id),
      )

      return {
        previousSongs: [...playlist.previousSongs, ...songsToRemove],
        currentAndNextSongs: filteredNext,
      }
    }
  }
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
