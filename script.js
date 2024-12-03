// DOM Elements
const movieForm = document.getElementById("movieForm");
const movieNameInput = document.getElementById("movieName");
const movieGenreInput = document.getElementById("movieGenre");
const movieRatingInput = document.getElementById("movieRating");
const movieImageInput = document.getElementById("movieImage");
const movieList = document.getElementById("movieList");
const searchMovieInput = document.getElementById("searchMovie");
const deleteLocalStorageBtn = document.getElementById("deleteLocalStorage");

// Movies Array
let movies = JSON.parse(localStorage.getItem("movies")) || [];
let editingMovieId = null; // Track the movie being edited

// Generate Unique ID
function generateUniqueId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

// Render Movies
function renderMovies(filter = "") {
  movieList.innerHTML = ""; // Clear the movie list

  // Filter the movies based on the search input
  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Loop through filtered movies and create cards
  filteredMovies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.className = "col-md-6";

    // Define the card's HTML structure
    movieCard.innerHTML = `
      <div class="card">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${movie.image}" class="img-fluid rounded-start" alt="${movie.name}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${movie.name}</h5>
              <p class="card-text">Genre: ${movie.genre}</p>
              <p class="card-text">Rating: ${movie.rating}/10</p>
              <div class="d-flex justify-content-end">
                <button class="btn btn-warning btn-sm me-2" onclick="editMovie('${movie.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteMovie('${movie.id}')">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Append the card to the movie list
    movieList.appendChild(movieCard);
  });

  // Show message if no movies are found
  if (filteredMovies.length === 0) {
    movieList.innerHTML = `<div class="text-center">No movies found!</div>`;
  }
}

// Add/Edit Movie
movieForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const movieName = movieNameInput.value.trim();
  const movieGenre = movieGenreInput.value.trim();
  const movieRating = parseFloat(movieRatingInput.value);
  const movieImage = movieImageInput.files[0];

  if (!movieName || !movieGenre || isNaN(movieRating) || movieRating < 1 || movieRating > 10 || (editingMovieId === null && !movieImage)) {
    alert("Please provide valid inputs.");
    return;
  }

  if (editingMovieId) {
    // Update existing movie
    const movie = movies.find((m) => m.id === editingMovieId);
    movie.name = movieName;
    movie.genre = movieGenre;
    movie.rating = movieRating;

    if (movieImage) {
      const reader = new FileReader();
      reader.onload = function (e) {
        movie.image = e.target.result;
        saveAndRender();
      };
      reader.readAsDataURL(movieImage);
    } else {
      saveAndRender();
    }

    editingMovieId = null; // Reset editing mode
  } else {
    // Convert image file to Base64 for display
    const reader = new FileReader();
    reader.onload = function (e) {
      const newMovie = {
        id: generateUniqueId(), // Assign a unique ID to the movie
        name: movieName,
        genre: movieGenre,
        rating: movieRating,
        image: e.target.result,
      };

      movies.push(newMovie);
      saveAndRender();
    };
    reader.readAsDataURL(movieImage);
  }

  // Reset form inputs
  movieNameInput.value = "";
  movieGenreInput.value = "";
  movieRatingInput.value = "";
  movieImageInput.value = "";
});

// Edit Movie
function editMovie(id) {
  const movie = movies.find((movie) => movie.id === id);

  if (movie) {
    // Pre-fill form with existing movie details
    movieNameInput.value = movie.name;
    movieGenreInput.value = movie.genre;
    movieRatingInput.value = movie.rating;

    editingMovieId = id; // Set the movie ID being edited
  } else {
    alert("Movie not found!");
  }
}

// Delete Movie
function deleteMovie(id) {
  movies = movies.filter((movie) => movie.id !== id);
  saveAndRender();
}

// Search Movies
searchMovieInput.addEventListener("input", () => {
  renderMovies(searchMovieInput.value);
});

// Delete Local Storage
deleteLocalStorageBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all movies?")) {
    movies = [];
    localStorage.removeItem("movies");
    renderMovies();
  }
});

// Save to localStorage and render
function saveAndRender() {
  localStorage.setItem("movies", JSON.stringify(movies));
  renderMovies();
}

// Initial Render
renderMovies();
