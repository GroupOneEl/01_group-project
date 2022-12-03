// GLOBAL VARIABLES
let searchButton = document.querySelector("#search-button");
let searchInput = document.querySelector("#search-input");
let movieResults = document.querySelector("#movie-results");
let singleMovie = document.querySelector("#single-movie");
let singlePoster = document.querySelector("#single-poster");
let bookMarkEl = document.querySelector("#add-bookmark");
let showBookMark = document.querySelector("#show-bookmark");
let shareBtnEl = document.querySelector("#share-btn");
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
      bookMarkEl.classList.remove("hidden");
      shareBtnEl.classList.remove("hidden");
      singlePoster.innerHTML += `<h1 class="movie-header">${data.Title}</h1>`;
      singlePoster.innerHTML += `<img class="object-center border" src="${data.Poster}"></img>`;
      singleMovie.innerHTML += `<h2 class="headings"> SUMMARY </h2>`;
      singleMovie.innerHTML += `<div>${data.Plot}</div>`;
      singleMovie.innerHTML += `<h2 class="headings"> RATING </h2>`;
      singleMovie.innerHTML += `<div> ${data.Rated}</div>`;
      singleMovie.innerHTML += `<h2 class="headings"> REVIEWS </h2>`;
      for (let i = 0; i < data.Ratings.length; i++) {
        singleMovie.innerHTML += `<div>${data.Ratings[i].Source}: ${data.Ratings[i].Value}</div>`;
      }

      bookMarkEl.setAttribute("movieTitle", data.Title);
      bookMarkEl.setAttribute("moviePoster", data.Poster);
    });
}
function handleSearchButton() {
  singleMovie.innerHTML = "";
  singlePoster.innerHTML = "";
  movieResults.innerHTML = "";
  fetch(`https://www.omdbapi.com/?apikey=f14ca85d&s=${searchInput.value}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      bookMarkEl.classList.add("hidden");
      shareBtnEl.classList.add("hidden");
      // message for no movie found
      data.Search.forEach((movie) => {
        movieResults.innerHTML += `<a href="index.html?i=${movie.imdbID}">${movie.Title}</a>`;
        movieResults.innerHTML += `<a href="index.html?i=${movie.imdbID}"><img class="object-center" src="${movie.Poster}"></a>`;
      });
    });
}

function handleShowBookMark() {
  singleMovie.innerHTML = "";
  singlePoster.innerHTML = "";
  movieResults.innerHTML = "";
  bookMarkEl.classList.add("hidden");
  shareBtnEl.classList.add("hidden");

  moviesArray.forEach((object) => {
    singlePoster.innerHTML += object.movie;
    singlePoster.innerHTML += `<img class="object-center" src="${object.poster}"></img>`;
  });
}
function saveBookmark() {
  let savedMovie = this.getAttribute("movieTitle");
  let savedPoster = this.getAttribute("moviePoster");
  let moviesObject = {
    movie: savedMovie,
    poster: savedPoster,
  };
  moviesArray.push(moviesObject);
  localStorage.setItem("bookmarks", JSON.stringify(moviesArray));
}
function copy() {
  let Url = document.createElement("a");
  Url.innerHTML = window.location.href;
  shareBtnEl.innerHTML = `${shareBtnEl.innerHTML}  ${Url.innerHTML}`;
}

// EVENT LISTENERS
searchButton.addEventListener("click", handleSearchButton);

bookMarkEl.addEventListener("click", saveBookmark);

showBookMark.addEventListener("click", handleShowBookMark);

shareBtnEl.addEventListener("click", copy);

init();
