(function(){
  const drawer=document.querySelector('#drawer'), panel=document.querySelector('#modalStandings');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toolbar=document.createElement('div');toolbar.id='matchModalToolbar';toolbar.hidden=true;
  toolbar.innerHTML='<strong>比赛数据中心</strong><div class="match-modal-switch"><button data-view="detail">比赛详情</button><button data-view="standings">积分榜</button></div><button class="match-modal-close" aria-label="关闭比赛详情">×</button>';
  document.body.appendChild(toolbar);
  let previousFocus,oldOverflow,oldPadding,active=false;
  const view=value=>{document.body.dataset.matchView=value;toolbar.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===value)));};
  toolbar.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>view(b.dataset.view));
  const closeModal=()=>document.querySelector('#close').click();toolbar.querySelector('.match-modal-close').onclick=closeModal;
  window.prepareMatchModal=(home,away)=>{
    if(!active){previousFocus=document.activeElement;oldOverflow=document.body.style.overflow;oldPadding=document.body.style.paddingRight;const gap=window.innerWidth-document.documentElement.clientWidth;document.body.style.overflow='hidden';if(gap>0)document.body.style.paddingRight=gap+'px';}
    active=true;document.body.classList.add('match-modal-open');toolbar.hidden=false;view('detail');drawer.scrollTop=0;
    const split=Math.ceil(teams.length/2),started=teams.some(t=>t[3]>0);
    const group=(items,start)=>`<section class="match-standings-group" aria-label="第${start+1}至${start+items.length}位球队"><h3>${start+1}–${start+items.length}</h3><div class="side-table-head"><span>#</span><span>球队</span><span>赛</span><span>净胜</span><span>积分</span></div><div class="side-table-body">${items.map((t,i)=>{const rank=start+i+1;return `<div data-rank="${rank}" data-club="${esc(t[1])}" class="side-team zone-${rank} ${[home,away].includes(t[1])?'selected':''} ${rank===8||rank===24?'zone-end':''}"><b>${rank}</b><span><strong title="${esc(t[0]+' / '+t[1])}">${esc(t[0])}</strong></span><i>${t[3]}</i><i>${t[7]-t[8]}</i><em>${t[9]}</em></div>`;}).join('')}</div></section>`;
    panel.innerHTML=`<div class="side-table-title"><h2>联赛阶段积分榜</h2><span>${teams.length} 队 · ${started?'当前排序':'赛前名单，序号非正式排名'}</span></div><div class="match-team-jumps"><button data-jump-club="${esc(home)}">定位主队</button><button data-jump-club="${esc(away)}">定位客队</button></div><div class="match-standings-scroll" tabindex="0" aria-label="完整积分榜，可滚动查看全部球队">${group(teams.slice(0,split),0)}${group(teams.slice(split),split)}</div><div class="side-legend"><span>1–8 直通16强</span><span>9–24 附加赛</span><span>25–36 淘汰</span></div>`;
    panel.querySelectorAll('[data-jump-club]').forEach(b=>b.onclick=()=>{const row=[...panel.querySelectorAll('[data-club]')].find(r=>r.dataset.club===b.dataset.jumpClub),scroll=panel.querySelector('.match-standings-scroll');if(row)scroll.scrollTo({top:row.getBoundingClientRect().top-scroll.getBoundingClientRect().top+scroll.scrollTop-95,behavior:'smooth'});});
    toolbar.querySelector('.match-modal-close').focus({preventScroll:true});
  };
  new MutationObserver(()=>{if(active&&!drawer.classList.contains('open')){active=false;toolbar.hidden=true;document.body.classList.remove('match-modal-open');delete document.body.dataset.matchView;document.body.style.overflow=oldOverflow;document.body.style.paddingRight=oldPadding;panel.classList.remove('open');previousFocus?.focus?.({preventScroll:true});}}).observe(drawer,{attributes:true,attributeFilter:['class']});
  document.addEventListener('keydown',e=>{if(!active)return;if(e.key==='Escape'){e.preventDefault();closeModal();}if(e.key==='Tab'){const focusable=[...toolbar.querySelectorAll('button'),...panel.querySelectorAll('button,[tabindex="0"]'),...drawer.querySelectorAll('button,input,select,textarea,a[href]')].filter(el=>!el.disabled&&el.getClientRects().length);const i=focusable.indexOf(document.activeElement);if(focusable.length&&(i<0||(e.shiftKey?i===0:i===focusable.length-1))){e.preventDefault();focusable[e.shiftKey?focusable.length-1:0].focus();}}});
})();
