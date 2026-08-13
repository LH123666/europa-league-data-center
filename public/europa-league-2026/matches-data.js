const uelNames={
  'AZ Alkmaar':'阿尔克马尔','Bournemouth':'伯恩茅斯','Celta':'塞尔塔','Crystal Palace':'水晶宫',
  'Hoffenheim':'霍芬海姆','Juventus':'尤文图斯','Leverkusen':'勒沃库森','Marseille':'马赛',
  'Milan':'AC米兰','Real Sociedad':'皇家社会','Rennes':'雷恩','Sunderland':'桑德兰','Torreense':'托伦斯',
  'Qarabag':'卡拉巴赫','CSKA Sofia':'索菲亚中央陆军','Hammarby':'哈马比','Anderlecht':'安德莱赫特',
  'Tromso':'特罗姆瑟','Hradec Kralove':'赫拉德茨克拉洛韦','Sheriff':'谢里夫',
  'Maccabi Tel-Aviv':'特拉维夫马卡比','Dynamo Kyiv':'基辅迪纳摩','PAOK':'塞萨洛尼基',
  'Twente':'特温特','Ferencvaros':'费伦茨瓦罗斯','Besiktas':'贝西克塔斯','Midtjylland':'中日德兰',
  'St. Gallen':'圣加仑','Benfica':'本菲卡','Hajduk Split':'哈伊杜克','Pafos':'帕福斯',
  'Derry':'德里城','Universitatea Cluj':'克卢日大学','Aluminij':'亚穆尼积','Vojvodina':'伏伊伏丁那',
  'Zilina':'日利纳','Vestri':'韦斯特里','Jagiellonia':'雅盖隆','Rangers':'格拉斯哥流浪者',
  'Salzburg':'萨尔茨堡','Lillestrom':'利勒斯特罗姆','OFI Crete':'克里特OFI',
  'Sint-Truidense':'圣图尔登','Trabzonspor':'特拉布宗体育','Viktoria Plzen':'比尔森胜利',
  'Vestri':'韦斯特里','Larne':'拉恩','Iberia Tbilisi':'第比利斯伊比利亚','Shamrock Rovers':'沙姆洛克流浪',
  'Egnatia':'埃格纳蒂亚','KuPS Kuopio':'古比斯','Universitatea Craiova':'克拉约瓦大学','Lincoln Red Imps':'林肯红魔',
  'Omonia':'奥莫尼亚','Lech Poznan':'波兹南莱赫','KI Klaksvik':'克拉克斯维克','Thun':'图恩',
  'Vikingur Reykjavik':'雷克雅未克维京人','Gornik Zabrze':'扎布热戈尔尼克','Hearts':'哈茨',
  'Ararat-Armenia':'亚美尼亚阿拉特','Crvena Zvezda':'贝尔格莱德红星','Lillestrom':'利勒斯特罗姆',
  'Mjallby':'米亚尔比','Kairat Almaty':'阿拉木图凯拉特','Kauno Zalgiris':'考纳斯扎尔吉里斯','Aarhus':'奥胡斯'
};

const leagueTeams=[
  ['AZ Alkmaar','AZ'],['Bournemouth','BOU'],['Celta','CEL'],['Crystal Palace','CRY'],['Hoffenheim','TSG'],
  ['Juventus','JUV'],['Leverkusen','B04'],['Marseille','OM'],['Milan','ACM'],['Real Sociedad','RSO'],
  ['Rennes','REN'],['Sunderland','SUN'],['Torreense','TOR']
];

