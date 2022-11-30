// GLOBAL VARIABLES
let searchButton = document.querySelector("#search-button");
let searchInput = document.querySelector("#search-input");
let movieResults = document.querySelector("#movie-results");
let singleMovie = document.querySelector("#single-movie");
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
      singleMovie.innerHTML += `<img class="object-center poster-resize" src="${data.Poster}"></img>`;
      singleMovie.innerHTML += `<div>${data.Plot}</div>`;
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
      data.Search.forEach((movie) => {
        movieResults.innerHTML += `<a href="index.html?i=${movie.imdbID}">${movie.Title}</a>`;
        movieResults.innerHTML += `<a href="index.html?i=${movie.imdbID}"><img class="object-center" src="${movie.Poster}"></a>`;
      });
    });
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

init();
