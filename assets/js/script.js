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
      singleMovie.innerHTML += `<h2 class="headings"> SUMMARY </h2>`;
      singleMovie.innerHTML += `<div>${data.Plot}</div>`;
      singleMovie.innerHTML += `<h2 class="headings"> RATING </h2>`;
      singleMovie.innerHTML += `<div> ${data.Rated}</div>`;
      singleMovie.innerHTML += `<h2 class="headings"> REVIEWS </h2>`;
      singleMovie.innerHTML += `<div>${data.Ratings[0].Source}: ${data.Ratings[0].Value.slice(0, 1) >= 5 ? data.Ratings[0].Value + " 🍎" : data.Ratings[0].Value + " 🤮"}</div>`;
      for (let i = 1; i < data.Ratings.length; i++) {
        singleMovie.innerHTML += `<div>${data.Ratings[i].Source}: ${data.Ratings[i].Value.slice(0, 2) >= 50 ? data.Ratings[i].Value + " 🍎" : data.Ratings[i].Value + " 🤮"}</div>`;
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
        let movieDiv = document.createElement("div");
        movieDiv.style.display = "flex";
        let movieDiv2 = document.createElement("div");
        movieDiv2.style.display = "flex";
        data.Search.forEach((movie, index) => {
          let childDiv1 = document.createElement("div");
          childDiv1.style.border = "0.5px solid white";
          childDiv1.style.background = "rgba(254, 254, 254, 0.3)";
          childDiv1.style.margin = "5px";
          childDiv1.style.width = "19%";
          if (index < 5) {
            childDiv1.innerHTML += `<a class="movie-header" href="index.html?i=${movie.imdbID}">${movie.Title}</a>`;
            childDiv1.innerHTML += `<a href="index.html?i=${movie.imdbID}"><img class="object-center" src="${movie.Poster}" height="150px" width="150px"></a>`;
            movieDiv.append(childDiv1);
          } else {
            childDiv1.innerHTML += `<a class="movie-header" href="index.html?i=${movie.imdbID}">${movie.Title}</a>`;
            childDiv1.innerHTML += `<a href="index.html?i=${movie.imdbID}"><img class="object-center" src="${movie.Poster}" height="150px" width="150px"></a>`;
            movieDiv2.append(childDiv1);
          }
        });
        movieResults.append(movieDiv, movieDiv2);
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

  let movieDivTop = document.createElement("div");
  movieDivTop.style.display = "flex";
  let movieDivBottom = document.createElement("div");
  movieDivBottom.style.display = "flex";
  moviesArray.forEach((movie, index) => {
    let childDiv = document.createElement("div");
    childDiv.style.border = "1px solid white";
    childDiv.style.background = "rgba(254, 254, 254, 0.3)";
    childDiv.style.margin = "5px";
    childDiv.style.width = "19%";
    if (index < 5) {
      childDiv.innerHTML += `<a href="index.html?i=${movie.id}"><div class="movie-header">${movie.movie}</div></a>`;
      childDiv.innerHTML += `<a href="index.html?i=${movie.id}"><img class="object-center" src="${movie.poster}" height="175" width="175"></a>`;
      movieDivTop.append(childDiv);
    } else {
      childDiv.innerHTML += `<a href="index.html?i=${movie.id}"><div class="movie-header">${movie.movie}</div></a>`;
      childDiv.innerHTML += `<a href="index.html?i=${movie.id}"><img class="object-center" src="${movie.poster}" height="175" width="175"></a>`;
      movieDivBottom.append(childDiv);
    }
  });
  movieResults.append(movieDivTop, movieDivBottom);
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
  moviesArray.push(moviesObject);
  localStorage.setItem("bookmarks", JSON.stringify(moviesArray));
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
