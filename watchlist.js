(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded",()=>{
    const button=document.querySelector("#clearWatchlist");
    button?.addEventListener("click",()=>{ /* Main application owns confirmation and clearing. */ });
  });
})();