import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source=await readFile(new URL('../public/europa-league-2026/season-archives.js',import.meta.url),'utf8');
const context={window:{}};
vm.runInNewContext(source,context,{filename:'season-archives.js'});
const archives=context.window.uelSeasonArchives;

test('historical Europa League archives contain both requested seasons',()=>{
  assert.deepEqual(Object.keys(archives).sort(),['2024-25','2025-26']);
});

for(const [key,expected] of Object.entries({
  '2024-25':{qualification:80,league:144,knockout:45,total:269,champion:'Tottenham Hotspur',finalScore:'1-0'},
  '2025-26':{qualification:82,league:144,knockout:45,total:271,champion:'Aston Villa',finalScore:'0-3'}
})){
  test(`${key} archive is complete and internally consistent`,()=>{
    const archive=archives[key];
    assert.ok(archive);
    assert.deepEqual(JSON.parse(JSON.stringify(archive.counts)),{
      qualification:expected.qualification,league:expected.league,knockout:expected.knockout,total:expected.total
    });
    assert.equal(archive.catalog.length,36);
    assert.equal(new Set(archive.catalog.map(team=>team.name)).size,36);
    assert.equal(Object.values(archive.pots).flat().length,36);
    assert.ok(Object.values(archive.pots).every(pot=>pot.length===9));
    assert.equal(archive.leagueFixtures.length,144);
    assert.ok(archive.leagueFixtures.every(match=>/^\d+-\d+$/.test(match.score)));

    const appearances=new Map(archive.catalog.map(team=>[team.name,0]));
    const matchdays=Array.from({length:8},()=>0);
    for(const match of archive.leagueFixtures){
      assert.ok(appearances.has(match.home),`unknown home team: ${match.home}`);
      assert.ok(appearances.has(match.away),`unknown away team: ${match.away}`);
      appearances.set(match.home,appearances.get(match.home)+1);
      appearances.set(match.away,appearances.get(match.away)+1);
      assert.ok(match.matchday>=1&&match.matchday<=8);
      matchdays[match.matchday-1]++;
    }
    assert.ok([...appearances.values()].every(count=>count===8));
    assert.deepEqual(matchdays,[18,18,18,18,18,18,18,18]);

    assert.equal(archive.finalStandings.length,36);
    assert.deepEqual(JSON.parse(JSON.stringify(archive.finalStandings.map(row=>row.rank))),Array.from({length:36},(_,index)=>index+1));
    assert.ok(archive.finalStandings.every(row=>row.p===8));
    assert.equal(archive.final.champion,expected.champion);
    assert.equal(archive.final.score,expected.finalScore);
  });
}
