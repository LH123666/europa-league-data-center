document.head.insertAdjacentHTML('beforeend','<link rel="stylesheet" href="enhancements.css"><link rel="stylesheet" href="result-clickable.css">');

const teamNames={
  'Palmeiras':'帕尔梅拉斯','Flamengo':'弗拉门戈','Athletico-PR':'巴拉纳竞技','Fluminense':'弗鲁米嫩塞',
  'Red Bull Bragantino':'布拉干蒂诺红牛','Bahia':'巴伊亚','Cruzeiro':'克鲁塞罗','Coritiba':'科里蒂巴',
  'São Paulo':'圣保罗','Botafogo':'博塔弗戈','Atlético-MG':'米内罗竞技','Vitória':'维多利亚',
  'Corinthians':'科林蒂安','Internacional':'巴西国际','Santos':'桑托斯','Grêmio':'格雷米奥',
  'Vasco da Gama':'瓦斯科达伽马','Mirassol':'米拉索尔','Remo':'瑞模','Chapecoense':'沙佩科恩斯'
};
const teamCodes={
  'Palmeiras':'PAL','Flamengo':'FLA','Athletico-PR':'CAP','Fluminense':'FLU','Red Bull Bragantino':'RBB',
  'Bahia':'BAH','Cruzeiro':'CRU','Coritiba':'CFC','São Paulo':'SAO','Botafogo':'BOT','Atlético-MG':'CAM',
  'Vitória':'VIT','Corinthians':'COR','Internacional':'INT','Santos':'SAN','Grêmio':'GRE',
  'Vasco da Gama':'VAS','Mirassol':'MIR','Remo':'REM','Chapecoense':'CHA'
};

const currentTable=[
  ['Palmeiras',19,13,5,1,33,14,44,'DDWWW'],
  ['Flamengo',18,11,4,3,35,16,37,'WDLWW'],
  ['Athletico-PR',19,10,3,6,26,19,33,'LDWWW'],
  ['Fluminense',19,9,5,5,29,24,32,'DWLDD'],
  ['Red Bull Bragantino',19,9,3,7,26,20,30,'LWWWD'],
  ['Bahia',19,8,6,5,28,24,30,'DLWWD'],
  ['Cruzeiro',19,7,6,6,26,29,27,'WDWDW'],
  ['Coritiba',19,7,5,7,25,27,26,'DWWLL'],
  ['São Paulo',19,7,4,8,24,22,25,'LLDLL'],
  ['Botafogo',18,7,4,7,33,32,25,'DWDLW'],
  ['Atlético-MG',19,7,4,8,23,24,25,'DWLWD'],
  ['Vitória',18,7,4,7,22,25,25,'DLWLW'],
  ['Corinthians',18,6,6,6,18,19,24,'LWLWW'],
  ['Internacional',19,5,6,8,22,24,21,'DWLLL'],
  ['Santos',19,5,6,8,27,31,21,'WLLWL'],
  ['Grêmio',19,5,6,8,21,25,21,'LDWLL'],
  ['Vasco da Gama',19,5,5,9,22,30,20,'WLLLL'],
  ['Mirassol',18,5,4,9,20,25,19,'DLWLW'],
  ['Remo',18,4,6,8,21,29,18,'WDWLW'],
  ['Chapecoense',19,1,6,12,17,39,9,'LLLLL']
];
const teams=currentTable.map(([name,p,w,d,l,gf,ga,pts,form])=>[
  teamNames[name],name,teamCodes[name],p,w,d,l,gf,ga,pts,form
]);
const aliases={'Athletico Paranaense':'Athletico-PR','Athletico Paranaense FC':'Athletico-PR'};
const matches=rawMatches.map(m=>[m[0],aliases[m[1]]||m[1],aliases[m[2]]||m[2],m[3],m[4]]).sort((a,b)=>b[0].localeCompare(a[0]));
const display=n=>{const canonical=aliases[n]||n,t=teams.find(x=>x[1]===canonical);return t?`${t[0]}（${t[1]}）`:canonical};
const tbody=document.querySelector('#standings');

