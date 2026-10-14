```javascript
// ==============================================
// CINEVERSE — COMMIT 14
// Advanced Movie Search & Genre Filters
// ==============================================

const MOVIES = [
  {
    id: 1,
    title: "Interstellar",
    genre: "Sci-Fi",
    year: 2014,
    rating: 8.7,
    duration: "169 min",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    description: "A team of explorers travels beyond this galaxy to discover whether humanity has a future among the stars."
  },
  {
    id: 2,
    title: "Inception",
    genre: "Sci-Fi",
    year: 2010,
    rating: 8.8,
    duration: "148 min",
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    description: "A skilled thief enters people's dreams to steal secrets and faces his most difficult mission."
  },
  {
    id: 3,
    title: "The Dark Knight",
    genre: "Action",
    year: 2008,
    rating: 9.0,
    duration: "152 min",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description: "Batman faces a criminal mastermind threatening to plunge Gotham City into chaos."
  },
  {
    id: 4,
    title: "Avatar",
    genre: "Adventure",
    year: 2009,
    rating: 7.9,
    duration: "162 min",
    poster: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    description: "A former Marine discovers the extraordinary world of Pandora."
  },
  {
    id: 5,
    title: "The Avengers",
    genre: "Action",
    year: 2012,
    rating: 8.0,
    duration: "143 min",
    poster: "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
    description: "Earth's greatest heroes join forces to stop a powerful threat."
  },
  {
    id: 6,
    title: "Joker",
    genre: "Drama",
    year: 2019,
    rating: 8.4,
    duration: "122 min",
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    description: "A struggling comedian's life takes a dark turn in Gotham City."
  },
  {
    id: 7,
    title: "Dune",
    genre: "Adventure",
    year: 2021,
    rating: 8.0,
    duration: "155 min",
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    description: "A young heir travels to a dangerous desert planet that holds the future of his family."
  },
  {
    id: 8,
    title: "Spider-Man: Into the Spider-Verse",
    genre: "Animation",
    year: 2018,
    rating: 8.4,
    duration: "117 min",
    poster: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    description: "Miles Morales discovers his powers and meets Spider heroes from different dimensions."
  },
  {
    id: 9,
    title: "The Matrix",
    genre: "Sci-Fi",
    year: 1999,
    rating: 8.7,
    duration: "136 min",
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    description: "A computer hacker discovers that reality is not what it appears to be."
  },
  {
    id: 10,
    title: "John Wick",
    genre: "Action",
    year: 2014,
    rating: 7.4,
    duration: "101 min",
    poster: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
    description: "A retired assassin returns to the criminal underworld after a devastating loss."
  },
  {
    id: 11,
    title: "Shutter Island",
    genre: "Thriller",
    year: 2010,
    rating: 8.2,
    duration: "138 min",
    poster: "https://image.tmdb.org/t/p/w500/4GDy0PHYX3VRXUtwK5ysFbg3kEx.jpg",
    description: "Two investigators uncover disturbing secrets at a remote psychiatric facility."
  },
  {
    id: 12,
    title: "Coco",
    genre: "Animation",
    year: 2017,
    rating: 8.4,
    duration: "105 min",
    poster: "https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg",
    description: "A young musician journeys into the Land of the Dead to discover his family's history."
  }
];

// ==============================================
// STORAGE
// ==============================================

const KEYS = {
  list: "cineverseWatchlist",
  progress: "cineverseProgress",
  users: "cineverseDemoUsers",
  session: "cineverseDemoSession",
  history: "cineverseViewingHistory"
};

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Could not save browser data:", error);
  }
}

let watchlist = readStorage(KEYS.list, []);
let progress = readStorage(KEYS.progress, {});
let users = readStorage(KEYS.users, []);
let session = readStorage(KEYS.session, null);
let viewingHistory = readStorage(KEYS.history, []);

const $ = selector => document.querySelector(selector);

const getMovie = id =>
  MOVIES.find(movie => movie.id === Number(id));

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function isSaved(id) {
  return watchlist.includes(Number(id));
}

function isWatched(id) {
  return viewingHistory.some(
    item => Number(item.id) === Number(id)
  );
}

// Keep stored data compatible with the current movie collection.
watchlist = watchlist
  .map(item => Number(typeof item === "object" ? item.id : item))
  .filter(id => MOVIES.some(movie => movie.id === id));

viewingHistory = viewingHistory
  .map(item => {
    const id = Number(typeof item === "object" ? item.id : item);
    if (!getMovie(id)) return null;

    return {
      id,
      watchedAt:
        typeof item === "object" && item.watchedAt
          ? item.watchedAt
          : new Date().toISOString()
    };
  })
  .filter(Boolean);

writeStorage(KEYS.list, watchlist);
writeStorage(KEYS.history, viewingHistory);

// ==============================================
// MOVIE CARD
// ==============================================

function movieCard(movie) {
  const watchedBadge = isWatched(movie.id)
    ? '<span class="watched-badge">✓ WATCHED</span>'
    : "";

  const savedLabel = isSaved(movie.id)
    ? "♥ Saved"
    : "+ Watchlist";

  const percent = Number(progress[movie.id] || 0);

  return `
    <article class="movie-card">
      <div class="poster">
        ${watchedBadge}

        <img
          src="${movie.poster}"
          alt="${escapeHTML(movie.title)} poster"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/400x600/11131e/8b7cff?text=CINEVERSE';"
        >

        <span class="rating-badge">★ ${movie.rating}</span>
      </div>

      <div class="movie-info">
        <p class="eyebrow">${escapeHTML(movie.genre)} · ${movie.year}</p>
        <h3>${escapeHTML(movie.title)}</h3>
        <p class="movie-description">${movie.duration}</p>

        ${
          percent > 0 && percent < 100
            ? `<p class="history-date">${percent}% watched</p>`
            : ""
        }

        <div class="movie-actions">
          <button
            class="primary-button"
            type="button"
            data-action="details"
            data-id="${movie.id}"
          >Details</button>

          <button
            class="secondary-button"
            type="button"
            data-action="watchlist"
            data-id="${movie.id}"
          >${savedLabel}</button>
        </div>
      </div>
    </article>
  `;
}

// ==============================================
// COMMIT 14: ADVANCED SEARCH & FILTERS
// ==============================================

function renderMovies() {
  const grid = $("#movieGrid");
  if (!grid) return;

  const search = ($("#searchInput")?.value || "")
    .trim()
    .toLowerCase();

  const genre = ($("#genreFilter")?.value || "all")
    .toLowerCase();

  const sort = $("#sortFilter")?.value || "default";

  let filteredMovies = MOVIES.filter(movie => {
    const matchesSearch =
      movie.title.toLowerCase().includes(search) ||
      movie.genre.toLowerCase().includes(search) ||
      String(movie.year).includes(search);

    const matchesGenre =
      genre === "all" ||
      movie.genre.toLowerCase() === genre;

    return matchesSearch && matchesGenre;
  });

  if (sort === "rating") {
    filteredMovies.sort((a, b) => b.rating - a.rating);
  } else if (sort === "year") {
    filteredMovies.sort((a, b) => b.year - a.year);
  } else if (sort === "title") {
    filteredMovies.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  grid.innerHTML = filteredMovies.map(movieCard).join("");

  const emptyMessage = $("#emptyMessage");
  if (emptyMessage) {
    emptyMessage.hidden = filteredMovies.length > 0;
  }

  const resultsCount = $("#resultsCount");
  if (resultsCount) {
    resultsCount.textContent =
      `${filteredMovies.length} movie${filteredMovies.length === 1 ? "" : "s"}`;
  }
}

$("#searchInput")?.addEventListener("input", renderMovies);
$("#genreFilter")?.addEventListener("change", renderMovies);
$("#sortFilter")?.addEventListener("change", renderMovies);

$("#resetFilters")?.addEventListener("click", () => {
  if ($("#searchInput")) $("#searchInput").value = "";
  if ($("#genreFilter")) $("#genreFilter").value = "all";
  if ($("#sortFilter")) $("#sortFilter").value = "default";

  renderMovies();
});

// ==============================================
// WATCHLIST
// ==============================================

function toggleWatchlist(id) {
  id = Number(id);

  if (isSaved(id)) {
    watchlist = watchlist.filter(item => item !== id);
  } else {
    watchlist.unshift(id);
  }

  writeStorage(KEYS.list, watchlist);
  renderMovies();
  renderWatchlist();

  if ($("#detailsModal") &&
      !$("#detailsModal").classList.contains("hidden")) {
    showDetails(id);
  }
}

function renderWatchlist() {
  const grid = $("#watchlistGrid");
  const empty = $("#watchlistEmpty");
  const count = $("#watchlistCount");

  if (!grid) return;

  const savedMovies = watchlist.map(getMovie).filter(Boolean);
  grid.innerHTML = savedMovies.map(movieCard).join("");

  if (count) count.textContent = savedMovies.length;
  if (empty) empty.hidden = savedMovies.length > 0;
}

// ==============================================
// CONTINUE WATCHING
// ==============================================

function renderContinueWatching() {
  const grid = $("#continueGrid");
  const empty = $("#continueEmpty");

  if (!grid) return;

  const movies = MOVIES.filter(movie => {
    const amount = Number(progress[movie.id] || 0);
    return amount > 0 && amount < 100;
  });

  grid.innerHTML = movies.map(movie => `
    <div class="history-card">
      ${movieCard(movie)}

      <div class="movie-info">
        <label for="progress-${movie.id}">
          Progress: <span id="progress-label-${movie.id}">${Number(progress[movie.id])}%</span>
        </label>

        <input
          id="progress-${movie.id}"
          type="range"
          min="0"
          max="100"
          value="${Number(progress[movie.id])}"
          data-progress-id="${movie.id}"
          style="width:100%;"
        >
      </div>
    </div>
  `).join("");

  if (empty) empty.hidden = movies.length > 0;
}

function saveProgress(id, amount) {
  id = Number(id);
  amount = Math.max(0, Math.min(100, Number(amount)));

  if (!getMovie(id)) return;

  progress[id] = amount;
  writeStorage(KEYS.progress, progress);
}

// ==============================================
// VIEWING HISTORY
// ==============================================

function markAsWatched(id) {
  id = Number(id);
  if (!getMovie(id)) return;

  viewingHistory = viewingHistory.filter(
    item => Number(item.id) !== id
  );

  viewingHistory.unshift({
    id,
    watchedAt: new Date().toISOString()
  });

  progress[id] = 100;

  writeStorage(KEYS.history, viewingHistory);
  writeStorage(KEYS.progress, progress);

  renderMovies();
  renderWatchlist();
  renderContinueWatching();
  renderHistory();
  showDetails(id);
}

function renderHistory() {
  const grid = $("#historyGrid");
  const empty = $("#historyEmpty");

  if (!grid) return;

  const entries = viewingHistory
    .map(item => ({
      ...item,
      movie: getMovie(item.id)
    }))
    .filter(item => item.movie);

  grid.innerHTML = entries.map(item => {
    const date = Date.parse(item.watchedAt);
    const formattedDate = Number.isNaN(date)
      ? "Date unavailable"
      : new Date(date).toLocaleDateString();

    return `
      <div class="history-card">
        ${movieCard(item.movie)}
        <p class="history-date">Watched: ${formattedDate}</p>
        <button
          class="secondary-button"
          type="button"
          data-action="remove-history"
          data-id="${item.movie.id}"
        >Remove from History</button>
      </div>
    `;
  }).join("");

  if (empty) empty.hidden = entries.length > 0;
}

$("#clearHistoryButton")?.addEventListener("click", () => {
  if (!viewingHistory.length) return;
  if (!confirm("Clear your entire viewing history?")) return;

  viewingHistory = [];
  writeStorage(KEYS.history, viewingHistory);

  renderHistory();
  renderMovies();
});

// ==============================================
// MOVIE DETAILS MODAL
// ==============================================

function showDetails(id) {
  const movie = getMovie(id);
  const modal = $("#detailsModal");
  const content = $("#detailsContent");

  if (!movie || !modal || !content) return;

  const percent = Number(progress[movie.id] || 0);

  content.innerHTML = `
    <div class="details-layout">
      <img
        class="details-poster"
        src="${movie.poster}"
        alt="${escapeHTML(movie.title)} poster"
        onerror="this.onerror=null;this.src='https://placehold.co/400x600/11131e/8b7cff?text=CINEVERSE';"
      >

      <div class="details-info">
        <p class="eyebrow">CINEVERSE MOVIE DETAILS</p>
        <h2>${escapeHTML(movie.title)}</h2>

        <p>★ ${movie.rating} / 10 · ${movie.year} · ${escapeHTML(movie.genre)}</p>
        <p>${escapeHTML(movie.description)}</p>
        <p>Runtime: ${movie.duration}</p>

        <div class="movie-actions">
          <button
            class="primary-button"
            type="button"
            data-action="start"
            data-id="${movie.id}"
          >Start Watching</button>

          <button
            class="secondary-button"
            type="button"
            data-action="watchlist"
            data-id="${movie.id}"
          >${isSaved(movie.id) ? "♥ Remove from Watchlist" : "+ Add to Watchlist"}</button>

          <button
            class="secondary-button watched-button"
            type="button"
            data-action="watched"
            data-id="${movie.id}"
          >${isWatched(movie.id) ? "✓ Watched" : "✓ Mark as Watched"}</button>
        </div>

        <label for="detailProgress">
          Viewing progress: <span id="detailProgressLabel">${percent}%</span>
        </label>

        <input
          id="detailProgress"
          type="range"
          min="0"
          max="100"
          value="${percent}"
          data-progress-id="${movie.id}"
          style="width:100%;"
        >
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

