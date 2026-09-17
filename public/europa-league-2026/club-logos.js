(function(){
  const files={
    'AZ Alkmaar':'01_az-alkmaar.webp','Anderlecht':'02_anderlecht.webp','Ararat-Armenia':'03_ararat-armenia.webp',
    'Benfica':'04_benfica.webp','Besiktas':'05_besiktas.webp','Bournemouth':'06_bournemouth.webp','Celje':'07_celje.webp',
    'Celta':'08_celta-vigo.webp','Celtic':'09_celtic.webp','Crystal Palace':'10_crystal-palace.webp','Ferencvaros':'11_ferencvaros.webp',
    'Dinamo Zagreb':'12_gnk-dinamo-zagreb.webp','Hapoel Beer-Sheva':'13_hapoel-beer-sheva.webp','Hoffenheim':'14_hoffenheim.webp',
    'Jagiellonia':'15_jagiellonia-bialystok.webp','Juventus':'16_juventus.webp','Lech Poznan':'17_lech-poznan.webp',
    'Leverkusen':'18_bayer-leverkusen.webp','Levski Sofia':'19_levski-sofia.webp','Lillestrom':'20_lillestrom.webp','Lyon':'21_lyon.webp',
    'Marseille':'22_marseille.webp','Milan':'23_ac-milan.webp','NEC Nijmegen':'24_nec-nijmegen.webp','OFI Crete':'25_ofi-crete.webp',
    'Olympiacos':'26_olympiacos.webp','Omonia':'27_omonia.webp','Real Sociedad':'28_real-sociedad.webp','Rennes':'29_rennes.webp',
    'Salzburg':'30_salzburg.webp','Sparta Prague':'31_sparta-praha.webp','Sturm Graz':'32_sturm-graz.webp','Sunderland':'33_sunderland.webp',
    'Torreense':'34_torreense.webp','Union Saint-Gilloise':'35_union-sg.webp','Viktoria Plzen':'36_viktoria-plzen.webp'
  };
  const localAliases={
    'Bayer Leverkusen':'Leverkusen','AC Milan':'Milan','GNK Dinamo Zagreb':'Dinamo Zagreb','GNK Dinamo':'Dinamo Zagreb',
    'Union SG':'Union Saint-Gilloise','Sparta Praha':'Sparta Prague','Celta Vigo':'Celta','Jagiellonia Bialystok':'Jagiellonia',
    'Omonoia':'Omonia','H. Beer-Sheva':'Hapoel Beer-Sheva','Hapoel Be’er Sheva':'Hapoel Beer-Sheva',"Hapoel Be'er Sheva":'Hapoel Beer-Sheva',
    'N.E.C.':'NEC Nijmegen','NEC':'NEC Nijmegen','Lillestrøm':'Lillestrom','Viktoria Plzeň':'Viktoria Plzen','Lech Poznań':'Lech Poznan',
    'Ferencváros':'Ferencvaros','Beşiktaş':'Besiktas','AZ':'AZ Alkmaar'
  };
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const canonical=value=>{
    const raw=String(value??'').trim();
    if(files[raw])return raw;
    const appCanonical=window.uelCanonical?.(raw)||raw;
    return files[appCanonical]?appCanonical:(localAliases[raw]||localAliases[appCanonical]||appCanonical);
  };
  const initials=value=>{
    const key=canonical(value),team=window.uelTeamInfo?.(key),code=team?.code;
    if(code)return code.slice(0,4);
    const words=String(value||'?').replace(/[^A-Za-z0-9 ]/g,' ').trim().split(/\s+/).filter(Boolean);
    return (words.length>1?words.map(word=>word[0]).join(''):words[0]||'?').slice(0,4).toUpperCase();
  };
  function logo(value,size='md',label=''){
    const key=canonical(value),file=files[key],text=label||window.uelTeamInfo?.(key)?.zh||key||String(value||'球队');
    const fallback=`<span class="club-logo-fallback" aria-hidden="true">${esc(initials(key))}</span>`;
    if(!file)return `<span class="club-logo club-logo--${esc(size)} club-logo--fallback-only" title="${esc(text)}">${fallback}</span>`;
    return `<span class="club-logo club-logo--${esc(size)}" title="${esc(text)}"><img src="assets/team-logos/2026-27/${file}" alt="${esc(text)}队徽" loading="lazy" decoding="async" onload="this.parentElement.classList.add('is-loaded')" onerror="this.remove()">${fallback}</span>`;
  }
  window.uelClubLogo=logo;
  window.uelClubLogoFile=value=>files[canonical(value)]||'';
  window.uelClubLogoNames=Object.freeze({...files});
})();
