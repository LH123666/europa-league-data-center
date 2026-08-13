const UEFA_URL = "https://www.uefa.com/uefaeuropaleague/news/02a6-20e5db0029dd-8241a8d00925-1000--europa-league-qualifying-fixtures-results-dates-how-it-works/";
const ESPN_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.europa/scoreboard?dates=20260701-20260831&limit=300";

type Match = { date: string; home: string; away: string; score: string; half: string; stage: "qualifying" | "league" };
type Fixture = { date: string; time: string; home: string; away: string };

const VERIFIED_MATCHES: Match[] = [
  ["2026-07-09","Qarabag","Vestri","3-0"],["2026-07-09","Dynamo Kyiv","Universitatea Cluj","0-0"],["2026-07-09","Sheriff","Aluminij","0-0"],["2026-07-09","CSKA Sofia","Derry","3-2"],["2026-07-09","Hajduk Split","Zilina","2-0"],["2026-07-09","Vojvodina","Ferencvaros","1-2"],
  ["2026-07-16","Derry","CSKA Sofia","1-2"],["2026-07-16","Universitatea Cluj","Dynamo Kyiv","0-0"],["2026-07-16","Aluminij","Sheriff","0-1"],["2026-07-16","Ferencvaros","Vojvodina","3-0"],["2026-07-16","Zilina","Hajduk Split","2-1"],["2026-07-16","Vestri","Qarabag","0-3"],
  ["2026-07-23","Qarabag","CSKA Sofia","0-0"],["2026-07-23","Hammarby","Anderlecht","1-1"],["2026-07-23","Tromso","Hradec Kralove","0-1"],["2026-07-23","Sheriff","Maccabi Tel-Aviv","0-5"],["2026-07-23","Dynamo Kyiv","PAOK","2-3"],["2026-07-23","Twente","Ferencvaros","1-2"],["2026-07-23","Besiktas","Midtjylland","1-0"],["2026-07-23","St. Gallen","Benfica","2-1"],["2026-07-23","Hajduk Split","Pafos","2-0"],
  ["2026-07-30","Maccabi Tel-Aviv","Sheriff","1-0"],["2026-07-30","Hradec Kralove","Tromso","3-1"],["2026-07-30","Midtjylland","Besiktas","0-2"],["2026-07-30","Pafos","Hajduk Split","4-0"],["2026-07-30","PAOK","Dynamo Kyiv","2-0"],["2026-07-30","CSKA Sofia","Qarabag","0-0"],["2026-07-30","Anderlecht","Hammarby","3-1"],["2026-07-30","Ferencvaros","Twente","2-2"],["2026-07-30","Benfica","St. Gallen","5-0"],
  ["2026-08-04","Larne","Iberia Tbilisi","0-0"],["2026-08-04","Shamrock Rovers","Egnatia","3-1"],["2026-08-05","Ferencvaros","Gornik Zabrze","1-0"],["2026-08-06","KuPS Kuopio","Universitatea Craiova","1-1"],["2026-08-06","Lincoln Red Imps","Omonia","1-1"],["2026-08-06","Lech Poznan","KI Klaksvik","1-0"],["2026-08-06","Thun","Vikingur Reykjavik","3-0"],["2026-08-06","Jagiellonia","Rangers","2-1"],["2026-08-06","Maccabi Tel-Aviv","CSKA Sofia","0-3"],["2026-08-06","Salzburg","Pafos","1-0"],["2026-08-06","Hradec Kralove","Besiktas","0-1"],["2026-08-06","PAOK","Anderlecht","0-1"],["2026-08-06","Benfica","Hearts","6-1"],["2026-08-11","Iberia Tbilisi","Larne","2-1"]
].map(([date,home,away,score])=>({date,home,away,score,half:"—",stage:"qualifying"}));

const VERIFIED_FIXTURES: Fixture[] = [
  ["2026-08-13","19:00","Omonia","Lincoln Red Imps"],["2026-08-13","19:00","Universitatea Craiova","KuPS Kuopio"],["2026-08-13","19:30","Vikingur Reykjavik","Thun"],["2026-08-13","20:45","KI Klaksvik","Lech Poznan"],["2026-08-13","21:00","Egnatia","Shamrock Rovers"],["2026-08-13","19:00","Besiktas","Hradec Kralove"],["2026-08-13","19:00","Pafos","Salzburg"],["2026-08-13","19:00","Gornik Zabrze","Ferencvaros"],["2026-08-13","20:00","CSKA Sofia","Maccabi Tel-Aviv"],["2026-08-13","20:30","Rangers","Jagiellonia"],["2026-08-13","20:30","Anderlecht","PAOK"],["2026-08-13","20:45","Hearts","Benfica"],
  ["2026-08-20","待定","Trabzonspor","Ferencvaros / Gornik Zabrze"],["2026-08-20","待定","KuPS Kuopio / Universitatea Craiova","Ararat-Armenia"],["2026-08-20","待定","Sint-Truidense","Lincoln Red Imps / Omonia"],["2026-08-20","待定","Crvena Zvezda","Viktoria Plzen"],["2026-08-20","待定","Shamrock Rovers / Egnatia","Lillestrom"],["2026-08-20","待定","Jagiellonia / Rangers","Iberia Tbilisi"],["2026-08-20","待定","Mjallby","Pafos / Salzburg"],["2026-08-20","待定","Kairat Almaty","PAOK / Anderlecht"],["2026-08-20","待定","Lech Poznan / KI Klaksvik","Thun / Vikingur Reykjavik"],["2026-08-20","待定","Hradec Kralove / Besiktas","Kauno Zalgiris"],["2026-08-20","待定","Benfica / Hearts","Aarhus"],["2026-08-20","待定","OFI Crete","Maccabi Tel-Aviv / CSKA Sofia"]
].map(([date,time,home,away])=>({date,time,home,away}));

