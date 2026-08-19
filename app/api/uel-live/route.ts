const UEFA_URL = "https://www.uefa.com/uefaeuropaleague/accesslist/";
const UEFA_TEXT_URL = `https://r.jina.ai/http://${UEFA_URL.replace(/^https?:\/\//, "")}`;

type Match = { date: string; home: string; away: string; score: string; half: string; stage: "qualifying" | "league" };
type Fixture = { date: string; time: string; home: string; away: string };
type Tie = { round: string; path: string; a: string; b: string; leg1: string; leg2: string; total: string; winner: string };
type PlayoffTie = Omit<Tie, "round" | "path">;
type ParsedMatch = Match & { note: string; round: string };

const VERIFIED_MATCHES: Match[] = [
  ["2026-07-09","Qarabag","Vestri","3-0"],["2026-07-09","Dynamo Kyiv","Universitatea Cluj","0-0"],["2026-07-09","Sheriff","Aluminij","0-0"],["2026-07-09","CSKA Sofia","Derry","3-2"],["2026-07-09","Hajduk Split","Zilina","2-0"],["2026-07-09","Vojvodina","Ferencvaros","1-2"],
  ["2026-07-16","Derry","CSKA Sofia","1-2"],["2026-07-16","Universitatea Cluj","Dynamo Kyiv","0-0"],["2026-07-16","Aluminij","Sheriff","0-1"],["2026-07-16","Ferencvaros","Vojvodina","3-0"],["2026-07-16","Zilina","Hajduk Split","2-1"],["2026-07-16","Vestri","Qarabag","0-3"],
  ["2026-07-23","Qarabag","CSKA Sofia","0-0"],["2026-07-23","Hammarby","Anderlecht","1-1"],["2026-07-23","Tromso","Hradec Kralove","0-1"],["2026-07-23","Sheriff","Maccabi Tel-Aviv","0-5"],["2026-07-23","Dynamo Kyiv","PAOK","2-3"],["2026-07-23","Twente","Ferencvaros","1-2"],["2026-07-23","Besiktas","Midtjylland","1-0"],["2026-07-23","St. Gallen","Benfica","2-1"],["2026-07-23","Hajduk Split","Pafos","2-0"],
  ["2026-07-30","Maccabi Tel-Aviv","Sheriff","1-0"],["2026-07-30","Hradec Kralove","Tromso","3-1"],["2026-07-30","Midtjylland","Besiktas","0-2"],["2026-07-30","Pafos","Hajduk Split","4-0"],["2026-07-30","PAOK","Dynamo Kyiv","2-0"],["2026-07-30","CSKA Sofia","Qarabag","0-0"],["2026-07-30","Anderlecht","Hammarby","3-1"],["2026-07-30","Ferencvaros","Twente","2-2"],["2026-07-30","Benfica","St. Gallen","5-0"],
  ["2026-08-04","Larne","Iberia Tbilisi","0-0"],["2026-08-04","Shamrock Rovers","Egnatia","3-1"],["2026-08-05","Ferencvaros","Gornik Zabrze","1-0"],["2026-08-06","KuPS Kuopio","Universitatea Craiova","1-1"],["2026-08-06","Lincoln Red Imps","Omonia","1-1"],["2026-08-06","Lech Poznan","KI Klaksvik","1-0"],["2026-08-06","Thun","Vikingur Reykjavik","3-0"],["2026-08-06","Jagiellonia","Rangers","2-1"],["2026-08-06","Maccabi Tel-Aviv","CSKA Sofia","0-3"],["2026-08-06","Salzburg","Pafos","1-0"],["2026-08-06","Hradec Kralove","Besiktas","0-1"],["2026-08-06","PAOK","Anderlecht","0-1"],["2026-08-06","Benfica","Hearts","6-1"],["2026-08-11","Iberia Tbilisi","Larne","2-1"],
  ["2026-08-13","Omonia","Lincoln Red Imps","1-0"],["2026-08-13","Universitatea Craiova","KuPS Kuopio","2-1"],["2026-08-13","Vikingur Reykjavik","Thun","3-2"],["2026-08-13","Egnatia","Shamrock Rovers","5-1"],["2026-08-13","Besiktas","Hradec Kralove","1-0"],["2026-08-13","Pafos","Salzburg","3-3"],["2026-08-13","Gornik Zabrze","Ferencvaros","1-1"],["2026-08-13","CSKA Sofia","Maccabi Tel-Aviv","1-3"],["2026-08-13","Rangers","Jagiellonia","1-1"],["2026-08-13","Anderlecht","PAOK","3-2"],["2026-08-13","Hearts","Benfica","1-1"]
].map(([date,home,away,score])=>({date,home,away,score,half:"—",stage:"qualifying"}));

