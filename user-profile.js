
/* ==========================================
   CINEVERSE — COMMIT 23
   User Profile & Preferences
   ========================================== */

(() => {
  "use strict";

  const STORAGE_KEY = "cineverse_user_profile_v1";

  const DEFAULT_PROFILE = {
    name: "Movie Lover",
    favoriteGenres: ["Action", "Sci-Fi"],
    theme: "dark",
    autoplayTrailers: false
  };

  const GENRES = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller"
  ];

  const getMovies = () =>
    typeof MOVIES !== "undefined" && Array.isArray(MOVIES)
      ? MOVIES
      : [];

  const readProfile = () => {
    try {
      return {
        ...DEFAULT_PROFILE,
        ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
      };
    } catch {
      return { ...DEFAULT_PROFILE };
    }
  };

  const saveProfile = (profile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
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
    if (document.querySelector("#cvProfileStyles")) return;

    const style = document.createElement("style");
    style.id = "cvProfileStyles";
    style.textContent = `
      .cv-profile {
        max-width: 1100px;
        margin: 34px auto;
        padding: 26px;
        color: var(--text-color, #fff);
        background: var(--card-bg, rgba(255,255,255,.035));
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 22px;
      }

      .cv-profile-hero {
        display: flex;
        align-items: center;
        gap: 18px;
        margin-bottom: 26px;
      }

      .cv-profile-avatar {
        display: grid;
        place-items: center;
        width: 76px;
        height: 76px;
        flex: 0 0 76px;
        color: white;
        background: linear-gradient(135deg, #c91f3b, #71152a);
        border-radius: 50%;
        font-size: 1.8rem;
        font-weight: 800;
      }

      .cv-profile-hero h2 {
        margin: 0 0 6px;
        font-size: clamp(1.5rem, 4vw, 2.2rem);
      }

      .cv-profile-hero p {
        margin: 0;
        color: rgba(255,255,255,.65);
      }

      .cv-profile-stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(0,1fr));
        gap: 12px;
        margin-bottom: 28px;
      }

      .cv-profile-stat {
        padding: 18px;
        background: rgba(255,255,255,.045);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 14px;
      }

      .cv-profile-stat strong {
        display: block;
        margin-bottom: 5px;
        color: #ff6178;
        font-size: 1.7rem;
      }

      .cv-profile-stat span {
        color: rgba(255,255,255,.65);
        font-size: .88rem;
      }

      .cv-profile-form {
        display: grid;
        grid-template-columns: repeat(2, minmax(0,1fr));
        gap: 20px;
      }

      .cv-profile-field {
        min-width: 0;
      }

      .cv-profile-field.full {
        grid-column: 1/-1;
      }

      .cv-profile-field label,
      .cv-profile-label {
        display: block;
        margin-bottom: 9px;
        font-weight: 650;
      }

      .cv-profile-field input[type="text"],
      .cv-profile-field select {
        box-sizing: border-box;
        width: 100%;
        padding: 12px 14px;
        color: inherit;
        background: rgba(255,255,255,.06);
        border: 1px solid rgba(255,255,255,.16);
        border-radius: 10px;
        font: inherit;
      }

      .cv-profile-genres {
        display: flex;
        flex-wrap: wrap;
        gap: 9px;
      }

      .cv-profile-genre {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 9px 12px;
        background: rgba(255,255,255,.055);
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 99px;
        font-size: .9rem;
      }

      .cv-profile-genre input {
        accent-color: #c91f3b;
      }

      .cv-profile-checkbox {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .cv-profile-checkbox input {
        accent-color: #c91f3b;
      }

      .cv-profile-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 24px;
      }

      .cv-profile-btn {
        padding: 12px 17px;
        color: white;
        background: #c91f3b;
        border: 0;
        border-radius: 10px;
        cursor: pointer;
        font: inherit;
        font-weight: 650;
      }

      .cv-profile-btn.secondary {
        background: rgba(255,255,255,.12);
      }

      .cv-profile-status {
        min-height: 1.4em;
        margin-top: 12px;
        color: #7ce0a3;
        font-size: .9rem;
      }

      @media(max-width: 650px) {
        .cv-profile { padding: 17px; }
        .cv-profile-stats { grid-template-columns: 1fr; }
        .cv-profile-form { grid-template-columns: 1fr; }
        .cv-profile-field.full { grid-column: auto; }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureSection() {
    let section = document.querySelector("#cineverseUserProfile");
    if (section) return section;

    section = document.createElement("section");
    section.id = "cineverseUserProfile";
    section.className = "cv-profile";

    const anchor =
      document.querySelector("#movieGrid") ||
      document.querySelector(".movie-grid") ||
      document.querySelector("main");

    if (anchor?.parentNode) {
      anchor.parentNode.insertBefore(section, anchor);
    } else {
      document.body.appendChild(section);
    }

    section.addEventListener("submit", (event) => {
      if (event.target.id !== "cvProfileForm") return;
      event.preventDefault();

      const form = event.target;
      const profile = {
        name: form.elements.profileName.value.trim() || "Movie Lover",
        favoriteGenres: Array.from(
          form.querySelectorAll('input[name="favoriteGenres"]:checked')
        ).map((input) => input.value),
        theme: form.elements.profileTheme.value,
        autoplayTrailers: form.elements.autoplayTrailers.checked
      };

      saveProfile(profile);
      applyTheme(profile.theme);
      render();

      const status = section.querySelector("#cvProfileStatus");
      if (status) status.textContent = "Preferences saved on this device.";
    });

    section.addEventListener("click", (event) => {
      if (!event.target.closest("#cvResetProfile")) return;
      saveProfile({ ...DEFAULT_PROFILE });
      applyTheme(DEFAULT_PROFILE.theme);
      render();

      const status = section.querySelector("#cvProfileStatus");
      if (status) status.textContent = "Preferences reset.";
    });

    return section;
  }

  function applyTheme(theme) {
    document.documentElement.dataset.cineverseTheme = theme;

    // Respect existing theme systems rather than overriding their classes.
    window.dispatchEvent(new CustomEvent("cineverse:themechange", {
      detail: { theme }
    }));
  }

  function render() {
    const section = document.querySelector("#cineverseUserProfile");
    if (!section) return;

    const profile = readProfile();
    const watchlist = readStoredArray([
      "cineverse_watchlist_v1",
      "cineverse_watchlist",
      "watchlist"
    ]);
    const history = readStoredArray([
      "cineverse_history_v1",
      "cineverse_history",
      "cineverse_continue_watching_v1"
    ]);

    const watchedCount = new Set(
      history.map((item) => String(
        typeof item === "object" ? item.id ?? item.movieId ?? "" : item
      )).filter(Boolean)
    ).size;

    const initial = (profile.name.trim()[0] || "M").toUpperCase();

    section.innerHTML = `
      <div class="cv-profile-hero">
        <div class="cv-profile-avatar" aria-hidden="true">
          ${escapeHTML(initial)}
        </div>
        <div>
          <h2>${escapeHTML(profile.name)}</h2>
          <p>Your CINEVERSE viewing space</p>
        </div>
      </div>

      <div class="cv-profile-stats">
        <div class="cv-profile-stat">
          <strong>${getMovies().length}</strong>
          <span>Movies in catalogue</span>
        </div>
        <div class="cv-profile-stat">
          <strong>${watchlist.length}</strong>
          <span>Saved watchlist entries</span>
        </div>
        <div class="cv-profile-stat">
          <strong>${watchedCount}</strong>
          <span>Stored progress entries</span>
        </div>
      </div>

      <form id="cvProfileForm" class="cv-profile-form">
        <div class="cv-profile-field">
          <label for="cvProfileName">Display name</label>
          <input id="cvProfileName" name="profileName"
            type="text" maxlength="40" autocomplete="nickname"
            value="${escapeHTML(profile.name)}">
        </div>

        <div class="cv-profile-field">
          <label for="cvProfileTheme">Preferred theme</label>
          <select id="cvProfileTheme" name="profileTheme">
            <option value="dark" ${profile.theme === "dark" ? "selected" : ""}>
              Dark
            </option>
            <option value="light" ${profile.theme === "light" ? "selected" : ""}>
              Light
            </option>
          </select>
        </div>

        <div class="cv-profile-field full">
          <span class="cv-profile-label">Favorite genres</span>
          <div class="cv-profile-genres">
            ${GENRES.map((genre) => `
              <label class="cv-profile-genre">
                <input type="checkbox" name="favoriteGenres"
                  value="${escapeHTML(genre)}"
                  ${profile.favoriteGenres.includes(genre) ? "checked" : ""}>
                ${escapeHTML(genre)}
              </label>
            `).join("")}
          </div>
        </div>

        <div class="cv-profile-field full">
          <label class="cv-profile-checkbox">
            <input type="checkbox" name="autoplayTrailers"
              ${profile.autoplayTrailers ? "checked" : ""}>
            Prefer automatic trailer playback when available
          </label>
        </div>

        <div class="cv-profile-field full">
          <p style="color:rgba(255,255,255,.6);font-size:.85rem;margin:0">
            Preferences are stored locally in this browser. They are not
            synced to an account or other devices.
          </p>
        </div>
      </form>

      <div class="cv-profile-actions">
        <button class="cv-profile-btn" type="submit" form="cvProfileForm">
          Save preferences
        </button>
        <button class="cv-profile-btn secondary" id="cvResetProfile" type="button">
          Reset profile
        </button>
      </div>

      <div class="cv-profile-status" id="cvProfileStatus"
        role="status" aria-live="polite"></div>
    `;
  }

  function readStoredArray(keys) {
    for (const key of keys) {
      try {
        const value = JSON.parse(localStorage.getItem(key) || "null");
        if (Array.isArray(value)) return value;
      } catch {
        // Ignore invalid data and check the next key.
      }
    }
    return [];
  }

  function init() {
    ensureStyles();
    ensureSection();
    applyTheme(readProfile().theme);
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.CineverseProfile = {
    get: readProfile,
    save(profile) {
      saveProfile({ ...DEFAULT_PROFILE, ...profile });
      applyTheme(readProfile().theme);
      render();
    },
    render,
    applyTheme
  };
})();
