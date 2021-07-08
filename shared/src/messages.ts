import { Playlist } from './playlist'

export type Message<MutationMessage> = {
  mutation: MutationMessage
  playlist: PlaylistMessage<MutationMessage>
}

export type PlaylistMessage<MutationMessage> = {
  playlist: Playlist
  mutation?: MutationMessage
}
