// GLOBAL VARIABLES
let searchButton = document.querySelector("#search-button");
let searchInput = document.querySelector("#search-input");
let movieResults = document.querySelector("#movie-results");
let singleMovie = document.querySelector("#single-movie");
let bookMarkEl = document.querySelector("#add-bookmark");

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
      singleMovie.innerHTML += `<h1>${data.Title}</h1>`;
      singleMovie.innerHTML += `<img class="object-center border" src="${data.Poster}"></img>`;
      singleMovie.innerHTML += `<div>${data.Plot}</div>`;
      singleMovie.innerHTML += `<div> Rating: ${data.Rated}</div>`;
      for (let i = 0; i < data.Ratings.length; i++) {
        singleMovie.innerHTML += `<div>${data.Ratings[i].Source}: ${data.Ratings[i].Value}</div>`;
      }
      bookMarkEl.setAttribute("movieTitle", data.Title);
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
  let savedMarkMovie = this.getAttribute("movieTitle");
  let moviesObject = {
    movie: savedMarkMovie,
    img: 
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
