import { Song } from './playlist'

export type Message = AddSong | RemoveSong | MoveSong | StartPlayingSong

export type AddSong = {
  type: 'addSong'
  song: Song
}

export type RemoveSong = {
  type: 'removeSong'
  index: number
}

export type MoveSong = {
  type: 'moveSong'
  from: number
  to: number
}

export type StartPlayingSong = {
  type: 'startPlayingSong'
  index: number
}
