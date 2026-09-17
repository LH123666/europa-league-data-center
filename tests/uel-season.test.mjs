import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const dir=path.resolve('public/europa-league-2026');
function model(){const c=vm.createContext({window:{}});for(const file of ['matches-data.js','league-data.js','season-model.js'])vm.runInContext(fs.readFileSync(path.join(dir,file),'utf8'),c);return c.window;}
test('36 clubs, 144 unique fixtures, 8 rounds of 18, 8 opponents per club',()=>{const w=model(),fs=w.uelSeasonModel.events([]);assert.equal(w.uelLeagueCatalog.length,36);assert.equal(fs.length,144);for(let i=1;i<=8;i++)assert.equal(fs.filter(f=>f.matchday===i).length,18);for(const t of w.uelLeagueCatalog)assert.equal(fs.filter(f=>[f.home,f.away].includes(t.name)).length,8);});
test('all 36 current clubs have a deployable WebP crest',()=>{const w=model(),context=vm.createContext({window:w});vm.runInContext(fs.readFileSync(path.join(dir,'club-logos.js'),'utf8'),context);assert.equal(Object.keys(w.uelClubLogoNames).length,36);for(const team of w.uelLeagueCatalog){const file=w.uelClubLogoFile(team.name);assert.match(file,/\.webp$/);assert.ok(fs.existsSync(path.join(dir,'assets','team-logos','2026-27',file)),`${team.name} crest is missing`);}assert.match(w.uelClubLogo('Leverkusen','md','勒沃库森'),/18_bayer-leverkusen\.webp/);assert.match(w.uelClubLogo('AC Milan','md','AC米兰'),/23_ac-milan\.webp/);});
test('Beijing conversion and all official club contexts are complete',()=>{const c=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path.join(dir,'schedule-upgrade.js'),'utf8'),c);const convert=c.window.uelSchedule.beijing;assert.equal(JSON.stringify(convert('2026-09-16','18:45')),JSON.stringify({date:'2026-09-17',time:'00:45'}));assert.equal(JSON.stringify(convert('2026-11-05','21:00')),JSON.stringify({date:'2026-11-06',time:'04:00'}));assert.equal(convert('2026-12-31','21:00').date,'2027-01-01');assert.equal(convert('2026-09-16','待定'),null);assert.equal(Object.keys(c.window.uelTeamContext).length,36);assert.equal(c.window.uelTeamContext.Bournemouth[1],'上季无欧战记录');assert.equal(c.window.uelTeamContext.Lillestrom[1],'上季未晋级欧战');});
test('shared colors, stats deduplicate, postponed match retains official matchday',()=>{const w=model(),m=w.uelSeasonModel;const hi=w.uelLeagueCatalog.find(t=>t.pot===1).name,lo=w.uelLeagueCatalog.find(t=>t.pot===4).name;const f={home:hi,away:lo,score:'2-0',stage:'league'};assert.equal(m.color(f),'favorite');assert.equal(m.color({...f,score:'0-1'}),'upset');assert.equal(m.color({...f,score:'1-1'}),'upset');assert.equal(m.color({...f,away:hi,score:'1-1'}),'draw');assert.equal(m.color({...f,away:hi}),'equal');assert.equal(m.color({...f,away:'unknown'}),'neutral');assert.equal(m.stats([f,f]).played,1);assert.equal(m.stats([f,f]).goals,2);const b=w.uelLeagueFixtures[0];const e=m.events([['2026-10-01',b.home,b.away,'3-2','1-1','league']]);assert.equal(e.length,144);const found=e.find(x=>x.home===b.home&&x.away===b.away);assert.equal(found.matchday,b.matchday);assert.equal(found.date,'2026-10-01');assert.equal(m.stats([]).played,0);});
test('dashboard navigation, matrix, latest expansion, status, preserved notes',async()=>{
  const require=createRequire(import.meta.url);let JSDOM;
  try{({JSDOM}=require(process.env.UEL_JSDOM_PATH||'jsdom'));}catch{throw new Error('Install jsdom in a temporary directory and set UEL_JSDOM_PATH to its absolute module path (see README).');}
  const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');const dom=new JSDOM(html,{url:'https://example.test/europa-league-2026/',runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;const errors=[];
  w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.setInterval=()=>0;
  w.AbortSignal.timeout=()=>undefined;
  w.fetch=async url=>String(url).includes('/api/uel-live')?{ok:true,json:async()=>({matches:[],fixtures:[],coverage:{qualifying:true,league:false,knockout:false},source:'UEFA qualification only',checkedAt:new Date().toISOString(),sourceUpdatedAt:'2026-08-27',ties:[],playoffTies:[]})}:{ok:true,json:async()=>({events:[]})};
  w.addEventListener('error',e=>errors.push(e.error));w.localStorage.setItem('uel36-team-notes-v1','{"Milan":"KEEP"}');
  const context=dom.getInternalVMContext();
  for(const s of [...w.document.querySelectorAll('script[src]')]){
    const filename=s.getAttribute('src').split('?')[0];
    vm.runInContext(fs.readFileSync(path.join(dir,filename),'utf8'),context,{filename:s.getAttribute('src')});
    if(filename==='season-context.js')for(const dataFile of ['matches-data.js','league-data.js','qualification-data.js'])vm.runInContext(fs.readFileSync(path.join(dir,dataFile),'utf8'),context,{filename:dataFile});
  }
  await new Promise(r=>setTimeout(r,50));const q=s=>w.document.querySelector(s);
  assert.equal(Object.keys(w.uelClubLogoNames).length,36);assert.equal(w.document.querySelectorAll('#standings .club-logo img').length,36);
  assert.equal(q('#latest').style.display,'none');q('#latestBtn').click();assert.equal(q('#latest').style.display,'block');assert.equal(q('.layout').style.display,'none');
  q('#advancementBtn').click();assert.equal(w.document.querySelectorAll('#seasonQualification .team-origin').length,80);assert.ok(w.document.querySelectorAll('#seasonQualification .club-logo').length>0);assert.doesNotMatch(q('#seasonQualification').textContent,/来源待确认|路径未分类/);q('[data-tab="statistics"]').click();assert.equal(q('#seasonStatistics').hidden,false);assert.equal(q('#seasonQualification').hidden,true);assert.equal(w.document.querySelectorAll('.season-cell').length,288);assert.equal(w.document.querySelectorAll('.season-matrix tbody>tr>th .club-logo').length,36);assert.equal(w.document.querySelectorAll('.season-cell .club-logo').length,288);
  q('#drawBtn').click();q('#scheduleBtn').click();assert.equal(q('#schedulePage').style.display,'block');assert.equal(q('#drawPage').style.display,'none');
  assert.equal(w.document.querySelectorAll('#scheduleGrid .fixture').length,144);
  assert.match(q('#fixtureCount').textContent,/北京时间/);assert.match(q('#scheduleGrid .fixture-date').textContent,/2026-09-17/);
  assert.equal(w.document.querySelectorAll('#scheduleGrid .schedule-club').length,288);
  assert.equal(w.document.querySelectorAll('#scheduleGrid .schedule-club .club-logo img').length,288);
  assert.equal(w.document.querySelectorAll('#scheduleGrid .schedule-context .entry').length,288);
  assert.doesNotMatch(q('#scheduleGrid').textContent,/待核实/);assert.match(q('#scheduleGrid').textContent,/德甲第6/);assert.match(q('#scheduleGrid').textContent,/欧冠十六强/);assert.match(q('#scheduleGrid').textContent,/上季无欧战记录/);assert.match(q('#scheduleGrid').textContent,/上季未晋级欧战/);
  const scheduleFixture=q('#scheduleGrid .fixture');const sourceDate=scheduleFixture.dataset.date;
  scheduleFixture.click();await new Promise(r=>setTimeout(r,30));assert.match(q('#drawerContent').textContent,/北京时间/);
  q('.prediction-row select[data-field="result"]').value='home';q('.prediction-save').click();
  const saved=JSON.parse(w.localStorage.getItem('uel36-match-predictions-v1'));assert.ok(Object.keys(saved).some(key=>key.startsWith(sourceDate+'|')));
  assert.match(q('#scheduleGrid').textContent,/我的预测/);q('.match-modal-close').click();await new Promise(r=>setTimeout(r,0));
  vm.runInContext("matches.splice(0,matches.length,...uelLeagueFixtures.slice(0,12).map(f=>[f.date,f.home,f.away,'2-1','1-0','league','',f.matchday,'',f.time,'events']));renderResults();",context);assert.equal(w.document.querySelectorAll('#resultGrid .match').length,8);assert.equal(w.document.querySelectorAll('#resultGrid .schedule-club').length,16);assert.equal(w.document.querySelectorAll('#resultGrid .schedule-club .club-logo img').length,16);assert.equal(w.document.querySelectorAll('#resultGrid .schedule-context .entry').length,16);assert.equal(w.document.querySelectorAll('#resultGrid .schedule-context .domestic').length,16);assert.equal(w.document.querySelectorAll('#resultGrid .schedule-context .europe').length,16);assert.ok(w.document.querySelector('#resultGrid .schedule-context [class^="pot-"]'));assert.match(q('#resultGrid').textContent,/进球事件重建/);assert.match(q('#resultGrid').textContent,/德甲第6|西甲第6|葡超第3/);q('.season-expand').click();assert.equal(w.document.querySelectorAll('#resultGrid .match').length,12);q('.season-expand').click();assert.equal(w.document.querySelectorAll('#resultGrid .match').length,8);
  w.HTMLElement.prototype.scrollTo=function(options){this.scrollTop=options.top||0;};
  await w.openFixtureDetail('Milan','Sparta Prague','2026-09-16','18:45');
  assert.equal(w.document.querySelectorAll('.match-standings-group').length,2);
  assert.equal(w.document.querySelectorAll('.match-standings-group')[0].querySelectorAll('.side-team').length,18);
  assert.equal(w.document.querySelectorAll('.match-standings-group')[1].querySelectorAll('.side-team').length,18);
  assert.equal(q('[data-rank="1"]')!==null,true);assert.equal(q('[data-rank="36"]')!==null,true);
  assert.equal(w.document.querySelectorAll('#modalStandings .side-team.selected').length,2);
  assert.equal(w.document.querySelectorAll('#modalStandings .side-team .club-logo img').length,36);
  assert.equal(w.document.body.style.overflow,'hidden');
  q('[data-view="standings"]').click();assert.equal(w.document.body.dataset.matchView,'standings');
  q('[data-view="detail"]').click();assert.equal(w.document.body.dataset.matchView,'detail');
  q('.prediction-save').click();assert.equal(q('#predictionEditor')!==null,true);
  q('#drawer').scrollTop=500;await w.openFixtureDetail('Milan','Sparta Prague','2026-09-17','18:45');assert.equal(q('#drawer').scrollTop,0);
  w.document.body.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await new Promise(r=>setTimeout(r,0));assert.equal(w.document.body.style.overflow,'');assert.equal(q('#matchModalToolbar').hidden,true);
  let opened;w.openFixtureDetail=(...args)=>opened=args;q('#resultGrid .match').click();assert.equal(opened.length,4);
  const summary=w.uelDashboardUpdate({coverage:{qualifying:true},source:'资格赛页面',checkedAt:new Date().toISOString()},false);assert.match(summary,/1\/3/);assert.match(q('#seasonDataStatus').textContent,/使用缓存/);w.uelDashboardUpdate(null,true);assert.match(q('#updatedAt').textContent,/0\/3/);
  assert.equal(w.localStorage.getItem('uel36-team-notes-v1'),'{"Milan":"KEEP"}');assert.deepEqual(errors,[]);dom.window.close();
});

