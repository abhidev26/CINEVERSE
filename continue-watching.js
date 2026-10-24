(() => {
  "use strict";
  // This section intentionally represents recently opened titles, not actual video playback progress.
  document.addEventListener("cineverse:movieopen",()=>window.CINEVERSE?.renderHistory());
})();
