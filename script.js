
"use strict";

/* =========================================
   CINEVERSE — COMPLETE MOVIE APP
   Commit 15: Similar & Recommended Movies
========================================= */

const MOVIES = [
  {
    id: 1, title: "Interstellar", genre: "Sci-Fi", year: 2014, rating: 8.7,
    duration: "169 min", director: "Christopher Nolan",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    description: "A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars."
  },
  {
    id: 2, title: "Inception", genre: "Sci-Fi", year: 2010, rating: 8.8,
    duration: "148 min", director: "Christopher Nolan",
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    description: "A skilled thief enters people's dreams to steal secrets and attempts an almost impossible mission."
  },
  {
    id: 3, title: "The Dark Knight", genre: "Action", year: 2008, rating: 9.0,
    duration: "152 min", director: "Christopher Nolan",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description: "Batman faces the Joker, a criminal mastermind who pushes Gotham City into chaos."
  },
  {
    id: 4, title: "The Matrix", genre: "Sci-Fi", year: 1999, rating: 8.7,
    duration: "136 min", director: "Lana and Lilly Wachowski",
    poster: "https://image.tmdb.org/t/p/w500/p96dm7sCMn4VYAStA6siNz30G1r.jpg",
    description: "A computer hacker discovers the shocking truth behind the reality he has always known."
  },
  {
    id: 5, title: "Dune: Part Two", genre: "Sci-Fi", year: 2024, rating: 8.5,
    duration: "166 min", director: "Denis Villeneuve",
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    description: "Paul Atreides unites with the Fremen while pursuing a future shaped by destiny and conflict."
  },
  {
    id: 6, title: "Arrival", genre: "Sci-Fi", year: 2016, rating: 7.9,
    duration: "116 min", director: "Denis Villeneuve",
    poster: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    description: "A linguist works to communicate with mysterious visitors who have arrived on Earth."
  },
  {
    id: 7, title: "Avengers: Endgame", genre: "Action", year: 2019, rating: 8.4,
    duration: "181 min", director: "Anthony and Joe Russo",
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    description: "The surviving Avengers unite for one final mission to restore what was lost."
  },
  {
    id: 8, title: "John Wick", genre: "Action", year: 2014, rating: 7.4,
    duration: "101 min", director: "Chad Stahelski",
    poster: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
    description: "A retired assassin returns to a dangerous underworld and confronts his past."
  },
  {
    id: 9, title: "Gladiator", genre: "Action", year: 2000, rating: 8.5,
    duration: "155 min", director: "Ridley Scott",
    poster: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    description: "A betrayed Roman general fights his way through the arena in search of justice."
  },
  {
    id: 10, title: "The Shawshank Redemption", genre: "Drama", year: 1994, rating: 9.3,
    duration: "142 min", director: "Frank Darabont",
    poster: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    description: "Two prisoners form an enduring friendship while holding on to hope behind prison walls."
  },
  {
    id: 11, title: "Joker", genre: "Thriller", year: 2019, rating: 8.4,
    duration: "122 min", director: "Todd Phillips",
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    description: "A troubled man descends into chaos in a city that has turned its back on him."
  },
  {
    id: 12, title: "Spider-Man: Into the Spider-Verse", genre: "Animation", year: 2018, rating: 8.4,
    duration: "117 min", director: "Bob Persichetti and others",
    poster: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    description: "Miles Morales discovers a new world of Spider-heroes and learns what it means to be a hero."
  }
];

const STORAGE_KEYS = {
  watchlist: "cineverse_watchlist",
  progress: "cineverse_progress",
  history: "cineverse_history",
  profile: "cineverse_profile"
};

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch (error) {
    console.warn("CINEVERSE could not read saved data:", key, error);
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("CINEVERSE could not save data:", key, error);
  }
}

function getMovie(id) {
  return MOVIES.find(movie => movie.id === Number(id));
}

