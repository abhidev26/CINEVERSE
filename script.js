
"use strict";

const MOVIES = [
  { id: 1, title: "Neon Horizon", year: 2025, genre: "Sci-Fi", rating: "8.6", duration: "2h 08m", description: "A lone explorer discovers a mysterious signal that could change humanity's future.", color: "#6657ff", trailer: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4" },
  { id: 2, title: "Shadow Protocol", year: 2024, genre: "Action", rating: "8.1", duration: "1h 58m", description: "An intelligence agent uncovers a conspiracy before the city falls into chaos.", color: "#ed496d", trailer: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4" },
  { id: 3, title: "Beyond Earth", year: 2025, genre: "Adventure", rating: "8.4", duration: "2h 15m", description: "A daring crew journeys beyond the known frontier in search of a new beginning.", color: "#24b8a9", trailer: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4" },
  { id: 4, title: "Silent Echo", year: 2023, genre: "Drama", rating: "7.9", duration: "1h 52m", description: "A musician returns home and discovers the truth behind a forgotten memory.", color: "#d39b48", trailer: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4" },
  { id: 5, title: "Quantum Run", year: 2025, genre: "Sci-Fi", rating: "8.7", duration: "2h 03m", description: "A scientist races against time when an experiment fractures reality.", color: "#4287f5", trailer: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4" },
  { id: 6, title: "Final Strike", year: 2024, genre: "Action", rating: "7.8", duration: "1h 49m", description: "An elite team has one night to prevent a global disaster.", color: "#ed7549", trailer: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4" },
  { id: 7, title: "Lost Kingdom", year: 2023, genre: "Adventure", rating: "8.0", duration: "2h 11m", description: "A hidden kingdom awaits a traveller brave enough to uncover its ancient secret.", color: "#8e68cf", trailer: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4" },
  { id: 8, title: "Last Letter", year: 2024, genre: "Drama", rating: "8.2", duration: "1h 56m", description: "An unexpected letter connects two strangers and changes their lives.", color: "#c75e8d", trailer: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4" }
];

const $ = selector => document.querySelector(selector);

const KEYS = {
  list: "cineverseWatchlist",
  progress: "cineverseProgress",
  users: "cineverseDemoUsers",
  session: "cineverseDemoSession",
  history: "cineverseViewingHistory"
};

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Could not save browser data:", error);
  }
}

let watchlist = readStorage(KEYS.list, []);
let progress = readStorage(KEYS.progress, {});
let currentMovieId = null;
let authMode = "register";
let viewingHistory = JSON.parse(
localStorage.getItem("cineverseViewingHistory") || "[]"
);

function getMovie(id) {
  return MOVIES.find(movie => movie.id === Number(id));
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
}

function isSaved(id) {
  return watchlist.includes(Number(id));
}

function movieCard(movie) {
  const saved = isSaved(movie.id);

  return `
    <article class="movie-card">
      <div class="poster" style="--poster-glow:${movie.color}">
        <span class="rating-badge">★ ${movie.rating}</span>
        <span class="poster-title">${movie.title}</span>
      </div>
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <div class="movie-meta">${movie.year} · ${movie.genre} · ${movie.duration}</div>
        <div class="movie-actions">
          <button class="small-button" type="button"
            data-action="details" data-id="${movie.id}">Details</button>
          <button class="small-button ${saved ? "saved" : ""}" type="button"
            data-action="watchlist" data-id="${movie.id}">
            ${saved ? "♥ Saved" : "♡ List"}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderMovies() {
  const search = ($("#searchInput").value || "").trim().toLowerCase();
  const genre = $("#genreFilter").value;
  const sort = $("#sortFilter").value;

  const filtered = MOVIES.filter(movie => {
    const matchesSearch =
      movie.title.toLowerCase().includes(search) ||
      movie.genre.toLowerCase().includes(search) ||
      String(movie.year).includes(search);

    return matchesSearch && (genre === "All" || movie.genre === genre);
  });

  filtered.sort((a, b) => {
    if (sort === "rating" || sort === "popular") {
      return Number(b.rating) - Number(a.rating);
    }
    if (sort === "newest") {
      return b.year - a.year || Number(b.rating) - Number(a.rating);
    }
    if (sort === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  $("#movieGrid").innerHTML = filtered.map(movieCard).join("");
  $("#emptyMessage").classList.toggle("hidden", filtered.length !== 0);
  renderWatchlist();
}

function renderWatchlist() {
  const movies = watchlist.map(getMovie).filter(Boolean);
  $("#watchlistGrid").innerHTML = movies.map(movieCard).join("");
  $("#watchlistEmpty").classList.toggle("hidden", movies.length > 0);
  $("#watchlistCount").textContent = movies.length;
}

function renderContinueWatching() {
  const movies = MOVIES.filter(movie => Number(progress[movie.id]) > 0);

  $("#continueGrid").innerHTML = movies.map(movie => {
    const percent = Math.min(100, Math.max(0, Number(progress[movie.id]) || 0));

    return `
      <article class="progress-card">
        <h3>${movie.title}</h3>
        <p>${movie.year} · ${movie.genre} · ${movie.duration}</p>
        <label class="progress-label" for="progress-${movie.id}">
          Progress: <span id="progress-label-${movie.id}">${percent}%</span>
        </label>
        <input id="progress-${movie.id}" type="range" min="0" max="100"
          value="${percent}" data-action="progress" data-id="${movie.id}">
        <p>Update the slider to save your viewing progress.</p>
      </article>
    `;
  }).join("");

  $("#continueEmpty").classList.toggle("hidden", movies.length > 0);
}

function toggleWatchlist(id) {
  id = Number(id);

  watchlist = isSaved(id)
    ? watchlist.filter(savedId => savedId !== id)
    : [...watchlist, id];

  writeStorage(KEYS.list, watchlist);
  renderMovies();

  if (currentMovieId === id) showDetails(id);
}

function showDetails(id) {
  const movie = getMovie(id);
  if (!movie) return;

  currentMovieId = movie.id;

  const saved = isSaved(movie.id);
  const percent = Math.min(100, Math.max(0, Number(progress[movie.id]) || 0));

  $("#detailsContent").innerHTML = `
    <div class="details-layout">
      <div class="details-poster" style="background:
        radial-gradient(circle at top right, ${movie.color}, transparent 65%), #191b2c">
        ${movie.title}
      </div>
      <div class="details-copy">
        <p class="eyebrow">CINEVERSE MOVIE COLLECTION</p>
        <h2 id="detailsTitle">${movie.title}</h2>
        <p>${movie.year} · ${movie.genre} · ${movie.duration} · ★ ${movie.rating}</p>
        <p>${movie.description}</p>
        <button class="primary-button" type="button"
          data-action="play" data-id="${movie.id}">▶ Watch Trailer</button>
        <button class="secondary-button" type="button"
          data-action="watchlist" data-id="${movie.id}">
          ${saved ? "♥ Remove from My List" : "♡ Add to My List"}
        </button>
        <div id="trailerContainer"></div>
        <p class="progress-label">
          Watch progress: <span id="detailProgress">${percent}%</span>
        </p>
        <input type="range" min="0" max="100" value="${percent}"
          data-action="progress" data-id="${movie.id}" aria-label="Watch progress">
      </div>
    </div>
  `;

  openModal("detailsModal");
}

function saveProgress(id, value) {
  id = Number(id);
  const percent = Math.min(100, Math.max(0, Number(value) || 0));

  progress[id] = percent;
  writeStorage(KEYS.progress, progress);
  renderContinueWatching();

  const label = document.getElementById(`progress-label-${id}`);
  if (label) label.textContent = `${percent}%`;

  if (currentMovieId === id) {
    const detailProgress = $("#detailProgress");
    if (detailProgress) detailProgress.textContent = `${percent}%`;
  }
}

document.addEventListener("click", event => {
  const closeTarget = event.target.closest("[data-close]");
  if (closeTarget) {
    closeModal(closeTarget.dataset.close);
    return;
  }

  const button = event.target.closest("[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "details") showDetails(id);
  if (action === "watchlist") toggleWatchlist(id);

  if (action === "play") {
    const movie = getMovie(id);
    if (!movie) return;

    $("#trailerContainer").innerHTML = `
      <iframe class="trailer-frame"
        src="${movie.trailer}?autoplay=1"
        title="${movie.title} trailer"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen loading="lazy"></iframe>
      <p>Demo trailer embed. Replace it with a verified trailer URL for your project.</p>
    `;

    if (!(Number(progress[id]) > 0)) saveProgress(id, 5);
  }
});

document.addEventListener("input", event => {
  const input = event.target.closest('[data-action="progress"]');
  if (input) saveProgress(input.dataset.id, input.value);
});

$("#searchInput").addEventListener("input", renderMovies);
$("#genreFilter").addEventListener("change", renderMovies);
$("#sortFilter").addEventListener("change", renderMovies);

$("#heroWatchlistButton")?.addEventListener("click", () => {
  $("#watchlist").scrollIntoView({ behavior: "smooth" });
});

$("#profileButton").addEventListener("click", () => {
  $("#profileMenu").classList.toggle("hidden");
});

document.addEventListener("click", event => {
  const menu = $("#profileMenu");
  if (!menu.contains(event.target) && !$("#profileButton").contains(event.target)) {
    menu.classList.add("hidden");
  }
});

function setAuthMode(mode) {
  authMode = mode;
  const registering = mode === "register";

  $("#authHeading").textContent = registering ? "Create your account" : "Welcome back";
  $("#authSubmit").textContent = registering ? "Create Account" : "Login";
  $("#nameLabel").classList.toggle("hidden", !registering);
  $("#authName").classList.toggle("hidden", !registering);
  $("#authName").required = registering;
  $("#authPassword").autocomplete = registering ? "new-password" : "current-password";
  $("#authSwitchText").textContent = registering ? "Already registered?" : "New to CINEVERSE?";
  $("#authSwitchButton").textContent = registering ? "Login" : "Create account";
  $("#authMessage").textContent = "";
}

function updateProfile() {
  const session = readStorage(KEYS.session, null);
  const signedIn = Boolean(session && session.email);

  $("#profileLabel").textContent = signedIn ? (session.name || "Member") : "Guest";
  $("#profileEmail").textContent = signedIn ? session.email : "Not signed in";
  $("#profileButton").textContent = signedIn
    ? (session.name || session.email).charAt(0).toUpperCase()
    : "G";

  $("#openAuthButton").classList.toggle("hidden", signedIn);
  $("#logoutButton").classList.toggle("hidden", !signedIn);
}

$("#openAuthButton").addEventListener("click", () => {
  $("#profileMenu").classList.add("hidden");
  $("#authForm").reset();
  setAuthMode("register");
  openModal("authModal");
});

$("#closeAuthButton").addEventListener("click", () => closeModal("authModal"));

$("#authSwitchButton").addEventListener("click", () => {
  setAuthMode(authMode === "register" ? "login" : "register");
});

$("#authForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = $("#authName").value.trim();
  const email = $("#authEmail").value.trim().toLowerCase();
  const password = $("#authPassword").value;

  if (!email || password.length < 6 || (authMode === "register" && !name)) {
    $("#authMessage").textContent = "Please complete all required fields.";
    return;
  }

  const users = readStorage(KEYS.users, []);

  if (authMode === "register") {
    if (users.some(user => user.email === email)) {
      $("#authMessage").textContent = "This email is already registered. Please log in.";
      return;
    }

    // Demo only: this stores a password in browser storage.
    // Never use this approach for a real authentication system.
    users.push({ name, email, password });
    writeStorage(KEYS.users, users);
    writeStorage(KEYS.session, { name, email });
  } else {
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
      $("#authMessage").textContent = "Email or password is incorrect.";
      return;
    }

    writeStorage(KEYS.session, { name: user.name, email: user.email });
  }

  updateProfile();
  closeModal("authModal");
  $("#authForm").reset();
});

$("#logoutButton").addEventListener("click", () => {
  localStorage.removeItem(KEYS.session);
  updateProfile();
  $("#profileMenu").classList.add("hidden");
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal("authModal");
    closeModal("detailsModal");
    $("#profileMenu").classList.add("hidden");
  }
});

// Initialise page. Modals remain closed until requested.
closeModal("authModal");
closeModal("detailsModal");
$("#profileMenu").classList.add("hidden");

setAuthMode("register");
updateProfile();
renderMovies();
renderContinueWatching();
function markAsWatched(id) {
  const movie = MOVIES.find((item) => item.id === Number(id));

  if (!movie) return;

  viewingHistory = viewingHistory.filter(
    (item) => item.id !== movie.id
  );

  viewingHistory.unshift({
    id: movie.id,
    watchedAt: new Date().toISOString()
  });

  localStorage.setItem(
    "cineverseViewingHistory",
    JSON.stringify(viewingHistory)
  );

  if (typeof saveProgress === "function") {
    saveProgress(movie.id, 100);
  }

  renderHistory();
  renderMovies();

  if (typeof renderContinueWatching === "function") {
    renderContinueWatching();
  }

  showDetails(movie.id);
}

function renderHistory() {
  const grid = document.getElementById("historyGrid");
  const empty = document.getElementById("historyEmpty");

  if (!grid || !empty) return;

  const watchedMovies = viewingHistory
    .map((item) => ({
      ...item,
      movie: MOVIES.find((movie) => movie.id === item.id)
    }))
    .filter((item) => item.movie);

  grid.innerHTML = "";

  empty.style.display = watchedMovies.length ? "none" : "block";

  watchedMovies.forEach((item) => {
    const card = document.createElement("div");

    card.innerHTML = `
      ${movieCard(item.movie)}
      <p class="history-date">
        Watched: ${new Date(item.watchedAt).toLocaleDateString()}
      </p>
      <button
        class="secondary-button"
        type="button"
        data-action="remove-history"
        data-id="${item.movie.id}"
      >
        Remove from History
      </button>
    `;

    grid.appendChild(card);
  });
}

document
  .getElementById("clearHistoryButton")
  ?.addEventListener("click", () => {
    if (!viewingHistory.length) return;

    if (!confirm("Clear your entire viewing history?")) return;

    viewingHistory = [];

    localStorage.setItem(
      "cineverseViewingHistory",
      JSON.stringify(viewingHistory)
    );

    renderHistory();
    renderMovies();
  });