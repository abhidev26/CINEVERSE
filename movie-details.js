
/* ==========================================
   CINEVERSE — COMMIT 20
   Movie Details, Cast & Director Information
========================================== */

(() => {
  "use strict";

  const DETAILS_ID = "detailsContent";
  const SECTION_ID = "cineverseExtraDetails";

  const MOVIE_INFO = {
    "interstellar": {
      year: 2014,
      director: "Christopher Nolan",
      genres: ["Sci-Fi", "Adventure", "Drama"],
      cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
      runtime: "169 min",
      synopsis: "A team of explorers travels beyond this galaxy to discover whether humanity has a future among the stars."
    },
    "inception": {
      year: 2010,
      director: "Christopher Nolan",
      genres: ["Sci-Fi", "Action", "Thriller"],
      cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"],
      runtime: "148 min",
      synopsis: "A skilled thief who enters people's dreams is offered a chance to perform an extraordinary mission."
    },
    "the dark knight": {
      year: 2008,
      director: "Christopher Nolan",
      genres: ["Action", "Crime", "Drama"],
      cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Gary Oldman"],
      runtime: "152 min",
      synopsis: "Batman faces a criminal mastermind who pushes Gotham City into chaos."
    },
    "the matrix": {
      year: 1999,
      director: "The Wachowskis",
      genres: ["Sci-Fi", "Action"],
      cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss", "Hugo Weaving"],
      runtime: "136 min",
      synopsis: "A programmer discovers that reality is an elaborate simulation and joins a fight for freedom."
    },
    "dune part two": {
      year: 2024,
      director: "Denis Villeneuve",
      genres: ["Sci-Fi", "Adventure", "Drama"],
      cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Austin Butler"],
      runtime: "166 min",
      synopsis: "Paul Atreides joins the Fremen while confronting the future revealed in his visions."
    },
    "arrival": {
      year: 2016,
      director: "Denis Villeneuve",
      genres: ["Sci-Fi", "Drama", "Mystery"],
      cast: ["Amy Adams", "Jeremy Renner", "Forest Whitaker"],
      runtime: "116 min",
      synopsis: "A linguist tries to communicate with mysterious visitors from beyond Earth."
    },
    "avengers endgame": {
      year: 2019,
      director: "Anthony Russo, Joe Russo",
      genres: ["Action", "Adventure", "Sci-Fi"],
      cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson", "Mark Ruffalo"],
      runtime: "181 min",
      synopsis: "The surviving Avengers unite for one final attempt to reverse Thanos's devastation."
    },
    "john wick": {
      year: 2014,
      director: "Chad Stahelski",
      genres: ["Action", "Thriller", "Crime"],
      cast: ["Keanu Reeves", "Michael Nyqvist", "Alfie Allen", "Willem Dafoe"],
      runtime: "101 min",
      synopsis: "A retired hitman returns to the criminal underworld on a path of revenge."
    },
    "the shawshank redemption": {
      year: 1994,
      director: "Frank Darabont",
      genres: ["Drama"],
      cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
      runtime: "142 min",
      synopsis: "Two prisoners form an unlikely friendship while holding on to hope."
    },
    "joker": {
      year: 2019,
      director: "Todd Phillips",
      genres: ["Crime", "Drama", "Thriller"],
      cast: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz"],
      runtime: "122 min",
      synopsis: "A troubled aspiring comedian becomes increasingly alienated from society."
    },
    "spider man across the spider verse": {
      year: 2023,
      director: "Joaquim Dos Santos, Kemp Powers, Justin K. Thompson",
      genres: ["Animation", "Action", "Adventure"],
      cast: ["Shameik Moore", "Hailee Steinfeld", "Brian Tyree Henry", "Oscar Isaac"],
      runtime: "140 min",
      synopsis: "Miles Morales travels across the multiverse and meets other Spider-People."
    },
    "gladiator": {
      year: 2000,
      director: "Ridley Scott",
      genres: ["Action", "Drama", "Adventure"],
      cast: ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen", "Oliver Reed"],
      runtime: "155 min",
      synopsis: "A betrayed Roman general becomes a gladiator and seeks justice."
    }
  };

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
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

  function toArray(value) {
    if (Array.isArray(value)) return value.filter(Boolean);

    if (typeof value === "string" && value.trim()) {
      return value.split(",").map(item => item.trim()).filter(Boolean);
    }

    return [];
  }

  function getMovieInfo() {
    const details = document.getElementById(DETAILS_ID);
    if (!details) return null;

    const heading = details.querySelector(
      ".details-title, .movie-title, h1, h2"
    );

    if (!heading) return null;

    const title = heading.textContent.trim();
    if (!title) return null;

    let movie = null;

    if (typeof MOVIES !== "undefined" && Array.isArray(MOVIES)) {
      movie = MOVIES.find(item =>
        normalize(item.title || item.name) === normalize(title)
      ) || null;
    }

    const aliases = {
      "dune 2": "dune part two",
      "dark knight": "the dark knight",
      "matrix": "the matrix",
      "shawshank": "the shawshank redemption",
      "spiderverse": "spider man across the spider verse",
      "spider man across the spiderverse": "spider man across the spider verse"
    };

    const key = aliases[normalize(title)] || normalize(title);
    const info = MOVIE_INFO[key] || {};

    return {
      title,
      year: info.year || movie?.year || movie?.releaseYear || "",
      director: info.director || movie?.director || movie?.directorName || "",
      genres: info.genres || movie?.genres || movie?.genre || [],
      cast: info.cast || movie?.cast || movie?.actors || [],
      runtime: info.runtime || movie?.runtime || movie?.duration || "",
      synopsis: info.synopsis || movie?.overview || movie?.description || ""
    };
  }

  function render() {
    const details = document.getElementById(DETAILS_ID);
    if (!details) return;

    const movie = getMovieInfo();
    if (!movie) return;

    let section = document.getElementById(SECTION_ID);

    // Avoid rebuilding the same movie's details repeatedly.
    if (
      section &&
      section.dataset.movieTitle === normalize(movie.title)
    ) {
      return;
    }

    if (!section) {
      section = document.createElement("section");
      section.id = SECTION_ID;
      section.className = "extra-movie-details";
      details.appendChild(section);
    }

    section.dataset.movieTitle = normalize(movie.title);

    const genres = toArray(movie.genres);
    const cast = toArray(movie.cast);

    const chips = [
      movie.year,
      movie.runtime,
      ...genres
    ].filter(Boolean);

    section.innerHTML = `
      <div class="extra-details-heading">
        <p class="eyebrow">BEHIND THE MOVIE</p>
        <h2>Movie <span>Spotlight</span></h2>
      </div>

      ${chips.length ? `
        <div class="extra-detail-chips">
          ${chips.map(item => `
            <span class="extra-detail-chip">
              ${escapeHTML(item)}
            </span>
          `).join("")}
        </div>
      ` : ""}

      ${movie.director ? `
        <div class="extra-detail-block">
          <p class="extra-detail-label">DIRECTED BY</p>
          <p class="extra-detail-value">${escapeHTML(movie.director)}</p>
        </div>
      ` : ""}

      ${movie.synopsis ? `
        <div class="extra-detail-block">
          <p class="extra-detail-label">STORY OVERVIEW</p>
          <p class="extra-detail-synopsis">${escapeHTML(movie.synopsis)}</p>
        </div>
      ` : ""}

      <div class="extra-detail-block">
        <p class="extra-detail-label">FEATURED CAST</p>

        ${cast.length ? `
          <div class="extra-cast-grid">
            ${cast.map(person => `
              <div class="extra-cast-card">
                <div class="extra-cast-avatar" aria-hidden="true">
                  ${escapeHTML(String(person).charAt(0).toUpperCase())}
                </div>
                <div class="extra-cast-name">${escapeHTML(person)}</div>
                <div class="extra-cast-role">Cast member</div>
              </div>
            `).join("")}
          </div>
        ` : `
          <p class="extra-detail-muted">
            Cast information is not available for this movie yet.
          </p>
        `}
      </div>
    `;
  }

  function init() {
    const details = document.getElementById(DETAILS_ID);

    if (!details) {
      console.warn(
        "CINEVERSE Commit 20: #detailsContent was not found in index.html."
      );
      return;
    }

    const observer = new MutationObserver(() => {
      const movie = getMovieInfo();
      if (!movie) return;

      const section = document.getElementById(SECTION_ID);

      if (
        !section ||
        section.dataset.movieTitle !== normalize(movie.title)
      ) {
        render();
      }
    });

    observer.observe(details, {
      childList: true,
      subtree: true,
      characterData: true
    });

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
