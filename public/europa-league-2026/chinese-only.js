(function(){
  const hideEnglish=()=>document.querySelectorAll('.bilingual small,.qualification-team small,.advance-team small:not(.team-origin)').forEach(node=>node.remove());
  new MutationObserver(hideEnglish).observe(document.body,{childList:true,subtree:true});
  hideEnglish();
})();
