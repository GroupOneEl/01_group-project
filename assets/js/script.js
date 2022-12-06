// GLOBAL VARIABLES
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
      singleMovie.innerHTML += `<h2 class="headings pt-5 my-3"> SUMMARY </h2>`;
      singleMovie.innerHTML += `<div class="text-lg">${data.Plot}</div>`;
      singleMovie.innerHTML += `<h2 class="headings my-3"> RATING </h2>`;
      singleMovie.innerHTML += `<div class="text-lg"> ${data.Rated}</div>`;
      singleMovie.innerHTML += `<h2 class="headings my-3"> REVIEWS </h2>`;
      singleMovie.innerHTML += `<div class="text-lg">${data.Ratings[0].Source}: ${data.Ratings[0].Value.slice(0, 1) >= 5 ? data.Ratings[0].Value + " 🍎" : data.Ratings[0].Value + " 🤮"}</div>`;
      for (let i = 1; i < data.Ratings.length; i++) {
        singleMovie.innerHTML += `<div class="text-lg">${data.Ratings[i].Source}: ${data.Ratings[i].Value.slice(0, 2) >= 50 ? data.Ratings[i].Value + " 🍎" : data.Ratings[i].Value + " 🤮"}</div>`;
      }

      bookMarkEl.setAttribute("movieTitle", data.Title);
      bookMarkEl.setAttribute("moviePoster", data.Poster);
      bookMarkEl.setAttribute("movieID", data.imdbID);
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
      if (data.Search === undefined) {
        singlePoster.innerHTML += `<h1 class="movie-header mt-20">NO MOVIES FOUND!</h1>`;
        singlePoster.innerHTML += `<h1 class="movie-header">PLEASE SEARCH AGAIN</h1>`;
      } else {
        data.Search.forEach((movie) => {
          let childDiv = document.createElement("div");
          childDiv.style.border = "1px solid white";
          childDiv.style.background = "rgba(254, 254, 254, 0.3)";
          childDiv.style.margin = "5px";
          childDiv.classList.add("sm:w-3/4", "lg:w-1/6");
          childDiv.innerHTML += `<a href="index.html?i=${movie.imdbID}"><div class="movie-header">${movie.Title}</div></a>`;
          childDiv.innerHTML += `<a href="index.html?i=${movie.imdbID}"><img class="object-center" src="${movie.Poster}" height="175" width="175"></a>`;
          movieResults.append(childDiv);
        });
      }
    });
}

function handleHomeBtn() {
  singleMovie.innerHTML = "";
  singlePoster.innerHTML = "";
  movieResults.innerHTML = "";
  bookMarkEl.classList.add("hidden");
  shareBtnEl.classList.add("hidden");
}

function handleShowBookMark() {
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
    childDiv.classList.add("sm:w-full", "lg:w-1/5");
    childDiv.innerHTML += `<a href="index.html?i=${movie.id}"><div class="movie-header">${movie.movie}</div></a>`;
    childDiv.innerHTML += `<a href="index.html?i=${movie.id}"><img class="object-center" src="${movie.poster}" height="175" width="175"></a>`;
    movieResults.append(childDiv);
  });
}

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

  function isMovieDuplicate(movie) {
    for (let i = 0; i < moviesArray.length; i++) {
      if (moviesArray[i].id === movie.id) {
        return true;
      }
    }
    return false;
  }

  function removeMovie(movie) {
    for (let i = 0; i < moviesArray.length; i++) {
      if (moviesArray[i].id === movie.id) {
        let index = moviesArray.indexOf(moviesArray[i]);
        moviesArray.splice(index, 1);
        localStorage.setItem("bookmarks", JSON.stringify(moviesArray));
      }
    }
  }

  if (isMovieDuplicate(moviesObject)) {
    removeMovie(moviesObject);
  } else {
    moviesArray.push(moviesObject);
    localStorage.setItem("bookmarks", JSON.stringify(moviesArray));
  }
}

function copy() {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => {
      alert(`Saved to clipboard successfully`);
    })
    .catch((err) => {
      alert(`Error while saving to clipboard, ${err}`);
    });
}

// EVENT LISTENERS
searchButton.addEventListener("click", handleSearchButton);

bookMarkEl.addEventListener("click", saveBookmark);

showBookMark.addEventListener("click", handleShowBookMark);

homeBtnEl.addEventListener("click", handleHomeBtn);

shareBtnEl.addEventListener("click", copy);

homeShareBtnEl.addEventListener("click", copy);

init();