document.addEventListener("click", event => {
  const closeButton = event.target.closest("[data-close]");

  if (closeButton) {
    closeModal(closeButton.dataset.close);
    return;
  }

  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const id = Number(button.dataset.id);

  if (action === "details") {
    showDetails(id);
  } else if (action === "watchlist") {
    toggleWatchlist(id);
  } else if (action === "watched") {
    markAsWatched(id);
  } else if (action === "remove-history") {
    viewingHistory = viewingHistory.filter(
      item => Number(item.id) !== id
    );

    writeStorage(KEYS.history, viewingHistory);
    renderHistory();
    renderMovies();

    if ($("#detailsModal") &&
        !$("#detailsModal").classList.contains("hidden")) {
      showDetails(id);
    }
  } else if (action === "start") {
    saveProgress(id, Math.max(5, Number(progress[id] || 0)));
    renderMovies();
    renderContinueWatching();
    showDetails(id);
  }
});

document.addEventListener("input", event => {
  const slider = event.target.closest("[data-progress-id]");
  if (!slider) return;

  const id = Number(slider.dataset.progressId);
  const amount = Number(slider.value);

  saveProgress(id, amount);

  const detailLabel = $("#detailProgressLabel");
  if (detailLabel && slider.id === "detailProgress") {
    detailLabel.textContent = `${amount}%`;
  }

  const progressLabel = $(`#progress-label-${id}`);
  if (progressLabel) {
    progressLabel.textContent = `${amount}%`;
  }

  renderMovies();
});

