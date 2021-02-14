window.addEventListener('DOMContentLoaded', async function(event) {
  // TMDb access
  let apiKey = '624b46c7d7c5ca830efc8c74b1303c74'
  let nowPlayingURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`
  let movieQuerySnapshot = await fetch(nowPlayingURL)
  let queryJson = await movieQuerySnapshot.json()
  let movies = queryJson.results

  // Firebase access
  let db = firebase.firestore()
  // Pulling the whole collection saves calls to Firebase so page renders faster
  let watchedCollection = await db.collection('watched').get()
  let watchedDocs = watchedCollection.docs
  
  let moviesElement = document.querySelector('.movies')

  // Loop through movie list received from TMDb and...
  for (let i = 0; i < movies.length; i++){
    let movie = movies[i]
    // ...build HTML elements for the movie, 
    moviesElement.insertAdjacentHTML('beforeend', `
      <div id="${movie.id}" class="w-1/4 p-4 movie-${movie.id}">
        <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" rel="noreferrer noopener"><img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path}" class="w-full">
        <div class="title bg-auto font-bold text-white text-center">${movie.title}</div></a>
        <a href="#" id="watched-${movie.id}" class="watched-button block text-center text-white bg-green-500 mt-4 mb-2 px-4 py-2 rounded">Saw it!</a>
      </div>
    `)
    // Track the button (and parent div) under construction for status and events
    let movieButton = document.querySelector(`#watched-${movie.id}`)

    // Loop through array of watched movies to see if any match
    for (let j = 0; j < watchedDocs.length; j++) {
      watchedMovieData = watchedDocs[j].data()
      // If we match, make this movie transparent
      if (movie.id == watchedMovieData.id) {
        movieButton.parentElement.classList.add('opacity-20')
      }
    }

    // Event listener for watch/unwatch input
    movieButton.addEventListener('click', async function(event){
      event.preventDefault()
      // Find the movie ID being watched/unwatched
      watchedToggleID = event.target.parentNode.getAttribute('id')
      // If this div is already transparent, the movie is already watched.
      if (event.target.parentNode.classList.contains('opacity-20')){
        // So delete the associated doc and clear transparency
        await db.collection('watched').doc(watchedToggleID).delete()
        event.target.parentNode.classList.remove('opacity-20')
      } else {
        // Create a doc and set transparency
        await db.collection('watched').doc(watchedToggleID).set({
          watched: true,
          // Adding the ID to the doc properties makes it easier to find
          // information without calling Firebase more times on load
          id: watchedToggleID
        })
        event.target.parentNode.classList.add('opacity-20')
      }
    })
  }
})