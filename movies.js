
window.addEventListener('DOMContentLoaded', async function(event) {
  // Step 1:
  // ⬇️ ⬇️ ⬇️
  // TMDB access
  let apiKey = '624b46c7d7c5ca830efc8c74b1303c74'
  let nowPlayingURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`
  let movieQuerySnapshot = await fetch(nowPlayingURL)
  let queryJson = await movieQuerySnapshot.json()
  let movieArray = queryJson.results

  // Firebase access
  let db = firebase.firestore()
  let watchedCollection = await db.collection('watched').get()
  let watchedDocs = watchedCollection.docs
  // console.log(watchedDocs)
  // ⬆️ ⬆️ ⬆️ 
  // End Step 1
  
  // Step 2: 
  // ⬇️ ⬇️ ⬇️
  let idStr = ''
  let moviesElement = document.querySelector('.movies')
  for (let i = 0; i < movieArray.length; i++){
    let movie = movieArray[i]
    constructingMovieID = movie.id
    moviesElement.insertAdjacentHTML('beforeend', `
      <div id="${movie.id}" class="w-1/4 p-4 movie-${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path}" class="w-full">
        <div class="title bg-auto font-bold text-white">${movie.title}</div>
        <a href="#" id="watched-${movie.id}" class="watched-button block text-center text-white bg-green-500 mt-4 mb-2 px-4 py-2 rounded">Saw it!</a>
      </div>
    `)
    let movieButton = document.querySelector(`#watched-${movie.id}`)
    for (let j = 0; j < watchedDocs.length; j++) {
      movieData = watchedDocs[j].data()
      if (constructingMovieID == movieData.id) {
        movieButton.parentElement.classList.add('opacity-20')
      }
    }
    movieButton.addEventListener('click', async function(event){
      event.preventDefault()
      watchedToggleID = event.target.parentNode.getAttribute('id')
      if (event.target.parentNode.classList.contains('opacity-20')){
        await db.collection('watched').doc(`${watchedToggleID}`).delete()
        event.target.parentNode.classList.remove('opacity-20')
      } else {
        await db.collection('watched').doc(`${watchedToggleID}`).set({
          watched: true,
          id: watchedToggleID
        })
        event.target.parentNode.classList.add('opacity-20')
      }
    })
  }
})