const uelQualifyingNames={
  'Qarabag':'卡拉巴赫','Vestri':'韦斯特里','Dynamo Kyiv':'基辅迪纳摩','Universitatea Cluj':'克卢日大学',
  'Sheriff':'谢里夫','Aluminij':'亚穆尼积','CSKA Sofia':'索菲亚中央陆军','Derry':'德里城',
  'Hajduk Split':'哈伊杜克','Zilina':'日利纳','Vojvodina':'伏伊伏丁那','Ferencvaros':'费伦茨瓦罗斯',
  'Hammarby':'哈马比','Anderlecht':'安德莱赫特','Tromso':'特罗姆瑟','Hradec Kralove':'赫拉德茨克拉洛韦',
  'Maccabi Tel-Aviv':'特拉维夫马卡比','PAOK':'塞萨洛尼基','Twente':'特温特','Besiktas':'贝西克塔斯',
  'Midtjylland':'中日德兰','St. Gallen':'圣加仑','Benfica':'本菲卡','Pafos':'帕福斯',
  'Larne':'拉恩','Iberia Tbilisi':'第比利斯伊比利亚','Shamrock Rovers':'沙姆洛克流浪','Egnatia':'埃格纳蒂亚',
  'KuPS Kuopio':'古比斯','Universitatea Craiova':'克拉约瓦大学','Lincoln Red Imps':'林肯红魔','Omonia':'奥莫尼亚',
  'Lech Poznan':'波兹南莱赫','KI Klaksvik':'克拉克斯维克','Thun':'图恩','Vikingur Reykjavik':'雷克雅未克维京人',
  'Jagiellonia':'雅盖隆','Rangers':'格拉斯哥流浪者','Salzburg':'萨尔茨堡','Hearts':'哈茨','Gornik Zabrze':'扎布热戈尔尼克'
};

const uelQualifyingTies=[
  {round:'第一轮',path:'主路径',a:'Qarabag',b:'Vestri',leg1:'3–0',leg2:'0–3',total:'6–0',winner:'Qarabag'},
  {round:'第一轮',path:'主路径',a:'Dynamo Kyiv',b:'Universitatea Cluj',leg1:'0–0',leg2:'0–0',total:'0–0（点球4–2）',winner:'Dynamo Kyiv'},
  {round:'第一轮',path:'主路径',a:'Sheriff',b:'Aluminij',leg1:'0–0',leg2:'0–1',total:'1–0',winner:'Sheriff'},
  {round:'第一轮',path:'主路径',a:'CSKA Sofia',b:'Derry',leg1:'3–2',leg2:'1–2',total:'5–3',winner:'CSKA Sofia'},
  {round:'第一轮',path:'主路径',a:'Hajduk Split',b:'Zilina',leg1:'2–0',leg2:'2–1',total:'3–2',winner:'Hajduk Split'},
  {round:'第一轮',path:'主路径',a:'Vojvodina',b:'Ferencvaros',leg1:'1–2',leg2:'3–0',total:'1–5',winner:'Ferencvaros'},
  {round:'第二轮',path:'主路径',a:'Qarabag',b:'CSKA Sofia',leg1:'0–0',leg2:'0–0',total:'0–0（点球4–5）',winner:'CSKA Sofia'},
  {round:'第二轮',path:'主路径',a:'Hammarby',b:'Anderlecht',leg1:'1–1',leg2:'3–1',total:'2–4',winner:'Anderlecht'},
  {round:'第二轮',path:'主路径',a:'Tromso',b:'Hradec Kralove',leg1:'0–1',leg2:'3–1',total:'1–4',winner:'Hradec Kralove'},
  {round:'第二轮',path:'主路径',a:'Sheriff',b:'Maccabi Tel-Aviv',leg1:'0–5',leg2:'1–0',total:'0–6',winner:'Maccabi Tel-Aviv'},
  {round:'第二轮',path:'主路径',a:'Dynamo Kyiv',b:'PAOK',leg1:'2–3',leg2:'2–0',total:'2–5',winner:'PAOK'},
  {round:'第二轮',path:'主路径',a:'Twente',b:'Ferencvaros',leg1:'1–2',leg2:'2–2',total:'3–4',winner:'Ferencvaros'},
  {round:'第二轮',path:'主路径',a:'Besiktas',b:'Midtjylland',leg1:'1–0',leg2:'0–2',total:'3–0',winner:'Besiktas'},
  {round:'第二轮',path:'主路径',a:'St. Gallen',b:'Benfica',leg1:'2–1',leg2:'5–0',total:'2–6',winner:'Benfica'},
  {round:'第二轮',path:'主路径',a:'Hajduk Split',b:'Pafos',leg1:'2–0',leg2:'4–0',total:'2–4（加时）',winner:'Pafos'},
  {round:'第三轮',path:'冠军路径',a:'Larne',b:'Iberia Tbilisi',leg1:'0–0',leg2:'2–1',total:'1–2（加时）',winner:'Iberia Tbilisi'},
  {round:'第三轮',path:'冠军路径',a:'Shamrock Rovers',b:'Egnatia',leg1:'3–1',leg2:'5–1',total:'4–6',winner:'Egnatia'},
  {round:'第三轮',path:'冠军路径',a:'KuPS Kuopio',b:'Universitatea Craiova',leg1:'1–1',leg2:'2–1',total:'2–3',winner:'Universitatea Craiova'},
  {round:'第三轮',path:'冠军路径',a:'Lincoln Red Imps',b:'Omonia',leg1:'1–1',leg2:'1–0',total:'1–2',winner:'Omonia'},
  {round:'第三轮',path:'冠军路径',a:'Lech Poznan',b:'KI Klaksvik',leg1:'1–0',leg2:'待赛',total:'1–0',winner:''},
  {round:'第三轮',path:'冠军路径',a:'Thun',b:'Vikingur Reykjavik',leg1:'3–0',leg2:'3–2',total:'5–3',winner:'Thun'},
  {round:'第三轮',path:'主路径',a:'Ferencvaros',b:'Gornik Zabrze',leg1:'1–0',leg2:'1–1',total:'2–1',winner:'Ferencvaros'},
  {round:'第三轮',path:'主路径',a:'Jagiellonia',b:'Rangers',leg1:'2–1',leg2:'1–1',total:'3–2',winner:'Jagiellonia'},
  {round:'第三轮',path:'主路径',a:'Maccabi Tel-Aviv',b:'CSKA Sofia',leg1:'0–3',leg2:'1–3',total:'3–4',winner:'CSKA Sofia'},
  {round:'第三轮',path:'主路径',a:'Salzburg',b:'Pafos',leg1:'1–0',leg2:'3–3',total:'4–3',winner:'Salzburg'},
  {round:'第三轮',path:'主路径',a:'Hradec Kralove',b:'Besiktas',leg1:'0–1',leg2:'1–0',total:'0–2',winner:'Besiktas'},
  {round:'第三轮',path:'主路径',a:'PAOK',b:'Anderlecht',leg1:'0–1',leg2:'3–2',total:'2–4',winner:'Anderlecht'},
  {round:'第三轮',path:'主路径',a:'Benfica',b:'Hearts',leg1:'6–1',leg2:'1–1',total:'7–2',winner:'Benfica'}
];

