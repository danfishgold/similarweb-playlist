import { PayloadAction } from '@reduxjs/toolkit'
import { Playlist, Song } from './playlist'

export type Message = {
  mutation: MutationMessage
  playlist: PlaylistMessage
}

export type PlaylistMessage = {
  playlist: Playlist
  mutation?: MutationMessage
  fromCurrentUser: boolean
}

export type MutationMessage = AddSongs | RemoveSong | MoveSong | MarkAsPlayed

type AddSongs = PayloadAction<Song[], 'addSongs'>
type RemoveSong = PayloadAction<string, 'removeSong'>
type MoveSong = PayloadAction<{ songId: string; toAfterId: string }, 'moveSong'>
type MarkAsPlayed = PayloadAction<string[], 'markAsPlayed'>
