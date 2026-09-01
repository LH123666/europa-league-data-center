(function(){
  const infoBtn=document.querySelector('#infoBtn');
  const infoPage=document.querySelector('#competitionInfo');
  const schedulePage=document.querySelector('#schedulePage');
  const regularViews=['.hero','.layout','.results'];
  const setActive=button=>{document.querySelectorAll('nav button').forEach(item=>item.classList.toggle('active',item===button))};
  const hideInfo=()=>infoPage.classList.remove('active');
  infoBtn.addEventListener('click',()=>{
    setActive(infoBtn);
    regularViews.forEach(selector=>document.querySelector(selector).style.display='none');
    schedulePage.classList.remove('active');
    infoPage.classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
  });
  document.querySelectorAll('nav button:not(#infoBtn)').forEach(button=>button.addEventListener('click',()=>{
    hideInfo();
    if(button.id==='latestBtn')setTimeout(()=>document.querySelector('#latest').scrollIntoView({behavior:'smooth'}),0);
  }));

  const map=document.querySelector('#advancementMap');
  const detail=document.querySelector('#pathDetail');
  const copy={
    all:'13支球队直接晋级，12支球队从欧罗巴资格赛突围，另有11支欧冠附加赛落败球队转入，共同组成36队联赛阶段。',
    qualifying:'欧罗巴资格赛从第一轮开始，全部采用主客场两回合；经过四轮淘汰后，12支附加赛胜者进入联赛阶段。',
    league:'13支球队直接进入联赛阶段，另有23支球队通过欧罗巴资格赛或从欧冠转入。36队统一排名，每队面对8个不同对手。',
    playoff:'第9–16名为种子队，对阵第17–24名，原则上次回合主场作战；8组两回合对决产生8支胜者。',
    knockout:'前8名与附加赛8支胜者组成16强。16强至半决赛为两回合淘汰，决赛于2027年5月26日在法兰克福单场决胜。'
  };
  document.querySelectorAll('.path-controls button').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('.path-controls button').forEach(item=>item.classList.toggle('active',item===button));
    map.dataset.stage=button.dataset.stage;
    detail.textContent=copy[button.dataset.stage];
  }));
})();
