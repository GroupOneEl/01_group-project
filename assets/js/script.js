// GLOBAL VARIABLES
let searchButton = document.querySelector("#search-button");
let movieResults = document.querySelector("#movie-results");
let singleMovie = document.querySelector("#single-movie");
// FUNCTIONS

function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieID = urlParams.get("i") || "";
  if (movieID === "") {
    return;
  }
  fetch(`http://www.omdbapi.com/?i=${movieID}&apikey=38367836`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      singleMovie.innerHTML += `<div>${data.Plot}</div>`;
      singleMovie.innerHTML += `<img src="${data.Poster}"></img>`;
    });
}
function handleSearchButton() {
  fetch("https://www.omdbapi.com/?apikey=f14ca85d&s=batman")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data.Search.forEach((movie) => {
        movieResults.innerHTML += `<a href="index.html?i=${movie.imdbID}">${movie.Title}</a>`;
        singleMovie.innerHTML += `<img src="${movie.Poster}"></img>`;
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
