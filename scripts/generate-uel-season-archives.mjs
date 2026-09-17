import fs from 'node:fs/promises';
import path from 'node:path';

const OUTPUT=path.resolve('public/europa-league-2026/season-archives.js');
const MATCH_URL=year=>`https://match.uefa.com/v5/matches?competitionId=14&seasonYear=${year}&order=ASC&offset=0&limit=400`;
const STANDINGS_URL=roundId=>`https://standings.uefa.com/v1/standings?roundId=${roundId}`;

const seasonConfig={
  '2024-25':{
    seasonYear:2025,expected:{qualification:80,league:144,knockout:45,total:269},
    pots:{
      1:['AS Roma','Manchester United','FC Porto','Ajax','Rangers','Eintracht Frankfurt','Lazio','Tottenham Hotspur','Slavia Prague'],
      2:['Real Sociedad','AZ Alkmaar','Braga','Olympiacos','Lyon','PAOK','Fenerbahce','Maccabi Tel-Aviv','Ferencvaros'],
      3:['Qarabag','Galatasaray','Viktoria Plzen','Bodo/Glimt','Union Saint-Gilloise','Dynamo Kyiv','Ludogorets','Midtjylland','Malmo'],
      4:['Athletic Club','Hoffenheim','Nice','Anderlecht','Twente','Besiktas','FCSB','RFS','Elfsborg']
    },
    final:{date:'2025-05-21',venue:'毕尔巴鄂圣马梅斯球场',champion:'Tottenham Hotspur'}
  },
  '2025-26':{
    seasonYear:2026,expected:{qualification:82,league:144,knockout:45,total:271},
    pots:{
      1:['AS Roma','FC Porto','Rangers','Feyenoord','Lille','Dinamo Zagreb','Real Betis','Salzburg','Aston Villa'],
      2:['Fenerbahce','Braga','Crvena Zvezda','Lyon','PAOK','Viktoria Plzen','Ferencvaros','Celtic','Maccabi Tel-Aviv'],
      3:['Young Boys','Basel','Midtjylland','Freiburg','Ludogorets','Nottingham Forest','Sturm Graz','FCSB','Nice'],
      4:['Bologna','Celta','Stuttgart','Panathinaikos','Malmo','Go Ahead Eagles','Utrecht','Genk','Brann']
    },
    final:{date:'2026-05-20',venue:'伊斯坦布尔贝西克塔斯公园球场',champion:'Aston Villa'}
  }
};

