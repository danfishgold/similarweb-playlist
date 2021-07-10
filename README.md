# Similarweb Playlist

[demo](https://similarweb-dj.herokuapp.com)

This is an exercise in my interview process for Similarweb. It was fun

## TODO

- finish tests
- handle ports more gracefully
- handle errors (weird playlist updating in the backend, socket connection
  status, etc)
- no-syncronization option
- handle TODOs in code

### tests

- useDelay (might be tricky to test)
- youtube (test actual response for known video)
- usePlaylist (mock socket.io, initial state, dispatches locally and to socket)
- reducer (just some nice logic testing, make sure no duplicate ids)
- SongInput (calls youtube.ts functions, shows loading state, shows error)
- Playlist (shows all songs, buttons dispatch actions correctly and appear on
  correct items)
- Player (I don't really know what to test here)
- Integration (happy paths)

## The Server

The server acts as the source of truth for the playlist. It receives playlist
updates from users (adding, moving, removing, and skipping songs) and updates
its playlist accordingly. Then it broadcasts the new playlist to everyone,
including the sender.

It also serves the client code in production.

The server's playlist is maintained in memory, which is obviously not a solution
that would scale well but this is a home exercise. When there are no active
clients connected to the server (via socket.io) the playlist is emptied.

Playlist mutations refer to songs via an id (not the video id, but one that is
specific to each playlist item, as the same video can appear in the playlist
multiple times). This id is generated on the client via the `v4` function from
the `uuid` package. I used ids for mutations (as in
`remove item with id=[some id]`, or
`move item with id=[some id] to be after item with id=[some other id]`, instead
of `remove the nth item` or `move the nth item to the mth position`) because
this is more robust in case clients aren't syncronized or make different edits
simultaneously. This helps but id doesn't completely solve the problem (for
example in case user 1 removes an item and simultaneously user 2 moves that item
somewhere. If the first update reaches the server first then by the time the
second update arrives it can't be committed). When an update can't be committed
it is simply ignored.

## The Client

The client allows users to modify the playlist by adding, moving, removing, and
skipping songs. The updates that a user makes are simultaneously committed to
their local copy of the playlist and sent to the server (via socket.io) so that
the new version can be sent to all other users. This update to the local version
creates a nicer user experience (where you don't have to wait for your action to
update locally).

### Search

The input field allows users to enter a YouTube video id, a youtube link (which
also includes a video id), or free text. The input is parsed in search for a
video id. If there is none, we use the input as a search query for the YouTube
Data API and use the video id of the first search result.

Now that we have a video id we use the YouTube Data API to get the relevant
information about the video (title, duration, thumbnail). After we get that
information we can add the song to the playlist.

These YouTube API requests happen on the client to keep the server free to do
its business of dispatching the playlist to all users every time something
happens.

### The Player

I used `react-youtube` for the iframe YouTube player. I managed to make the
basics of it work but I would have wanted more freedom to do some extra stuff
(specifically external play/pause buttons). Also there's a strange bug (my guess
is this is caused by the iframe itself and not the react wrapper) where when the
video id is cleared (as in set to `null`. This happens when the last song in the
playlist finishes playing) it doesn't get cleared from the player. This results
in some confusing UI where the playlist says it's empty but the player shows the
thumbnail of the last played song (which you can then click and play).

### The Playlist

I used the song information from the YouTube Data API (obtained during song
addition) to display human readable data about each song (thumbnail, title and
duration). There are also buttons under each playlist item: the currently
playing song can be skipped (as mentioned above I would have wanted to include
play/pause buttons). For other playlist items there are several:

- Play now, which would skip all songs up until that song
- Play next, which would move it so that it's the next song to be played
- Play last, which would move it to the end of the playlist
- Remove

I did not implement drag and drop because it felt like it would take a while to
pick a package, learn its API, and solve the bugs that I would no doubt get from
trying to use it in a div with `overflow: auto`.

### Design

I used icons from Parakeet Primaries (and made the ones for play next/last
myself). I used Tailwind's blue color scheme. I put a corner radius on a lot of
things becuase it looks friendlier that way. I'm not a fan of the 'Add Song'
button.

Fun fact: it's responsive!

## Shared code

I desparately tried to make shared code available to both the client and server
(as evident by the `shared/` directory and the fact I'm using a yarn workspace).
This turned out to be harder than I expected because I'm using TypeScript: The
client (created with CRA) uses `module: 'ESNext'`, while the server (ran with
`ts-node`) uses `module: 'CommonJS`. For that reason I couldn't share values or
functions between the two parts, but I could share types, which I used (along
with `client/src/typesafeSocket.ts` and `server/src/typesafeSocket.ts`) to make
the socket.io communication type safe.

I know there's a better way to share code between projects but this is a home
exercise.

## Considerations

- When a user finishes listening to a song, that song is deleted from the
  playlist. Should it also delete it for all other users? What happens if a user
  is still listening to the song?
- Can we send the entire playlist on _every_ update to all active connections?
  This might be very resource intensive. On the other hand, it handles
  disconnections well: if I only send a diff of the playlist on update and that
  diff is lost (due to connection issues for example) or multiple diffs arrive
  at the wrong order, then we'll have a syncronization issue.
- addSongs instead of addSong to support batch addition
- I had to duplicate reducer.ts in front/back end because of mismatched "module"
  values in the tsconfig. I wasted a lot of time on this. Important to note:
  that code is sharable mainly because the back end implementation is naive. A
  more advanced back end would need separate logic, so maybe this duplication
  isn't the worst thing. However, the action creators could and should have been
  shared between the front end and the socket on the back end. This resulted in
  some cumbersome type magic in client/src/reducer.ts
- there's a single context for both the playlist and the dispatch. it might be
  more efficient to split them into two providers (so that, for example, the
  input field could only use the dispatch and not have to re-render every time
  the playlist changes). This is a very simple change but we should measure the
  loss in performance we're getting by keeping the code simpler.

## Running

1. Add a `.env` file in the `client/` directory with an API key for the YouTube
   Data API (v3).
2. Run `yarn install` in the root directory
3. Run development with `yarn dev`. This will set up the server on port 5000 and
   the client (with HMR) on port 3000.
4. Run production with `yarn start`. This will build the client code and then
   run the server on `env.process.PORT`.

I ran this code locally on macOS 11.4 using node 15.2.0 and yarn 1.22.10, and
deployed to heroku (configured using the `Procfile` file in the root directory).
Note that when you deploy you need to provide the `.env` values as that file is
not included in git.