test('2025/26 archive renders independently without calling the live endpoint',async()=>{
  const require=createRequire(import.meta.url);let JSDOM;
  try{({JSDOM}=require(process.env.UEL_JSDOM_PATH||'jsdom'));}catch{throw new Error('Install jsdom in a temporary directory and set UEL_JSDOM_PATH to its absolute module path (see README).');}
  const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
  const dom=new JSDOM(html,{url:'https://example.test/europa-league-2026/?season=2025-26',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window,context=dom.getInternalVMContext();let fetches=0;
  w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.scrollTo=()=>{};w.setInterval=()=>0;w.fetch=async()=>{fetches++;return {ok:true,json:async()=>({events:[]})}};
  for(const s of [...w.document.querySelectorAll('script[src]')]){
    const filename=s.getAttribute('src').split('?')[0];
    vm.runInContext(fs.readFileSync(path.join(dir,filename),'utf8'),context,{filename:s.getAttribute('src')});
    if(filename==='season-context.js')for(const dataFile of ['season-archives.js','archive-runtime.js'])vm.runInContext(fs.readFileSync(path.join(dir,dataFile),'utf8'),context,{filename:dataFile});
  }
  await new Promise(resolve=>setTimeout(resolve,50));
  const q=selector=>w.document.querySelector(selector);
  assert.equal(w.uelSeason.key,'2025-26');
  assert.equal(w.document.querySelectorAll('#standings tr').length,36);
  assert.match(q('.season-trigger').textContent,/2025 \/ 26/);
  assert.match(q('#updatedAt').textContent,/2025\/26 完整静态归档/);
  assert.match(q('#seasonDataStatus').textContent,/完整静态归档/);
  assert.equal(w.document.querySelectorAll('#resultGrid .match').length,8);
  q('.season-expand').click();assert.equal(w.document.querySelectorAll('#resultGrid .match').length,189);
  q('#scheduleBtn').click();assert.equal(w.document.querySelectorAll('#scheduleGrid .fixture').length,144);
  q('#advancementBtn').click();q('[data-tab="statistics"]').click();assert.equal(w.document.querySelectorAll('.season-cell').length,288);
  assert.equal(fetches,0);
  dom.window.close();
});
