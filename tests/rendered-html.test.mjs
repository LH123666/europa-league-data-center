import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server renders the data-center entry page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /NORD 16｜挪超数据中心/);
  assert.match(html, /url=\/site\/index\.html/);
});

test("Europa League data contains the complete official league phase and qualifiers", async () => {
  const [data, leagueData, liveUpdate, dataSync, advancement, qualification, api, clubContext] = await Promise.all([
    readFile(new URL("../public/europa-league-2026/qualification-data.js", import.meta.url), "utf8"),
    readFile(new URL("../public/europa-league-2026/league-data.js", import.meta.url), "utf8"),
    readFile(new URL("../public/europa-league-2026/live-update.js", import.meta.url), "utf8"),
    readFile(new URL("../public/europa-league-2026/data-sync-utils.js", import.meta.url), "utf8"),
    readFile(new URL("../public/europa-league-2026/advancement.js", import.meta.url), "utf8"),
    readFile(new URL("../public/europa-league-2026/qualification.js", import.meta.url), "utf8"),
    readFile(new URL("../app/api/uel-live/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../public/europa-league-2026/club-context.css", import.meta.url), "utf8"),
  ]);
  assert.match(data, /Egnatia',leg1:'3–1',leg2:'5–1',total:'4–6',winner:'Egnatia'/);
  assert.match(data, /Anderlecht',leg1:'0–1',leg2:'3–2',total:'2–4',winner:'Anderlecht'/);
  assert.match(data, /Trabzonspor'.+leg1:'0–1'.+total:'0–5'.+winner:'Ferencvaros'/);
  assert.match(data, /Lech Poznan'.+leg1:'1–0'.+leg2:'0–5'.+total:'6–0'/);
  assert.match(leagueData, /window\.uelLeagueCatalog=catalog/);
  assert.match(leagueData, /window\.uelLeagueFixtures=fixtures/);
  assert.match(leagueData, /rawUpcoming\.splice\(0,rawUpcoming\.length,\.\.\.fixtures\)/);
  assert.match(liveUpdate, /uelQualifyingTies\.splice/);
  assert.match(liveUpdate, /setInterval\(\(\)=>updateData\(true\),300000\)/);
  assert.match(liveUpdate, /renderUelAdvancement/);
  assert.match(liveUpdate, /uelDataSync\.mergeMatchRows/);
  assert.match(liveUpdate, /uelDataSync\.mergeFixtures/);
  assert.match(liveUpdate, /if\(window\.uelSeason\.current\)\{\s*updateData\(true\)/);
  assert.match(liveUpdate, /uelDashboardUpdate\?\.\(\{archive:true/);
  assert.match(dataSync, /function mergeMatchRows/);
  assert.match(dataSync, /function mergeFixtures/);
  assert.match(advancement, /window\.renderUelAdvancement/);
  assert.match(advancement, /资格赛全部结束/);
  assert.match(advancement, /t\.leg1\|\|'待赛'/);
  assert.match(qualification, /window\.renderUelQualification/);
  assert.match(api, /parseOfficialText/);
  assert.match(api, /parseOfficialMatches/);
  assert.match(api, /match\.uefa\.com\/v5\/matches/);
  assert.match(api, /updatePlayoffTies/);
  assert.match(api, /playoffTies=updatePlayoffTies/);
  assert.match(api, /refreshBucket/);
  assert.match(api, /\["2026-08-20","Kairat Almaty","Anderlecht","0-3"\]/);
  assert.match(api, /\["2026-08-27","Anderlecht","Kairat Almaty","3-0"\]/);
  assert.match(api, /sourceUpdatedAt="2026-08-27"/);
  assert.match(api, /sourceUpdatedAt/);
  assert.match(api, /sourceErrors/);
  assert.match(api, /authoritative/);
  assert.match(api, /"L\. Red Imps":"Lincoln Red Imps"/);
  assert.match(api, /stale:!live/);
  assert.match(clubContext, /\.schedule-context \.entry\{background:#fff0dd;color:#75522f\}/);
  assert.match(clubContext, /\.schedule-context \.pot-1\{background:#fff0b8;color:#795b0d\}/);
  assert.match(clubContext, /\.schedule-context \.pot-4\{background:#def2e8;color:#28634b\}/);
  assert.match(clubContext, /\.schedule-context \.domestic\{background:#eaf2fa;color:#355979\}/);
  assert.match(clubContext, /\.schedule-context \.europe\{background:#eee8fa;color:#624197\}/);
  assert.match(clubContext, /\.schedule-context \.not-qualified\{background:#fff0ef;color:#9a4d45\}/);
});

test("Europa League live merging never removes newer local data or official fixtures", async () => {
  const vm = await import("node:vm");
  const source=await readFile(new URL("../public/europa-league-2026/data-sync-utils.js",import.meta.url),"utf8");
  const context={window:null};context.window=context;vm.createContext(context);vm.runInContext(source,context);
  const current=[["2026-08-27","Anderlecht","Kairat Almaty","3-0","—","qualifying"]];
  const stale=[["2026-08-20","Kairat Almaty","Anderlecht","0-3","—","qualifying"]];
  const merged=context.uelDataSync.mergeMatchRows(current,stale);
  assert.equal(merged.length,2);assert.equal(merged[0][0],"2026-08-27");
  const base=[{date:"2026-09-16",time:"18:45",home:"A",away:"B"},{date:"2026-09-17",time:"21:00",home:"C",away:"D"}];
  const fixtures=context.uelDataSync.mergeFixtures(base,[],[["2026-09-16","A","B","2-0","—","league"]]);
  assert.equal(fixtures.length,1);assert.equal(fixtures[0].home,"C");
});

test("Europa League league-phase invariants are enforced", async () => {
  const vm = await import("node:vm");
  const [matchesData, leagueData] = await Promise.all([
    readFile(new URL("../public/europa-league-2026/matches-data.js", import.meta.url), "utf8"),
    readFile(new URL("../public/europa-league-2026/league-data.js", import.meta.url), "utf8"),
  ]);
  const context={window:null};context.window=context;vm.createContext(context);vm.runInContext(matchesData,context);vm.runInContext(leagueData,context);
  const {uelLeagueCatalog: teams,uelLeagueFixtures: fixtures,uelLeagueDraw: draw,uelTeamInfo}=context;
  assert.equal(teams.length,36);assert.equal(new Set(teams.map(team=>team.zh)).size,36);assert.equal(fixtures.length,144);
  for(let pot=1;pot<=4;pot++)assert.equal(teams.filter(team=>team.pot===pot).length,9);
  for(const team of teams){const rows=draw[team.name];assert.equal(rows.length,8);assert.equal(rows.filter(row=>row.venue==='home').length,4);assert.equal(rows.filter(row=>row.venue==='away').length,4);for(let pot=1;pot<=4;pot++)assert.equal(rows.filter(row=>uelTeamInfo(row.opponent).pot===pot).length,2)}
});