let watchlist = readStorage(STORAGE_KEYS.watchlist, []);
let progress = readStorage(STORAGE_KEYS.progress, {});
let viewingHistory = readStorage(STORAGE_KEYS.history, []);
let profile = readStorage(STORAGE_KEYS.profile, null);

if (!Array.isArray(watchlist)) watchlist = [];
if (!progress || typeof progress !== "object" || Array.isArray(progress)) progress = {};
if (!Array.isArray(viewingHistory)) viewingHistory = [];

watchlist = watchlist.map(Number).filter(id => getMovie(id));
viewingHistory = viewingHistory.filter(item => item && getMovie(item.id));

let activeMovieId = null;
let isRegisterMode = false;

/* ---------- Safe HTML output ---------- */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

/* ---------- Movie cards ---------- */

function movieCard(movie) {
  const saved = watchlist.includes(movie.id);
  const poster = escapeHTML(movie.poster);
  const title = escapeHTML(movie.title);
  const genre = escapeHTML(movie.genre);
  const percentage = Number(progress[movie.id]) || 0;

  return `
    <article class="movie-card">
      <div class="poster-wrap">
        <img
          class="movie-poster"
          src="${poster}"
          alt="${title} poster"
          loading="lazy"
          onerror="this.onerror=null;this.style.display='none';this.parentElement.style.background='linear-gradient(145deg,#202943,#101421)'"
        >
        <span class="rating-pill">★ ${movie.rating.toFixed(1)}</span>
      </div>
      <div class="movie-info">
        <h3>${title}</h3>
        <div class="movie-meta">${movie.year} · ${genre}</div>
        <div class="card-actions">
          <button class="card-button" type="button"
            data-action="details" data-id="${movie.id}">Details</button>
          <button class="card-button ${saved ? "saved" : ""}" type="button"
            data-action="watchlist" data-id="${movie.id}">
            ${saved ? "✓ Saved" : "+ Watchlist"}
          </button>
        </div>
        ${percentage > 0 ? `<div class="movie-meta">Progress: ${Math.min(100, percentage)}%</div>` : ""}
      </div>
    </article>
  `;
}

/* ---------- Main discovery grid ---------- */

function renderMovies() {
  const grid = document.getElementById("movieGrid");
  if (!grid) return;

  const search = (document.getElementById("searchInput")?.value || "")
    .trim().toLowerCase();

  const genre = document.getElementById("genreFilter")?.value || "all";
  const sort = document.getElementById("sortFilter")?.value || "popular";

  let filtered = MOVIES.filter(movie => {
    const matchesSearch =
      movie.title.toLowerCase().includes(search) ||
      movie.genre.toLowerCase().includes(search) ||
      String(movie.year).includes(search) ||
      movie.director.toLowerCase().includes(search);

    const matchesGenre = genre === "all" || movie.genre === genre;
    return matchesSearch && matchesGenre;
  });

  if (sort === "popular") filtered.sort((a, b) => b.rating - a.rating);
  if (sort === "newest") filtered.sort((a, b) => b.year - a.year);
  if (sort === "oldest") filtered.sort((a, b) => a.year - b.year);
  if (sort === "title") filtered.sort((a, b) => a.title.localeCompare(b.title));

  grid.innerHTML = filtered.map(movieCard).join("");

  const count = document.getElementById("resultsCount");
  if (count) {
    count.textContent = `${filtered.length} movie${filtered.length === 1 ? "" : "s"}`;
  }

  const empty = document.getElementById("emptyMessage");
  if (empty) empty.hidden = filtered.length > 0;
}

/* ---------- Watchlist ---------- */

function renderWatchlist() {
  const grid = document.getElementById("watchlistGrid");
  const empty = document.getElementById("watchlistEmpty");
  const count = document.getElementById("watchlistCount");

  const movies = watchlist.map(getMovie).filter(Boolean);

  if (grid) grid.innerHTML = movies.map(movieCard).join("");
  if (empty) empty.hidden = movies.length > 0;
  if (count) count.textContent = String(movies.length);
}

