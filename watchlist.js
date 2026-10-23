
/* =========================================
   CINEVERSE — COMMIT 21
   Smart Watchlist Improvements
   ========================================= */

(() => {
  "use strict";

  const STORAGE_KEY = "cineverse_watchlist_v1";

  const readList = () => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  const saveList = (list) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const getMovies = () =>
    typeof MOVIES !== "undefined" && Array.isArray(MOVIES)
      ? MOVIES
      : [];

  const getId = (movie) => String(movie.id);

  const getTitle = (movie) =>
    movie.title || movie.name || "Untitled movie";

  const getPoster = (movie) =>
    movie.poster ||
    movie.poster_path ||
    movie.image ||
    movie.backdrop ||
    "";

  const getRating = (movie) => {
    const value = Number(
      movie.rating ?? movie.vote_average ?? movie.score ?? 0
    );
    return Number.isFinite(value) && value > 0
      ? value.toFixed(1)
      : "N/A";
  };

  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  function ensureStyles() {
    if (document.querySelector("#cineverse-watchlist-styles")) return;

    const style = document.createElement("style");
    style.id = "cineverse-watchlist-styles";
    style.textContent = `
      .cv-watchlist {
        margin: 36px auto;
        padding: 24px;
        max-width: 1400px;
        color: var(--text-color, #fff);
        background: var(--card-bg, rgba(255,255,255,.035));
        border: 1px solid rgba(255,255,255,.10);
        border-radius: 20px;
      }
      .cv-watchlist-header {
        display:flex;
        flex-wrap:wrap;
        align-items:center;
        justify-content:space-between;
        gap:16px;
        margin-bottom:20px;
      }
      .cv-watchlist-title {
        margin:0;
        font-size:clamp(1.4rem, 3vw, 2rem);
      }
      .cv-watchlist-count {
        color:#ff4b61;
        font-size:.9rem;
      }
      .cv-watchlist-controls {
        display:flex;
        flex-wrap:wrap;
        gap:10px;
        margin-bottom:22px;
      }
      .cv-watchlist-controls input,
      .cv-watchlist-controls select {
        min-width:0;
        padding:11px 13px;
        color:inherit;
        background:rgba(255,255,255,.06);
        border:1px solid rgba(255,255,255,.15);
        border-radius:10px;
      }
      .cv-watchlist-controls input {
        flex:1 1 220px;
      }
      .cv-watchlist-grid {
        display:grid;
        grid-template-columns:repeat(auto-fill,minmax(155px,1fr));
        gap:18px;
      }
      .cv-watchlist-card {
        overflow:hidden;
        background:rgba(255,255,255,.045);
        border:1px solid rgba(255,255,255,.09);
        border-radius:14px;
      }
      .cv-watchlist-poster {
        display:block;
        width:100%;
        aspect-ratio:2/3;
        object-fit:cover;
        background:rgba(255,255,255,.08);
      }
      .cv-watchlist-card-body {
        padding:12px;
      }
      .cv-watchlist-card-title {
        margin:0 0 8px;
        font-size:.98rem;
        line-height:1.4;
      }
      .cv-watchlist-rating {
        margin-bottom:12px;
        color:#ffc857;
        font-size:.85rem;
      }
      .cv-watchlist-actions {
        display:grid;
        grid-template-columns:1fr;
        gap:8px;
      }
      .cv-watchlist-btn {
        padding:9px 10px;
        color:#fff;
        background:#c91f3b;
        border:0;
        border-radius:8px;
        cursor:pointer;
        font:inherit;
        font-size:.85rem;
      }
      .cv-watchlist-btn.secondary {
        background:rgba(255,255,255,.12);
      }
      .cv-watchlist-btn:hover {
        filter:brightness(1.15);
      }
      .cv-watchlist-empty {
        padding:28px 10px;
        text-align:center;
        color:rgba(255,255,255,.68);
        grid-column:1/-1;
      }
      .cv-watchlist-empty strong {
        display:block;
        margin-bottom:8px;
        color:inherit;
        font-size:1.15rem;
      }
      @media(max-width:480px) {
        .cv-watchlist { padding:16px; }
        .cv-watchlist-grid {
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:12px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureSection() {
    let section = document.querySelector("#cineverseWatchlist");
    if (section) return section;

    section = document.createElement("section");
    section.id = "cineverseWatchlist";
    section.className = "cv-watchlist";
    section.innerHTML = `
      <div class="cv-watchlist-header">
        <h2 class="cv-watchlist-title">My Watchlist</h2>
        <span class="cv-watchlist-count" id="cvWatchlistCount">
          0 saved movies
        </span>
      </div>

      <div class="cv-watchlist-controls">
        <input
          id="cvWatchlistSearch"
          type="search"
          placeholder="Search your saved movies..."
          aria-label="Search watchlist"
        />
        <select id="cvWatchlistSort" aria-label="Sort watchlist">
          <option value="recent">Recently added</option>
          <option value="title">Title A–Z</option>
          <option value="rating">Highest rating</option>
        </select>
      </div>

      <div class="cv-watchlist-grid" id="cvWatchlistGrid"></div>
    `;

    const anchor =
      document.querySelector("#movieGrid") ||
      document.querySelector(".movie-grid") ||
      document.querySelector("main");

    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(section, anchor);
    } else {
      document.body.appendChild(section);
    }

    section.querySelector("#cvWatchlistSearch")
      .addEventListener("input", render);

    section.querySelector("#cvWatchlistSort")
      .addEventListener("change", render);

    section.addEventListener("click", (event) => {
      const button = event.target.closest("[data-watchlist-action]");
      if (!button) return;

      const id = button.dataset.movieId;
      const action = button.dataset.watchlistAction;

      if (action === "remove") {
        saveList(readList().filter((item) => String(item.id) !== id));
        render();
      }

      if (action === "details") {
        const movie = getMovies().find((item) => getId(item) === id);
        if (movie && typeof showDetails === "function") {
          showDetails(movie.id);
        }
      }
    });

    return section;
  }

  function render() {
    const section = document.querySelector("#cineverseWatchlist");
    if (!section) return;

    const allMovies = getMovies();
    const saved = readList();
    const search = (
      section.querySelector("#cvWatchlistSearch")?.value || ""
    ).trim().toLowerCase();
    const sort = section.querySelector("#cvWatchlistSort")?.value || "recent";

    let movies = saved
      .map((item) => {
        const id = String(typeof item === "object" ? item.id : item);
        const movie = allMovies.find((candidate) => getId(candidate) === id);
        return movie ? { movie, savedAt: item.savedAt || 0 } : null;
      })
      .filter(Boolean)
      .filter(({ movie }) =>
        getTitle(movie).toLowerCase().includes(search)
      );

    if (sort === "title") {
      movies.sort((a, b) =>
        getTitle(a.movie).localeCompare(getTitle(b.movie))
      );
    } else if (sort === "rating") {
      movies.sort((a, b) =>
        Number(getRating(b.movie)) - Number(getRating(a.movie))
      );
    } else {
      movies.sort((a, b) => Number(b.savedAt) - Number(a.savedAt));
    }

    const count = section.querySelector("#cvWatchlistCount");
    const grid = section.querySelector("#cvWatchlistGrid");

    count.textContent = `${saved.length} saved movie${saved.length === 1 ? "" : "s"}`;

    if (!movies.length) {
      grid.innerHTML = `
        <div class="cv-watchlist-empty">
          <strong>${search ? "No matching movies" : "Your watchlist is empty"}</strong>
          ${search
            ? "Try another title."
            : "Save movies from your movie cards to build your personal list."}
        </div>
      `;
      return;
    }

    grid.innerHTML = movies.map(({ movie }) => {
      const title = escapeHTML(getTitle(movie));
      const poster = escapeHTML(getPoster(movie));
      const rating = escapeHTML(getRating(movie));
      const id = escapeHTML(getId(movie));

      return `
        <article class="cv-watchlist-card">
          ${poster
            ? `<img class="cv-watchlist-poster" src="${poster}" alt="${title}" loading="lazy">`
            : `<div class="cv-watchlist-poster" role="img" aria-label="No poster available"></div>`
          }
          <div class="cv-watchlist-card-body">
            <h3 class="cv-watchlist-card-title">${title}</h3>
            <div class="cv-watchlist-rating">★ ${rating}</div>
            <div class="cv-watchlist-actions">
              <button class="cv-watchlist-btn"
                data-watchlist-action="details" data-movie-id="${id}">
                View details
              </button>
              <button class="cv-watchlist-btn secondary"
                data-watchlist-action="remove" data-movie-id="${id}">
                Remove
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  function addWatchlistButton() {
    const grid = document.querySelector("#movieGrid, .movie-grid");
    if (!grid || document.querySelector("#cvOpenWatchlist")) return;

    const button = document.createElement("button");
    button.id = "cvOpenWatchlist";
    button.className = "cv-watchlist-btn";
    button.textContent = "♡ My Watchlist";
    button.style.margin = "12px 0";

    button.addEventListener("click", () => {
      const section = document.querySelector("#cineverseWatchlist");
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    grid.parentNode.insertBefore(button, grid);
  }

  function init() {
    ensureStyles();
    ensureSection();
    addWatchlistButton();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.CineverseWatchlist = {
    render,
    getSaved: readList,
    add(movieId) {
      const movie = getMovies().find((item) => getId(item) === String(movieId));
      if (!movie) return false;

      const list = readList();
      if (!list.some((item) => String(typeof item === "object" ? item.id : item) === String(movieId))) {
        list.push({ id: movieId, savedAt: Date.now() });
        saveList(list);
      }
      render();
      return true;
    },
    remove(movieId) {
      saveList(readList().filter((item) =>
        String(typeof item === "object" ? item.id : item) !== String(movieId)
      ));
      render();
    }
  };
})();

