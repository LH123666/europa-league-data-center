const UEFA_URL = "https://www.uefa.com/uefaeuropaleague/accesslist/";
const UEFA_TEXT_URL = `https://r.jina.ai/http://${UEFA_URL.replace(/^https?:\/\//, "")}`;
const UEFA_MATCHES_URL = "https://match.uefa.com/v5/matches?competitionId=14&seasonYear=2027&order=ASC&offset=0&limit=250";
const UEFA_MATCH_PAGE_URL = (offset:number)=>`https://match.uefa.com/v5/matches?competitionId=14&seasonYear=2027&order=ASC&offset=${offset}&limit=80`;

type Match = { date: string; home: string; away: string; score: string; half: string; stage: "qualifying" | "league" };
type Fixture = { date: string; time: string; home: string; away: string };
type Tie = { round: string; path: string; a: string; b: string; leg1: string; leg2: string; total: string; winner: string };
type PlayoffTie = Omit<Tie, "round" | "path">;
type ParsedMatch = Match & { note: string; round: string };
type OfficialSnapshot = { matches: ParsedMatch[]; fixtures: Fixture[]; sourceUpdatedAt: string; source: string; errors: string[] };
type JsonRecord = Record<string, unknown>;

const VERIFIED_MATCHES: Match[] = [
  ["2026-07-09","Qarabag","Vestri","3-0"],["2026-07-09","Dynamo Kyiv","Universitatea Cluj","0-0"],["2026-07-09","Sheriff","Aluminij","0-0"],["2026-07-09","CSKA Sofia","Derry","3-2"],["2026-07-09","Hajduk Split","Zilina","2-0"],["2026-07-09","Vojvodina","Ferencvaros","1-2"],
  ["2026-07-16","Derry","CSKA Sofia","1-2"],["2026-07-16","Universitatea Cluj","Dynamo Kyiv","0-0"],["2026-07-16","Aluminij","Sheriff","0-1"],["2026-07-16","Ferencvaros","Vojvodina","3-0"],["2026-07-16","Zilina","Hajduk Split","2-1"],["2026-07-16","Vestri","Qarabag","0-3"],
  ["2026-07-23","Qarabag","CSKA Sofia","0-0"],["2026-07-23","Hammarby","Anderlecht","1-1"],["2026-07-23","Tromso","Hradec Kralove","0-1"],["2026-07-23","Sheriff","Maccabi Tel-Aviv","0-5"],["2026-07-23","Dynamo Kyiv","PAOK","2-3"],["2026-07-23","Twente","Ferencvaros","1-2"],["2026-07-23","Besiktas","Midtjylland","1-0"],["2026-07-23","St. Gallen","Benfica","2-1"],["2026-07-23","Hajduk Split","Pafos","2-0"],
  ["2026-07-30","Maccabi Tel-Aviv","Sheriff","1-0"],["2026-07-30","Hradec Kralove","Tromso","3-1"],["2026-07-30","Midtjylland","Besiktas","0-2"],["2026-07-30","Pafos","Hajduk Split","4-0"],["2026-07-30","PAOK","Dynamo Kyiv","2-0"],["2026-07-30","CSKA Sofia","Qarabag","0-0"],["2026-07-30","Anderlecht","Hammarby","3-1"],["2026-07-30","Ferencvaros","Twente","2-2"],["2026-07-30","Benfica","St. Gallen","5-0"],
  ["2026-08-04","Larne","Iberia Tbilisi","0-0"],["2026-08-04","Shamrock Rovers","Egnatia","3-1"],["2026-08-05","Ferencvaros","Gornik Zabrze","1-0"],["2026-08-06","KuPS Kuopio","Universitatea Craiova","1-1"],["2026-08-06","Lincoln Red Imps","Omonia","1-1"],["2026-08-06","Lech Poznan","KI Klaksvik","1-0"],["2026-08-06","Thun","Vikingur Reykjavik","3-0"],["2026-08-06","Jagiellonia","Rangers","2-1"],["2026-08-06","Maccabi Tel-Aviv","CSKA Sofia","0-3"],["2026-08-06","Salzburg","Pafos","1-0"],["2026-08-06","Hradec Kralove","Besiktas","0-1"],["2026-08-06","PAOK","Anderlecht","0-1"],["2026-08-06","Benfica","Hearts","6-1"],["2026-08-11","Iberia Tbilisi","Larne","2-1"],
  ["2026-08-13","Omonia","Lincoln Red Imps","1-0"],["2026-08-13","Universitatea Craiova","KuPS Kuopio","2-1"],["2026-08-13","Vikingur Reykjavik","Thun","3-2"],["2026-08-13","Egnatia","Shamrock Rovers","5-1"],["2026-08-13","Besiktas","Hradec Kralove","1-0"],["2026-08-13","Pafos","Salzburg","3-3"],["2026-08-13","Gornik Zabrze","Ferencvaros","1-1"],["2026-08-13","CSKA Sofia","Maccabi Tel-Aviv","1-3"],["2026-08-13","Rangers","Jagiellonia","1-1"],["2026-08-13","Anderlecht","PAOK","3-2"],["2026-08-13","Hearts","Benfica","1-1"],["2026-08-13","KI Klaksvik","Lech Poznan","0-5"],
  ["2026-08-20","Kairat Almaty","Anderlecht","0-3"],["2026-08-20","Jagiellonia","Iberia Tbilisi","4-0"],["2026-08-20","Mjallby","Salzburg","0-1"],
  ["2026-08-20","Trabzonspor","Ferencvaros","0-1"],["2026-08-20","Universitatea Craiova","Ararat-Armenia","1-1"],["2026-08-20","Egnatia","Lillestrom","0-0"],
  ["2026-08-20","Besiktas","Kauno Zalgiris","3-0"],["2026-08-20","Lech Poznan","Thun","7-0"],["2026-08-20","Sint-Truidense","Omonia","1-0"],["2026-08-20","Crvena Zvezda","Viktoria Plzen","3-0"],["2026-08-20","OFI Crete","CSKA Sofia","3-0"],["2026-08-20","Benfica","Aarhus","3-1"],
  ["2026-08-27","Ararat-Armenia","Universitatea Craiova","1-0"],["2026-08-27","Iberia Tbilisi","Jagiellonia","1-2"],["2026-08-27","Omonia","Sint-Truidense","4-2"],["2026-08-27","Viktoria Plzen","Crvena Zvezda","5-1"],
  ["2026-08-27","Lillestrom","Egnatia","2-1"],["2026-08-27","Salzburg","Mjallby","3-0"],["2026-08-27","Kauno Zalgiris","Besiktas","1-0"],["2026-08-27","Thun","Lech Poznan","2-2"],
  ["2026-08-27","Aarhus","Benfica","1-3"],["2026-08-27","CSKA Sofia","OFI Crete","0-2"],["2026-08-27","Ferencvaros","Trabzonspor","4-0"],["2026-08-27","Anderlecht","Kairat Almaty","3-0"]
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
  {round:"第三轮",path:"冠军路径",a:"Lech Poznan",b:"KI Klaksvik",leg1:"1–0",leg2:"0–5",total:"6–0",winner:"Lech Poznan"},
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
  {a:"Trabzonspor",b:"Ferencvaros",leg1:"0–1",leg2:"4–0",total:"0–5",winner:"Ferencvaros"},
  {a:"Universitatea Craiova",b:"Ararat-Armenia",leg1:"1–1",leg2:"1–0",total:"1–2",winner:"Ararat-Armenia"},
  {a:"Sint-Truidense",b:"Omonia",leg1:"1–0",leg2:"4–2",total:"3–4",winner:"Omonia"},
  {a:"Crvena Zvezda",b:"Viktoria Plzen",leg1:"3–0",leg2:"5–1",total:"4–5",winner:"Viktoria Plzen"},
  {a:"Egnatia",b:"Lillestrom",leg1:"0–0",leg2:"2–1",total:"1–2",winner:"Lillestrom"},
  {a:"Jagiellonia",b:"Iberia Tbilisi",leg1:"4–0",leg2:"1–2",total:"6–1",winner:"Jagiellonia"},
  {a:"Mjallby",b:"Salzburg",leg1:"0–1",leg2:"3–0",total:"0–4",winner:"Salzburg"},
  {a:"Kairat Almaty",b:"Anderlecht",leg1:"0–3",leg2:"3–0",total:"0–6",winner:"Anderlecht"},
  {a:"Lech Poznan",b:"Thun",leg1:"7–0",leg2:"2–2",total:"9–2",winner:"Lech Poznan"},
  {a:"Besiktas",b:"Kauno Zalgiris",leg1:"3–0",leg2:"1–0",total:"3–1",winner:"Besiktas"},
  {a:"Benfica",b:"Aarhus",leg1:"3–1",leg2:"1–3",total:"6–2",winner:"Benfica"},
  {a:"OFI Crete",b:"CSKA Sofia",leg1:"3–0",leg2:"0–2",total:"5–0",winner:"OFI Crete"}
];