function toggleWatchlist(id) {
  id = Number(id);
  if (!getMovie(id)) return;

  if (watchlist.includes(id)) {
    watchlist = watchlist.filter(movieId => movieId !== id);
  } else {
    watchlist.push(id);
  }

  saveStorage(STORAGE_KEYS.watchlist, watchlist);
  renderMovies();
  renderWatchlist();
  renderContinueWatching();
  renderHistory();

  if (activeMovieId !== null) {
    renderRecommendations(activeMovieId);
  }
}

/* ---------- Continue watching ---------- */

function renderContinueWatching() {
  const grid = document.getElementById("continueGrid");
  const empty = document.getElementById("continueEmpty");
  if (!grid) return;

  const movies = MOVIES.filter(movie => {
    const value = Number(progress[movie.id]) || 0;
    return value > 0 && value < 100;
  }).sort((a, b) => (Number(progress[b.id]) || 0) - (Number(progress[a.id]) || 0));

  grid.innerHTML = movies.map(movie => `
    <article class="movie-card">
      <div class="poster-wrap">
        <img class="movie-poster" src="${escapeHTML(movie.poster)}"
          alt="${escapeHTML(movie.title)} poster" loading="lazy"
          onerror="this.onerror=null;this.style.display='none'">
        <span class="rating-pill">${Math.min(100, Number(progress[movie.id]) || 0)}%</span>
      </div>
      <div class="movie-info">
        <h3>${escapeHTML(movie.title)}</h3>
        <div class="movie-meta">${movie.year} · ${escapeHTML(movie.genre)}</div>
        <div style="height:5px;background:#292e40;border-radius:8px;overflow:hidden;margin:12px 0">
          <div style="height:100%;width:${Math.min(100, Number(progress[movie.id]) || 0)}%;background:linear-gradient(90deg,#83e9ff,#a88bff)"></div>
        </div>
        <div class="card-actions">
          <button class="card-button" type="button"
            data-action="start" data-id="${movie.id}">Continue</button>
          <button class="card-button" type="button"
            data-action="details" data-id="${movie.id}">Details</button>
        </div>
      </div>
    </article>
  `).join("");

  if (empty) empty.hidden = movies.length > 0;
}

/* ---------- Recently viewed ---------- */

function addToHistory(id) {
  id = Number(id);
  if (!getMovie(id)) return;

  viewingHistory = [
    { id, viewedAt: Date.now() },
    ...viewingHistory.filter(item => Number(item.id) !== id)
  ].slice(0, 8);

  saveStorage(STORAGE_KEYS.history, viewingHistory);
  renderHistory();
}

function renderHistory() {
  const grid = document.getElementById("historyGrid");
  const empty = document.getElementById("historyEmpty");
  if (!grid) return;

  const movies = viewingHistory.map(item => getMovie(item.id)).filter(Boolean);
  grid.innerHTML = movies.map(movieCard).join("");

  if (empty) empty.hidden = movies.length > 0;
}

/* ---------- Similar movie recommendations ---------- */

function renderRecommendations(movieId = null) {
  const grid = document.getElementById("recommendationsGrid");
  const empty = document.getElementById("recommendationsEmpty");
  if (!grid) return;

  let recommendations = [];

  if (movieId !== null) {
    const selected = getMovie(movieId);

    if (selected) {
      recommendations = MOVIES.filter(movie =>
        movie.id !== selected.id && movie.genre === selected.genre
      ).sort((a, b) => b.rating - a.rating);
    }
  } else {
    const preferenceIds = [
      ...watchlist,
      ...viewingHistory.map(item => Number(item.id))
    ];

    const genreScores = {};

    preferenceIds.forEach(id => {
      const movie = getMovie(id);
      if (movie) genreScores[movie.genre] = (genreScores[movie.genre] || 0) + 1;
    });

    recommendations = MOVIES.filter(movie => !watchlist.includes(movie.id))
      .sort((a, b) => {
        const scoreA = genreScores[a.genre] || 0;
        const scoreB = genreScores[b.genre] || 0;
        return scoreB - scoreA || b.rating - a.rating;
      });
  }

  recommendations = recommendations.slice(0, 6);
  grid.innerHTML = recommendations.map(movie => `
    <div>
      <p class="recommendation-label">✦ ${escapeHTML(movie.genre)} pick</p>
      ${movieCard(movie)}
    </div>
  `).join("");

  if (empty) empty.hidden = recommendations.length > 0;
}

