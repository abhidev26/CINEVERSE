
/* ==========================================
   CINEVERSE — COMMIT 24
   Accessibility & Performance Improvements
   ========================================== */

(() => {
  "use strict";

  function addStyles() {
    if (document.querySelector("#cvAccessibilityStyles")) return;

    const style = document.createElement("style");
    style.id = "cvAccessibilityStyles";

    style.textContent = `
      /* Visible keyboard focus */
      :focus-visible {
        outline: 3px solid #ff647c !important;
        outline-offset: 4px;
      }

      /* Skip navigation link */
      .cv-skip-link {
        position: fixed;
        z-index: 99999;
        top: 12px;
        left: 12px;
        padding: 12px 16px;
        color: #fff;
        background: #c91f3b;
        border-radius: 8px;
        transform: translateY(-160%);
        transition: transform .2s ease;
      }

      .cv-skip-link:focus {
        transform: translateY(0);
      }

      /* Responsive images and embedded media */
      img {
        max-width: 100%;
      }

      iframe,
      video {
        max-width: 100%;
      }

      /* Avoid layout overflow on smaller screens */
      html {
        scroll-behavior: smooth;
        scroll-padding-top: 80px;
      }

      body {
        overflow-wrap: break-word;
      }

      button,
      input,
      select,
      textarea {
        max-width: 100%;
      }

      /* Mobile improvements */
      @media (max-width: 768px) {
        .container,
        .content,
        main {
          max-width: 100%;
        }

        .movie-grid,
        #movieGrid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        button,
        .btn {
          touch-action: manipulation;
        }

        img {
          height: auto;
        }
      }

      @media (max-width: 420px) {
        .movie-grid,
        #movieGrid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        h1 {
          font-size: clamp(1.6rem, 8vw, 2.4rem);
        }
      }

      /* Honor the visitor's motion preference */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          scroll-behavior: auto !important;
          animation-duration: .01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: .01ms !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function addSkipLink() {
    if (document.querySelector(".cv-skip-link")) return;

    const main =
      document.querySelector("main") ||
      document.querySelector("#movieGrid") ||
      document.querySelector(".movie-grid");

    if (!main) return;

    if (!main.id) main.id = "cv-main-content";

    main.setAttribute("tabindex", "-1");

    const link = document.createElement("a");
    link.className = "cv-skip-link";
    link.href = `#${main.id}`;
    link.textContent = "Skip to main content";

    document.body.prepend(link);
  }

  function improveImages() {
    document.querySelectorAll("img").forEach((img) => {
      if (!img.hasAttribute("alt")) {
        img.setAttribute("alt", "");
      }

      // Avoid changing loading behavior for the main hero image.
      const isHero = img.closest(
        ".hero, #hero, .hero-section, header"
      );

      if (!isHero && !img.hasAttribute("loading")) {
        img.loading = "lazy";
      }

      if (!isHero && !img.hasAttribute("decoding")) {
        img.decoding = "async";
      }
    });
  }

  function improveButtons() {
    document.querySelectorAll("button").forEach((button) => {
      if (!button.hasAttribute("type") &&
          !button.closest("form")) {
        button.setAttribute("type", "button");
      }

      if (
        !button.hasAttribute("aria-label") &&
        !button.textContent.trim() &&
        !button.querySelector("img[alt]")
      ) {
        button.setAttribute("aria-label", "Interactive button");
      }
    });
  }

  function observeDynamicContent() {
    if (!document.body || !("MutationObserver" in window)) return;

    const observer = new MutationObserver((mutations) => {
      const addedNodes = mutations.some((mutation) =>
        mutation.addedNodes.length > 0
      );

      if (addedNodes) {
        improveImages();
        improveButtons();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function init() {
    addStyles();
    addSkipLink();
    improveImages();
    improveButtons();
    observeDynamicContent();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
})();
