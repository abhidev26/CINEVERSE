(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded",()=>{
    const search=document.querySelector("#movieSearch"),clear=document.querySelector("#clearFilters");
    document.addEventListener("keydown",e=>{
      if(e.key==="/"&&!["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)&&!e.ctrlKey&&!e.metaKey){e.preventDefault();search?.focus();}
      if(e.key==="Escape"){
        const modal=document.querySelector(".modal-backdrop:not(.hidden)");
        if(modal){window.CINEVERSE?.closeModal(modal);return;}
        if(document.activeElement===search&&search.value){search.value="";window.CINEVERSE?.renderCatalog();}
      }
    });
    clear?.addEventListener("click",()=>{if(search)search.value="";});
  });
})();