/* ---------- Movie details modal ---------- */

function showDetails(id) {
  const movie = getMovie(id);
  const modal = document.getElementById("detailsModal");
  const content = document.getElementById("detailsContent");

  if (!movie || !modal || !content) return;

  activeMovieId = movie.id;
  addToHistory(movie.id);

  const saved = watchlist.includes(movie.id);
  const currentProgress = Number(progress[movie.id]) || 0;

  content.innerHTML = `
    <div class="details-layout">
      <div>
        <img class="details-poster" src="${escapeHTML(movie.poster)}"
          alt="${escapeHTML(movie.title)} poster"
          onerror="this.onerror=null;this.style.display='none'">
      </div>
      <div class="details-copy">
        <p class="eyebrow">${escapeHTML(movie.genre)} · ${movie.year}</p>
        <h2>${escapeHTML(movie.title)}</h2>
        <div class="details-meta">★ ${movie.rating.toFixed(1)} / 10 &nbsp; · &nbsp; ${escapeHTML(movie.duration)}</div>
        <p>${escapeHTML(movie.description)}</p>
        <p><strong>Director:</strong> ${escapeHTML(movie.director)}</p>
        <p><strong>Your progress:</strong> ${currentProgress}%</p>
        <div class="details-actions">
          <button class="primary-button" type="button"
            data-action="start" data-id="${movie.id}">
            ${currentProgress > 0 && currentProgress < 100 ? "Continue movie" : "Start movie"}
          </button>
          <button class="secondary-button" type="button"
            data-action="watchlist" data-id="${movie.id}">
            ${saved ? "✓ In watchlist" : "+ Add to watchlist"}
          </button>
          <button class="secondary-button" type="button"
            data-action="watched" data-id="${movie.id}">Mark watched</button>
        </div>
      </div>
    </div>
  `;

  modal.hidden = false;
  document.body.style.overflow = "hidden";
  renderRecommendations(movie.id);
}

/* ---------- Demo watch progress ---------- */

function startMovie(id) {
  const movie = getMovie(id);
  if (!movie) return;

  const current = Number(progress[id]) || 0;
  progress[id] = current >= 100 ? 100 : Math.min(100, current + 10);
  saveStorage(STORAGE_KEYS.progress, progress);

  addToHistory(id);
  renderContinueWatching();
  renderMovies();
  renderWatchlist();
  renderHistory();

  if (progress[id] >= 100) {
    alert(`${movie.title} marked as completed in this demo.`);
  } else {
    alert(`${movie.title}: demo progress is now ${progress[id]}%. This is a progress tracker, not a movie player.`);
  }

  if (activeMovieId === Number(id)) showDetails(id);
}

function markWatched(id) {
  id = Number(id);
  if (!getMovie(id)) return;

  progress[id] = 100;
  saveStorage(STORAGE_KEYS.progress, progress);
  addToHistory(id);
  renderContinueWatching();
  renderMovies();
  renderWatchlist();
  renderHistory();
  showDetails(id);
}

/* ---------- Modal and click handling ---------- */

function closeModal(modal) {
  if (modal) modal.hidden = true;

  const detailsOpen = !document.getElementById("detailsModal")?.hidden;
  const authOpen = !document.getElementById("authModal")?.hidden;

  if (!detailsOpen && !authOpen) {
    document.body.style.overflow = "";
  }
}