const VERIFIED_FIXTURES: Fixture[] = [];

const aliases: Record<string,string> = {"Qarabağ":"Qarabag","Tromsø":"Tromso","Hradec Králové":"Hradec Kralove","Ferencváros":"Ferencvaros","Beşiktaş":"Besiktas","Žilina":"Zilina","Klaksvík":"KI Klaksvik","KÍ Klaksvík":"KI Klaksvik","Víkingur Reykjavík":"Vikingur Reykjavik","Víkingur R.":"Vikingur Reykjavik","L. Red Imps":"Lincoln Red Imps","M. Tel-Aviv":"Maccabi Tel-Aviv","U. Cluj":"Universitatea Cluj","Jagiellonia Białystok":"Jagiellonia","Górnik Zabrze":"Gornik Zabrze","Lech Poznań":"Lech Poznan","Universitatea Craiova ":"Universitatea Craiova","U. Craiova":"Universitatea Craiova","Mjällby":"Mjallby","Lillestrøm":"Lillestrom","Viktoria Plzeň":"Viktoria Plzen","Kauno Žalgiris":"Kauno Zalgiris","Sparta Praha":"Sparta Prague","Omonoia":"Omonia","GNK Dinamo":"Dinamo Zagreb","Union SG":"Union Saint-Gilloise","N.E.C.":"NEC Nijmegen","NEC":"NEC Nijmegen"};
const canon=(value:string)=>aliases[value.trim()]||value.trim();
const scorePair=(value:string)=>value.match(/(\d+)[–-](\d+)/)?.slice(1).map(Number) as [number,number] | undefined;
const matchKey=(item:{date:string;home:string;away:string})=>`${item.date}|${item.home}|${item.away}`;

