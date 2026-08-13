(function(){
  const hideEnglish=()=>document.querySelectorAll('.bilingual small,.qualification-team small,.advance-team small').forEach(node=>node.remove());
  new MutationObserver(hideEnglish).observe(document.body,{childList:true,subtree:true});
  hideEnglish();
})();
