
/* ==========================================
   CINEVERSE — COMMIT 22
   Continue Watching & Playback Progress
   ========================================== */

(() => {
  "use strict";

  const STORAGE_KEY = "cineverse_continue_watching_v1";

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

  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  function readProgress() {
    try {
      const parsed = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveProgress(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function ensureStyles() {
    if (document.querySelector("#cvContinueStyles")) return;

    const style = document.createElement("style");
    style.id = "cvContinueStyles";

    style.textContent = `
      .cv-continue-section {
        margin: 34px auto;
        padding: 24px;
        max-width: 1400px;
        color: var(--text-color, #fff);
        background: var(--card-bg, rgba(255,255,255,.035));
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 20px;
      }

      .cv-continue-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 22px;
      }

      .cv-continue-header h2 {
        margin: 0;
        font-size: clamp(1.4rem, 3vw, 2rem);
      }

      .cv-continue-subtitle {
        margin-top: 7px;
        color: rgba(255,255,255,.62);
        font-size: .9rem;
      }

      .cv-continue-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 18px;
      }

      .cv-continue-card {
        display: grid;
        grid-template-columns: 100px minmax(0, 1fr);
        gap: 14px;
        padding: 12px;
        background: rgba(255,255,255,.045);
        border: 1px solid rgba(255,255,255,.09);
        border-radius: 14px;
      }

      .cv-continue-poster {
        width: 100%;
        height: 145px;
        object-fit: cover;
        background: rgba(255,255,255,.08);
        border-radius: 9px;
      }

      .cv-continue-card h3 {
        margin: 2px 0 9px;
        font-size: 1rem;
        line-height: 1.4;
      }

      .cv-continue-percent {
        margin-bottom: 8px;
        color: #ff6578;
        font-size: .85rem;
      }

      .cv-continue-track {
        height: 6px;
        margin: 8px 0 13px;
        overflow: hidden;
        background: rgba(255,255,255,.13);
        border-radius: 99px;
      }

      .cv-continue-fill {
        height: 100%;
        background: linear-gradient(90deg, #c91f3b, #ff6578);
        border-radius: inherit;
      }

      .cv-continue-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
      }

      .cv-continue-btn {
        padding: 8px 10px;
        color: white;
        background: #c91f3b;
        border: 0;
        border-radius: 8px;
        cursor: pointer;
        font: inherit;
        font-size: .8rem;
      }

      .cv-continue-btn.secondary {
        background: rgba(255,255,255,.12);
      }

      .cv-continue-empty {
        grid-column: 1/-1;
        padding: 30px 12px;
        text-align: center;
        color: rgba(255,255,255,.65);
      }

      .cv-continue-empty strong {
        display: block;
        margin-bottom: 8px;
        color: inherit;
        font-size: 1.1rem;
      }

      @media (max-width: 520px) {
        .cv-continue-section { padding: 16px; }
        .cv-continue-grid { grid-template-columns: 1fr; }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureSection() {
    let section = document.querySelector("#cineverseContinueWatching");

    if (section) return section;

    section = document.createElement("section");
    section.id = "cineverseContinueWatching";
    section.className = "cv-continue-section";

    section.innerHTML = `
      <div class="cv-continue-header">
        <div>
          <h2>Continue Watching</h2>
          <div class="cv-continue-subtitle">
            Pick up where you left off.
          </div>
        </div>
      </div>

      <div class="cv-continue-grid" id="cvContinueGrid"></div>
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

    section.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cv-action]");
      if (!button) return;

      const id = button.dataset.movieId;
      const action = button.dataset.cvAction;

      if (action === "remove") {
        saveProgress(readProgress().filter(
          (item) => String(item.id) !== id
        ));
        render();
      }

      if (action === "reset") {
        updateProgress(id, 0);
        render();
      }

      if (action === "resume") {
        const movie = getMovies().find(
          (item) => getId(item) === id
        );

        if (movie && typeof showDetails === "function") {
          showDetails(movie.id);
        } else {
          window.dispatchEvent(new CustomEvent(
            "cineverse:resume",
            { detail: { movieId: id } }
          ));
        }
      }
    });

    return section;
  }

  function updateProgress(movieId, percent, extra = {}) {
    const id = String(movieId);
    const value = Math.max(0, Math.min(100, Number(percent) || 0));

    const items = readProgress();
    const existing = items.find(
      (item) => String(item.id) === id
    );

    const updated = {
      ...(existing || {}),
      ...extra,
      id,
      percent: value,
      updatedAt: Date.now()
    };

    const filtered = items.filter(
      (item) => String(item.id) !== id
    );

    // Completed movies are removed from Continue Watching.
    if (value < 100 && value > 0) {
      filtered.unshift(updated);
    }

    saveProgress(filtered.slice(0, 50));
    render();

    return updated;
  }

  function render() {
    const section = document.querySelector("#cineverseContinueWatching");
    const grid = section?.querySelector("#cvContinueGrid");

    if (!grid) return;

    const movies = getMovies();
    const progressItems = readProgress();

    const entries = progressItems
      .map((item) => {
        const movie = movies.find(
          (candidate) => getId(candidate) === String(item.id)
        );

        return movie ? { movie, item } : null;
      })
      .filter(Boolean)
      .sort((a, b) =>
        Number(b.item.updatedAt || 0) -
        Number(a.item.updatedAt || 0)
      );

    if (!entries.length) {
      grid.innerHTML = `
        <div class="cv-continue-empty">
          <strong>No movies in progress yet</strong>
          When playback progress is recorded, your movies will appear here.
        </div>
      `;
      return;
    }

    grid.innerHTML = entries.map(({ movie, item }) => {
      const id = escapeHTML(getId(movie));
      const title = escapeHTML(getTitle(movie));
      const poster = escapeHTML(getPoster(movie));
      const percent = Math.max(
        0,
        Math.min(99, Number(item.percent) || 0)
      );

      return `
        <article class="cv-continue-card">
          ${
            poster
              ? `<img class="cv-continue-poster"
                   src="${poster}" alt="${title}" loading="lazy">`
              : `<div class="cv-continue-poster"
                   role="img" aria-label="No poster available"></div>`
          }

          <div>
            <h3>${title}</h3>
            <div class="cv-continue-percent">${percent}% watched</div>

            <div class="cv-continue-track"
                 role="progressbar"
                 aria-valuenow="${percent}"
                 aria-valuemin="0"
                 aria-valuemax="100"
                 aria-label="${title} playback progress">
              <div class="cv-continue-fill"
                   style="width:${percent}%"></div>
            </div>

            <div class="cv-continue-actions">
              <button class="cv-continue-btn"
                data-cv-action="resume" data-movie-id="${id}">
                Resume
              </button>
              <button class="cv-continue-btn secondary"
                data-cv-action="reset" data-movie-id="${id}">
                Reset
              </button>
              <button class="cv-continue-btn secondary"
                data-cv-action="remove" data-movie-id="${id}">
                Remove
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  function init() {
    ensureStyles();
    ensureSection();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.CineverseContinueWatching = {
    updateProgress,
    getProgress: readProgress,
    render
  };
})();


