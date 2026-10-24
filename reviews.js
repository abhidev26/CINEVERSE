
(() => {
  "use strict";
  const KEY="cineverse_reviews_final";
  const $=s=>document.querySelector(s);
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}");}catch{return {};}};
  const write=data=>{try{localStorage.setItem(KEY,JSON.stringify(data));}catch{}};
  function refresh(){
    const panel=$("#reviewsPanel"), movie=window.CINEVERSE?.state.activeMovie;
    if(!panel||!movie)return;
    const all=read(),reviews=Array.isArray(all[movie.id])?all[movie.id]:[];
    panel.innerHTML=`<h3>Audience notes <span style="color:var(--muted);font-size:11px;font-weight:400">(${reviews.length})</span></h3>
      <form class="review-form" id="reviewForm">
        <label class="sr-only" for="reviewRating">Your rating</label><select id="reviewRating" required><option value="5">★★★★★ — Loved it</option><option value="4">★★★★☆ — Really good</option><option value="3">★★★☆☆ — It was good</option><option value="2">★★☆☆☆ — Not for me</option><option value="1">★☆☆☆☆ — Disappointing</option></select>
        <label class="sr-only" for="reviewText">Write your review</label><textarea id="reviewText" maxlength="500" placeholder="What stayed with you? (500 characters max)" required></textarea>
        <button class="button button-primary button-small" type="submit">Post your note ↗</button>
      </form><div class="review-list">${reviews.length?reviews.map(r=>`<article class="review-item"><strong>${window.CINEVERSE.escapeHtml(r.name||"Viewer")}</strong><span>${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}</span><p>${window.CINEVERSE.escapeHtml(r.text)}</p></article>`).join(""):'<p class="section-subtitle">Be the first to leave a note about this title.</p>'}</div>`;
    $("#reviewForm").addEventListener("submit",e=>{e.preventDefault();const text=$("#reviewText").value.trim();if(!text)return;const profile=window.CINEVERSE.state.profile;const data=read();data[movie.id]=Array.isArray(data[movie.id])?data[movie.id]:[];data[movie.id].unshift({name:profile.name||"Viewer",rating:Number($("#reviewRating").value),text:text.slice(0,500),createdAt:Date.now()});data[movie.id]=data[movie.id].slice(0,30);write(data);refresh();window.CINEVERSE.toast("Your review was saved in this browser.");});
  }
  document.addEventListener("cineverse:movieopen",refresh);
  window.CineverseReviews={refresh,refreshSaveButton:()=>{}};
})();