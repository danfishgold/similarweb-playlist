import { Playlist, Song } from './playlist'

export type Message = {
  mutation: MutationMessage
  playlist: PlaylistMessage
}

export type MutationMessage = AddSong | RemoveSong | MoveSong | AdvanceToSong

export type PlaylistMessage = {
  playlist: Playlist
  mutation?: MutationMessage
}

export type AddSong = {
  type: 'addSong'
  song: Song
}

export type RemoveSong = {
  type: 'removeSong'
  songId: string
}

export type MoveSong = {
  type: 'moveSong'
  songId: string
  toAfterId: string
}

export type AdvanceToSong = {
  type: 'advanceToSong'
  songId: string
}

export function updatePlaylist(
  playlist: Playlist,
  message: MutationMessage,
): Playlist {
  switch (message.type) {
    case 'addSong': {
      return {
        ...playlist,
        currentAndNextSongs: [...playlist.currentAndNextSongs, message.song],
      }
    }
    case 'moveSong': {
      const oldIndex = playlist.currentAndNextSongs.findIndex(
        (song) => song.id === message.songId,
      )
      if (oldIndex == -1) {
        throw new Error(
          `Tried to move song with id ${message.songId}, which isn't in the playlist`,
        )
      }

      const toAfterIndex = playlist.currentAndNextSongs.findIndex(
        (song) => song.id === message.toAfterId,
      )
      if (toAfterIndex == -1) {
        throw new Error(
          `Tried to move song with id ${message.songId} to after song id ${message.toAfterId}, which isn't in the playlist`,
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
      break
    }
    case 'removeSong': {
      return {
        ...playlist,
        currentAndNextSongs: playlist.currentAndNextSongs.filter(
          (song) => song.id !== message.songId,
        ),
      }
    }
    case 'advanceToSong': {
      const songIndex = playlist.currentAndNextSongs.findIndex(
        (song) => song.id === message.songId,
      )
      if (songIndex == -1) {
        throw new Error(
          `Tried to advance to song id ${message.songId}, which isn't in the playlist`,
        )
      }
      return {
        previousSongs: [
          ...playlist.previousSongs,
          ...playlist.currentAndNextSongs.slice(0, songIndex),
        ],
        currentAndNextSongs: playlist.currentAndNextSongs.slice(songIndex),
      }
    }
  }
}