document.addEventListener("change", event => {
  if (!event.target.matches("[data-progress-id]")) return;

  const id = Number(event.target.dataset.progressId);
  const amount = Number(event.target.value);

  if (amount >= 100) {
    markAsWatched(id);
    return;
  }

  renderContinueWatching();
});

// ==============================================
// DEMO PROFILE
// ==============================================

let authMode = "login";

function setAuthMode(mode) {
  authMode = mode;

  const registering = mode === "register";

  if ($("#authTitle")) {
    $("#authTitle").textContent = registering
      ? "Create Your Profile"
      : "Sign In";
  }

  if ($("#authSubmit")) {
    $("#authSubmit").textContent = registering
      ? "Create Account"
      : "Sign In";
  }

  if ($("#authSwitch")) {
    $("#authSwitch").textContent = registering
      ? "Already registered? Sign in"
      : "New here? Create an account";
  }

  if ($("#nameField")) {
    $("#nameField").classList.toggle("hidden", !registering);
  }

  if ($("#authName")) {
    $("#authName").required = registering;
  }
}

function updateProfile() {
  if (session) {
    if ($("#profileButton")) {
      $("#profileButton").textContent = session.name || "My Profile";
    }

    if ($("#profileMessage")) {
      $("#profileMessage").textContent = `Signed in as ${session.email}`;
    }

    $("#authForm")?.classList.add("hidden");
    $("#authSwitch")?.classList.add("hidden");
    $("#logoutButton")?.classList.remove("hidden");
  } else {
    if ($("#profileButton")) {
      $("#profileButton").textContent = "My Profile";
    }

    if ($("#profileMessage")) {
      $("#profileMessage").textContent = "Sign in or create a demo account.";
    }

    $("#authForm")?.classList.remove("hidden");
    $("#authSwitch")?.classList.remove("hidden");
    $("#logoutButton")?.classList.add("hidden");

    setAuthMode("login");
  }
}

