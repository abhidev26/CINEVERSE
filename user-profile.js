
(() => {
  "use strict";
  document.addEventListener("cineverse:profilechange",event=>{
    const genre=event.detail?.profile?.genre;
    if(genre&&window.CineversePersonalized)window.CineversePersonalized.render();
  });
})();