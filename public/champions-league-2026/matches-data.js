const uclNames={
'Arsenal':'阿森纳','Aston Villa':'阿斯顿维拉','Atlético Madrid':'马德里竞技','Borussia Dortmund':'多特蒙德','Barcelona':'巴塞罗那','Bayern Munich':'拜仁慕尼黑','Club Brugge':'布鲁日','Como':'科莫','Feyenoord':'费耶诺德','Galatasaray':'加拉塔萨雷','Internazionale':'国际米兰','RB Leipzig':'莱比锡','Lens':'朗斯','Lille':'里尔','Liverpool':'利物浦','Manchester City':'曼城','Manchester United':'曼联','Napoli':'那不勒斯','Paris Saint-Germain':'巴黎圣日耳曼','FC Porto':'波尔图','PSV Eindhoven':'埃因霍温','Real Betis':'皇家贝蒂斯','Real Madrid':'皇家马德里','AS Roma':'罗马','Shakhtar Donetsk':'顿涅茨克矿工','Slavia Prague':'布拉格斯拉维亚','Sporting CP':'葡萄牙体育','VfB Stuttgart':'斯图加特','Villarreal':'比利亚雷亚尔',
'Sabah':'萨巴赫','The New Saints':'新圣徒','Lincoln Red Imps':'林肯红魔','Inter Club d’Escaldes':'伊斯卡尔德斯国际','Ararat-Armenia':'亚美尼亚阿拉拉特','Riga FC':'里加','Kauno Zalgiris':'考纳斯萨尔基利斯','Drita':'德里塔','Vardar':'瓦尔达尔','KuPS Kuopio':'古比斯','Floriana':'弗洛里亚纳','Shamrock Rovers':'沙姆洛克流浪','Tre Fiori':'特雷菲奥里','Larne':'拉恩','Borac Banja Luka':'巴尼亚卢卡战士','Levski Sofia':'索菲亚列夫斯基','KI Klaksvik':'克拉克斯维克','Atert Bissen':'阿特尔特比森','Vikingur Reykjavik':'雷克雅未克维京人','ETO Gyor':'杰尔ETO','Kairat Almaty':'阿拉木图凯拉特','Sutjeska':'尼克希奇苏捷斯卡','Flora Tallinn':'塔林弗洛拉','Iberia Tbilisi':'第比利斯伊比利亚','Vitebsk':'维捷布斯克','Universitatea Craiova':'克拉约瓦大学','Petrocub':'佩特罗库布','Egnatia':'埃格纳蒂亚','Mjallby':'米亚尔比','Red Star Belgrade':'贝尔格莱德红星','Aarhus':'奥胡斯','Lech Poznan':'波兹南莱赫','Omonoia':'奥莫尼亚','Dinamo Zagreb':'萨格勒布迪纳摩','Hapoel Beer-Sheva':'贝尔谢巴工人','Slovan Bratislava':'布拉迪斯拉发斯洛万','Celje':'采列','Fenerbahce':'费内巴切','Gornik Zabrze':'扎布热戈尔尼克','Sturm Graz':'格拉茨风暴','Hearts':'哈茨'};
const leagueTeams=[['Arsenal','ARS'],['Aston Villa','AVL'],['Atlético Madrid','ATM'],['Borussia Dortmund','BVB'],['Barcelona','BAR'],['Bayern Munich','FCB'],['Club Brugge','BRU'],['Como','COM'],['Feyenoord','FEY'],['Galatasaray','GAL'],['Internazionale','INT'],['RB Leipzig','RBL'],['Lens','LEN'],['Lille','LIL'],['Liverpool','LIV'],['Manchester City','MCI'],['Manchester United','MUN'],['Napoli','NAP'],['Paris Saint-Germain','PSG'],['FC Porto','POR'],['PSV Eindhoven','PSV'],['Real Betis','BET'],['Real Madrid','RMA'],['AS Roma','ROM'],['Shakhtar Donetsk','SHK'],['Slavia Prague','SLA'],['Sporting CP','SCP'],['VfB Stuttgart','VFB'],['Villarreal','VIL']];
const aliases={'Atleti':'Atlético Madrid','B. Dortmund':'Borussia Dortmund','Bayern München':'Bayern Munich','Inter':'Internazionale','Man City':'Manchester City','Man Utd':'Manchester United','Paris':'Paris Saint-Germain','PSV':'PSV Eindhoven','Roma':'AS Roma','Shakhtar':'Shakhtar Donetsk','Slavia Praha':'Slavia Prague','Stuttgart':'VfB Stuttgart','Fenerbahçe':'Fenerbahce','KÍ Klaksvík':'KI Klaksvik','Víkingur Reykjavík':'Vikingur Reykjavik','Universitatea Craiova':'Universitatea Craiova'};
const rawMatches=[
['2026-07-07','Sabah','The New Saints','2-0','—','qualifying'],['2026-07-07','Lincoln Red Imps','Inter Club d’Escaldes','3-1','—','qualifying'],['2026-07-07','Ararat-Armenia','Riga FC','2-0','—','qualifying'],['2026-07-07','Kauno Zalgiris','Drita','1-1','—','qualifying'],['2026-07-07','Vardar','KuPS Kuopio','0-2','—','qualifying'],['2026-07-07','Floriana','Shamrock Rovers','2-0','—','qualifying'],['2026-07-07','Tre Fiori','Larne','0-1','—','qualifying'],['2026-07-07','Borac Banja Luka','Levski Sofia','1-1','—','qualifying'],['2026-07-07','KI Klaksvik','Atert Bissen','2-1','—','qualifying'],['2026-07-07','Vikingur Reykjavik','ETO Gyor','1-0','—','qualifying'],['2026-07-08','Kairat Almaty','Sutjeska','2-1','—','qualifying'],['2026-07-08','Flora Tallinn','Iberia Tbilisi','2-3','—','qualifying'],['2026-07-08','Vitebsk','Universitatea Craiova','1-4','—','qualifying'],['2026-07-08','Petrocub','Egnatia','1-1','—','qualifying'],
['2026-07-14','KuPS Kuopio','Vardar','2-3','—','qualifying'],['2026-07-14','Iberia Tbilisi','Flora Tallinn','2-2','—','qualifying'],['2026-07-14','Inter Club d’Escaldes','Lincoln Red Imps','1-1','—','qualifying'],['2026-07-14','Riga FC','Ararat-Armenia','3-2','—','qualifying'],['2026-07-14','ETO Gyor','Vikingur Reykjavik','2-2','—','qualifying'],['2026-07-14','The New Saints','Sabah','1-2','—','qualifying'],['2026-07-14','Levski Sofia','Borac Banja Luka','4-0','—','qualifying'],['2026-07-14','Drita','Kauno Zalgiris','2-3','—','qualifying'],['2026-07-14','Shamrock Rovers','Floriana','5-1','—','qualifying'],['2026-07-14','Larne','Tre Fiori','2-1','—','qualifying'],['2026-07-15','Universitatea Craiova','Vitebsk','1-0','—','qualifying'],['2026-07-15','Egnatia','Petrocub','6-1','—','qualifying']];
const rawUpcoming=[
{date:'2026-07-22',time:'00:00',home:'Mjallby',away:'Lincoln Red Imps'},
{date:'2026-07-22',time:'00:00',home:'Sabah',away:'KuPS Kuopio'},
{date:'2026-07-22',time:'00:00',home:'Ararat-Armenia',away:'Shamrock Rovers'},
{date:'2026-07-22',time:'00:00',home:'Iberia Tbilisi',away:'Slovan Bratislava'},
{date:'2026-07-22',time:'01:00',home:'Aarhus',away:'Lech Poznan'},
{date:'2026-07-22',time:'02:00',home:'Thun',away:'Dinamo Zagreb'},
{date:'2026-07-22',time:'02:00',home:'Fenerbahce',away:'Gornik Zabrze'},
{date:'2026-07-22',time:'02:30',home:'Sturm Graz',away:'Hearts'},
{date:'2026-07-22',time:'02:45',home:'KI Klaksvik',away:'Kauno Zalgiris'},
{date:'2026-07-22',time:'03:00',home:'Larne',away:'Red Star Belgrade'},
{date:'2026-07-22',time:'03:00',home:'Vikingur Reykjavik',away:'Hapoel Beer-Sheva'},
{date:'2026-07-23',time:'01:00',home:'Omonoia',away:'Kairat Almaty'},
{date:'2026-07-23',time:'01:30',home:'Levski Sofia',away:'Universitatea Craiova'},
{date:'2026-07-23',time:'03:00',home:'Egnatia',away:'Celje'},
{date:'2026-07-28',time:'23:00',home:'KuPS Kuopio',away:'Sabah'},
{date:'2026-07-29',time:'00:00',home:'Lincoln Red Imps',away:'Mjallby'},
{date:'2026-07-29',time:'02:00',home:'Dinamo Zagreb',away:'Thun'},
{date:'2026-07-29',time:'02:15',home:'Celje',away:'Egnatia'},
{date:'2026-07-29',time:'02:45',home:'Hearts',away:'Sturm Graz'},
{date:'2026-07-29',time:'03:00',home:'Shamrock Rovers',away:'Ararat-Armenia'},
{date:'2026-07-29',time:'23:00',home:'Kairat Almaty',away:'Omonoia'},
{date:'2026-07-30',time:'00:00',home:'Kauno Zalgiris',away:'KI Klaksvik'},
{date:'2026-07-30',time:'01:00',home:'Lech Poznan',away:'Aarhus'},
{date:'2026-07-30',time:'01:30',home:'Universitatea Craiova',away:'Levski Sofia'},
{date:'2026-07-30',time:'01:30',home:'Hapoel Beer-Sheva',away:'Vikingur Reykjavik'},
{date:'2026-07-30',time:'02:00',home:'Red Star Belgrade',away:'Larne'},
{date:'2026-07-30',time:'02:00',home:'Gornik Zabrze',away:'Fenerbahce'},
{date:'2026-07-30',time:'02:15',home:'Slovan Bratislava',away:'Iberia Tbilisi'}];