const VERIFIED_TIES: Tie[] = [
  {round:"第一轮",path:"主路径",a:"Qarabag",b:"Vestri",leg1:"3–0",leg2:"0–3",total:"6–0",winner:"Qarabag"},
  {round:"第一轮",path:"主路径",a:"Dynamo Kyiv",b:"Universitatea Cluj",leg1:"0–0",leg2:"0–0",total:"0–0（点球4–2）",winner:"Dynamo Kyiv"},
  {round:"第一轮",path:"主路径",a:"Sheriff",b:"Aluminij",leg1:"0–0",leg2:"0–1",total:"1–0",winner:"Sheriff"},
  {round:"第一轮",path:"主路径",a:"CSKA Sofia",b:"Derry",leg1:"3–2",leg2:"1–2",total:"5–3",winner:"CSKA Sofia"},
  {round:"第一轮",path:"主路径",a:"Hajduk Split",b:"Zilina",leg1:"2–0",leg2:"2–1",total:"3–2",winner:"Hajduk Split"},
  {round:"第一轮",path:"主路径",a:"Vojvodina",b:"Ferencvaros",leg1:"1–2",leg2:"3–0",total:"1–5",winner:"Ferencvaros"},
  {round:"第二轮",path:"主路径",a:"Qarabag",b:"CSKA Sofia",leg1:"0–0",leg2:"0–0",total:"0–0（点球4–5）",winner:"CSKA Sofia"},
  {round:"第二轮",path:"主路径",a:"Hammarby",b:"Anderlecht",leg1:"1–1",leg2:"3–1",total:"2–4",winner:"Anderlecht"},
  {round:"第二轮",path:"主路径",a:"Tromso",b:"Hradec Kralove",leg1:"0–1",leg2:"3–1",total:"1–4",winner:"Hradec Kralove"},
  {round:"第二轮",path:"主路径",a:"Sheriff",b:"Maccabi Tel-Aviv",leg1:"0–5",leg2:"1–0",total:"0–6",winner:"Maccabi Tel-Aviv"},
  {round:"第二轮",path:"主路径",a:"Dynamo Kyiv",b:"PAOK",leg1:"2–3",leg2:"2–0",total:"2–5",winner:"PAOK"},
  {round:"第二轮",path:"主路径",a:"Twente",b:"Ferencvaros",leg1:"1–2",leg2:"2–2",total:"3–4",winner:"Ferencvaros"},
  {round:"第二轮",path:"主路径",a:"Besiktas",b:"Midtjylland",leg1:"1–0",leg2:"0–2",total:"3–0",winner:"Besiktas"},
  {round:"第二轮",path:"主路径",a:"St. Gallen",b:"Benfica",leg1:"2–1",leg2:"5–0",total:"2–6",winner:"Benfica"},
  {round:"第二轮",path:"主路径",a:"Hajduk Split",b:"Pafos",leg1:"2–0",leg2:"4–0",total:"2–4（加时）",winner:"Pafos"},
  {round:"第三轮",path:"冠军路径",a:"Larne",b:"Iberia Tbilisi",leg1:"0–0",leg2:"2–1",total:"1–2（加时）",winner:"Iberia Tbilisi"},
  {round:"第三轮",path:"冠军路径",a:"Shamrock Rovers",b:"Egnatia",leg1:"3–1",leg2:"5–1",total:"4–6",winner:"Egnatia"},
  {round:"第三轮",path:"冠军路径",a:"KuPS Kuopio",b:"Universitatea Craiova",leg1:"1–1",leg2:"2–1",total:"2–3",winner:"Universitatea Craiova"},
  {round:"第三轮",path:"冠军路径",a:"Lincoln Red Imps",b:"Omonia",leg1:"1–1",leg2:"1–0",total:"1–2",winner:"Omonia"},
  {round:"第三轮",path:"冠军路径",a:"Lech Poznan",b:"KI Klaksvik",leg1:"1–0",leg2:"待赛",total:"1–0",winner:""},
  {round:"第三轮",path:"冠军路径",a:"Thun",b:"Vikingur Reykjavik",leg1:"3–0",leg2:"3–2",total:"5–3",winner:"Thun"},
  {round:"第三轮",path:"主路径",a:"Ferencvaros",b:"Gornik Zabrze",leg1:"1–0",leg2:"1–1",total:"2–1",winner:"Ferencvaros"},
  {round:"第三轮",path:"主路径",a:"Jagiellonia",b:"Rangers",leg1:"2–1",leg2:"1–1",total:"3–2",winner:"Jagiellonia"},
  {round:"第三轮",path:"主路径",a:"Maccabi Tel-Aviv",b:"CSKA Sofia",leg1:"0–3",leg2:"1–3",total:"3–4",winner:"CSKA Sofia"},
  {round:"第三轮",path:"主路径",a:"Salzburg",b:"Pafos",leg1:"1–0",leg2:"3–3",total:"4–3",winner:"Salzburg"},
  {round:"第三轮",path:"主路径",a:"Hradec Kralove",b:"Besiktas",leg1:"0–1",leg2:"1–0",total:"0–2",winner:"Besiktas"},
  {round:"第三轮",path:"主路径",a:"PAOK",b:"Anderlecht",leg1:"0–1",leg2:"3–2",total:"2–4",winner:"Anderlecht"},
  {round:"第三轮",path:"主路径",a:"Benfica",b:"Hearts",leg1:"6–1",leg2:"1–1",total:"7–2",winner:"Benfica"}
];

