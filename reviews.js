
/* CINEVERSE — COMMIT 17
   User Ratings & Reviews
   Stores reviews locally in the user's browser.
*/

(() => {
  "use strict";

  const STORAGE_KEY = "cineverse_movie_reviews_v1";
  const DETAILS_ID = "detailsContent";

  let selectedRating = 5;
  let editingReviewId = null;
  let activeMovieTitle = "";

  function getReviews() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return data && typeof data === "object" ? data : {};
    } catch {
      return {};
    }
  }

  function saveReviews(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function normalizeTitle(title) {
    return title.trim().toLowerCase().replace(/\s+/g, " ");
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

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function getMovieTitle() {
    const details = document.getElementById(DETAILS_ID);
    if (!details) return "";

    const heading = details.querySelector(
      ".details-title, .movie-title, h1, h2"
    );

    if (!heading) return "";

    return heading.textContent
      .replace(/\s+/g, " ")
      .trim();
  }

  function getMovieReviews(title) {
    const allReviews = getReviews();
    const key = normalizeTitle(title);
    const reviews = allReviews[key];

    return Array.isArray(reviews) ? reviews : [];
  }

  function renderStars(rating) {
    return [1, 2, 3, 4, 5].map(number =>
      `<span class="${number <= rating ? "review-star-filled" : "review-star-empty"}">★</span>`
    ).join("");
  }

  function renderReviewSection() {
    const details = document.getElementById(DETAILS_ID);
    if (!details) return;

    const title = getMovieTitle();
    if (!title) return;

    activeMovieTitle = title;
    selectedRating = 5;
    editingReviewId = null;

    let section = document.getElementById("cineverseReviews");

    if (!section) {
      section = document.createElement("section");
      section.id = "cineverseReviews";
      section.className = "cineverse-reviews";
      details.appendChild(section);
    }

    const reviews = getMovieReviews(title);
    const average = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    const averageLabel = reviews.length
      ? `${average.toFixed(1)} / 5`
      : "No ratings yet";

    section.innerHTML = `
      <div class="reviews-heading">
        <div>
          <p class="eyebrow">COMMUNITY FEEDBACK</p>
          <h2>Ratings & Reviews</h2>
          <p class="reviews-summary">
            <span class="reviews-average">${averageLabel}</span>
            <span class="reviews-average-stars">${reviews.length ? renderStars(Math.round(average)) : "☆☆☆☆☆"}</span>
            <span class="reviews-total">${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}</span>
          </p>
        </div>
      </div>

      <form id="cineverseReviewForm" class="review-form">
        <label class="review-label">Your rating</label>
        <div class="review-rating-picker" role="group" aria-label="Choose a rating">
          ${[1, 2, 3, 4, 5].map(number => `
            <button
              type="button"
              class="rating-choice ${number <= selectedRating ? "selected" : ""}"
              data-rating="${number}"
              aria-label="${number} out of 5 stars"
              aria-pressed="${number === selectedRating}"
            >★</button>
          `).join("")}
        </div>

        <label class="review-label" for="cineverseReviewText">Write your review</label>
        <textarea
          id="cineverseReviewText"
          class="review-textarea"
          maxlength="1000"
          rows="4"
          placeholder="What did you think of this movie?"
          required
        ></textarea>

        <div class="review-form-footer">
          <span class="review-hint">Maximum 1,000 characters</span>
          <button type="submit" class="primary-button review-submit">
            Publish review
          </button>
        </div>
        <p id="cineverseReviewMessage" class="review-message" role="status"></p>
      </form>

      <div class="review-list">
        ${
          reviews.length
            ? [...reviews]
                .sort((a, b) => b.createdAt - a.createdAt)
                .map(review => `
                  <article class="review-card" data-review-id="${escapeHTML(review.id)}">
                    <div class="review-card-top">
                      <div>
                        <div class="review-card-stars">${renderStars(review.rating)}</div>
                        <p class="review-date">${escapeHTML(formatDate(review.createdAt))}</p>
                      </div>
                      <div class="review-actions">
                        <button type="button" class="review-action" data-edit-review="${escapeHTML(review.id)}">Edit</button>
                        <button type="button" class="review-action delete-review" data-delete-review="${escapeHTML(review.id)}">Delete</button>
                      </div>
                    </div>
                    <p class="review-content">${escapeHTML(review.text)}</p>
                  </article>
                `).join("")
            : `<div class="reviews-empty">
                 <span class="reviews-empty-icon">✦</span>
                 <h3>Be the first to review</h3>
                 <p>Share your thoughts on this movie.</p>
               </div>`
        }
      </div>
    `;

    attachFormEvents(section);
  }

  function attachFormEvents(section) {
    const form = section.querySelector("#cineverseReviewForm");
    const textarea = section.querySelector("#cineverseReviewText");
    const submitButton = section.querySelector(".review-submit");

    section.querySelectorAll("[data-rating]").forEach(button => {
      button.addEventListener("click", () => {
        selectedRating = Number(button.dataset.rating);

        section.querySelectorAll("[data-rating]").forEach(star => {
          const active = Number(star.dataset.rating) <= selectedRating;
          star.classList.toggle("selected", active);
          star.setAttribute(
            "aria-pressed",
            String(Number(star.dataset.rating) === selectedRating)
          );
        });
      });
    });

    form.addEventListener("submit", event => {
      event.preventDefault();

      const text = textarea.value.trim();
      const message = section.querySelector("#cineverseReviewMessage");

      if (!activeMovieTitle || !text) {
        message.textContent = "Please enter your review.";
        return;
      }

      if (text.length > 1000) {
        message.textContent = "Your review must be under 1,000 characters.";
        return;
      }

      const allReviews = getReviews();
      const key = normalizeTitle(activeMovieTitle);
      const reviews = Array.isArray(allReviews[key]) ? allReviews[key] : [];

      if (editingReviewId) {
        const index = reviews.findIndex(
          review => review.id === editingReviewId
        );

        if (index === -1) {
          message.textContent = "That review could not be found.";
          return;
        }

        reviews[index] = {
          ...reviews[index],
          rating: selectedRating,
          text,
          updatedAt: Date.now()
        };
      } else {
        reviews.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          rating: selectedRating,
          text,
          createdAt: Date.now()
        });
      }

      allReviews[key] = reviews;

      try {
        saveReviews(allReviews);
      } catch {
        message.textContent = "Could not save. Check your browser storage.";
        return;
      }

      renderReviewSection();
    });

    section.querySelectorAll("[data-edit-review]").forEach(button => {
      button.addEventListener("click", () => {
        const review = getMovieReviews(activeMovieTitle).find(
          item => item.id === button.dataset.editReview
        );

        if (!review) return;

        editingReviewId = review.id;
        selectedRating = review.rating;

        const textField = section.querySelector("#cineverseReviewText");
        textField.value = review.text;

        section.querySelectorAll("[data-rating]").forEach(star => {
          const active = Number(star.dataset.rating) <= selectedRating;
          star.classList.toggle("selected", active);
          star.setAttribute(
            "aria-pressed",
            String(Number(star.dataset.rating) === selectedRating)
          );
        });

        submitButton.textContent = "Save changes";
        textField.focus();
        textField.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });

    section.querySelectorAll("[data-delete-review]").forEach(button => {
      button.addEventListener("click", () => {
        if (!confirm("Delete this review?")) return;

        const allReviews = getReviews();
        const key = normalizeTitle(activeMovieTitle);

        allReviews[key] = (allReviews[key] || []).filter(
          review => review.id !== button.dataset.deleteReview
        );

        try {
          saveReviews(allReviews);
          renderReviewSection();
        } catch {
          alert("Could not update browser storage.");
        }
      });
    });
  }

  function initReviews() {
    const details = document.getElementById(DETAILS_ID);
    if (!details) {
      console.warn("CINEVERSE Reviews: #detailsContent was not found.");
      return;
    }

    const observer = new MutationObserver(() => {
      const title = getMovieTitle();

      if (title && title !== activeMovieTitle) {
        renderReviewSection();
      } else if (title && !document.getElementById("cineverseReviews")) {
        renderReviewSection();
      }
    });

    observer.observe(details, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Support a movie modal that is already open on initialization.
    if (getMovieTitle()) renderReviewSection();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReviews);
  } else {
    initReviews();
  }
})();
