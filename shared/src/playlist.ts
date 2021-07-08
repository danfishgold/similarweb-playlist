export type Playlist = {
  previousSongs: Song[]
  currentAndNextSongs: Song[]
}

export type Song = {
  url: string
  title: string
  thumbnailUrl: string
  durationInSeconds: number
  id: string
}