const aliases={
  'Roma':'AS Roma','AS Roma':'AS Roma','Man Utd':'Manchester United','Manchester Utd':'Manchester United',
  'Porto':'FC Porto','Frankfurt':'Eintracht Frankfurt','Tottenham':'Tottenham Hotspur','Slavia Praha':'Slavia Prague',
  'M. Tel-Aviv':'Maccabi Tel-Aviv','Maccabi Tel Aviv':'Maccabi Tel-Aviv','Ferencváros':'Ferencvaros','Fenerbahçe':'Fenerbahce',
  'Qarabağ':'Qarabag','Bodø/Glimt':'Bodo/Glimt','Union SG':'Union Saint-Gilloise','Viktoria Plzeň':'Viktoria Plzen',
  'Malmö':'Malmo','Beşiktaş':'Besiktas','GNK Dinamo':'Dinamo Zagreb','Crvena zvezda':'Crvena Zvezda',
  'Crvena Zvezda':'Crvena Zvezda','Salzburg':'Salzburg','Aston Villa':'Aston Villa','Stuttgart':'Stuttgart',
  'Basel':'Basel','Celta Vigo':'Celta','Go Ahead':'Go Ahead Eagles','Go Ahead Eagles':'Go Ahead Eagles',"Nott'm Forest":'Nottingham Forest'
};
const manualChinese={
  'AS Roma':'罗马','Manchester United':'曼联','FC Porto':'波尔图','Ajax':'阿贾克斯','Rangers':'格拉斯哥流浪者',
  'Eintracht Frankfurt':'法兰克福','Lazio':'拉齐奥','Tottenham Hotspur':'托特纳姆热刺','Slavia Prague':'布拉格斯拉维亚',
  'Real Sociedad':'皇家社会','AZ Alkmaar':'阿尔克马尔','Braga':'布拉加','Olympiacos':'奥林匹亚科斯','Lyon':'里昂',
  'PAOK':'塞萨洛尼基','Fenerbahce':'费内巴切','Maccabi Tel-Aviv':'特拉维夫马卡比','Ferencvaros':'费伦茨瓦罗斯',
  'Qarabag':'卡拉巴赫','Galatasaray':'加拉塔萨雷','Viktoria Plzen':'比尔森胜利','Bodo/Glimt':'博德闪耀',
  'Union Saint-Gilloise':'圣吉罗斯联合','Dynamo Kyiv':'基辅迪纳摩','Ludogorets':'卢多戈雷茨','Midtjylland':'中日德兰',
  'Malmo':'马尔默','Athletic Club':'毕尔巴鄂竞技','Hoffenheim':'霍芬海姆','Nice':'尼斯','Anderlecht':'安德莱赫特',
  'Twente':'特温特','Besiktas':'贝西克塔斯','FCSB':'布加勒斯特星','RFS':'里加足球学校','Elfsborg':'埃尔夫斯堡',
  'Feyenoord':'费耶诺德','Lille':'里尔','Dinamo Zagreb':'萨格勒布迪纳摩','Real Betis':'皇家贝蒂斯','Salzburg':'萨尔茨堡',
  'Aston Villa':'阿斯顿维拉','Crvena Zvezda':'贝尔格莱德红星','Celtic':'凯尔特人','Young Boys':'伯尔尼年轻人',
  'Basel':'巴塞尔','Freiburg':'弗赖堡','Nottingham Forest':'诺丁汉森林','Sturm Graz':'格拉茨风暴','Bologna':'博洛尼亚',
  'Celta':'塞尔塔','Stuttgart':'斯图加特','Panathinaikos':'帕纳辛奈科斯','Go Ahead Eagles':'前进之鹰','Utrecht':'乌德勒支',
  'Genk':'亨克','Brann':'布兰'
};
const canonical=value=>aliases[String(value||'').trim()]||String(value||'').trim();
const containsChinese=value=>/[\u3400-\u9fff]/.test(String(value||''));
const teamName=team=>canonical(team?.internationalName||team?.translations?.displayName?.EN||'');
const teamChinese=team=>manualChinese[teamName(team)]||(containsChinese(team?.translations?.displayName?.ZH)?team.translations.displayName.ZH:teamName(team));
const scoreText=score=>score&&Number.isFinite(Number(score.home))&&Number.isFinite(Number(score.away))?`${Number(score.home)}-${Number(score.away)}`:'';
const codeFor=team=>String(team?.teamCode||teamName(team)).replace(/[^A-Za-z0-9]/g,'').slice(0,4).toUpperCase();
const dateTimeFor=match=>{
  const instant=new Date(match?.kickOffTime?.dateTime||'');
  if(Number.isNaN(instant.getTime()))return {date:match?.kickOffTime?.date||'',time:'—'};
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Zurich',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(instant).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
  return {date:`${parts.year}-${parts.month}-${parts.day}`,time:`${parts.hour}:${parts.minute}`};
};
const roundInfo=value=>{
  const raw=String(value||'').replace(/_/g,' ').trim();
  if(/first qualifying/i.test(raw))return {label:'第一轮',stage:'qualifying'};
  if(/second qualifying/i.test(raw))return {label:'第二轮',stage:'qualifying'};
  if(/third qualifying/i.test(raw))return {label:'第三轮',stage:'qualifying'};
  if(/^play.?offs?$/i.test(raw))return {label:'附加赛',stage:'qualifying'};
  if(/league phase/i.test(raw))return {label:'联赛阶段',stage:'league'};
  if(/knock.*play/i.test(raw))return {label:'淘汰赛附加赛',stage:'knockout'};
  if(/round of 16/i.test(raw))return {label:'十六强',stage:'knockout'};
  if(/quarter/i.test(raw))return {label:'四分之一决赛',stage:'knockout'};
  if(/semi/i.test(raw))return {label:'半决赛',stage:'knockout'};
  if(/^final$/i.test(raw))return {label:'决赛',stage:'knockout'};
  throw new Error(`Unrecognized UEFA round: ${raw}`);
};
const halfTimeFor=match=>{
  const final=match?.score?.total||match?.score?.regular||{};
  const direct=match?.score?.halfTime;
  if(direct?.home!=null&&direct?.away!=null&&Number.isFinite(Number(direct.home))&&Number.isFinite(Number(direct.away)))return {score:`${Number(direct.home)}-${Number(direct.away)}`,source:'official'};
  if(Number(final.home)===0&&Number(final.away)===0)return {score:'0-0',source:'zero-zero'};
  const scorers=match?.playerEvents?.scorers;
  if(!Array.isArray(scorers))return {score:'—',source:'unverified'};
  let home=0,away=0;
  for(const event of scorers){
    if(event?.phase!=='FIRST_HALF')continue;
    const own=/^OWN(?:_GOAL)?$/i.test(event?.goalType||'');
    const belongsHome=String(event?.teamId)===String(match?.homeTeam?.id);
    if(own?(belongsHome?false:true):belongsHome)home++;else away++;
  }
  const recognized=scorers.filter(event=>event&&event.teamId!=null).length;
  if(recognized!==Number(final.home)+Number(final.away)||home>Number(final.home)||away>Number(final.away))return {score:'—',source:'unverified'};
  return {score:`${home}-${away}`,source:'events'};
};
const resultNote=match=>{
  const parts=[];
  const aggregateReason=match?.winner?.aggregate?.reason||'';
  if(/EXTRA/i.test(aggregateReason))parts.push('加时');
  if(match?.score?.penalty){parts.push(`点球 ${match.score.penalty.home}-${match.score.penalty.away}`);}
  return parts.join(' · ');
};
const winnerName=match=>canonical(match?.winner?.aggregate?.team?.internationalName||match?.winner?.match?.team?.internationalName||'');