const aliases={
  'AZ':'AZ Alkmaar','AFC Bournemouth':'Bournemouth','Celta Vigo':'Celta','TSG Hoffenheim':'Hoffenheim',
  'Bayer Leverkusen':'Leverkusen','Olympique de Marseille':'Marseille','AC Milan':'Milan','Stade Rennes':'Rennes',
  'Qarabağ':'Qarabag','Qarabag FK':'Qarabag','PFC CSKA Sofia':'CSKA Sofia','Tromsø':'Tromso',
  'FC Hradec Králové':'Hradec Kralove','M. Tel-Aviv':'Maccabi Tel-Aviv','Dynamo Kiev':'Dynamo Kyiv',
  'PAOK Salonika':'PAOK','Ferencváros':'Ferencvaros','Beşiktaş':'Besiktas','FC Midtjylland':'Midtjylland',
  'Hajduk Split':'Hajduk Split','U. Cluj':'Universitatea Cluj','Universitatea Cluj':'Universitatea Cluj',
  'Žilina':'Zilina','Vojvodina':'Vojvodina','FC Salzburg':'Salzburg','Viktoria Plzeň':'Viktoria Plzen'
};

// 资格赛半场数据在官方汇总页未完整提供，统一显示“—”。
const rawMatches=[
  ['2026-07-09','Qarabag','Vestri','3-0','—','qualifying'],
  ['2026-07-09','Dynamo Kyiv','Universitatea Cluj','0-0','—','qualifying'],
  ['2026-07-09','Sheriff','Aluminij','0-0','—','qualifying'],
  ['2026-07-09','CSKA Sofia','Derry','3-2','—','qualifying'],
  ['2026-07-09','Hajduk Split','Zilina','2-0','—','qualifying'],
  ['2026-07-09','Vojvodina','Ferencvaros','1-2','—','qualifying'],
  ['2026-07-16','Derry','CSKA Sofia','1-2','—','qualifying'],
  ['2026-07-16','Universitatea Cluj','Dynamo Kyiv','0-0','—','qualifying'],
  ['2026-07-16','Aluminij','Sheriff','0-1','—','qualifying'],
  ['2026-07-16','Ferencvaros','Vojvodina','3-0','—','qualifying'],
  ['2026-07-16','Zilina','Hajduk Split','2-1','—','qualifying'],
  ['2026-07-16','Vestri','Qarabag','0-3','—','qualifying']
];

// UEFA 页面标注为 CET；网页会明确显示该时区，避免与北京时间混淆。
const rawUpcoming=[
  {date:'2026-07-23',time:'18:00',home:'Qarabag',away:'CSKA Sofia'},
  {date:'2026-07-23',time:'19:00',home:'Hammarby',away:'Anderlecht'},
  {date:'2026-07-23',time:'19:00',home:'Tromso',away:'Hradec Kralove'},
  {date:'2026-07-23',time:'19:00',home:'Sheriff',away:'Maccabi Tel-Aviv'},
  {date:'2026-07-23',time:'19:00',home:'Dynamo Kyiv',away:'PAOK'},
  {date:'2026-07-23',time:'20:00',home:'Twente',away:'Ferencvaros'},
  {date:'2026-07-23',time:'20:00',home:'Besiktas',away:'Midtjylland'},
  {date:'2026-07-23',time:'20:00',home:'St. Gallen',away:'Benfica'},
  {date:'2026-07-23',time:'21:00',home:'Hajduk Split',away:'Pafos'},
  {date:'2026-07-30',time:'18:00',home:'Maccabi Tel-Aviv',away:'Sheriff'},
  {date:'2026-07-30',time:'19:00',home:'Hradec Kralove',away:'Tromso'},
  {date:'2026-07-30',time:'19:00',home:'Midtjylland',away:'Besiktas'},
  {date:'2026-07-30',time:'19:00',home:'Pafos',away:'Hajduk Split'},
  {date:'2026-07-30',time:'19:45',home:'PAOK',away:'Dynamo Kyiv'},
  {date:'2026-07-30',time:'20:00',home:'CSKA Sofia',away:'Qarabag'},
  {date:'2026-07-30',time:'20:30',home:'Anderlecht',away:'Hammarby'},
  {date:'2026-07-30',time:'20:30',home:'Ferencvaros',away:'Twente'},
  {date:'2026-07-30',time:'21:00',home:'Benfica',away:'St. Gallen'}
];