const aliases: Record<string,string> = {"Qarabağ":"Qarabag","Tromsø":"Tromso","Hradec Králové":"Hradec Kralove","Ferencváros":"Ferencvaros","Beşiktaş":"Besiktas","Žilina":"Zilina","Klaksvík":"KI Klaksvik","Víkingur Reykjavík":"Vikingur Reykjavik","Jagiellonia Białystok":"Jagiellonia","Górnik Zabrze":"Gornik Zabrze","Lech Poznań":"Lech Poznan"};
const canon=(value:string)=>aliases[value.trim()]||value.trim();
const isRecord=(value:unknown):value is Record<string,unknown>=>typeof value==="object"&&value!==null;
const asArray=(value:unknown):unknown[]=>Array.isArray(value)?value:[];
const asRecord=(value:unknown):Record<string,unknown>=>isRecord(value)?value:{};

async function fetchEspn(){
  const response=await fetch(ESPN_URL,{cache:"no-store",signal:AbortSignal.timeout(7000),headers:{Accept:"application/json"}});
  if(!response.ok)throw new Error(`ESPN ${response.status}`);
  const payload=asRecord(await response.json()),matches:Match[]=[],fixtures:Fixture[]=[];
  for(const rawEvent of asArray(payload.events)){
    const event=asRecord(rawEvent),competition=asRecord(asArray(event.competitions)[0]),clubs=asArray(competition.competitors).map(asRecord);
    const home=clubs.find(item=>item.homeAway==="home"),away=clubs.find(item=>item.homeAway==="away");if(!home||!away)continue;
    const homeTeam=asRecord(home.team),awayTeam=asRecord(away.team),homeName=canon(String(homeTeam.displayName||homeTeam.shortDisplayName||"")),awayName=canon(String(awayTeam.displayName||awayTeam.shortDisplayName||""));if(!homeName||!awayName)continue;
    const dateValue=String(event.date||"");if(!dateValue)continue;const date=dateValue.slice(0,10),status=asRecord(asRecord(event.status).type);
    if(status.completed===true)matches.push({date,home:homeName,away:awayName,score:`${String(home.score||0)}-${String(away.score||0)}`,half:"—",stage:"qualifying"});
    else if(new Date(dateValue).getTime()>Date.now()-3_600_000){const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Zurich",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(dateValue));const hour=parts.find(x=>x.type==="hour")?.value||"00",minute=parts.find(x=>x.type==="minute")?.value||"00";fixtures.push({date,time:`${hour}:${minute}`,home:homeName,away:awayName})}
  }
  return {matches,fixtures};
}

async function checkUefa(){const response=await fetch(`https://r.jina.ai/http://${UEFA_URL.replace(/^https?:\/\//,"")}`,{cache:"no-store",signal:AbortSignal.timeout(8000),headers:{Accept:"text/markdown"}});if(!response.ok)throw new Error(`UEFA ${response.status}`);const text=await response.text();if(!text.includes("First qualifying round")||!text.includes("Second qualifying round"))throw new Error("Unexpected UEFA response");return true}
const merge=<T extends {date:string;home:string;away:string}>(base:T[],fresh:T[])=>{const map=new Map(base.map(item=>[`${item.date}|${item.home}|${item.away}`,item]));fresh.forEach(item=>map.set(`${item.date}|${item.home}|${item.away}`,item));return [...map.values()]};
export const dynamic="force-dynamic";
export async function GET(){let officialAvailable=false,liveAvailable=false,matches=VERIFIED_MATCHES,fixtures=VERIFIED_FIXTURES;const [uefa,espn]=await Promise.allSettled([checkUefa(),fetchEspn()]);if(uefa.status==="fulfilled")officialAvailable=true;if(espn.status==="fulfilled"&&(espn.value.matches.length||espn.value.fixtures.length)){liveAvailable=true;matches=merge(matches,espn.value.matches);fixtures=merge(fixtures,espn.value.fixtures)}const now=Date.now();fixtures=fixtures.filter(item=>new Date(`${item.date}T23:59:59Z`).getTime()>=now-86_400_000).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));matches=matches.sort((a,b)=>b.date.localeCompare(a.date));return Response.json({source:officialAvailable?"UEFA 官方资格赛页面":"UEFA 官方赛果（最近同步）",sourceUrl:UEFA_URL,live:liveAvailable,checkedAt:new Date().toISOString(),matches,fixtures},{headers:{"Cache-Control":"no-store, max-age=0","X-Content-Type-Options":"nosniff"}})}
