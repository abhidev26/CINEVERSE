
/* CINEVERSE — COMMIT 19
   Advanced Movie Search, Genre Filters & Sorting
*/

(() => {
  "use strict";

  const SECTION_ID = "advancedDiscovery";

  const $ = (selector, root = document) => root.querySelector(selector);

  function getMovies() {
    try {
      return typeof MOVIES !== "undefined" && Array.isArray(MOVIES)
        ? MOVIES
        : [];
    } catch {
      return [];
    }
  }

  function movieTitle(movie) {
    return String(movie.title || movie.name || "Untitled Movie");
  }

  function movieGenres(movie) {
    const value = movie.genres || movie.genre || [];
    return (Array.isArray(value) ? value : [value])
      .filter(Boolean)
      .map(item => String(item).trim())
      .filter(Boolean);
  }

  function movieYear(movie) {
    const value = movie.year || movie.releaseYear || movie.release_date || "";
    const match = String(value).match(/\b(19|20)\d{2}\b/);
    return match ? Number(match[0]) : 0;
  }

  function movieRating(movie) {
    const value = Number(movie.rating ?? movie.vote_average ?? movie.score);
    return Number.isFinite(value) ? value : 0;
  }

  function moviePoster(movie) {
    return movie.poster || movie.posterUrl || movie.image ||
      movie.imageUrl || movie.thumbnail || "";
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function init() {
    const discover = $("#discover");
    const originalGrid = $("#movieGrid");
    if (!discover || !originalGrid) {
      console.warn("CINEVERSE Commit 19: Discover section not found.");
      return;
    }

    if ($("#" + SECTION_ID)) return;

    const section = document.createElement("section");
    section.id = SECTION_ID;
    section.className = "advanced-discovery";

    section.innerHTML = `
      <div class="advanced-heading">
        <div>
          <p class="eyebrow">DISCOVER YOUR NEXT FAVORITE</p>
          <h2>Advanced <span>Discovery</span></h2>
          <p class="advanced-subtitle">
            Search, filter and sort your movie collection.
          </p>
        </div>
      </div>

      <div class="advanced-controls">
        <label class="advanced-search-box">
          <span aria-hidden="true">⌕</span>
          <input id="advancedSearchInput" type="search"
            placeholder="Search movie titles..." autocomplete="off">
        </label>

        <label class="advanced-control">
          <span>Genre</span>
          <select id="advancedGenre">
            <option value="all">All genres</option>
          </select>
        </label>

        <label class="advanced-control">
          <span>Minimum rating</span>
          <select id="advancedMinRating">
            <option value="0">Any rating</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
            <option value="2">2+ stars</option>
            <option value="1">1+ stars</option>
          </select>
        </label>

        <label class="advanced-control">
          <span>Release year</span>
          <select id="advancedYear">
            <option value="all">All years</option>
          </select>
        </label>

        <label class="advanced-control">
          <span>Sort by</span>
          <select id="advancedSort">
            <option value="recommended">Recommended order</option>
            <option value="rating-desc">Highest rating</option>
            <option value="year-desc">Newest first</option>
            <option value="year-asc">Oldest first</option>
            <option value="title-asc">Title A–Z</option>
            <option value="title-desc">Title Z–A</option>
          </select>
        </label>

        <button id="advancedReset" class="advanced-reset" type="button">
          Reset filters
        </button>
      </div>

      <div class="advanced-results-header">
        <p id="advancedResultsCount" aria-live="polite">Loading movies…</p>
      </div>

      <div id="advancedMovieGrid" class="advanced-movie-grid"></div>

      <div id="advancedNoResults" class="advanced-no-results" hidden>
        <div class="advanced-empty-icon">⌕</div>
        <h3>No movies found</h3>
        <p>Try a different title or adjust your filters.</p>
        <button id="advancedEmptyReset" class="advanced-reset" type="button">
          Clear filters
        </button>
      </div>
    `;

    // Keep the original movie grid intact.
    originalGrid.parentElement.insertBefore(section, originalGrid);

    const movies = getMovies();

    const searchInput = $("#advancedSearchInput", section);
    const genreSelect = $("#advancedGenre", section);
    const ratingSelect = $("#advancedMinRating", section);
    const yearSelect = $("#advancedYear", section);
    const sortSelect = $("#advancedSort", section);
    const resultCount = $("#advancedResultsCount", section);
    const resultsGrid = $("#advancedMovieGrid", section);
    const noResults = $("#advancedNoResults", section);

    const genres = [...new Set(movies.flatMap(movieGenres))]
      .sort((a, b) => a.localeCompare(b));

    genres.forEach(genre => {
      const option = document.createElement("option");
      option.value = genre.toLowerCase();
      option.textContent = genre;
      genreSelect.appendChild(option);
    });

    const years = [...new Set(movies.map(movieYear).filter(Boolean))]
      .sort((a, b) => b - a);

    years.forEach(year => {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = String(year);
      yearSelect.appendChild(option);
    });

    function render() {
      const query = searchInput.value.trim().toLowerCase();
      const selectedGenre = genreSelect.value;
      const minimumRating = Number(ratingSelect.value);
      const selectedYear = yearSelect.value;
      const sort = sortSelect.value;

      let filtered = movies.filter(movie => {
        const title = movieTitle(movie).toLowerCase();
        const genres = movieGenres(movie).map(genre => genre.toLowerCase());
        const year = movieYear(movie);
        const rating = movieRating(movie);

        return (
          title.includes(query) &&
          (selectedGenre === "all" || genres.includes(selectedGenre)) &&
          rating >= minimumRating &&
          (selectedYear === "all" || year === Number(selectedYear))
        );
      });

      switch (sort) {
        case "rating-desc":
          filtered.sort((a, b) => movieRating(b) - movieRating(a));
          break;
        case "year-desc":
          filtered.sort((a, b) => movieYear(b) - movieYear(a));
          break;
        case "year-asc":
          filtered.sort((a, b) => {
            const yearA = movieYear(a) || Infinity;
            const yearB = movieYear(b) || Infinity;
            return yearA - yearB;
          });
          break;
        case "title-asc":
          filtered.sort((a, b) =>
            movieTitle(a).localeCompare(movieTitle(b))
          );
          break;
        case "title-desc":
          filtered.sort((a, b) =>
            movieTitle(b).localeCompare(movieTitle(a))
          );
          break;
      }

      resultCount.textContent =
        `${filtered.length} ${filtered.length === 1 ? "movie" : "movies"} found`;

      resultsGrid.innerHTML = filtered.map(movie => {
        const title = movieTitle(movie);
        const poster = moviePoster(movie);
        const rating = movieRating(movie);
        const year = movieYear(movie);
        const genres = movieGenres(movie).slice(0, 2).join(" · ");
        const id = movie.id;

        return `
          <article class="advanced-movie-card">
            <div class="advanced-poster-wrap">
              ${
                poster
                  ? `<img class="advanced-poster"
                       src="${escapeHTML(poster)}"
                       alt="${escapeHTML(title)}"
                       loading="lazy">`
                  : `<div class="advanced-poster-placeholder">🎬</div>`
              }
              <span class="advanced-rating">★ ${rating ? rating.toFixed(1) : "N/A"}</span>
            </div>

            <div class="advanced-card-content">
              <h3>${escapeHTML(title)}</h3>
              <p class="advanced-card-meta">
                ${year || "Year unavailable"}
                ${genres ? " · " + escapeHTML(genres) : ""}
              </p>
              <button type="button" class="advanced-view-button"
                data-open-movie="${escapeHTML(id ?? "")}">
                View details <span aria-hidden="true">↗</span>
              </button>
            </div>
          </article>
        `;
      }).join("");

      noResults.hidden = filtered.length !== 0;
      resultsGrid.hidden = filtered.length === 0;
    }

    [searchInput, genreSelect, ratingSelect, yearSelect, sortSelect]
      .forEach(control => control.addEventListener("input", render));

    $("#advancedReset", section).addEventListener("click", reset);
    $("#advancedEmptyReset", section).addEventListener("click", reset);

    function reset() {
      searchInput.value = "";
      genreSelect.value = "all";
      ratingSelect.value = "0";
      yearSelect.value = "all";
      sortSelect.value = "recommended";
      render();
    }

    resultsGrid.addEventListener("click", event => {
      const button = event.target.closest("[data-open-movie]");
      if (!button) return;

      const movie = movies.find(item =>
        String(item.id) === button.dataset.openMovie
      );

      if (!movie) return;

      if (typeof showDetails === "function") {
        showDetails(movie.id);
      } else {
        console.warn(
          "CINEVERSE: Existing showDetails(movie.id) function was not found."
        );
      }
    });

    if (movies.length === 0) {
      resultCount.textContent = "Movie data could not be loaded.";
      noResults.hidden = false;
      $(".advanced-no-results h3", section).textContent =
        "Movie collection unavailable";
      $(".advanced-no-results p", section).textContent =
        "Check that your existing script.js loads the MOVIES array.";
      resultsGrid.hidden = true;
      return;
    }

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
