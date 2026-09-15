(function(){
  const seasons={
    '2026-27':{key:'2026-27',label:'2026/27',display:'2026 / 27',current:true,status:'当前赛季',start:'2026-07-09',finalDate:'2027年5月26日',finalVenue:'法兰克福球场',finalYear:'2027'},
    '2025-26':{key:'2025-26',label:'2025/26',display:'2025 / 26',current:false,status:'已结束 · 完整归档',start:'2025-07-10',finalDate:'2026年5月20日',finalVenue:'伊斯坦布尔贝西克塔斯公园球场',finalYear:'2026'},
    '2024-25':{key:'2024-25',label:'2024/25',display:'2024 / 25',current:false,status:'已结束 · 完整归档',start:'2024-07-11',finalDate:'2025年5月21日',finalVenue:'毕尔巴鄂圣马梅斯球场',finalYear:'2025'}
  };
  const requested=new URLSearchParams(location.search).get('season');let saved='';
  try{saved=localStorage.getItem('uel-selected-season')||''}catch(error){}
  const key=seasons[requested]?requested:seasons[saved]?saved:'2026-27',meta=seasons[key];
  window.uelSeasons=seasons;window.uelSeason=meta;document.documentElement.dataset.season=key;document.documentElement.classList.toggle('archive-season',!meta.current);
  try{localStorage.setItem('uel-selected-season',key)}catch(error){}
  const picker=document.querySelector('.season');
  if(picker){
    picker.innerHTML=`<button class="season-trigger" type="button" aria-haspopup="listbox" aria-expanded="false"><span>${meta.display}</span><i>⌄</i></button><div class="season-menu" role="listbox" aria-label="选择欧罗巴赛季" hidden>${Object.values(seasons).map(item=>`<button class="season-option" type="button" role="option" data-season="${item.key}" aria-selected="${item.key===key}"><strong>${item.display}</strong><small>${item.status}</small><span>${item.key===key?'✓':''}</span></button>`).join('')}</div>`;
    const trigger=picker.querySelector('.season-trigger'),menu=picker.querySelector('.season-menu');
    const close=()=>{picker.classList.remove('open');menu.hidden=true;trigger.setAttribute('aria-expanded','false')};
    trigger.onclick=()=>{const open=menu.hidden;menu.hidden=!open;picker.classList.toggle('open',open);trigger.setAttribute('aria-expanded',String(open));if(open)menu.querySelector('[aria-selected=true]')?.focus()};
    menu.querySelectorAll('.season-option').forEach(option=>option.onclick=()=>{if(option.dataset.season===key){close();return}const active=document.querySelector('nav button.active'),view=active?.id||'standings';try{sessionStorage.setItem('uel-return-view',view)}catch(error){}const url=new URL(location.href);url.searchParams.set('season',option.dataset.season);url.hash='';location.assign(url)});
    document.addEventListener('click',event=>{if(!picker.contains(event.target))close()});
    picker.addEventListener('keydown',event=>{if(event.key==='Escape'){close();trigger.focus()}if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)&&!menu.hidden){event.preventDefault();const options=[...menu.querySelectorAll('.season-option')],index=options.indexOf(document.activeElement),next=event.key==='Home'?0:event.key==='End'?options.length-1:(index+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;options[next].focus();}});
  }
  window.uelApplySeasonCopy=()=>{
    document.title=`UEL 36 · ${meta.label}欧罗巴联赛数据中心`;
    const desc=document.querySelector('.hero .desc');if(desc)desc.textContent=`完整追踪${meta.label}欧罗巴联赛资格赛、36队联赛阶段、完整赛果、晋级路线与球队详情。`;
    const heroSeason=document.querySelector('.hero-stat small');if(heroSeason)heroSeason.textContent=`${meta.label}赛季`;
    const infoEyebrow=document.querySelector('#competitionInfo .info-hero .eyebrow');if(infoEyebrow)infoEyebrow.textContent=`THE COMPETITION · ${meta.label}`;
    const infoIntro=document.querySelector('#competitionTitle+p');if(infoIntro)infoIntro.textContent=`从资格赛、36队联赛阶段到${meta.finalVenue}决赛，了解赛制路径、淘汰机制与奖金分配。`;
    const route=document.querySelector('#competitionInfo .season-route');if(route)route.innerHTML=`<span>${meta.start}</span><i></i><strong>${meta.finalDate}</strong><small>资格赛揭幕 · ${meta.finalVenue}决赛</small>`;
    const finalFact=document.querySelector('.info-facts article:last-child small');if(finalFact)finalFact.textContent=`${meta.finalDate} · ${meta.finalVenue}`;
    const finalNode=document.querySelector('.knockout-route>div:nth-of-type(4) small');if(finalNode)finalNode.textContent=`${meta.finalVenue} · 单场`;
    const pulseFinal=document.querySelector('.pulse .top');if(pulseFinal)pulseFinal.innerHTML=`<span>${meta.finalYear}决赛</span><strong>${meta.finalVenue} <i>${meta.finalDate.replace(/^\d{4}年/,'')}</i></strong>`;
    const latest=document.querySelector('#latest h2');if(latest)latest.textContent=meta.current?'最近赛果':'赛季末赛果';
    if(!meta.current){
      const source=document.querySelector('#latest .data-source-panel');if(source)source.innerHTML=`<b>历史赛果数据来源</b><span>UEFA 官方比赛接口完整静态归档；半场数据无法可靠还原时显示“—”。</span><a href="https://www.uefa.com/uefaeuropaleague/history/" target="_blank" rel="noopener">UEFA 欧罗巴历史赛季</a>`;
      const infoSource=document.querySelector('.info-sources span');if(infoSource)infoSource.textContent=`赛事结构和结果按UEFA ${meta.label}官方归档；奖金图保留2025/26预计口径供参考，并非所选赛季实际结算。`;
    }
  };
  window.uelRestoreSeasonView=()=>{let view='';try{view=sessionStorage.getItem('uel-return-view')||'';sessionStorage.removeItem('uel-return-view')}catch(error){}if(view&&view!=='standings')setTimeout(()=>document.getElementById(view)?.click(),120)};
  window.uelApplySeasonCopy();
})();