async function fetchJson(url){
  const response=await fetch(url,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(90000)});
  if(!response.ok)throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

function buildTies(matches,roundLabel){
  const rows=matches.filter(match=>match.round===roundLabel).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  const groups=new Map();
  for(const match of rows){
    const key=[match.home,match.away].sort().join('|');
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push(match);
  }
  return [...groups.values()].map(pair=>{
    const legs=pair.sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)),first=legs[0],second=legs[1];
    const a=first.home,b=first.away,[oneA,oneB]=first.score.split('-').map(Number);
    let aTotal=oneA,bTotal=oneB,leg2='—',note=first.note||'';
    if(second){const [twoHome,twoAway]=second.score.split('-').map(Number);aTotal+=second.home===a?twoHome:twoAway;bTotal+=second.home===b?twoHome:twoAway;leg2=second.score.replace('-', '–');note=second.note||note;}
    const winner=second?.winner||first.winner||(aTotal>bTotal?a:bTotal>aTotal?b:'');
    return {round:roundLabel,path:'资格赛',a,b,leg1:first.score.replace('-', '–'),leg2,total:`${aTotal}–${bTotal}${note?`（${note}）`:''}`,winner};
  });
}

async function buildArchive(key,config){
  const payload=await fetchJson(MATCH_URL(config.seasonYear));
  if(!Array.isArray(payload))throw new Error(`${key}: UEFA matches response is not an array`);
  const names={},codes={},logos={},aliasesOut={};
  const normalized=payload.map(match=>{
    const home=teamName(match.homeTeam),away=teamName(match.awayTeam),info=roundInfo(match?.round?.metaData?.name||match?.round?.translations?.name?.EN),dt=dateTimeFor(match);
    const half=halfTimeFor(match);
    aliasesOut[match.homeTeam?.internationalName||home]=home;aliasesOut[match.awayTeam?.internationalName||away]=away;
    names[home]=teamChinese(match.homeTeam);names[away]=teamChinese(match.awayTeam);codes[home]=codeFor(match.homeTeam);codes[away]=codeFor(match.awayTeam);
    logos[home]=match.homeTeam?.logoUrl||'';logos[away]=match.awayTeam?.logoUrl||'';
    return {id:String(match.id),date:dt.date,time:dt.time,home,away,score:scoreText(match.score?.total||match.score?.regular),half:half.score,halfSource:half.source,stage:info.stage,round:info.label,matchday:info.stage==='league'?Number(match?.matchday?.sequenceNumber||match?.matchday?.name?.match(/\d+/)?.[0]||0):undefined,note:resultNote(match),winner:winnerName(match),roundId:String(match?.round?.id||'')};
  });
  const unknown=normalized.filter(row=>!row.score);
  if(unknown.length)throw new Error(`${key}: ${unknown.length} matches are missing a final score`);
  const counts={qualification:normalized.filter(r=>r.stage==='qualifying').length,league:normalized.filter(r=>r.stage==='league').length,knockout:normalized.filter(r=>r.stage==='knockout').length,total:normalized.length};
  for(const [field,value] of Object.entries(config.expected))if(counts[field]!==value)throw new Error(`${key}: expected ${field}=${value}, got ${counts[field]}`);
  const league=normalized.filter(row=>row.stage==='league'),leagueTeams=new Set(league.flatMap(row=>[row.home,row.away]));
  if(leagueTeams.size!==36)throw new Error(`${key}: expected 36 league teams, got ${leagueTeams.size}`);
  for(const name of leagueTeams)if(league.filter(row=>row.home===name||row.away===name).length!==8)throw new Error(`${key}: ${name} does not have 8 league matches`);
  for(let day=1;day<=8;day++)if(league.filter(row=>row.matchday===day).length!==18)throw new Error(`${key}: matchday ${day} is incomplete`);
  const pots=Object.fromEntries(Object.entries(config.pots).map(([pot,rows])=>[pot,rows.map(canonical)]));
  const potTeams=Object.values(pots).flat();
  if(new Set(potTeams).size!==36||potTeams.some(name=>!leagueTeams.has(name)))throw new Error(`${key}: official pot list does not match league teams: ${potTeams.filter(name=>!leagueTeams.has(name)).join(', ')}`);
  const leagueRoundId=league[0]?.roundId,standingsPayload=await fetchJson(STANDINGS_URL(leagueRoundId));
  const standingGroup=Array.isArray(standingsPayload)?standingsPayload.find(group=>String(group?.round?.id)===leagueRoundId)||standingsPayload[0]:null;
  const finalStandings=(standingGroup?.items||[]).map(item=>({name:teamName(item.team),rank:Number(item.rank),p:Number(item.played),w:Number(item.won),d:Number(item.drawn),l:Number(item.lost),gf:Number(item.goalsFor),ga:Number(item.goalsAgainst),pts:Number(item.points)})).sort((a,b)=>a.rank-b.rank);
  if(finalStandings.length!==36)throw new Error(`${key}: official standings contain ${finalStandings.length} rows`);
  const catalog=potTeams.map(name=>{const pot=Number(Object.entries(pots).find(([,rows])=>rows.includes(name))?.[0]);const qualified=normalized.some(row=>row.stage==='qualifying'&&[row.home,row.away].includes(name));return {id:name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''),name,zh:names[name]||manualChinese[name]||name,code:codes[name]||name.slice(0,3).toUpperCase(),logo:logos[name]||'',pot,entry:qualified?'uel':'direct'};});
  const fixtures=league.map(row=>({date:row.date,time:row.time,home:row.home,away:row.away,matchday:row.matchday,stage:'league',score:row.score,half:row.half,halfSource:row.halfSource,note:row.note})).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  const draw=Object.fromEntries(catalog.map(team=>[team.name,[]]));
  for(const fixture of fixtures){draw[fixture.home].push({date:fixture.date,time:fixture.time,matchday:fixture.matchday,venue:'home',opponent:fixture.away,score:fixture.score});draw[fixture.away].push({date:fixture.date,time:fixture.time,matchday:fixture.matchday,venue:'away',opponent:fixture.home,score:fixture.score});}
  const matches=normalized.map(row=>[row.date,row.home,row.away,row.score,row.half,row.stage,row.round,row.matchday||null,row.note,row.time,row.halfSource]).sort((a,b)=>b[0].localeCompare(a[0])||String(b[9]).localeCompare(String(a[9])));
  const qualifyingTies=['第一轮','第二轮','第三轮'].flatMap(round=>buildTies(normalized,round)),playoffTies=buildTies(normalized,'附加赛');
  const finalMatch=normalized.find(row=>row.round==='决赛');
  if(!finalMatch||finalMatch.date!==config.final.date||finalMatch.winner!==config.final.champion)throw new Error(`${key}: final validation failed`);
  return {key,seasonYear:config.seasonYear,names,codes,logos,aliases:aliasesOut,catalog,pots,leagueFixtures:fixtures,draw,matches,qualifyingTies,playoffTies,finalStandings,final:{...config.final,home:finalMatch.home,away:finalMatch.away,score:finalMatch.score},counts,source:{matches:MATCH_URL(config.seasonYear),standings:STANDINGS_URL(leagueRoundId),generatedAt:new Date().toISOString()}};
}

const archives={};
for(const [key,config] of Object.entries(seasonConfig)){archives[key]=await buildArchive(key,config);console.log(`${key}: ${JSON.stringify(archives[key].counts)}`);}
const banner='// Generated by scripts/generate-uel-season-archives.mjs from UEFA official match and standings APIs.\n// Do not edit by hand; rerun the generator and commit the resulting archive.\n';
await fs.writeFile(OUTPUT,`${banner}window.uelSeasonArchives=${JSON.stringify(archives)};\n`,'utf8');
console.log(`Wrote ${OUTPUT}`);
