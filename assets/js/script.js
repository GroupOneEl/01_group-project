// GLOBAL VARIABLES
let searchButton = document.querySelector("#search-button");
let searchInput = document.querySelector("#search-input");
let movieResults = document.querySelector("#movie-results");
let singleMovie = document.querySelector("#single-movie");
let bookMarkEl = document.querySelector("#add-bookmark");
let addBookMark = document.querySelector("#add-bookmark");
let moviesArray = JSON.parse(localStorage.getItem("bookmarks")) || [];
// FUNCTIONS

function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieID = urlParams.get("i") || "";
  if (movieID === "") {
    return;
  }
  fetch(`http://www.omdbapi.com/?i=${movieID}&apikey=f14ca85d`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      addBookMark.classList.remove("hidden");
      singleMovie.innerHTML += `<h1 class="movie-header">${data.Title}</h1>`;
      singleMovie.innerHTML += `<img class="object-center border" src="${data.Poster}"></img>`;
      singleMovie.innerHTML += `<h2 class="headings background"> SUMMARY </h2>`;
      singleMovie.innerHTML += `<div class="background">${data.Plot}</div>`;
      singleMovie.innerHTML += `<h2 class="headings background"> RATING </h2>`;
      singleMovie.innerHTML += `<div class="background"> ${data.Rated}</div>`;
      singleMovie.innerHTML += `<h2 class="headings background"> REVIEWS </h2>`;
      for (let i = 0; i < data.Ratings.length; i++) {
        singleMovie.innerHTML += `<div class="background">${data.Ratings[i].Source}: ${data.Ratings[i].Value}</div>`;
      }
      bookMarkEl.setAttribute("movieTitle", data.Title);
      bookMarkEl.setAttribute("moviePoster", data.Poster);
    });
}
function handleSearchButton() {
  singleMovie.innerHTML = "";
  movieResults.innerHTML = "";
  fetch(`https://www.omdbapi.com/?apikey=f14ca85d&s=${searchInput.value}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // message for no movie found
      data.Search.forEach((movie) => {
        movieResults.innerHTML += `<a href="index.html?i=${movie.imdbID}">${movie.Title}</a>`;
        movieResults.innerHTML += `<a href="index.html?i=${movie.imdbID}"><img class="object-center" src="${movie.Poster}"></a>`;
      });
    });
}
function saveBookmark() {
  let savedMovie = this.getAttribute("movieTitle");
  let savedPoster = this.getAttribute("movieTitle");
  let moviesObject = {
    movie: savedMovie,
    poster: savedPoster,
  };
  moviesArray.push(moviesObject);
  localStorage.setItem("bookmarks", JSON.stringify(moviesArray));
}
// handle formSubmit
// fetch https://www.omdbapi.com/?apikey=f14ca85d&s=batman
// For each movie, innerhtml += movie-results
// Create a link for each search results
// <a href= "index.html?i=tt";

// EVENT LISTENERS
// init function
// check the url to see if it contains the i query string
// call another fetch http://www.omdbapi.com/?i=tt0372784&apikey=38367836
// For each movie, innerhtml += movie-results
// User clicks on the search button
searchButton.addEventListener("click", handleSearchButton);

bookMarkEl.addEventListener("click", saveBookmark);

init();
