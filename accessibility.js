(() => {
  "use strict";
  const FALLBACK="https://placehold.co/500x750/171117/F5C451?text=CINEVERSE";
  function init(){
    if(window.CINEVERSE_ACCESSIBILITY_INITIALIZED)return;
    window.CINEVERSE_ACCESSIBILITY_INITIALIZED=true;
    const reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if(reduce?.matches)document.documentElement.classList.add("reduced-motion");
    reduce?.addEventListener?.("change",e=>document.documentElement.classList.toggle("reduced-motion",e.matches));
    document.addEventListener("error",event=>{
      const img=event.target;
      if(img instanceof HTMLImageElement&&!img.dataset.fallbackTried){
        img.dataset.fallbackTried="true";
        img.src=img.dataset.fallback||FALLBACK;
      }
    },true);
    document.querySelectorAll(".modal-backdrop").forEach(modal=>{
      modal.addEventListener("click",event=>{
        if(event.target===modal)window.CINEVERSE?.closeModal(modal);
      });
    });
    document.addEventListener("keydown",event=>{
      if(event.key!=="Escape")return;
      const modal=document.querySelector(".modal-backdrop:not(.hidden)");
      if(modal)window.CINEVERSE?.closeModal(modal);
    });
    document.querySelectorAll("img").forEach(img=>{if(!img.alt)img.alt="CINEVERSE movie artwork";});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();


