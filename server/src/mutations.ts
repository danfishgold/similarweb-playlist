import { MutationMessage } from 'shared/src/messages'
import { Playlist } from 'shared/src/playlist'

export default function updatePlaylist(
  playlist: Playlist,
  mutation: MutationMessage,
): Playlist {
  switch (mutation.type) {
    case 'addSongs': {
      return [...playlist, ...mutation.payload]
    }
    case 'moveSong': {
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
    case 'removeSong': {
      return playlist.filter((song) => song.id !== mutation.payload)
    }
    case 'markAsPlayed': {
      return playlist.filter((song) => !mutation.payload.includes(song.id))
    }
  }
}