const VERIFIED_PLAYOFF_TIES: PlayoffTie[] = [
  ["Trabzonspor","Ferencvaros"],["Universitatea Craiova","Ararat-Armenia"],["Sint-Truidense","Omonia"],["Crvena Zvezda","Viktoria Plzen"],
  ["Egnatia","Lillestrom"],["Jagiellonia","Iberia Tbilisi"],["Mjallby","Salzburg"],["Kairat Almaty","Anderlecht"],
  ["Lech Poznan","Thun"],["Besiktas","Kauno Zalgiris"],["Benfica","Aarhus"],["OFI Crete","CSKA Sofia"]
].map(([a,b])=>({a,b,leg1:"待赛",leg2:"待赛",total:"VS",winner:""}));

const VERIFIED_FIXTURES: Fixture[] = [
  ["2026-08-14","20:00","KI Klaksvik","Lech Poznan"],
  ["2026-08-20","待定","Trabzonspor","Ferencvaros"],["2026-08-20","待定","Universitatea Craiova","Ararat-Armenia"],["2026-08-20","待定","Sint-Truidense","Omonia"],["2026-08-20","待定","Crvena Zvezda","Viktoria Plzen"],["2026-08-20","待定","Egnatia","Lillestrom"],["2026-08-20","待定","Jagiellonia","Iberia Tbilisi"],["2026-08-20","待定","Mjallby","Salzburg"],["2026-08-20","待定","Kairat Almaty","Anderlecht"],["2026-08-20","待定","Lech Poznan / KI Klaksvik","Thun"],["2026-08-20","待定","Besiktas","Kauno Zalgiris"],["2026-08-20","待定","Benfica","Aarhus"],["2026-08-20","待定","OFI Crete","CSKA Sofia"]
].map(([date,time,home,away])=>({date,time,home,away}));

const aliases: Record<string,string> = {"Qarabağ":"Qarabag","Tromsø":"Tromso","Hradec Králové":"Hradec Kralove","Ferencváros":"Ferencvaros","Beşiktaş":"Besiktas","Žilina":"Zilina","Klaksvík":"KI Klaksvik","KÍ Klaksvík":"KI Klaksvik","Víkingur Reykjavík":"Vikingur Reykjavik","Jagiellonia Białystok":"Jagiellonia","Górnik Zabrze":"Gornik Zabrze","Lech Poznań":"Lech Poznan","Universitatea Craiova ":"Universitatea Craiova"};
const canon=(value:string)=>aliases[value.trim()]||value.trim();
const scorePair=(value:string)=>value.match(/(\d+)[–-](\d+)/)?.slice(1).map(Number) as [number,number] | undefined;
const matchKey=(item:{date:string;home:string;away:string})=>`${item.date}|${item.home}|${item.away}`;

