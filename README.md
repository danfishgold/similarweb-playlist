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

## TODO

- add front end logic
- css
- connect front end to back end
- use youtube embed api
- handle ports more gracefully
- use youtube api
- add option for premade CRJ playlist
- input validation
