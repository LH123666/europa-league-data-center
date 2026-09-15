(function(){
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const formatters=new Map(['Europe/Zurich','Asia/Shanghai'].map(zone=>[zone,new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'})]));
  const parts=(instant,zone)=>Object.fromEntries(formatters.get(zone).formatToParts(instant).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
  // Stored date/time and prediction IDs remain Europe/Zurich. Convert presentation only.
  function beijing(date,time){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))return null;
    const wall=Date.parse(`${date}T${time}:00Z`);let instant=wall;
    for(let i=0;i<3;i++){const p=parts(instant,'Europe/Zurich');const shown=Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:00Z`);instant+=wall-shown;}
    const local=parts(instant,'Europe/Zurich');if(`${local.year}-${local.month}-${local.day}`!==date||`${local.hour}:${local.minute}`!==time)return null;
    const p=parts(instant,'Asia/Shanghai');return {date:`${p.year}-${p.month}-${p.day}`,time:`${p.hour}:${p.minute}`};
  }
  function club(raw){const t=window.uelTeamInfo(raw);return `<span class="schedule-club"><strong>${esc(t?.zh||raw)}</strong><small>${esc(t?.name||raw)}</small><span class="schedule-context"><em class="pot-${t?.pot||0}">${t?.pot?`第${t.pot}档`:'档位待核实'}</em><em>${esc(window.uelEntryLabels[t?.entry]||'参赛来源待核实')}</em><em class="unverified">上季国内排名待核实</em><em class="unverified">上季欧战表现待核实</em></span></span>`;}
  function render(fixtures,predictionSummary,open){
    const grid=document.querySelector('#scheduleGrid');
    const mapped=fixtures.map(f=>({...f,displayTime:beijing(f.date,f.time)})).sort((a,b)=>((a.displayTime?.date||a.date)+(a.displayTime?.time||a.time)).localeCompare((b.displayTime?.date||b.date)+(b.displayTime?.time||b.time)));
    document.querySelector('#fixtureCount').textContent=`${fixtures.length} 场待赛 · 全部已获取赛程 · 北京时间`;
    const days=new Map();mapped.forEach(f=>{const key=f.displayTime?.date||`${f.date}（时间待定，原赛程日期）`;if(!days.has(key))days.set(key,[]);days.get(key).push(f);});
    grid.innerHTML=fixtures.length?[...days].map(([date,fs])=>`<article class="fixture-day"><div class="fixture-date"><span>${esc(date)}</span><b>${/^\d{4}-\d{2}-\d{2}$/.test(date)?new Intl.DateTimeFormat('zh-CN',{weekday:'short',timeZone:'Asia/Shanghai'}).format(new Date(date+'T12:00:00+08:00')):''}</b></div>${fs.map(f=>{const baseline=window.uelLeagueFixtures.find(b=>b.home===f.home&&b.away===f.away),round=f.matchday||((!f.stage||f.stage==='league')?baseline?.matchday:null);return `<div class="fixture" role="button" tabindex="0" data-date="${esc(f.date)}" data-time="${esc(f.time)}" data-home="${esc(encodeURIComponent(f.home))}" data-away="${esc(encodeURIComponent(f.away))}" aria-label="${esc((window.uelTeamInfo(f.home)?.zh||f.home)+' 对 '+(window.uelTeamInfo(f.away)?.zh||f.away))}，查看详情"><time>${f.displayTime?`${f.displayTime.time} · 北京时间`:'开球时间待确认'} · ${round?'联赛第 '+round+' 轮':esc(f.round||'欧罗巴')}</time><div class="fixture-teams">${club(f.home)}<i>VS</i>${club(f.away)}</div>${predictionSummary(f)}<small class="fixture-more">查看比赛详情 →</small></div>`;}).join('')}</article>`).join(''):'<div class="empty-schedule">暂无已获取的未来赛程，请查看顶部数据状态。</div>';
    grid.querySelectorAll('.fixture').forEach(el=>{const show=()=>open(decodeURIComponent(el.dataset.home),decodeURIComponent(el.dataset.away),el.dataset.date,el.dataset.time);el.onclick=show;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show();}};});
    if(!document.querySelector('#scheduleMetadataNote'))grid.insertAdjacentHTML('beforebegin','<p id="scheduleMetadataNote">北京时间已按夏令时/冬令时转换，日期同步跨日。档位和参赛来源沿用本站名单；尚未收录可靠的上赛季国内排名与欧战表现，均标为待核实，不代表未参赛。</p>');
  }
  window.uelSchedule={beijing,render,club,detailLabel:(date,time)=>{const value=beijing(date,time);return value?`${value.date} · ${value.time} · 北京时间`:`${date}${time?' · '+time:''} · 欧洲中部时间 / 时间待确认`;}};
})();
