(function () {
  const canonical = value => window.uelCanonical(value);
  const pair = f => `${canonical(f.home)}|${canonical(f.away)}`;
  const score = value => /^\d+[-–]\d+$/.test(String(value)) ? String(value).split(/[-–]/).map(Number) : null;
  const unique = items => [...new Map(items.map(f => [`${f.stage}|${pair(f)}`, f])).values()];
  function events(rows, fixtures = []) {
    const baseline = window.uelLeagueFixtures || [];
    const find = f => baseline.find(b => pair(b) === pair(f));
    const normalize = f => {
      const base = find(f);
      const stage = f.stage || (base ? 'league' : 'unknown');
      return {...base,...f,home:canonical(f.home),away:canonical(f.away),stage,
        matchday:stage==='league'?(f.matchday||base?.matchday):undefined,time:f.time||base?.time||'',note:f.note||base?.note||''};
    };
    const scheduled = [...baseline, ...fixtures].map(normalize);
    const completed = rows.map(m => normalize({date:m[0],home:m[1],away:m[2],score:m[3],half:m[4],stage:m[5],round:m[6],matchday:m[7],note:m[8],time:m[9],halfSource:m[10]})).filter(f => score(f.score));
    return unique([...scheduled, ...completed]);
  }
  function color(f) {
    const s = score(f.score), h = window.uelTeamInfo(f.home)?.pot, a = window.uelTeamInfo(f.away)?.pot;
    if (!s || !h || !a) return 'neutral';
    if (h === a) return s[0] === s[1] ? 'draw' : 'equal';
    if (s[0] === s[1]) return 'upset';
    return ((s[0] > s[1]) === (h < a)) ? 'favorite' : 'upset';
  }
  function stats(items) {
    const played = unique(items).filter(f => score(f.score));
    const result = {played:played.length, goals:0, home:0, draw:0, away:0, btts:0, over:0, upset:0, crossPot:0};
    played.forEach(f => {
      const [h,a] = score(f.score); result.goals += h+a;
      result[h>a?'home':h<a?'away':'draw']++;
      if (h && a) result.btts++; if (h+a>=3) result.over++;
      const hp=window.uelTeamInfo(f.home)?.pot, ap=window.uelTeamInfo(f.away)?.pot;
      if(hp && ap && hp!==ap){result.crossPot++;if(h!==a && color(f)==='upset')result.upset++;}
    });
    return result;
  }
  window.uelSeasonModel = {events, color, score, stats, unique, pair};
})();
