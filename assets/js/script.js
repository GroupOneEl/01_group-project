let searchButton = document.querySelector("#search-button");
let searchInput = document.querySelector("#search-input");
let movieResults = document.querySelector("#movie-results");
let singleMovie = document.querySelector("#single-movie");
let singlePoster = document.querySelector("#single-poster");
let bookMarkEl = document.querySelector("#add-bookmark");
let showBookMark = document.querySelector("#show-bookmark");
let homeBtnEl = document.querySelector("#home-button");
let shareBtnEl = document.querySelector("#share-btn");
let homeShareBtnEl = document.querySelector("#home-share-btn");
let homeMessage = document.querySelector("#home-message");

let moviesArray = JSON.parse(localStorage.getItem("bookmarks")) || [];
// The initial function we want to run on the start of the page
function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieID = urlParams.get("i") || "";

  for (let i = 0; i < moviesArray.length; i++) {
    if (movieID === moviesArray[i].id) {
      bookMarkEl.classList.add("text-amber-500");
    }
  }

  if (movieID === "") {
    return;
  }
  fetch(`http://www.omdbapi.com/?i=${movieID}&apikey=f14ca85d`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      homeMessage.classList.add("hidden");
      bookMarkEl.classList.remove("hidden");
      shareBtnEl.classList.remove("hidden");
      singlePoster.innerHTML += `<h1 class="movie-header">${data.Title}</h1>`;
      singlePoster.innerHTML += `<img class="object-center border" src="${data.Poster}"></img>`;
      singleMovie.innerHTML += `<h2 class="headings pt-5 my-3"> SUMMARY </h2>`;
      singleMovie.innerHTML += `<div class="text-lg">${data.Plot}</div>`;
      singleMovie.innerHTML += `<h2 class="headings pt-5 my-3"> ACTORS </h2>`;
      singleMovie.innerHTML += `<div class="text-lg">${data.Actors}</div>`;
      singleMovie.innerHTML += `<h2 class="headings my-3"> RATING </h2>`;
      singleMovie.innerHTML += `<div class="text-lg"> ${data.Rated}</div>`;
      singleMovie.innerHTML += `<h2 class="headings my-3"> REVIEWS </h2>`;
      singleMovie.innerHTML += `<div class="text-lg">${data.Ratings[0].Source}: ${data.Ratings[0].Value.slice(0, 1) >= 5 ? data.Ratings[0].Value + " ????" : data.Ratings[0].Value + " ????"}</div>`;
      for (let i = 1; i < data.Ratings.length; i++) {
        singleMovie.innerHTML += `<div class="text-lg">${data.Ratings[i].Source}: ${data.Ratings[i].Value.slice(0, 2) >= 50 ? data.Ratings[i].Value + " ????" : data.Ratings[i].Value + " ????"}</div>`;
      }

      bookMarkEl.setAttribute("movieTitle", data.Title);
      bookMarkEl.setAttribute("moviePoster", data.Poster);
      bookMarkEl.setAttribute("movieID", data.imdbID);
    });
}
// Fetches movies and displays them on search
function handleSearchButton() {
  singleMovie.innerHTML = "";
  singlePoster.innerHTML = "";
  movieResults.innerHTML = "";
  fetch(`https://www.omdbapi.com/?apikey=f14ca85d&s=${searchInput.value}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      homeMessage.classList.add("hidden");
      bookMarkEl.classList.add("hidden");
      shareBtnEl.classList.add("hidden");
      if (data.Search === undefined) {
        singlePoster.innerHTML += `<h1 class="movie-header mt-20">NO MOVIES FOUND!</h1>`;
        singlePoster.innerHTML += `<h1 class="movie-header">PLEASE SEARCH AGAIN</h1>`;
      } else {
        data.Search.forEach((movie) => {
          let childDiv = document.createElement("div");
          childDiv.style.border = "1px solid white";
          childDiv.style.background = "rgba(254, 254, 254, 0.3)";
          childDiv.style.margin = "5px";
          childDiv.classList.add("sm:w-3/4", "lg:w-1/6", "movie-selection");
          childDiv.innerHTML += `<a href="index.html?i=${movie.imdbID}"><div class="movie-search-header">${movie.Title}</div></a>`;
          childDiv.innerHTML += `<a href="index.html?i=${movie.imdbID}"><img class="object-center" src="${movie.Poster}" height="175" width="175"></a>`;
          movieResults.append(childDiv);
        });
      }
    });
}
// Shows the home text and removes any movie or buttons from screen
function handleHomeBtn() {
  homeMessage.classList.remove("hidden");
  singleMovie.innerHTML = "";
  singlePoster.innerHTML = "";
  movieResults.innerHTML = "";
  bookMarkEl.classList.add("hidden");
  shareBtnEl.classList.add("hidden");
}
// Shows all the movies you have bookmarked so far
function handleShowBookMark() {
  homeMessage.classList.add("hidden");
  singleMovie.innerHTML = "";
  singlePoster.innerHTML = "";
  movieResults.innerHTML = "";
  bookMarkEl.classList.add("hidden");
  shareBtnEl.classList.add("hidden");
  moviesArray.forEach((movie) => {
    let childDiv = document.createElement("div");
    childDiv.style.border = "1px solid white";
    childDiv.style.background = "rgba(254, 254, 254, 0.3)";
    childDiv.style.margin = "5px";
    childDiv.classList.add("sm:w-3/4", "lg:w-1/6", "movie-selection");
    childDiv.innerHTML += `<a href="index.html?i=${movie.id}"><div class="movie-search-header">${movie.movie}</div></a>`;
    childDiv.innerHTML += `<a href="index.html?i=${movie.id}"><img class="object-center" src="${movie.poster}" height="175" width="175"></a>`;
    movieResults.append(childDiv);
  });
}
// Stores the movie into local storage as an object
function saveBookmark() {
  bookMarkEl.classList.toggle("text-amber-500");
  let savedMovie = this.getAttribute("movieTitle");
  let savedPoster = this.getAttribute("moviePoster");
  let savedID = this.getAttribute("movieID");
  let moviesObject = {
    movie: savedMovie,
    poster: savedPoster,
    id: savedID,
  };
  // Checks if the movie ID is already in local storage
  function isMovieDuplicate(movie) {
    for (let i = 0; i < moviesArray.length; i++) {
      if (moviesArray[i].id === movie.id) {
        return true;
      }
    }
    return false;
  }
  // Removes the movie if the ID is the same
  function removeMovie(movie) {
    for (let i = 0; i < moviesArray.length; i++) {
      if (moviesArray[i].id === movie.id) {
        let index = moviesArray.indexOf(moviesArray[i]);
        moviesArray.splice(index, 1);
        localStorage.setItem("bookmarks", JSON.stringify(moviesArray));
      }
    }
  }
  // Checks if the movies is a duplicate, if so, it will remove the movie, else it will add it to local storage
  if (isMovieDuplicate(moviesObject)) {
    removeMovie(moviesObject);
  } else {
    moviesArray.push(moviesObject);
    localStorage.setItem("bookmarks", JSON.stringify(moviesArray));
  }
}
// Show a toast when clicking on the share button
function toastPopUp() {
  let snackbar = document.getElementById("snackbar");
  snackbar.className = "show";
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}
// Copy the url to the clipboard
function copy() {
  navigator.clipboard.writeText(window.location.href);
}

searchButton.addEventListener("click", handleSearchButton);

bookMarkEl.addEventListener("click", saveBookmark);

showBookMark.addEventListener("click", handleShowBookMark);

homeBtnEl.addEventListener("click", handleHomeBtn);

shareBtnEl.addEventListener("click", copy);

homeShareBtnEl.addEventListener("click", copy);

init();
