// First, sign up for an account at https://themoviedb.org
// Once verified and signed-in, go to Settings and create a new
// API key; in the form, indicate that you'll be using this API
// key for educational or personal use, and you should receive
// your new key right away.

// For this exercise, we'll be using the "now playing" API endpoint
// https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US

// Note: image data returned by the API will only give you the filename;
// prepend with `https://image.tmdb.org/t/p/w500/` to get the 
// complete image URL

window.addEventListener('DOMContentLoaded', async function(event) {
  // Step 1: Construct a URL to get movies playing now from TMDB, fetch
  // data and put the Array of movie Objects in a variable called
  // movies. Write the contents of this array to the JavaScript
  // console to ensure you've got good data
  // ⬇️ ⬇️ ⬇️
  let db = firebase.firestore()
  let apiKey = '624b46c7d7c5ca830efc8c74b1303c74'
  let nowPlayingURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`
  let movieQuerySnapshot = await fetch(nowPlayingURL)
  let queryJson = await movieQuerySnapshot.json()
  let movieArray = queryJson.results
  // console.log(movieArray)
  // ⬆️ ⬆️ ⬆️ 
  // End Step 1
  
  // Step 2: 
  // - Loop through the Array called movies and insert HTML
  //   into the existing DOM element with the class name .movies
  // - Include a "watched" button to click for each movie
  // - Give each "movie" a unique class name based on its numeric
  //   ID field.
  // Some HTML that would look pretty good... replace with real values :)
  // <div class="w-1/5 p-4 movie-abcdefg1234567">
  //   <img src="https://image.tmdb.org/t/p/w500/moviePosterPath.jpg" class="w-full">
  //   <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
  // </div>
  // ⬇️ ⬇️ ⬇️
  let idStr = ''
  let moviesElement = document.querySelector('.movies')
  for (let i = 0; i < movieArray.length; i++){
    let movie = movieArray[i]
    idStr = String(movie.id)
    moviesElement.insertAdjacentHTML('beforeend', `
      <div id="${movie.id}" class="w-1/4 p-4 movie-${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path}" class="w-full">
        <div class="title bg-auto font-bold text-white">${movie.title}</div>
        <a href="#" id="watched-${movie.id} "class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
      </div>
    `)
  }
  // ⬆️ ⬆️ ⬆️ 
  // End Step 2

  // Step 3: 
  // - Attach an event listener to each "watched button"
  // - Be sure to prevent the default behavior of the button
  // - When the "watched button" is clicked, changed the opacity
  //   of the entire "movie" by using .classList.add('opacity-20')
  // - When done, refresh the page... does the opacity stick?
  // - Bonus challenge: add code to "un-watch" the movie by
  //   using .classList.contains('opacity-20') to check if 
  //   the movie is watched. Use .classList.remove('opacity-20')
  //   to remove the class if the element already contains it.
  // ⬇️ ⬇️ ⬇️
  let watchedButtons = document.querySelectorAll('.watched-button')
  let watchedCollection = await db.collection('watched').get()
  let watchedDocs = watchedCollection.docs
  console.log(watchedDocs)
  for (i = 0; i < watchedButtons.length; i++) {
    buttonID = watchedButtons[i].parentNode.getAttribute('id')
    // console.log(idStr)
    // let docRef = await db.collection('watched').doc(idStr)
    // opacityFormat = ''
    for (let j = 0; j < watchedDocs.length; j++) {
      movieData = await watchedDocs[j].data()
      // console.log(movieData.watched)
      if (buttonID == movieData.id) {
        // console.log(`matched ${buttonID} to ${movieData.id}`)
        if (movieData.watched == true) {
          // console.log(`Found a watched movie! ${buttonID}`)
          // console.log(watchedButtons[i])
          watchedButtons[i].parentElement.classList.add('opacity-20')
        } else {
          // console.log(`Movie ${buttonID} found, but not watched.`)
        }
      }
    }
      // console.log(idStr)
      // if (movieData.watched == true){
      //   console.log(`Found a watched movie! ${watchedButtons[i].parentNode.getAttribute('id')}`)
      //   watchedButtons[i].parentNode.classList.add('opacity-20')
      // } else {
      //   console.log(`Movie ${watchedButtons[i].parentNode.getAttribute('id')} found, but not watched.`)
      // }
    

    watchedButtons[i].addEventListener('click', async function(event){
      event.preventDefault()
      buttonID = event.target.parentNode.getAttribute('id')

      // let watchedID = event.target.parentNode.id
      // console.log(watchedID)
      if (event.target.parentNode.classList.contains('opacity-20')){
        await db.collection('watched').doc(`${buttonID}`).set({
          watched: false,
          id: buttonID
        })
        event.target.parentNode.classList.remove('opacity-20')
        // console.log(`unwatched ${buttonID}`)
      } else {
        await db.collection('watched').doc(`${buttonID}`).set({
          watched: true,
          id: buttonID
        })
        event.target.parentNode.classList.add('opacity-20')
        // console.log(`watched ${buttonID}`)
      }
    })
  }
  // ⬆️ ⬆️ ⬆️ 
  // End Step 3

  // Step 4: 
  // - Properly configure Firebase and Firebase Cloud Firestore
  // - Inside your "watched button" event listener, you wrote in
  //   step 3, after successfully setting opacity, persist data
  //   for movies watched to Firebase.
  // - The data could be stored in a variety of ways, but the 
  //   easiest approach would be to use the TMDB movie ID as the
  //   document ID in a "watched" Firestore collection.
  // - Hint: you can use .set({}) to create a document with
  //   no data – in this case, the document doesn't need any data;
  //   if a TMDB movie ID is in the "watched" collection, the 
  //   movie has been watched, otherwise it hasn't.
  // - Modify the code you wrote in Step 2 to conditionally
  //   make the movie opaque if it's already watched in the 
  //   database.
  // - Hint: you can use if (document) with no comparison
  //   operator to test for the existence of an object.
})