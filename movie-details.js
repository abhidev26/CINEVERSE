(() => {
  "use strict";
  document.addEventListener("cineverse:movieopen",event=>{
    const movie=event.detail?.movie,container=document.querySelector("#movieExtraDetails");
    if(!movie||!container)return;
    const app=window.CINEVERSE;
    container.className="extra-details";
    container.innerHTML=`<div><span>DIRECTOR / CREATOR</span><strong>${app.escapeHtml(movie.director||"Not listed")}</strong></div><div><span>FORMAT</span><strong>${app.escapeHtml(movie.type)}</strong></div><div style="grid-column:1/-1"><span>FEATURED CAST</span><strong>${app.escapeHtml(movie.cast||"Not listed")}</strong></div>`;
  });
})();
