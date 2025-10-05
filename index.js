const parentElement = document.querySelector(".main");
const seachInput = document.querySelector("#search-input");
const movieRatings = document.querySelector("#rating-select");
const movieGenres = document.querySelector("#genre-select");
const searchBtn = document.querySelector("#search-btn");

let searchValue = "";
let ratings = 0;
let genre = "";

const URL = "your API KEY";

const getMovies = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (err) {
    console.error("Error fetching movies:", err);
  }
};

let movies = await getMovies(URL);

const createElement = (element) => document.createElement(element);

const createMovieCard = (movies) => {
  parentElement.innerHTML = "";
  if (!movies.length) {
    parentElement.innerHTML = `<p style="color:white; font-size:1.2rem;">No results found 😔</p>`;
    return;
  }
  for (let movie of movies) {
    const cardContainer = createElement("div");
    cardContainer.classList.add("card");

    const imageContainer = createElement("div");
    imageContainer.classList.add("card-image-container");

    const imageEle = createElement("img");
    imageEle.classList.add("card-image");
    imageEle.setAttribute("src", movie.img_link);
    imageEle.setAttribute("alt", movie.name);
    imageContainer.appendChild(imageEle);

    const cardDetails = createElement("div");
    cardDetails.classList.add("movie-details");

    const titleEle = createElement("p");
    titleEle.classList.add("title");
    titleEle.innerText = movie.name;
    cardDetails.appendChild(titleEle);

    const genreEle = createElement("p");
    genreEle.classList.add("genre");
    genreEle.innerText = `Genre: ${movie.genre}`;
    cardDetails.appendChild(genreEle);

    const movieRating = createElement("div");
    movieRating.classList.add("ratings");

    const starDiv = createElement("div");
    starDiv.classList.add("star-rating");

    const starIcon = createElement("span");
    starIcon.classList.add("material-icons-outlined");
    starIcon.innerText = "star";

    const ratingValue = createElement("span");
    ratingValue.innerText = movie.imdb_rating;

    starDiv.append(starIcon, ratingValue);
    movieRating.append(starDiv);

    const length = createElement("p");
    length.innerText = `${movie.duration} mins`;
    movieRating.append(length);

    cardDetails.append(movieRating);
    cardContainer.append(imageContainer, cardDetails);
    parentElement.append(cardContainer);
  }
};

function getFilteredData() {
  let filteredArrOfMovies =
    searchValue?.length > 0
      ? movies.filter(
          (movie) =>
            movie.name.toLowerCase().includes(searchValue) ||
            movie.director_name.toLowerCase().includes(searchValue) ||
            movie.writter_name.toLowerCase().includes(searchValue) ||
            movie.cast_name.toLowerCase().includes(searchValue)
        )
      : movies;

  if (ratings > 0) {
    filteredArrOfMovies = filteredArrOfMovies.filter(
      (movie) => movie.imdb_rating >= ratings
    );
  }

  if (genre?.length > 0) {
    filteredArrOfMovies = filteredArrOfMovies.filter((movie) =>
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  return filteredArrOfMovies;
}

function handleSearch() {
  searchValue = seachInput.value.toLowerCase();
  ratings = movieRatings.value;
  genre = movieGenres.value;

  let filteredMovies = getFilteredData();
  createMovieCard(filteredMovies);
}

seachInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});

searchBtn.addEventListener("click", handleSearch);

movieRatings.addEventListener("change", () => {
  ratings = movieRatings.value;
  handleSearch();
});

movieGenres.addEventListener("change", () => {
  genre = movieGenres.value;
  handleSearch();
});

createMovieCard(movies);