function parseOfficialText(text:string){
  const matches:ParsedMatch[]=[];let round="",date="";
  const months:Record<string,string>={July:"07",August:"08"};
  for(const raw of text.split(/\r?\n/)){
    const line=raw.replace(/\[([^\]]+)\]\([^\)]+\)/g,"$1").replace(/[\uFEFF*_#]/g,"").replace(/\s+/g," ").trim();
    if(/First qualifying round/i.test(line))round="第一轮";else if(/Second qualifying round/i.test(line))round="第二轮";else if(/Third qualifying round/i.test(line))round="第三轮";else if(/Play-off round/i.test(line))round="附加赛";
    const day=line.match(/(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+(\d{1,2})\s+(July|August)/i);
    if(day)date=`2026-${months[day[2][0].toUpperCase()+day[2].slice(1).toLowerCase()]}-${day[1].padStart(2,"0")}`;
    if(!date||!round)continue;
    const result=line.match(/^(.+?)\s+(\d+)[–-](\d+)(aet)?\s+(.+?)(?:\s+\((agg:.*)\))?$/i);
    if(!result)continue;
    const home=canon(result[1]),away=canon(result[5]);
    if(!home||!away||/^(Main|Champions) path$/i.test(home))continue;
    matches.push({date,home,away,score:`${result[2]}-${result[3]}`,half:"—",stage:"qualifying",note:`${result[4]||""} ${result[6]||""}`.trim(),round});
  }
  const updated=text.match(/Last updated:\s*(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+(July|August)\s+(\d{1,2}),\s+2026/i);
  const sourceUpdatedAt=updated?`2026-${months[updated[1]]}-${updated[2].padStart(2,"0")}`:"";
  return {matches,sourceUpdatedAt};
}

async function fetchOfficial(){
  const refreshBucket=Math.floor(Date.now()/300_000);
  const response=await fetch(`${UEFA_TEXT_URL}?n=%40&refresh=${refreshBucket}`,{cache:"no-store",signal:AbortSignal.timeout(12000),headers:{Accept:"text/markdown"}});
  if(!response.ok)throw new Error(`UEFA ${response.status}`);
  const parsed=parseOfficialText(await response.text());
  if(parsed.matches.length<10)throw new Error("UEFA response did not contain enough results");
  return parsed;
}

function mergeMatches(base:Match[],fresh:Match[]){const map=new Map(base.map(item=>[matchKey(item),item]));fresh.forEach(item=>map.set(matchKey(item),item));return [...map.values()]}

function updateTie<T extends {a:string;b:string;leg1:string;leg2:string;total:string;winner:string}>(tie:T,official:ParsedMatch[],round:string):T{
    const roundMatches=official.filter(match=>match.round===round);
    const first=roundMatches.find(m=>m.home===tie.a&&m.away===tie.b),second=roundMatches.find(m=>m.home===tie.b&&m.away===tie.a);
    if(!first&&!second)return {...tie};
    const next={...tie};if(first)next.leg1=first.score.replace("-","–");if(second)next.leg2=second.score.replace("-","–");
    const one=scorePair(next.leg1),two=scorePair(next.leg2);
    if(one&&!two){next.total=`${one[0]}–${one[1]}`;next.winner="";return next}
    if(!one&&two){next.total=`${two[1]}–${two[0]}`;next.winner="";return next}
    if(!one||!two)return next;
    const aTotal=one[0]+two[1],bTotal=one[1]+two[0];let suffix="";
    if(second?.note.includes("aet"))suffix="（加时）";
    const penalty=second?.note.match(/([\p{L}\s.-]+?)\s+win\s+(\d+)[–-](\d+)\s+on penalties/iu);
    if(penalty)suffix=`（点球${penalty[2]}–${penalty[3]}）`;
    next.total=`${aTotal}–${bTotal}${suffix}`;
    next.winner=aTotal>bTotal?tie.a:bTotal>aTotal?tie.b:penalty?(canon(penalty[1]).includes(tie.a)?tie.a:tie.b):next.winner;
    return next;
}

function updateTies(base:Tie[],official:ParsedMatch[]){return base.map(tie=>updateTie(tie,official,tie.round))}
function updatePlayoffTies(base:PlayoffTie[],official:ParsedMatch[]){return base.map(tie=>updateTie(tie,official,"附加赛"))}

export const dynamic="force-dynamic";
export async function GET(){
  let matches=[...VERIFIED_MATCHES],ties=VERIFIED_TIES.map(tie=>({...tie})),playoffTies=VERIFIED_PLAYOFF_TIES.map(tie=>({...tie})),sourceUpdatedAt="2026-08-13",live=false;
  try{const official=await fetchOfficial();matches=mergeMatches(matches,official.matches);ties=updateTies(ties,official.matches);playoffTies=updatePlayoffTies(playoffTies,official.matches);sourceUpdatedAt=official.sourceUpdatedAt||matches.reduce((latest,item)=>item.date>latest?item.date:latest,sourceUpdatedAt);live=true}catch{}
  const completed=new Set(matches.map(matchKey));
  const fixtures=VERIFIED_FIXTURES.filter(item=>!completed.has(matchKey(item))&&new Date(`${item.date}T23:59:59Z`).getTime()>=Date.now()).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  matches.sort((a,b)=>b.date.localeCompare(a.date));
  return Response.json({source:live?"UEFA 官方资格赛页面":"UEFA 官方赛果（本地已验证快照）",sourceUrl:UEFA_URL,live,stale:!live,checkedAt:new Date().toISOString(),sourceUpdatedAt,matches,ties,playoffTies,fixtures},{headers:{"Cache-Control":"no-store, max-age=0","Content-Type":"application/json; charset=utf-8","X-Content-Type-Options":"nosniff"}});
}