function render(q=''){
  tbody.innerHTML=teams.map((t,i)=>({t,i})).filter(({t})=>(t[0]+t[1]).toLowerCase().includes(q.toLowerCase())).map(({t,i})=>`<tr class="rank r${i+1}" data-team="${t[1]}"><td>${i+1}</td><td class="team"><i class="badge">${t[2]}</i><span class="bilingual"><strong>${t[0]}</strong><small>（${t[1]}）</small></span></td><td>${t[3]}</td><td>${t[4]}</td><td>${t[5]}</td><td>${t[6]}</td><td>${t[7]}–${t[8]}</td><td>${t[7]-t[8]>0?'+':''}${t[7]-t[8]}</td><td class="pts">${t[9]}</td><td><span class="form">${[...t[10]].map(x=>`<i class="${x.toLowerCase()}">${x==='W'?'胜':x==='D'?'平':'负'}</i>`).join('')}</span></td></tr>`).join('');
  tbody.querySelectorAll('tr').forEach(row=>row.onclick=()=>openTeam(row.dataset.team));
}
render();
document.querySelector('#search').oninput=e=>render(e.target.value);

function renderResults(){
  const latest=matches.slice(0,8),latestDate=latest[0]?.[0],grid=document.querySelector('#resultGrid');
  grid.innerHTML=latest.map(m=>`<div class="match" role="button" tabindex="0" data-date="${m[0]}" data-home="${encodeURIComponent(m[1])}" data-away="${encodeURIComponent(m[2])}" aria-label="查看 ${display(m[1])} 对 ${display(m[2])} 的比赛详情"><time>${m[0].slice(5).replace('-',' / ')}</time><p><span>${display(m[1])}</span><b>${m[3]}</b><span>${display(m[2])}</span></p><small>半场 ${m[4]}　·　全场 ${m[3]}</small><span class="match-detail-cue">查看详细信息 →</span></div>`).join('');
  grid.querySelectorAll('.match').forEach(card=>{const open=()=>window.openFixtureDetail?.(decodeURIComponent(card.dataset.home),decodeURIComponent(card.dataset.away),card.dataset.date,'');card.onclick=open;card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}}});
  document.querySelector('.hero-stat b').textContent=matches.length;
  const cutoff=document.querySelector('.hero-stat small');if(cutoff&&latestDate)cutoff.textContent='截至 '+latestDate.replaceAll('-','.');
}
renderResults();

const drawer=document.querySelector('#drawer'),overlay=document.querySelector('#overlay');
function openTeam(name){
  const t=teams.find(x=>x[1]===name),games=matches.filter(m=>m[1]===name||m[2]===name);
  document.querySelector('#drawerContent').innerHTML=`<div class="team-hero"><div class="bigbadge">${t[2]}</div><p class="eyebrow">2026 SEASON · 第 ${teams.indexOf(t)+1} 名</p><h2>${t[0]}<small>（${t[1]}）</small></h2><span>Brasileirão Série A · Brazil</span></div><div class="summary"><div><b>${t[9]}</b><span>积分</span></div><div><b>${t[4]}</b><span>胜</span></div><div><b>${t[5]}</b><span>平</span></div><div><b>${t[6]}</b><span>负</span></div></div><div class="history"><div class="history-title"><h3>本赛季全部比赛</h3><span>共 ${games.length} 场</span></div></div>`;
  drawer.classList.add('open');overlay.classList.add('open');
}
function close(){drawer.classList.remove('open');overlay.classList.remove('open')}
document.querySelector('#close').onclick=close;
overlay.onclick=close;
document.querySelector('#latestBtn').onclick=()=>document.querySelector('#latest').scrollIntoView({behavior:'smooth'});
