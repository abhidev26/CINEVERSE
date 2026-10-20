
/* CINEVERSE — COMMIT 18
   Personalized Movie Recommendations
*/

(() => {
  "use strict";

  const SECTION_ID = "personalizedSection";

  function getMovieDatabase() {
    try {
      if (typeof MOVIES !== "undefined" && Array.isArray(MOVIES)) {
        return MOVIES;
      }
    } catch (error) {
      console.warn("Movie database unavailable:", error);
    }

    return [];
  }

  function getGenres(movie) {
    const value = movie.genres || movie.genre || [];
    const genres = Array.isArray(value) ? value : [value];

    return genres
      .filter(Boolean)
      .map(genre => String(genre).toLowerCase().trim());
  }

  function getTitle(movie) {
    return String(movie.title || movie.name || "");
  }

  function getMovieId(movie) {
    return String(movie.id ?? movie.movieId ?? "");
  }

  function readSavedMovieIds() {
    const savedIds = new Set();
    const savedTitles = new Set();

    // Read likely watchlist and viewing-history storage entries.
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!key || !/(watchlist|history|continue|watched)/i.test(key)) {
        continue;
      }

      try {
        const data = JSON.parse(localStorage.getItem(key) || "null");

        function collect(value) {
          if (!value) return;

          if (Array.isArray(value)) {
            value.forEach(collect);
            return;
          }

          if (typeof value === "object") {
            const id = value.id ?? value.movieId;
            const title = value.title ?? value.name;

            if (id !== undefined && id !== null) {
              savedIds.add(String(id));
            }

            if (typeof title === "string") {
              savedTitles.add(title.trim().toLowerCase());
            }

            Object.entries(value).forEach(([property, child]) => {
              if (
                /movie|watch|history|continue|item|saved/i.test(property) &&
                child && typeof child === "object"
              ) {
                collect(child);
              }
            });

            return;
          }

          if (typeof value === "string") {
            savedTitles.add(value.trim().toLowerCase());
          }
        }

        collect(data);
      } catch {
        // Ignore unrelated or non-JSON storage values.
      }
    }

    return { savedIds, savedTitles };
  }

  function getPreferenceGenres(movies) {
    const genreScores = new Map();
    const { savedIds, savedTitles } = readSavedMovieIds();

    movies.forEach(movie => {
      const title = getTitle(movie).toLowerCase();
      const id = getMovieId(movie);

      const isSaved =
        savedIds.has(id) ||
        (title && savedTitles.has(title));

      if (!isSaved) return;

      getGenres(movie).forEach(genre => {
        genreScores.set(
          genre,
          (genreScores.get(genre) || 0) + 1
        );
      });
    });

    return genreScores;
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  }

  function getImage(movie) {
    return movie.poster ||
      movie.posterUrl ||
      movie.image ||
      movie.imageUrl ||
      movie.backdrop ||
      movie.thumbnail ||
      "";
  }

  function calculateRecommendations() {
    const movies = getMovieDatabase();
    const preferences = getPreferenceGenres(movies);
    const { savedIds, savedTitles } = readSavedMovieIds();

    const ranked = movies
      .filter(movie => {
        const id = getMovieId(movie);
        const title = getTitle(movie).toLowerCase();

        return (
          title &&
          !savedIds.has(id) &&
          !savedTitles.has(title)
        );
      })
      .map(movie => {
        const genres = getGenres(movie);

        const score = genres.reduce(
          (total, genre) => total + (preferences.get(genre) || 0),
          0
        );

        return { movie, score };
      })
      .sort((a, b) => b.score - a.score);

    // If the user has no saved preferences, show a varied selection.
    const hasPreferences = preferences.size > 0;

    return ranked
      .filter(item => !hasPreferences || item.score > 0)
      .slice(0, 6)
      .map(item => item.movie);
  }

  function renderRecommendations() {
    const discover = document.getElementById("discover");
    const movieGrid = document.getElementById("movieGrid");

    if (!discover || !movieGrid) return;

    let section = document.getElementById(SECTION_ID);

    if (!section) {
      section = document.createElement("section");
      section.id = SECTION_ID;
      section.className = "personalized-section";

      movieGrid.parentElement.insertBefore(section, movieGrid);
    }

    const recommendations = calculateRecommendations();

    section.innerHTML = `
      <div class="personalized-header">
        <div>
          <p class="eyebrow">YOUR CINEMATIC WORLD</p>
          <h2>Picked for <span>You</span></h2>
          <p class="personalized-description">
            Movies selected from your saved genres and viewing activity.
          </p>
        </div>

        <button type="button" class="recommend-refresh" id="refreshRecommendations">
          ↻ Refresh
        </button>
      </div>

      <div class="personalized-grid">
        ${
          recommendations.length
            ? recommendations.map(movie => {
                const id = escapeHTML(getMovieId(movie));
                const title = escapeHTML(getTitle(movie));
                const image = escapeHTML(getImage(movie));
                const genres = getGenres(movie)
                  .map(genre => genre.charAt(0).toUpperCase() + genre.slice(1))
                  .join(" · ");

                return `
                  <article class="personalized-card">
                    ${
                      image
                        ? `<img src="${image}" alt="${title}" loading="lazy">`
                        : `<div class="personalized-no-image">🎬</div>`
                    }
                    <div class="personalized-card-info">
                      <h3>${title}</h3>
                      <p>${escapeHTML(genres || "Discover something new")}</p>
                      <button
                        type="button"
                        class="personalized-open"
                        data-personalized-id="${id}"
                      >View movie ↗</button>
                    </div>
                  </article>
                `;
              }).join("")
            : `<div class="personalized-empty">
                 <h3>More movies to discover</h3>
                 <p>
                   Save movies to your watchlist or viewing history to help
                   personalize your recommendations.
                 </p>
               </div>`
        }
      </div>
    `;

    document.getElementById("refreshRecommendations")
      ?.addEventListener("click", renderRecommendations);

    section.querySelectorAll("[data-personalized-id]").forEach(button => {
      button.addEventListener("click", () => {
        const id = button.dataset.personalizedId;
        const movie = getMovieDatabase().find(
          item => getMovieId(item) === String(id)
        );

        if (!movie) return;

        // Integrate with the existing movie-details function.
        if (typeof showDetails === "function") {
          showDetails(movie.id);
        } else {
          console.warn(
            "Connect showDetails(movie.id) to your existing details modal."
          );
        }
      });
    });
  }

  function init() {
    renderRecommendations();

    // Re-render when the user changes watchlist/history storage.
    window.addEventListener("storage", renderRecommendations);

    // Other scripts can refresh recommendations after saving a movie.
    window.addEventListener("cineverse:refresh-recommendations", renderRecommendations);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
