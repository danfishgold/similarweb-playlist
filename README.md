# Similarweb Playlist

[demo](https://similarweb-dj.herokuapp.com)

This is an exercise in my interview process for Similarweb. It was fun

## Running

1. Add a `.env` file in the `client/` directory with an API key for the YouTube
   Data API (v3).
2. Run `yarn install` in the root directory.
3. Run development with `yarn dev`. This will set up the server on port 5000 and
   the client (with HMR) on port 3000.
4. Run production with `yarn start`. This will build the client code and then
   run the server on `env.process.PORT`.

I ran this code locally on macOS 11.4 using node 15.2.0 and yarn 1.22.10, and
deployed to heroku (configured using the `Procfile` file in the root directory).
Note that when you deploy you need to provide the `.env` values as that file is
not included in git.

## To Do

- handle more errors (weird playlist updating in the backend)
- add sync options (this is technically done but it's not tested)
- handle ports more gracefully (between dev/prod)

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
simultaneously. This helps but it doesn't completely solve the problem (for
example in case user 1 removes an item and user 2 simultaneously moves that item
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
also includes a video id), or free text. The input is parsed in the hopes of
detecting a video id. If there isn't one, we use the input as a search query for
the YouTube Data API and use the first search result's video id.

Now that we have a video id we use the YouTube Data API to get the relevant
information about the video (title, duration, thumbnail). After we get that
information we can add the song to the playlist.

These YouTube API requests happen on the client to keep the server free to do
its business of dispatching the playlist to all users every time something
happens.

### The Player

I used `react-youtube` for the iframe YouTube player. I managed to make it work
but I would have wanted more freedom to do some extra stuff (specifically
external play/pause buttons). Also there's a strange bug (my guess is this is
caused by the iframe itself and not the react wrapper) where when the video id
is cleared (as in set to `null`. This happens when the last song in the playlist
finishes playing) it doesn't get cleared from the player. This results in some
confusing UI where the playlist says it's empty but the player shows the
thumbnail of the last played song (which you can then click and play).

### The Playlist

I used the song information from the YouTube Data API (obtained during song
addition) to display human readable data about each song (thumbnail, title and
duration). There are also buttons under each playlist item: the currently
playing song can be skipped (as mentioned above I would have wanted to include
play/pause buttons). For other playlist items there are several:

- Play now, which would skip all songs up until that song
- Play next, which would move it so that it's the next song to be played
- Move up/down, which would move it one spot up/down
- Remove

I did not implement drag and drop because it felt like it would take a while to
pick a package, learn its API, and solve the bugs that I would no doubt get from
trying to use it in a div with `overflow: auto`.

### State

State is managed through the application using the `usePlaylist` hook. It uses a
context to share the state and dispatch function across the app. It also takes
care of incoming/outgoing socket messages via `useEffect`. The state and
dispatch come from `useReducer`. I wanted the flexibility this offered over
redux so that I could do those socket side effects, but I imagine using redux
wouldn't have changed _that_ much.

Note that the state and dispatch are referenced in a single context, while some
parts of the app only need one. This causes redundant renders (mainly on the
parts that only need the dispatch but are re-rendered every time the state
changes). Separating them into two nested contexts would probably help, but at
the size of this app I assume the improvement wouldn't be worth the added
complexity of the code.

### Design

I used icons from Parakeet Primaries (and made the ones for play next/last
myself). I used Tailwind's blue (and yellow) color scheme. I put a corner radius
on a lot of things becuase it looks friendlier that way. I'm not a fan of the
'Add Song' button.

Fun fact: it's responsive!

### Sync Options

This part is currently in a separate branch (`sync-options`) because I didn't
have time to properly test it. I'm 85% sure it works.

There are three sync options:

1. Full sync: adding, removing, moving, and playing are all synced.
2. Partial sync: only adding songs is broadcasted. This is effectively the basic
   requirement of the exercise. It also makes it so that the song doesn't
   auto-advance if I haven't finished listening to it.
3. None: completely disconnected from the server. This options doubles as a
   fallback for when the socket disconnects.

### Delay

This was a fun and silly part: during testing I spammed the mutation buttons on
the playlist and I noticed some jumps. This was caused because mutations are fed
back from the server to the user who made them. Here's the flow:

1. I make a change
2. That change is sent to the server
3. The server updates its own playlist and sends the new one to all users
4. I make another change
5. (That new change is sent to the server)
6. The previous change comes back from the server and temporarily invalidates my
   newer state
7. The server updates its own playlist with the newer update and sends the new
   playlist to all users
8. The new change makes its way back to me and now everything's alright

In summary, the changes that happen are:

1. Initial state
2. Mutation 1 (immediate)
3. Mutation 2 (immediate)
4. Mutation 1 (fed back from the server)
5. Mutation 2 (fed back from the server)

Basically what I needed was to hold back updates from the server when I'm
updating it myself. I did that with a delay: if `[some time]` hasn't passed
since my last mutation, hold off on updates from the server. This effectively
removes the jump caused by step 4 above, and we're left with mutation 2 coming
from the server but not changing anything because it's identical to the local
state. I semi-randomly picked 250ms for the delay.

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

Ideally I would also share the playlist mutation code (`client/src/mutations.ts`
and `server/src/mutations.ts`) because that part is identical: there's
duplication of work in order to speed up the UI and to avoid bugs caused by sync
issues. It's important to note though that this code is shared between the
client and server only because the server is dealing with in-memory data.
Perhaps a more scale friendly solution would require the playlist logic to
happen in a completely different context on the back end.

## Tests

I did not test the backend because its only piece of logic was the playlist
reducer, but the code for it is duplicated in the client, so tests on the client
that verify its logic would also add verification to the server. _However_, on
the client there are no explicit tests for the reducer because it is an
implementation detail that should be tested (indirectly) by user/developer
facing parts of the code. Mainly by integration tests.

I wrote the tests close to the end of my alotted time so they're not very
elegant. I had to use some hacks in my test utilities, I didn't test the
`<Player>` component (as it's mostly a third party iframe), and I didn't test
the `useDelay` hook becuase I knew I'd run into problems with mocking timers.
But this is a home exercise.

## Scale

I'd be happy to talk about this in person/over the phone. There are a couple of
directions this can go and I didn't want to add a lot to an already long
document.