function parseOfficialText(text:string){
  const matches:ParsedMatch[]=[];let round="",date="";
  const prepared=text
    .replace(/<script[\s\S]*?<\/script>/gi,"\n")
    .replace(/<style[\s\S]*?<\/style>/gi,"\n")
    .replace(/<[^>]+>/g,"\n")
    .replace(/&nbsp;|&#160;/gi," ")
    .replace(/&amp;/gi,"&")
    .replace(/&#(\d+);/g,(_,code)=>String.fromCharCode(Number(code)));
  const months:Record<string,string>={July:"07",August:"08"};
  for(const raw of prepared.split(/\r?\n/)){
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

const isRecord=(value:unknown):value is JsonRecord=>typeof value==="object"&&value!==null&&!Array.isArray(value);
function readPath(value:unknown,path:string[]):unknown{
  let cursor=value;
  for(const key of path){if(!isRecord(cursor))return undefined;cursor=cursor[key]}
  return cursor;
}
const readString=(value:unknown,path:string[])=>{const result=readPath(value,path);return typeof result==="string"?result:""};
const readNumber=(value:unknown,path:string[])=>{const result=readPath(value,path);const parsed=typeof result==="number"?result:Number(result);return Number.isFinite(parsed)?parsed:undefined};

function officialRound(value:string){
  if(/first qualifying/i.test(value))return "第一轮";
  if(/second qualifying/i.test(value))return "第二轮";
  if(/third qualifying/i.test(value))return "第三轮";
  if(/play.?offs?|play-off round/i.test(value))return "附加赛";
  if(/league phase/i.test(value))return "联赛阶段";
  return value||"联赛阶段";
}

function centralEuropeanDateTime(value:string,dateFallback:string){
  const parsed=new Date(value);
  if(Number.isNaN(parsed.getTime()))return {date:dateFallback,time:"待定"};
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Zurich",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(parsed);
  const part=(type:Intl.DateTimeFormatPartTypes)=>parts.find(item=>item.type===type)?.value||"";
  return {date:`${part("year")}-${part("month")}-${part("day")}`,time:`${part("hour")}:${part("minute")}`};
}

function parseOfficialMatches(payload:unknown){
  if(!Array.isArray(payload))throw new Error("UEFA matches response is not an array");
  const matches:ParsedMatch[]=[],fixtures:Fixture[]=[];
  for(const item of payload){
    if(!isRecord(item))continue;
    const home=canon(readString(item,["homeTeam","internationalName"])||readString(item,["homeTeam","displayName"]));
    const away=canon(readString(item,["awayTeam","internationalName"])||readString(item,["awayTeam","displayName"]));
    const rawDate=readString(item,["kickOffTime","date"]);
    const rawDateTime=readString(item,["kickOffTime","dateTime"]);
    const local=centralEuropeanDateTime(rawDateTime,rawDate);
    const date=local.date||rawDate;
    if(!home||!away||!date)continue;
    const status=readString(item,["status"]).toUpperCase();
    const round=officialRound(readString(item,["round","translations","name","EN"])||readString(item,["round","metaData","type"]));
    const stage=round==="联赛阶段"?"league":"qualifying";
    if(status==="FINISHED"){
      const homeScore=readNumber(item,["score","total","home"]),awayScore=readNumber(item,["score","total","away"]);
      if(homeScore===undefined||awayScore===undefined)continue;
      const halfHome=readNumber(item,["score","halfTime","home"]),halfAway=readNumber(item,["score","halfTime","away"]);
      const reason=readString(item,["winner","match","reason"]);let note="";
      if(/EXTRA_TIME/i.test(reason))note="aet";else if(/PENALT/i.test(reason))note="penalties";
      matches.push({date,home,away,score:`${homeScore}-${awayScore}`,half:halfHome===undefined||halfAway===undefined?"—":`${halfHome}-${halfAway}`,stage,note,round});
    }else if(status==="UPCOMING"||status==="SCHEDULED")fixtures.push({date,time:local.time,home,away});
  }
  if(matches.length<60||matches.length+fixtures.length<200)throw new Error(`UEFA matches response incomplete (${matches.length} results, ${fixtures.length} fixtures)`);
  matches.sort((a,b)=>b.date.localeCompare(a.date));
  fixtures.sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  return {matches,fixtures,sourceUpdatedAt:matches[0]?.date||""};
}

async function fetchOfficialJson(){
  const fetchPage=async(offset:number)=>{
    let lastError="";
    for(let attempt=0;attempt<2;attempt++){
      try{
        const response=await fetch(UEFA_MATCH_PAGE_URL(offset),{cache:"no-store",signal:AbortSignal.timeout(20000),headers:{Accept:"application/json"}});
        if(!response.ok)throw new Error(`UEFA matches API ${response.status} at offset ${offset}`);
        const declaredSize=Number(response.headers.get("content-length")||0);
        if(declaredSize>6_000_000)throw new Error(`UEFA matches page ${offset} exceeds size limit`);
        const body=await response.text();
        if(body.length>6_000_000)throw new Error(`UEFA matches page ${offset} exceeds size limit`);
        const parsed:unknown=JSON.parse(body);
        if(!Array.isArray(parsed))throw new Error(`UEFA matches page ${offset} is not an array`);
        return parsed;
      }catch(error){lastError=error instanceof Error?error.message:String(error);if(attempt===0)await new Promise(resolve=>setTimeout(resolve,300))}
    }
    throw new Error(lastError||`UEFA matches page ${offset} unavailable`);
  };
  const pages=await Promise.all([0,80,160].map(fetchPage));
  return parseOfficialMatches(pages.flat());
}

async function fetchOfficial():Promise<OfficialSnapshot>{
  const errors:string[]=[];
  try{
    const parsed=await fetchOfficialJson();
    return {...parsed,source:"UEFA 官方比赛接口",errors};
  }catch(error){errors.push(error instanceof Error?error.message:String(error))}
  const refreshBucket=Math.floor(Date.now()/300_000);
  for(const [url,label] of [[UEFA_URL,"UEFA"],[`${UEFA_TEXT_URL}?n=%40&refresh=${refreshBucket}`,"UEFA proxy"]]){
    try{
      const response=await fetch(url,{cache:"no-store",signal:AbortSignal.timeout(12000),headers:{Accept:"text/html, text/markdown"}});
      if(!response.ok)throw new Error(`${label} ${response.status}`);
      const parsed=parseOfficialText(await response.text());
      if(parsed.matches.length<10)throw new Error(`${label} response did not contain enough results`);
      return {...parsed,fixtures:[],source:"UEFA 官方资格赛页面",errors};
    }catch(error){errors.push(error instanceof Error?error.message:String(error))}
  }
  throw new Error(errors.join("; ")||"UEFA data unavailable");
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
  let matches:Match[]=[...VERIFIED_MATCHES],ties=VERIFIED_TIES.map(tie=>({...tie})),playoffTies=VERIFIED_PLAYOFF_TIES.map(tie=>({...tie})),sourceUpdatedAt="2026-08-27",source="UEFA 官方赛果（本地已验证快照）",sourceErrors:string[]=[],officialFixtures:Fixture[]=[],live=false,authoritative=false;
  try{
    const official=await fetchOfficial();authoritative=official.matches.length>=60&&official.matches.length+official.fixtures.length>=200;matches=authoritative?[...official.matches]:mergeMatches(matches,official.matches);ties=updateTies(ties,official.matches);playoffTies=updatePlayoffTies(playoffTies,official.matches);officialFixtures=official.fixtures;sourceUpdatedAt=matches.reduce((latest,item)=>item.date>latest?item.date:latest,sourceUpdatedAt);source=official.source;sourceErrors=official.errors;live=true;
  }catch(error){const message=error instanceof Error?error.message:String(error);sourceErrors=[message];console.error(JSON.stringify({event:"uel_live_update_failed",message}))}
  const completed=new Set(matches.map(matchKey));
  const fixtures=[...new Map([...VERIFIED_FIXTURES,...officialFixtures].filter(item=>!completed.has(matchKey(item))).map(item=>[matchKey(item),item])).values()].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  matches.sort((a,b)=>b.date.localeCompare(a.date));
  return Response.json({source,sourceUrl:UEFA_MATCHES_URL,live,authoritative,stale:!live,checkedAt:new Date().toISOString(),sourceUpdatedAt,matches,ties,playoffTies,fixtures,sourceErrors,counts:{results:matches.length,fixtures:fixtures.length}},{headers:{"Cache-Control":"no-store, max-age=0, must-revalidate","Content-Type":"application/json; charset=utf-8","X-Content-Type-Options":"nosniff"}});
}
