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

test("Europa League data contains verified third-round results", async () => {
  const [data, liveUpdate, advancement, qualification, api] = await Promise.all([
    readFile(new URL("../public/europa-league-2026/qualification-data.js", import.meta.url), "utf8"),
    readFile(new URL("../public/europa-league-2026/live-update.js", import.meta.url), "utf8"),
    readFile(new URL("../public/europa-league-2026/advancement.js", import.meta.url), "utf8"),
    readFile(new URL("../public/europa-league-2026/qualification.js", import.meta.url), "utf8"),
    readFile(new URL("../app/api/uel-live/route.ts", import.meta.url), "utf8"),
  ]);
  assert.match(data, /Egnatia',leg1:'3–1',leg2:'5–1',total:'4–6',winner:'Egnatia'/);
  assert.match(data, /Anderlecht',leg1:'0–1',leg2:'3–2',total:'2–4',winner:'Anderlecht'/);
  assert.match(data, /\['Trabzonspor','Ferencvaros'\]/);
  assert.match(liveUpdate, /uelQualifyingTies\.splice/);
  assert.match(liveUpdate, /renderUelAdvancement/);
  assert.match(advancement, /window\.renderUelAdvancement/);
  assert.match(qualification, /window\.renderUelQualification/);
  assert.match(api, /parseOfficialText/);
  assert.match(api, /sourceUpdatedAt/);
  assert.match(api, /stale:!live/);
});