const uelPlayoffTies=[
  ['Trabzonspor','Ferencvaros'],['Universitatea Craiova','Ararat-Armenia'],
  ['Sint-Truidense','Omonia'],['Crvena Zvezda','Viktoria Plzen'],
  ['Egnatia','Lillestrom'],['Jagiellonia','Iberia Tbilisi'],
  ['Mjallby','Salzburg'],['Kairat Almaty','Anderlecht'],
  ['Lech Poznan / KI Klaksvik','Thun'],['Besiktas','Kauno Zalgiris'],
  ['Benfica','Aarhus'],['OFI Crete','CSKA Sofia']
];

const uelThirdRoundOrigins={
  'Larne':'欧冠资格赛第二轮冠军路径淘汰','Iberia Tbilisi':'欧冠资格赛第二轮冠军路径淘汰',
  'Shamrock Rovers':'欧冠资格赛第二轮冠军路径淘汰','Egnatia':'欧冠资格赛第二轮冠军路径淘汰',
  'KuPS Kuopio':'欧冠资格赛第二轮冠军路径淘汰','Universitatea Craiova':'欧冠资格赛第二轮冠军路径淘汰',
  'Lincoln Red Imps':'欧冠资格赛第二轮冠军路径淘汰','Omonia':'欧冠资格赛第二轮冠军路径淘汰',
  'Lech Poznan':'欧冠资格赛第二轮冠军路径淘汰','KI Klaksvik':'欧冠资格赛第二轮冠军路径淘汰',
  'Thun':'欧冠资格赛第二轮冠军路径淘汰','Vikingur Reykjavik':'欧冠资格赛第二轮冠军路径淘汰',
  'Ferencvaros':'欧罗巴资格赛第二轮晋级','CSKA Sofia':'欧罗巴资格赛第二轮晋级',
  'Anderlecht':'欧罗巴资格赛第二轮晋级','Hradec Kralove':'欧罗巴资格赛第二轮晋级',
  'Maccabi Tel-Aviv':'欧罗巴资格赛第二轮晋级','PAOK':'欧罗巴资格赛第二轮晋级',
  'Besiktas':'欧罗巴资格赛第二轮晋级','Benfica':'欧罗巴资格赛第二轮晋级','Pafos':'欧罗巴资格赛第二轮晋级',
  'Gornik Zabrze':'第三轮直接参赛','Rangers':'第三轮直接参赛','Hearts':'第三轮直接参赛',
  'Jagiellonia':'欧冠资格赛第二轮主路径淘汰','Salzburg':'欧冠资格赛第二轮主路径淘汰'
};
