(() => {
  "use strict";
  function render(){
    const app=window.CINEVERSE,grid=document.querySelector("#recommendationsGrid");if(!app||!grid)return;
    const {movies,state}=app;const recent=state.history.map(app.getMovie).filter(Boolean);
    const preferred=state.profile?.genre||recent[0]?.genre||"Adventure";
    const seen=new Set(recent.map(m=>m.id));
    let picks=movies.filter(m=>m.genre===preferred&&!seen.has(m.id));
    picks=[...picks,...movies.filter(m=>!seen.has(m.id)&&!picks.some(p=>p.id===m.id)).sort((a,b)=>b.rating-a.rating)];
    const list=picks.slice(0,5);
    grid.innerHTML=list.map(m=>`<article class="movie-card" data-movie-id="${m.id}"><div class="poster-wrap" data-open-movie="${m.id}" role="button" tabindex="0" aria-label="Open details for ${app.escapeHtml(m.title)}"><img class="poster-image" src="${m.poster}" alt="${app.escapeHtml(m.title)} poster" loading="lazy" data-fallback="${app.posterFallback}"><div class="poster-top"><span class="rating-chip">★ ${m.rating.toFixed(1)}</span><button class="save-button ${state.watchlist.includes(m.id)?"saved":""}" data-save-movie="${m.id}" type="button" aria-label="Toggle ${app.escapeHtml(m.title)} in watchlist">${state.watchlist.includes(m.id)?"✓":"＋"}</button></div><div class="poster-bottom"><span>FOR YOU</span><span class="play-hint">▶</span></div></div><div class="movie-info"><h3 class="movie-title">${app.escapeHtml(m.title)}</h3><div class="movie-subline"><span>${m.year} · ${m.duration}</span><span class="movie-genre">${m.genre}</span></div></div></article>`).join("");
  }
  document.addEventListener("DOMContentLoaded",render);
  document.addEventListener("cineverse:profilechange",render);
  document.addEventListener("cineverse:movieopen",render);
  window.CineversePersonalized={render};
})();
