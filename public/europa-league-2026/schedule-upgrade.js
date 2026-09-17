(function(){
  const season=window.uelSeason;
  // UEFA club profiles, last updated 2026-09-14:
  // https://www.uefa.com/uefaeuropaleague/news/02a8-217364fd42e6-7e49801d8daf-1000--2026-27-europa-league-meet-the-league-phase-teams/
  const context={
    'Anderlecht':['比甲第4','欧协联附加赛'],'Ararat-Armenia':['亚美尼亚超冠军','欧协联资格赛第3轮'],'AZ Alkmaar':['荷兰杯冠军','欧协联八强'],
    'Benfica':['葡超第3','欧冠淘汰赛附加赛'],'Besiktas':['土超第4','欧协联附加赛'],'Bournemouth':['英超第6','上季无欧战记录'],
    'Celje':['斯甲冠军','欧协联十六强'],'Celta':['西甲第6','欧罗巴八强'],'Celtic':['苏超冠军','欧罗巴淘汰赛附加赛'],
    'Crystal Palace':['欧协联冠军','欧协联冠军'],'Ferencvaros':['匈甲第2','欧罗巴十六强'],'Dinamo Zagreb':['克甲冠军','欧罗巴淘汰赛附加赛'],
    'Hapoel Beer-Sheva':['以超冠军','欧协联资格赛第2轮'],'Hoffenheim':['德甲第5','上季无欧战记录'],'Jagiellonia':['波甲第3','欧协联淘汰赛附加赛'],
    'Juventus':['意甲第6','欧冠淘汰赛附加赛'],'Lech Poznan':['波甲冠军','欧协联十六强'],'Leverkusen':['德甲第6','欧冠十六强'],
    'Levski Sofia':['保甲冠军','欧协联附加赛'],'Lillestrom':['挪威杯冠军','上季未晋级欧战'],'Lyon':['法甲第4','欧罗巴十六强'],
    'Marseille':['法甲第5','欧冠联赛阶段'],'Milan':['意甲第5','上季无欧战记录'],'NEC Nijmegen':['荷甲第3','上季无欧战记录'],
    'OFI Crete':['希腊杯冠军','上季未晋级欧战'],'Olympiacos':['希超第2','欧冠淘汰赛附加赛'],'Omonia':['塞浦甲冠军','欧协联淘汰赛附加赛'],
    'Real Sociedad':['西班牙国王杯冠军','上季无欧战记录'],'Rennes':['法甲第6','上季无欧战记录'],'Salzburg':['奥甲第3','欧罗巴联赛阶段'],
    'Sparta Prague':['捷甲第2','欧协联十六强'],'Sturm Graz':['奥甲第2','欧罗巴联赛阶段'],'Sunderland':['英超第7','上季无欧战记录'],
    'Torreense':['葡萄牙杯冠军','上季无欧战记录'],'Union Saint-Gilloise':['比甲第2','欧冠联赛阶段'],'Viktoria Plzen':['捷甲第3','欧罗巴淘汰赛附加赛']
  };
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
  function club(raw){const t=window.uelTeamInfo(raw),history=context[t?.name||raw],label=t?.zh||raw;return `<span class="schedule-club">${window.uelClubLogo(raw,'md',label)}<strong>${esc(label)}</strong><small>${esc(t?.name||raw)}</small><span class="schedule-context"><em class="pot-${t?.pot||0}">${t?.pot?`第${t.pot}档`:'档位待核实'}</em><em class="entry">${esc(season.current?(window.uelEntryLabels[t?.entry]||'参赛来源待核实'):'历史归档')}</em>${season.current?`<em class="domestic" title="2025/26国内成绩或杯赛资格依据">${esc(history?.[0]||'国内资格依据待核实')}</em><em class="europe ${history?.[1]==='上季无欧战记录'?'no-record':history?.[1]==='上季未晋级欧战'?'not-qualified':''}" title="2025/26欧洲俱乐部赛事表现">${esc(history?.[1]||'上季欧战表现待核实')}</em>`:''}</span></span>`;}
  function render(fixtures,predictionSummary,open){
    const grid=document.querySelector('#scheduleGrid');
    const mapped=fixtures.map(f=>({...f,displayTime:beijing(f.date,f.time)})).sort((a,b)=>((a.displayTime?.date||a.date)+(a.displayTime?.time||a.time)).localeCompare((b.displayTime?.date||b.date)+(b.displayTime?.time||b.time)));
    document.querySelector('#fixtureCount').textContent=season.current?`${fixtures.length} 场待赛 · 全部已获取赛程 · 北京时间`:`${fixtures.length} 场完整赛程 · 全部已结束 · 北京时间`;
    const days=new Map();mapped.forEach(f=>{const key=f.displayTime?.date||`${f.date}（时间待定，原赛程日期）`;if(!days.has(key))days.set(key,[]);days.get(key).push(f);});
    grid.innerHTML=fixtures.length?[...days].map(([date,fs])=>`<article class="fixture-day"><div class="fixture-date"><span>${esc(date)}</span><b>${/^\d{4}-\d{2}-\d{2}$/.test(date)?new Intl.DateTimeFormat('zh-CN',{weekday:'short',timeZone:'Asia/Shanghai'}).format(new Date(date+'T12:00:00+08:00')):''}</b></div>${fs.map(f=>{const baseline=window.uelLeagueFixtures.find(b=>b.home===f.home&&b.away===f.away),round=f.matchday||((!f.stage||f.stage==='league')?baseline?.matchday:null),score=f.score||baseline?.score;return `<div class="fixture ${score?'fixture-complete':''}" role="button" tabindex="0" data-date="${esc(f.date)}" data-time="${esc(f.time)}" data-home="${esc(encodeURIComponent(f.home))}" data-away="${esc(encodeURIComponent(f.away))}" aria-label="${esc((window.uelTeamInfo(f.home)?.zh||f.home)+' 对 '+(window.uelTeamInfo(f.away)?.zh||f.away))}，查看详情"><time>${f.displayTime?`${f.displayTime.time} · 北京时间`:'开球时间待确认'} · ${round?'联赛第 '+round+' 轮':esc(f.round||'欧罗巴')}</time><div class="fixture-teams">${club(f.home)}<i>${score?`<b>${esc(score)}</b>`:'VS'}</i>${club(f.away)}</div>${season.current?predictionSummary(f):''}<small class="fixture-more">查看比赛详情 →</small></div>`;}).join('')}</article>`).join(''):`<div class="empty-schedule">暂无已获取的${season.current?'未来':'历史'}赛程，请查看顶部数据状态。</div>`;
    grid.querySelectorAll('.fixture').forEach(el=>{const show=()=>open(decodeURIComponent(el.dataset.home),decodeURIComponent(el.dataset.away),el.dataset.date,el.dataset.time);el.onclick=show;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show();}};});
    if(!document.querySelector('#scheduleMetadataNote'))grid.insertAdjacentHTML('beforebegin',`<p id="scheduleMetadataNote">${season.current?'北京时间已按夏令时/冬令时转换，日期同步跨日。国内信息显示2025/26联赛名次、冠军或杯赛资格依据；“无欧战记录”和“未晋级欧战”按UEFA原始口径区分。':'这是已结束赛季的144场联赛阶段完整静态归档；比赛时间换算为北京时间，比分来自UEFA官方比赛接口。'} <a href="https://www.uefa.com/uefaeuropaleague/history/" target="_blank" rel="noopener">UEFA ${season.label}赛季资料 ↗</a></p>`);
  }
  window.uelTeamContext=context;
  window.uelSchedule={beijing,render,club,detailLabel:(date,time)=>{const value=beijing(date,time);return value?`${value.date} · ${value.time} · 北京时间`:`${date}${time?' · '+time:''} · 欧洲中部时间 / 时间待确认`;}};
})();
