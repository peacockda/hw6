# Now Playing
A simple "Now Playing" movie page, built for Homework 6 in KIEI-451.

The interface for the site is `movies.html`. The page shows new releases currently playing in theaters and/or streaming, according to [The Movie Database (TMDb)](https://www.themoviedb.org/). The user can click the "Seen it!" button under each movie to mark it as watched.

## Data sources

Movie data is retrieved from TMDb using their API in `movies.js` and built into `movies.html` dynamically.

When a movie is marked as watched, a corresponding document is created in a Firebase collection with the TMDb movie ID and a `watched` flag. If the user "un-watches" a movie on `movies.html`, the associated document is deleted from the Firebase collection.