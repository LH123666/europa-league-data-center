(function(root){
  const matchKey=row=>`${row[0]}|${row[1]}|${row[2]}`;
  const fixtureKey=row=>`${row.date}|${row.home}|${row.away}`;

  function mergeMatchRows(current,incoming){
    const merged=new Map((current||[]).map(row=>[matchKey(row),row]));
    (incoming||[]).forEach(row=>merged.set(matchKey(row),row));
    return [...merged.values()].sort((a,b)=>b[0].localeCompare(a[0])||a[1].localeCompare(b[1]));
  }

  function mergeFixtures(base,incoming,completedRows){
    const completed=new Set((completedRows||[]).map(matchKey));
    const merged=new Map();
    [...(base||[]),...(incoming||[])].forEach(row=>{
      const key=fixtureKey(row);
      if(!completed.has(key))merged.set(key,row);
    });
    return [...merged.values()].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)||a.home.localeCompare(b.home));
  }

  root.uelDataSync={matchKey,fixtureKey,mergeMatchRows,mergeFixtures};
})(typeof window!=="undefined"?window:globalThis);
