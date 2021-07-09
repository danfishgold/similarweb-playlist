export type Playlist = {
  previousSongs: Song[]
  currentAndNextSongs: Song[]
}

export type Song = {
  videoId: string
  title: string
  thumbnail: { url: string; width: number; height: number }
  durationInSeconds: number
  id: string
}
