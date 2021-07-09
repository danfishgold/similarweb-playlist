export type Playlist = {
  previousSongs: Song[]
  currentAndNextSongs: Song[]
}

export type Song = {
  videoId: string
  title: string
  thumbnailUrl: string
  durationInSeconds: number
  id: string
}