document.addEventListener("click", event => {
  const closeTarget = event.target.closest("[data-close-modal]");
  if (closeTarget) {
    closeModal(closeTarget.closest(".modal"));
    return;
  }

  const button = event.target.closest("[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "details") showDetails(id);
  if (action === "watchlist") toggleWatchlist(id);
  if (action === "start") startMovie(id);
  if (action === "watched") markWatched(id);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal(document.getElementById("detailsModal"));
    closeModal(document.getElementById("authModal"));
  }
});

/* ---------- Search and filters ---------- */

document.getElementById("searchInput")?.addEventListener("input", renderMovies);
document.getElementById("genreFilter")?.addEventListener("change", renderMovies);
document.getElementById("sortFilter")?.addEventListener("change", renderMovies);

document.getElementById("resetFilters")?.addEventListener("click", () => {
  const search = document.getElementById("searchInput");
  const genre = document.getElementById("genreFilter");
  const sort = document.getElementById("sortFilter");

  if (search) search.value = "";
  if (genre) genre.value = "all";
  if (sort) sort.value = "popular";

  renderMovies();
});

document.getElementById("clearHistoryButton")?.addEventListener("click", () => {
  viewingHistory = [];
  saveStorage(STORAGE_KEYS.history, viewingHistory);
  renderHistory();
});

/* ---------- Demo profile ---------- */

function updateProfileUI() {
  const profileButton = document.getElementById("profileButton");
  if (profileButton) {
    profileButton.textContent = profile?.name
      ? profile.name
      : "Sign in";
  }
}

function openAuthModal() {
  const modal = document.getElementById("authModal");
  const title = document.getElementById("authTitle");
  const message = document.getElementById("profileMessage");
  const nameField = document.getElementById("nameField");
  const authSwitch = document.getElementById("authSwitch");
  const authSubmit = document.getElementById("authSubmit");
  const logoutButton = document.getElementById("logoutButton");
  const form = document.getElementById("authForm");

  modal.hidden = false;
  document.body.style.overflow = "hidden";

  if (profile) {
    title.textContent = `Hello, ${profile.name}`;
    message.textContent = `Signed in as ${profile.email}. This is a local demo profile.`;
    form.hidden = true;
    nameField.hidden = true;
    authSwitch.hidden = true;
    authSubmit.hidden = true;
    logoutButton.hidden = false;
  } else {
    title.textContent = isRegisterMode ? "Create your profile" : "Welcome back";
    message.textContent = "This demo profile is stored only in this browser.";
    form.hidden = false;
    nameField.hidden = !isRegisterMode;
    authSwitch.hidden = false;
    authSubmit.hidden = false;
    logoutButton.hidden = true;
    authSubmit.textContent = isRegisterMode ? "Create account" : "Sign in";
    authSwitch.textContent = isRegisterMode
      ? "Already registered? Sign in"
      : "New here? Create an account";
  }
}

document.getElementById("profileButton")?.addEventListener("click", openAuthModal);

document.getElementById("authSwitch")?.addEventListener("click", () => {
  isRegisterMode = !isRegisterMode;
  openAuthModal();
});

document.getElementById("authForm")?.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("authName").value.trim();
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;

  if (!email || password.length < 4) {
    alert("Enter a valid email and a password of at least 4 characters.");
    return;
  }

  if (isRegisterMode && !name) {
    alert("Please enter your name.");
    return;
  }

  // Demo only: no password is saved or checked by a server.
  profile = {
    name: isRegisterMode ? name : (email.split("@")[0] || "Movie Fan"),
    email
  };

  saveStorage(STORAGE_KEYS.profile, profile);
  updateProfileUI();
  openAuthModal();
});

document.getElementById("logoutButton")?.addEventListener("click", () => {
  profile = null;
  saveStorage(STORAGE_KEYS.profile, null);
  updateProfileUI();
  closeModal(document.getElementById("authModal"));
});

/* ---------- Initialise page ---------- */

function initCineverse() {
  renderMovies();
  renderWatchlist();
  renderContinueWatching();
  renderHistory();
  renderRecommendations();
  updateProfileUI();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCineverse, { once: true });
} else {
  initCineverse();
}
