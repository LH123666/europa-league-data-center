(function(){
  const teams=qualificationNames;
  const zh=team=>teams[team]||team;
  const round2=[
    ['Mjallby','Lincoln Red Imps','3–0','0–0','3–0','Mjallby'],['Sabah','KuPS Kuopio','1–0','0–2','3–0','Sabah'],['Ararat-Armenia','Shamrock Rovers','2–0','2–1','3–2','Ararat-Armenia'],['Iberia Tbilisi','Slovan Bratislava','0–2','1–1','1–3','Slovan Bratislava'],['Aarhus','Lech Poznan','1–4','1–4','5–5 点4–3','Aarhus'],['Thun','Dinamo Zagreb','1–1','3–2','3–4','Dinamo Zagreb'],['KI Klaksvik','Kauno Zalgiris','0–0','1–0','0–1','Kauno Zalgiris'],['Larne','Red Star Belgrade','0–4','5–0','0–9','Red Star Belgrade'],['Vikingur Reykjavik','Hapoel Beer-Sheva','2–1','2–0','2–3','Hapoel Beer-Sheva'],['Fenerbahce','Gornik Zabrze','1–0','1–1','2–1','Fenerbahce'],['Sturm Graz','Hearts','4–0','0–2','6–0','Sturm Graz'],['Omonoia','Kairat Almaty','1–0','1–0','1–1 点5–6','Kairat Almaty'],['Levski Sofia','Universitatea Craiova','1–0','2–2','3–2','Levski Sofia'],['Egnatia','Celje','3–3','2–2','5–5 点1–4','Celje']
  ];
  const round3=[
    {path:'冠军路径',a:'Mjallby',b:'Slovan Bratislava',first:'08-05 00:00'},
    {path:'冠军路径',a:'Ararat-Armenia',b:'Celje',first:'08-05 00:00'},
    {path:'冠军路径',a:'Levski Sofia',b:'Kairat Almaty',first:'08-05 01:30'},
    {path:'冠军路径',a:'Hapoel Beer-Sheva',b:'Red Star Belgrade',first:'08-05 01:30'},
    {path:'冠军路径',a:'Dinamo Zagreb',b:'Kauno Zalgiris',first:'08-05 02:00'},
    {path:'联赛路径',a:'Olympiacos',b:'NEC Nijmegen',first:'08-05 02:00'},
    {path:'联赛路径',a:'Union Saint-Gilloise',b:'Bodo/Glimt',first:'08-05 02:00'},
    {path:'联赛路径',a:'Sparta Prague',b:'Lyon',first:'08-05 02:00'},
    {path:'冠军路径',a:'Aarhus',b:'Sabah',first:'08-06 00:30'},
    {path:'联赛路径',a:'Fenerbahce',b:'Sturm Graz',first:'08-06 02:00'}
  ];
  const playoffs=[
    {path:'冠军路径',a:'列夫斯基 / 凯拉特',b:'雅典AEK'},
    {path:'冠军路径',a:'萨格勒布迪纳摩 / 考纳斯',b:'维京'},
    {path:'冠军路径',a:'贝尔谢巴 / 贝尔格莱德红星',b:'奥胡斯 / 萨巴赫'},
    {path:'冠军路径',a:'凯尔特人',b:'林茨'},
    {path:'冠军路径',a:'米亚尔比 / 布拉迪斯拉发',b:'阿拉拉特 / 采列'},
    {path:'联赛路径',a:'费内巴切 / 格拉茨风暴',b:'布拉格斯巴达 / 里昂'},
    {path:'联赛路径',a:'奥林匹亚科斯 / 奈梅亨',b:'圣吉罗斯联合 / 博德闪耀'}
  ];
  const page=document.createElement('section');
  page.id='advancementPage';page.className='advancement-page';
  page.innerHTML=`
    <section class="advance-hero"><div><p class="eyebrow">LIVE QUALIFICATION MAP · 2026/27</p><h1>欧冠资格赛<br><span>实时晋级图</span></h1><p>不看模拟积分，只沿着真实的两回合对阵追踪谁晋级、谁待赛、谁转入欧联杯。</p></div><div class="advance-live"><i></i><div><b id="advanceUpdateTitle">正在检查最新数据</b><span id="advanceUpdateTime">页面打开时自动更新</span></div><button id="advanceRefresh" type="button">↻ 立即刷新</button></div></section>
    <section class="advance-overview"><article><b>14</b><span>第一轮晋级</span><small>已完成</small></article><i>→</i><article><b>14</b><span>第二轮晋级</span><small>已完成</small></article><i>→</i><article class="current"><b>10</b><span>第三轮对阵</span><small>当前轮次</small></article><i>→</i><article><b>7</b><span>附加赛胜者</span><small>进入联赛阶段</small></article></section>
    <section class="advance-path-summary"><div class="champion"><span>冠军路径</span><b>12队 → 6队 → 5个联赛阶段席位</b></div><div class="league"><span>联赛路径</span><b>8队 → 4队 → 2个联赛阶段席位</b></div></section>
    <section class="advance-board">
      <div class="advance-column completed"><header><span>ROUND 2</span><h2>第二轮</h2><small>14组 · 已结束</small></header><div id="advanceRound2"></div></div>
      <div class="advance-flow"><span>14支晋级</span><b>→</b></div>
      <div class="advance-column current"><header><span>ROUND 3</span><h2>第三轮</h2><small>10组 · 进行中</small></header><div id="advanceRound3"></div></div>
      <div class="advance-flow"><span>10支晋级</span><b>→</b></div>
      <div class="advance-column pending"><header><span>PLAY-OFFS</span><h2>附加赛</h2><small>7组 · 8月18日起</small></header><div id="advancePlayoffs"></div></div>
      <div class="advance-flow final"><span>7支晋级</span><b>→</b></div>
      <div class="league-destination"><span>LEAGUE PHASE</span><b>36</b><strong>联赛阶段</strong><small>29队直入 + 7队资格赛晋级</small></div>
    </section>
    <section class="advance-legend"><span><i class="won"></i>已晋级</span><span><i class="live"></i>当前对阵</span><span><i class="waiting"></i>待确定</span><span><i class="europa"></i>负者转入欧联杯</span></section>
    <footer class="advance-source"><div><b>自动更新说明</b><span>每次进入页面、重新打开标签页以及每10分钟，系统都会请求最新赛果；数据源暂不可用时继续显示最后一次已核对结果并明确提示。</span></div><a href="https://www.uefa.com/uefachampionsleague/news/02a6-20e5a8be4e63-ae971c582f8c-1000--champions-league-qualifying-fixtures-results-dates-how-it-/" target="_blank" rel="noopener">UEFA官方资格赛页面 ↗</a></footer>`;
  document.querySelector('main').appendChild(page);

  const teamLine=(team,mark='')=>`<span class="advance-team ${mark}"><strong>${zh(team)}</strong><small>${team}</small></span>`;
  page.querySelector('#advanceRound2').innerHTML=round2.map(([a,b,leg1,leg2,total,winner])=>`<article class="advance-tie done">${teamLine(a,winner===a?'winner':'')}<div class="leg-score-grid"><span><small>首回合 · ${zh(a)}主场</small><b>${leg1}</b></span><span><small>次回合 · ${zh(b)}主场</small><b>${leg2}</b></span><span class="aggregate"><small>两回合总比分</small><b>${total}</b></span></div>${teamLine(b,winner===b?'winner':'')}<footer><span>比分均为当场主队在前</span><b>${zh(winner)} 晋级</b></footer></article>`).join('');
  const round3Box=page.querySelector('#advanceRound3');
  function renderRound3(liveMatches=[]){
    round3Box.innerHTML=round3.map((tie,index)=>{const games=liveMatches.filter(match=>sameTie(match,tie));const completed=games.filter(match=>match.completed);const running=games.find(match=>match.inProgress);let aGoals=0,bGoals=0;completed.forEach(match=>{if(norm(match.home)===norm(tie.a)){aGoals+=match.homeScore;bGoals+=match.awayScore}else{aGoals+=match.awayScore;bGoals+=match.homeScore}});const score=completed.length?`${aGoals}–${bGoals}`:running?`${running.homeScore}–${running.awayScore}`:'VS';const state=completed.length>1?'两回合结束':completed.length===1?'首回合结束':running?'比赛进行中':`${tie.first} 北京时间`;return `<article class="advance-tie active-tie" data-index="${index}"><span class="advance-path ${tie.path==='联赛路径'?'league':''}">${tie.path}</span>${teamLine(tie.a)}<em>${score}</em>${teamLine(tie.b)}<footer><span>${state}</span><b>${completed.length>1?'总比分':completed.length===1?'等待次回合':'待赛'}</b></footer></article>`}).join('');
  }
  renderRound3();
  page.querySelector('#advancePlayoffs').innerHTML=playoffs.map(tie=>`<article class="advance-tie playoff"><span class="advance-path ${tie.path==='联赛路径'?'league':''}">${tie.path}</span><span class="advance-team"><strong>${tie.a}</strong></span><em>VS</em><span class="advance-team"><strong>${tie.b}</strong></span><footer><span>对阵已抽签</span><b>胜者进联赛阶段</b></footer></article>`).join('');

  function norm(value){return String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'')}
  function sameTie(match,tie){const m=[norm(match.home),norm(match.away)],t=[norm(tie.a),norm(tie.b)];return m.every(x=>t.includes(x))}
  let refreshing=false;
  async function update(){
    if(refreshing)return;refreshing=true;
    const button=page.querySelector('#advanceRefresh'),title=page.querySelector('#advanceUpdateTitle'),time=page.querySelector('#advanceUpdateTime');
    button.disabled=true;button.textContent='↻ 更新中';title.textContent='正在检查最新数据';
    try{
      const response=await fetch('/api/ucl-qualification-live',{cache:'no-store'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const data=await response.json();
      renderRound3(data.matches||[]);
      const count=(data.matches||[]).filter(match=>match.completed||match.inProgress).length;
      title.textContent=data.live?`已同步 ${count} 场官方赛果`:'已使用最后核对数据';
      time.textContent=`检查于 ${new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})} · ${data.source||'UEFA / ESPN'}`;
    }catch(error){title.textContent='已使用最后核对数据';time.textContent='外部数据暂不可用 · 稍后将自动重试'}
    finally{refreshing=false;button.disabled=false;button.textContent='↻ 立即刷新'}
  }
  page.querySelector('#advanceRefresh').addEventListener('click',update);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&page.classList.contains('active'))update()});
  setInterval(()=>{if(page.classList.contains('active'))update()},600000);

  const button=document.querySelector('#advancementBtn');
  button.addEventListener('click',()=>{
    document.querySelectorAll('nav button').forEach(item=>item.classList.toggle('active',item===button));
    ['.hero','.layout','.results'].forEach(selector=>document.querySelector(selector).style.display='none');
    document.querySelector('#schedulePage')?.classList.remove('active');
    document.querySelector('#competitionInfo')?.classList.remove('active');
    document.querySelector('#qualificationPage')?.classList.remove('active');
    page.classList.add('active');window.scrollTo({top:0,behavior:'smooth'});update();
  });
})();
