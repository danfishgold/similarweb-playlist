# Similarweb Playlist

[demo](https://similarweb-dj.herokuapp.com)

This is an exercise in my interview process for Similarweb. Fun

## Overview

This is a web app that allows people to create and listen to a shared youtube
playlist.

The front end of this app does most of the heavy lifting and the back end acts
as a "dumb pipe".

## Considerations

- When a user finishes listening to a song, that song is deleted from the
  playlist. Should it also delete it for all other users? What happens if a user
  is still listening to the song?
- Can we send the entire playlist on _every_ update to all active connections?
  This might be very resource intensive. On the other hand, it handles
  disconnections well: if I only send a diff of the playlist on update and that
  diff is lost (due to connection issues for example), then we'll have a
  syncronization issue.
- The playlist mutation operations refer to song ids rather than the indices of
  the songs in the playlist. this is more robust when there are multiple
  mutations coming in at the same time from multiple users.
- The playlist is emptied when the last user leaves. This makes sense from a
  design perspective but was annoying from a development perspective
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

## TODO

- css and design
- tests
- handle ports more gracefully
- use youtube api
- handle errors (weird playlist updating in the backend, socket connection
  status, etc)
- figure out a nicer way to not duplicate reducer.ts in front/back end