$("#profileButton")?.addEventListener("click", () => {
  updateProfile();
  $("#authModal")?.classList.remove("hidden");
  $("#authModal")?.setAttribute("aria-hidden", "false");
});

$("#authSwitch")?.addEventListener("click", () => {
  setAuthMode(authMode === "login" ? "register" : "login");
});

$("#authForm")?.addEventListener("submit", event => {
  event.preventDefault();

  const name = $("#authName")?.value.trim() || "";
  const email = $("#authEmail")?.value.trim().toLowerCase() || "";
  const password = $("#authPassword")?.value || "";

  if (authMode === "register") {
    if (!name) {
      alert("Enter your name.");
      return;
    }

    if (users.some(user => user.email === email)) {
      alert("This email is already registered. Please sign in.");
      setAuthMode("login");
      return;
    }

    users.push({ name, email, password });
    writeStorage(KEYS.users, users);
  }

  const user = users.find(
    item => item.email === email && item.password === password
  );

  if (!user) {
    alert("Account not found or password incorrect. Try creating a demo account.");
    return;
  }

  session = { name: user.name, email: user.email };
  writeStorage(KEYS.session, session);

  updateProfile();
  closeModal("authModal");
});

$("#logoutButton")?.addEventListener("click", () => {
  session = null;

  try {
    localStorage.removeItem(KEYS.session);
  } catch (error) {
    console.error(error);
  }

  updateProfile();
  closeModal("authModal");
});

// Close modals with Escape.
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal("detailsModal");
    closeModal("authModal");
  }
});

// ==============================================
// INITIALIZE
// ==============================================

function initializeCineverse() {
  renderMovies();
  renderWatchlist();
  renderContinueWatching();
  renderHistory();
  updateProfile();

  closeModal("detailsModal");
  closeModal("authModal");

  console.log("CINEVERSE loaded successfully.");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCineverse);
} else {
  initializeCineverse();
}
```