(() => {
'use strict';
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CHAPTERS = [
  {title:'芳花撷取',sub:'清晨小院 · 识花寻香',short:'采一捧清晨的花',desc:'循着清晨的花香，在小院里认识簪花的花材。',reward:'素馨花簪',intro:'孩子，来坐。先认一认这些花，再把花笺放到对应的位置。慢慢来，花儿不赶时间。'},
  {title:'螺髻盘梳',sub:'临窗梳妆 · 挽发成髻',short:'挽起日常的温柔',desc:'一梳一挽，把散发收拢，让花儿有安稳的落脚处。',reward:'鱼骨簪',intro:'花采好了，先把头发理顺。咱们依着“梳顺、挽髻、固髻”的次序，慢慢来就好。'},
  {title:'花围缀编',sub:'屋檐花事 · 编缀成环',short:'编一圈头上的花园',desc:'将一片片花簇围拢，让花香绕着发髻，成为一个圆。',reward:'花围簪',intro:'来，咱们把四段花簇，依着花笺上的方位围成一圈。一片挨一片，就像邻里坐在一起。'},
  {title:'日暮传韵',sub:'海边闲谈 · 花事相传',short:'把今日花事说给你听',desc:'与游客聊聊头上的花，把清晨的素馨别在鬓边。',reward:'完整图鉴 · 形象保存'}
];
const FLOWERS = [
  {id:'jasmine',name:'素馨花',short:'素馨',asset:'flowerJasmine',meaning:'素心 · 长相伴',clue:'白色星形小花，清香细细',specimen:'星形白花',hint:'素馨花的花瓣像小星星，试着找“白色星形小花”的花笺。'},
  {id:'magnolia',name:'白兰花',short:'白兰',asset:'flowerMagnolia',meaning:'清雅 · 寄思念',clue:'花瓣修长，香气馥郁',specimen:'修长白花',hint:'白兰花的花瓣修长，香气馥郁。瞧瞧哪张花笺写着它的模样？'},
  {id:'chrysanthemum',name:'菊花',short:'菊花',asset:'flowerChrysanthemum',meaning:'圆满 · 常安康',clue:'层层花瓣，聚成圆圆一朵',specimen:'层瓣圆花',hint:'菊花有层层花瓣，团团圆圆。找那张写着“聚成圆圆一朵”的花笺。'},
  {id:'red',name:'红花',short:'红花',asset:'flowerRed',meaning:'欢喜 · 好光景',clue:'一抹暖红，点亮花围',specimen:'暖红花朵',hint:'这一抹红，是咱们故事里欢喜的颜色。把它放到写着“点亮花围”的地方。'}
];
const ITEMS = [
 {id:'jasmine',name:'素馨花簪',short:'素馨',asset:'itemJasmine',category:'清香入囊',chapter:1,story:'素馨花是蟳埔簪花围中常见的芳香花材之一。小小的白花，细细的香，把日常装点得温柔。在这段旅程里，它记下你在清晨小院的第一次采花。',note:'本作将花材转化为可收集的“花簪”，作为章节纪念。'},
 {id:'fishbone',name:'鱼骨簪',short:'骨簪',asset:'itemFishbone',category:'挽髻成形',chapter:2,story:'簪花先要有安稳的发髻。蟳埔女的盘髻与骨簪，是发式中具有辨识度的元素。本作以“鱼骨簪”作故事道具，体验固髻这一步，也记住海边生活与装束之间的联系。',note:'道具命名与四步盘发为互动简化，不代表骨簪均由鱼骨制成，也不代替真实技艺教学。'},
 {id:'wreath',name:'花围簪',short:'花围',asset:'itemWreath',category:'随心缀编',chapter:3,story:'花围围绕发髻铺展开来，层次、色彩与香气相映，仿佛“头顶上的花园”。花材和搭配会随季节、喜好与场合变化。此处用四段花簇组成一圈，留住亲手编缀的心意。',note:'四段拼合、花围簪为本作设计，并非固定的传统编制规格。'}
];

const JOURNEY=window.ZANHUA_JOURNEY,STYLES=JOURNEY.styles,HAIR=JOURNEY.hair,QUESTIONS=JOURNEY.questions;
const FILE_MAP = {'grandma.png':'grandma','portrait.png':'portrait','portrait-loose.png':'portraitLoose','portrait-gathered.png':'portraitGathered','flower-jasmine.png':'flowerJasmine','flower-magnolia.png':'flowerMagnolia','flower-chrysanthemum.png':'flowerChrysanthemum','flower-red.png':'flowerRed','item-jasmine.png':'itemJasmine','item-fishbone.png':'itemFishbone','tool-comb.png':'toolComb','tool-tie.png':'toolTie','basket.png':'basket','tool-hair.png':'toolHair','mirror-loose.png':'mirrorLoose','mirror-smooth.png':'mirrorSmooth','mirror-gathered.png':'mirrorGathered','mirror-tied.png':'mirrorTied','mirror-pinned.png':'mirrorPinned','wreath-everyday.png':'wreathEveryday','wreath-festival.png':'wreathFestival','look-everyday.png':'lookEveryday','look-everyday-final.png':'lookEverydayFinal','look-festival.png':'lookFestival','look-festival-final.png':'lookFestivalFinal','sea-chat-everyday.png':'seaChatEveryday','sea-chat-festival.png':'seaChatFestival'};
// A separate schema preserves the earlier prototype's save without reusing incompatible steps.
const STORAGE_KEY='zanhua-journey-v3';
const STORY=window.ZANHUA_STORY;
const fresh=()=>({v:3,flowers:[],pickCounts:{},pendingFlower:null,toolStep:0,style:null,ring:[],ringVersion:4,quiz:{answers:[],choice:null,phase:'question'},readyJasmine:false,jasminePlaced:false,completed:[false,false,false,false],seen:[],cursor:null});
function readSave(){
 try{
  const s=JSON.parse(localStorage.getItem(STORAGE_KEY));if(s?.v!==3)return fresh();const n=fresh();
  n.flowers=FLOWERS.map(f=>f.id).filter(id=>s.flowers?.includes(id));
  for(const id of n.flowers)n.pickCounts[id]=Math.max(1,Math.min(999,Math.floor(Number(s.pickCounts?.[id])||1)));
  n.pendingFlower=n.flowers.includes(s.pendingFlower)?s.pendingFlower:null;
  n.completed[0]=n.flowers.length===4&&!n.pendingFlower;
  n.toolStep=n.completed[0]?Math.max(0,Math.min(4,Math.floor(Number(s.toolStep)||0))):0;n.completed[1]=n.toolStep===4;
  n.style=n.completed[1]&&STYLES[s.style]?s.style:null;
  const oldRing=Array.isArray(s.ring)?s.ring:[];n.ring=n.style?(s.ringVersion===4?[...new Set(oldRing.filter(i=>Number.isInteger(i)&&i>=0&&i<4))]:[0,1,2,3].filter(i=>oldRing.includes(i*2)&&oldRing.includes(i*2+1))):[];n.completed[2]=n.ring.length===4;
  if(n.completed[2]){
   const q=s.quiz||{};for(const a of Array.isArray(q.answers)?q.answers.slice(0,3):[]){if(![0,1,2].includes(a))break;n.quiz.answers.push(a);}
   if(n.quiz.answers.length<3&&[0,1,2].includes(q.choice)&&['you','grandma'].includes(q.phase)){n.quiz.choice=q.choice;n.quiz.phase=q.phase;}
   n.readyJasmine=n.quiz.answers.length===3&&s.readyJasmine===true;
   n.jasminePlaced=n.readyJasmine&&s.jasminePlaced===true;n.completed[3]=n.jasminePlaced;
  }
  n.seen=Array.isArray(s.seen)?s.seen.filter(k=>STORY[k]&&(k==='opening'||k==='ending'&&n.completed[3]||/^before[1-4]$/.test(k)&&(k==='before1'||n.completed[Number(k.slice(6))-2])||/^after[1-4]$/.test(k)&&n.completed[Number(k.slice(5))-1])):[];
  const c=s.cursor;if(c&&STORY[c.key]&&(c.key==='opening'||c.key==='ending'&&n.completed[3]||/^before[1-4]$/.test(c.key)&&(c.key==='before1'||n.completed[Number(c.key.slice(6))-2])||/^after[1-4]$/.test(c.key)&&n.completed[Number(c.key.slice(5))-1]))n.cursor={key:c.key,index:Math.max(0,Math.min(STORY[c.key].pages.length-1,Math.floor(Number(c.index)||0)))};
  return n;
 }catch{return fresh();}
}

let state=readSave(), route={page:'home'},selected=null,drag=null,suppressClick=false,toastTimer,dragFrame,handledTouchSource=null;
let bagOpen=false,dialogueOpen=true,picking=false,flowerModal=false;
let replaySnapshot=null,replayChapter=null;
let dialogue='', dialogueSpeaker='阿嬷', art={...window.ZANHUA_ART}, artBlobs={}, db=null, exportBusy=false;
let musicAudio=null,soundOn=false,musicRequest=0,musicLoadPromise=null,musicObjectURL=null,musicProgress=null;
// Warm the browser's image cache without waiting for a page turn or blocking render.
const imageWarmup={entries:new Map(),queue:[],active:0,started:false,timer:null};
function showBackground(src){
 const priority=$('#scene-priority');if(priority&&priority.getAttribute('href')!==src)priority.href=src;
 $('.landscape').style.backgroundImage=`url('${src}')`;
}
function planImageWarmup(background,scene){
 const preferred=state.style==='festival'?'Festival':'Everyday',other=preferred==='Festival'?'Everyday':'Festival';
 const keys=(...names)=>names.map(name=>art[name]);
 const chapters=[
  ['assets/scene-1.webp',...keys('grandma','flowerJasmine','flowerMagnolia','flowerChrysanthemum','flowerRed','basket','itemJasmine')],
  ['assets/scene-2.webp',...keys('mirrorLoose','toolComb','mirrorSmooth','toolTie','itemFishbone','mirrorGathered','mirrorTied','mirrorPinned')],
  ['assets/scene-3.webp',...keys('wreath'+preferred,'wreath'+other,'look'+preferred,'look'+other)],
  ['assets/scene-4.webp',...keys('grandma','seaChat'+preferred,'ending'+preferred,'look'+preferred+'Final','seaChat'+other,'ending'+other,'look'+other+'Final')]
 ];
 const next=route.page==='home'?currentNext():Math.max(0,Math.min(3,scene-1));
 const orderedChapters=[...chapters.slice(next),...chapters.slice(0,next)];
 const sources=[background,...orderedChapters.map(chapter=>chapter[0]),...$$('#main img').map(img=>img.src),
  ...orderedChapters.flatMap(chapter=>chapter.slice(1)),...Object.values(art)];
 const ordered=[...new Set(sources.filter(Boolean).map(src=>new URL(src,document.baseURI).href))];
 for(const src of ordered)if(!imageWarmup.entries.has(src))imageWarmup.entries.set(src,{src,status:'pending',attempts:0});
 // Rebuild pending order after navigation/style selection; never restart active downloads.
 const pending=ordered.map(src=>imageWarmup.entries.get(src)).filter(entry=>entry.status==='pending');
 imageWarmup.queue=[...pending.filter(entry=>!entry.attempts),...pending.filter(entry=>entry.attempts)];
 if(imageWarmup.started)scheduleImageWarmup(200);
}
function scheduleImageWarmup(delay=100){
 clearTimeout(imageWarmup.timer);
 imageWarmup.timer=setTimeout(pumpImageWarmup,delay);
}
function pumpImageWarmup(){
 if(!imageWarmup.started)return;
 if(soundOn&&musicLoadPromise&&!musicObjectURL)return;
 while(imageWarmup.active<2&&imageWarmup.queue.length){
  const entry=imageWarmup.queue.shift();if(entry.status!=='pending')continue;
  entry.status='loading';entry.attempts++;imageWarmup.active++;
  const img=new Image();img.fetchPriority='low';img.decoding='async';
  let settled=false;
  const finish=ok=>{
   if(settled)return;settled=true;clearTimeout(timeout);img.onload=null;img.onerror=null;
   imageWarmup.active--;entry.status=ok?'loaded':entry.attempts<2?'pending':'failed';
   if(!ok){img.removeAttribute('src');if(entry.status==='pending')imageWarmup.queue.push(entry);}
   scheduleImageWarmup();
  };
  // A slow/broken file cannot hold a slot forever. Retry once, after other images.
  const timeout=setTimeout(()=>finish(false),60000);
  img.onload=()=>finish(true);img.onerror=()=>finish(false);img.src=entry.src;
 }
}
function startImageWarmup(){
 if(imageWarmup.started)return;imageWarmup.started=true;scheduleImageWarmup();
}
// Give visible cover/title requests a head start, but don't depend on a slow load event.
window.addEventListener('load',startImageWarmup,{once:true});
setTimeout(startImageWarmup,1800);
function save(){if(replaySnapshot)return;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{toast('浏览器暂时无法保存进度，本次体验仍可继续。');}}
function unlocked(i){return i===0||state.completed[i-1];}
function owned(id){return state.completed[ITEMS.findIndex(i=>i.id===id)];}
const num=i=>String(i+1).padStart(2,'0');
const totalCompleted=()=>state.completed.filter(Boolean).length;

function hasArt(key){return Boolean(art[key]);}
function artImage(key,alt,cls=''){return art[key]?'<img class="'+cls+'" src="'+esc(art[key])+'" alt="'+esc(alt)+'" draggable="false">':'';}
function chosenStyle(){return STYLES[state.style];}
function syncWreathArt(){const src=art[chosenStyle()?.wreath];if(src)art.itemWreath=src;else delete art.itemWreath;}

function toast(message){const e=$('#toast');e.textContent=message;e.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('visible'),3500);}
function setDialogue(text,speaker='阿嬷'){dialogue=text;dialogueSpeaker=speaker;const el=$('#grandma-text');if(el)el.textContent=text;const toggle=$('.speaker-toggle');if(toggle){toggle.textContent=(speaker||(dialogueOpen?'收起':'展开'))+(dialogueOpen?' −':' ＋');toggle.setAttribute('aria-label',dialogueOpen?'收起这段话':'展开这段话');}}
function currentNext(){const i=state.completed.findIndex(v=>!v);return i<0?3:i;}
function navigate(page,chapter){
  if(replaySnapshot&&page!=='game'){state=replaySnapshot;replaySnapshot=null;replayChapter=null;}
  if(page==='game'&&!unlocked(chapter)){toast(`先完成「${CHAPTERS[chapter-1].title}」，带着花簪再来。`);return;}
  if(page==='ending'&&!state.completed[3]){toast('完成四章体验后，再与阿嬷赴海边的约。');return;}
  cancelDrag(); selected=null;
  if('speechSynthesis' in window) speechSynthesis.cancel();
  route={page,...(chapter!==undefined?{chapter}: {})};
  if(page==='game'){bagOpen=false;dialogueOpen=true;setDialogue(state.completed[chapter]?completionLine(chapter):getChapterPrompt(chapter),state.completed[chapter]?'':'阿嬷');}
  render();window.scrollTo({top:0,behavior:'instant'});$('#main').focus({preventScroll:true});
}
function render(){
  syncWreathArt();
  const scene=route.page==='story'?STORY[route.key].scene:route.page==='game'?(route.chapter+1):route.page==='ending'?4:1;
 const background=route.page==='home'?'assets/cover-harbor-v2.webp':`assets/scene-${scene}.webp`;
  showBackground(background);
  document.body.dataset.page=route.page;document.body.dataset.chapter=route.page==='game'?route.chapter+1:'';
  $$('[data-nav]').forEach(n=>n.classList.toggle('active',n.dataset.nav===route.page||(n.dataset.nav==='chapters'&&route.page==='game')));
  const views={home:homeView,chapters:chaptersView,game:gameView,gallery:galleryView,about:aboutView,ending:endingView,story:storyView};
  $('#main').innerHTML=`<div class="fade-in">${views[route.page]()}</div>`;
  if(route.page==='game'&&route.chapter===0&&state.pendingFlower&&!picking)queueMicrotask(showFlowerDialogue);
  document.title=`${route.page==='game'?CHAPTERS[route.chapter].title+' · ':''}簪花寻踪 · 民俗交互体验`;
  planImageWarmup(background,scene);
}
function homeView(){return `<section class="quiet-home"><div class="home-title"><h1><img class="home-title-art" src="assets/art/title-flower-trace.webp" alt="簪花寻踪 · Flower Trace" width="1702" height="515" fetchpriority="high"></h1><p>海风捎来花香，阿嬷在院子里等我。</p><button class="primary" data-action="begin">${state.cursor||state.seen.length||totalCompleted()?'继续这一日':'走进小院'} <span class="arrow">⟶</span></button>${state.seen.length||totalCompleted()?'<button class="text-button" data-action="reset-confirm">从头体验</button>':''}</div></section>`;}
function startStory(key,index=0){cancelDrag();clearSelection();route={page:'story',key,index};state.cursor={key,index};save();render();window.scrollTo(0,0);}
function continueJourney(){if(state.cursor)return startStory(state.cursor.key,state.cursor.index);if(!state.seen.includes('opening'))return startStory('opening');const i=currentNext();if(state.completed[3])return state.seen.includes('ending')?navigate('ending'):startStory('after4');enterChapter(i);}
function enterChapter(i){if(!unlocked(i))return toast('先陪阿嬷走完前一段花事。');if(state.completed[i]){
 replaySnapshot=state;replayChapter=i;state=JSON.parse(JSON.stringify(state));state.completed[i]=false;state.cursor=null;
 if(i===0){state.flowers=[];state.pickCounts={};state.pendingFlower=null;}
 if(i===1)state.toolStep=0;
 if(i===2){state.style=null;state.ring=[];}
 if(i===3){state.quiz={answers:[],choice:null,phase:'question'};state.readyJasmine=false;state.jasminePlaced=false;}
 return startStory('before'+(i+1));
}const key='before'+(i+1);if(!state.seen.includes(key))startStory(key);else navigate('game',i);}
function advanceStory(){const key=route.key,part=STORY[key];if(route.index<part.pages.length-1)return startStory(key,route.index+1);if(!state.seen.includes(key))state.seen.push(key);state.cursor=null;save();if(key==='opening')return enterChapter(0);if(key.startsWith('before'))return navigate('game',Number(key.slice(6))-1);if(key.startsWith('after')){const n=Number(key.slice(5));if(replaySnapshot&&n===replayChapter+1)return navigate('chapters');return n===4?startStory('ending'):enterChapter(n);}navigate('ending');}
function endingPhoto(){const key=state.style==='festival'?'endingFestival':'endingEveryday';return art[key]?`<figure class="ending-photo">${artImage(key,'我和阿嬷在海边的合照')}</figure>`:'';}
function storyView(){const part=STORY[route.key],p=part.pages[route.index],speaker=p.speaker?`<span class="story-speaker">${esc(p.speaker)}</span>`:'';return `<section class="story-screen ${part.scene===4?'seaside-story':''} ${route.key==='ending'?'photo-story':''}"><div class="scene-label"><span>${part.title}</span><button class="text-button" data-action="home">暂别小院</button></div>${route.key==='ending'?endingPhoto():part.scene===4?seaChatArt(p.speaker==='阿嬷'?'grandma':p.speaker==='我'?'you':'question'):route.key==='after2'&&art.mirrorPinned?`<div class="story-look">${artImage('mirrorPinned','镜中盘好的螺髻','mirror-scene')}</div>`:route.key==='after3'&&art[chosenStyle()?.before]?`<div class="story-look">${lookPanel(false)}</div>`:p.speaker==='阿嬷'&&art.grandma?artImage('grandma','阿嬷','story-grandma'):p.speaker==='我'&&part.scene===4?artImage(state.style==='festival'?'seaChatFestival':'seaChatEveryday','我','story-grandma story-protagonist'):''}<div class="story-dialogue"><div class="story-meta">${speaker}<span>${route.index+1} / ${part.pages.length}</span></div><p aria-live="polite">${esc(p.text)}</p><div class="story-controls"><button class="text-button" data-action="story-prev" ${route.index===0?'disabled':''}>上一句</button><button class="primary" data-action="story-next">继续</button></div></div></section>`;}

function getChapterPrompt(i){return ['挑喜欢的花，轻轻采进花篮。','慢慢来，发丝梳顺了，发髻挽稳了，头上的花，才戴得好看。','挑一种你喜欢的样式，咱们把今天采的四种花编在一起。','别紧张，就把今天学到的，慢慢说给他们听。'][i];}

function chaptersView(){return `<section><div class="page-heading"><div><div class="eyebrow">THE FLOWER JOURNEY</div><h1>循着花香，慢慢来</h1><p class="intro-line">跟着阿嬷，走过四段花事。每一次相遇，都留下一份花香。</p></div><div class="meta">花事进度<br>${totalCompleted()} / 4 章</div></div><div class="chapter-grid">${CHAPTERS.map((c,i)=>`<button class="chapter-card" data-action="enter" data-index="${i}" ${!unlocked(i)?'disabled':''} aria-label="第${i+1}章 ${c.title}，${unlocked(i)?'进入体验':'尚未解锁'}"><div class="chapter-cover"><img src="assets/scene-${i+1}.webp" alt="${c.sub}" loading="lazy"><span class="chapter-badge">${['壹','贰','叁','肆'][i]} · ${['晨光','梳妆','花事','日暮'][i]}</span><span class="chapter-status">${state.completed[i]?'已完成 ✓':unlocked(i)?'静候你来':'待花开 · 未解锁'}</span></div><div class="chapter-card-body"><span class="index">CHAPTER ${num(i)}</span><h2>${c.title}</h2><p>${c.desc}</p><footer><span>${unlocked(i)?'收藏 · '+c.reward:'需获得'+CHAPTERS[i-1].reward}</span><span>${unlocked(i)?'⟶':'—'}</span></footer></div></button>`).join('')}</div><div class="quiet-note">阿嬷的话：不必赶路，也不怕放错。每一支收好的簪花都会陪着你，不会因为开启下一章而消失。</div></section>`;}

function bagView(){return '<aside class="bag" aria-label="簪花背包"><div class="bag-heading"><h2>我的花囊</h2><span>'+ITEMS.filter(i=>owned(i.id)).length+' / 3</span></div><div class="bag-list">'+ITEMS.map(it=>'<button class="bag-item" '+(owned(it.id)?'data-action="item" data-id="'+it.id+'"':'disabled')+'>'+(owned(it.id)?artImage(it.asset,it.name):'')+'<span class="item-name">'+it.name+'</span><small>'+(owned(it.id)?'查看花簪小记':'第 '+it.chapter+' 章解锁')+'</small></button>').join('')+'</div><p class="bag-note">花簪只收藏，不消耗</p></aside>';}

function dialogueView(){return `<section class="scene-dialogue ${dialogueOpen?'':'collapsed'}"><button class="speaker-toggle" data-action="dialogue" aria-expanded="${dialogueOpen}" aria-label="${dialogueOpen?'收起这段话':'展开这段话'}">${esc(dialogueSpeaker||(dialogueOpen?'收起':'展开'))}${dialogueOpen?' −':' ＋'}</button>${dialogueOpen?`<p id="grandma-text" aria-live="polite">${esc(dialogue)}</p>`:''}</section>`;}
function gameView(){const i=route.chapter,c=CHAPTERS[i];return `<section class="scene-play chapter-${i+1}"><div class="scene-label"><div><small>${['清晨 · 小院','午前 · 窗边','午后 · 屋檐','日暮 · 海边'][i]}</small><h1>${c.title}</h1></div><button class="secondary" data-action="bag-toggle" aria-expanded="${bagOpen}">花篮 · ${ITEMS.filter(it=>owned(it.id)).length}</button></div><div class="scene-workspace">${[flowersBoard,hairBoard,ringBoard,dressBoard][i]()}${bagOpen?`<div class="bag-drawer">${bagView()}</div>`:''}</div>${i===3?'':dialogueView()}</section>`;}

function flowersBoard(){return '<div class="gathering"><div class="flower-groups">'+FLOWERS.map(f=>'<button class="flower-clump" data-action="pick-flower" data-id="'+f.id+'" aria-label="采摘'+f.name+'">'+artImage(f.asset,f.name)+'<span>'+f.name+'</span></button>').join('')+'</div><div class="basket-area '+(art.basket?'has-basket':'')+'" aria-label="今日花篮">'+artImage('basket','竹篮','basket-art')+'<div class="basket-flowers">'+state.flowers.map(id=>{const f=FLOWERS.find(f=>f.id===id);return '<span>'+artImage(f.asset,f.name)+'<small>'+f.name+'</small></span>';}).join('')+'</div>'+artImage('basket','','basket-front')+'<p>今日花篮 <span>'+state.flowers.length+' / 4 种</span></p>'+(art.basket?'':'<small class="asset-status">竹篮插画待补</small>')+'</div></div>';}
async function pickFlower(id){
 if(picking||state.pendingFlower||route.page!=='game'||route.chapter!==0||state.completed[0])return;
 const f=FLOWERS.find(f=>f.id===id);if(!f)return;picking=true;
 const source=$('.flower-clump[data-id="'+id+'"]'),basket=$('.basket-area');
 if(!state.flowers.includes(id))state.flowers.push(id);state.pickCounts[id]=(state.pickCounts[id]||0)+1;state.pendingFlower=id;save();
 try{if(source&&basket&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const r=source.getBoundingClientRect(),b=basket.getBoundingClientRect(),ghost=document.createElement('div');ghost.className='picked-flight';ghost.innerHTML=artImage(f.asset,f.name);Object.assign(ghost.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});document.body.append(ghost);
  source.animate([{opacity:1},{opacity:.2},{opacity:1}],{duration:600});
  try{await ghost.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+(b.x+b.width/2-r.x-r.width/2)+'px,'+(b.y+b.height/2-r.y-r.height/2)+'px) scale(.4)',opacity:.2}],{duration:620,easing:'ease-in-out'}).finished;}finally{ghost.remove();}
 }}finally{picking=false;}
 if(route.page==='game'&&route.chapter===0){render();showFlowerDialogue();}
}
function showFlowerDialogue(){
 if(!state.pendingFlower||route.page!=='game'||route.chapter!==0||picking||$('#modal').open)return;
 const f=FLOWERS.find(f=>f.id===state.pendingFlower);flowerModal=true;
 modal('<div class="flower-dialogue-content"><div class="modal-meta">阿嬷</div><h2 id="modal-title">'+f.name+'</h2>'+artImage(f.asset,f.name,'flower-closeup')+'<p>'+esc(JOURNEY.flowers[f.id])+'</p><button class="primary" data-action="close-modal">'+(state.flowers.length===4?'继续':'继续采花')+'</button></div>');
}
function acknowledgeFlower(){if(!flowerModal)return;flowerModal=false;state.pendingFlower=null;save();if(state.flowers.length===4)completeChapter(0);else if(route.page==='game')render();}
function completeChapter(i){state.completed[i]=true;startStory('after'+(i+1));}
function gentlePrompt(text){setDialogue(text);modal('<div class="modal-meta">阿嬷</div><h2 id="modal-title">慢慢来</h2><p>'+esc(text)+'</p><button class="primary" data-action="close-modal">再试一试</button>');}

function hairBoard(){
 const step=state.toolStep,current=HAIR[step];let frame=current?.image||'mirrorPinned';if(frame==='mirrorSmooth'&&!art[frame]&&art.mirrorLoose)frame='mirrorLoose';
 return '<div class="hair-workflow"><div class="hair-mirror '+(art[frame]?'has-mirror-art':'awaiting-mirror')+(step===1?' gathering-hair':'')+'">'+(art[frame]?artImage(frame,'镜中'+(current?.verb||'盘好的螺髻'),'mirror-scene'):'<div class="mirror-wait"><p>镜前</p><small>镜中人物图待补</small></div>')+'<div class="hair-targets">'+HAIR.map((t,i)=>'<button class="hair-drop drop-target '+(i===step?'is-current ':'')+'area-'+t.target+'" data-drop="'+t.target+'" data-type="hairtool" '+(i!==step?'disabled':'')+' aria-label="'+['梳理头发','收拢到发髻','束稳髻根','固定骨簪'][i]+'"></button>').join('')+'</div>'+(step===1?'<button class="hair-source draggable" data-drag="hair" data-type="hairtool" aria-label="向上收拢头发"></button><svg class="gather-arrow" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path class="gather-track" d="M 75 49 C 82 35, 76 22, 52 16"/><path class="gather-head" d="M 60 15 L 52 16 L 56 23"/></svg>':'')+'<span class="comb-cursor" aria-hidden="true">'+artImage('toolComb','','cursor-comb')+'</span></div><div class="hair-props">'+HAIR.filter(t=>t.id!=='hair').map(t=>'<button class="prop draggable" data-drag="'+t.id+'" data-type="hairtool" '+(HAIR.indexOf(t)<step?'disabled':'')+'>'+artImage(t.asset,t.name)+'<span>'+t.name+'</span></button>').join('')+'</div><p class="step-instruction">'+['点击木梳，轻轻梳理','将头发向上收拢','用发绳束稳发髻','插入鱼骨簪'][Math.min(step,3)]+'</p></div>';
}
function chooseStyle(id){if(route.page!=='game'||route.chapter!==2||!STYLES[id]||state.completed[2])return;state.style=id;state.ring=[];save();render();}
const ARC_POSITIONS=[['右上',50,0],['右下',50,50],['左下',0,50],['左上',0,0]];
function pieceImage(i,cls=''){
 const style=chosenStyle(),[,x,y]=ARC_POSITIONS[i];
 return '<span class="arc-crop '+cls+'" style="--crop-x:'+(-x*2)+'%;--crop-y:'+(-y*2)+'%">'+artImage(style.wreath,'','arc-image')+'</span>';
}
function ringBoard(){
 if(!state.style)return '<div class="style-selection"><h2>今天，想戴哪一圈花？</h2><div class="style-options">'+Object.entries(STYLES).map(([id,s])=>'<button class="style-option" data-action="choose-style" data-style="'+id+'"><strong>'+s.name+'</strong><p>'+s.description+'</p></button>').join('')+'</div></div>';
 const style=chosenStyle(),done=state.ring.length===4;
 return '<div class="wreath-workflow"><div class="puzzle-heading"><h2>'+style.name+'</h2>'+(!done?'<button class="text-button" data-action="change-style">重新选款</button>':'')+'</div><div class="wreath-stage '+(done?'is-complete':'')+'" aria-label="编好的花围">'+ARC_POSITIONS.map(([name,x,y],i)=>'<button class="arc-target drop-target '+(state.ring.includes(i)?'filled':'')+'" data-drop="'+i+'" data-type="puzzle" style="left:'+x+'%;top:'+y+'%" '+(state.ring.includes(i)?'disabled':'')+' aria-label="放在'+name+'方">'+pieceImage(i)+'</button>').join('')+(!state.ring.length?'<p class="wreath-invitation">将花簇围在这里</p>':'')+'</div><div class="arc-tray" aria-label="待编的花簇">'+[2,0,3,1].map(i=>'<button class="arc-piece draggable" data-drag="'+i+'" data-type="puzzle" '+(state.ring.includes(i)?'disabled':'')+' aria-label="拿起'+ARC_POSITIONS[i][0]+'花簇">'+pieceImage(i)+'</button>').join('')+'</div><p class="wreath-instruction" aria-live="polite">'+(done?'花围编好了。':'拿起一簇花，沿着花影慢慢围拢。')+'</p></div>';
}
function guideArc(id){$$('.arc-target').forEach(t=>t.classList.toggle('is-guided',t.dataset.drop===String(id)&&!t.disabled));}
function dropAt(x,y,type,id){
 if(type==='puzzle'){
  const t=$('.arc-target[data-drop="'+id+'"]');if(!t||t.disabled)return null;const r=t.getBoundingClientRect();
  return Math.hypot(x-r.x-r.width/2,y-r.y-r.height/2)<=r.width*.68?t:null;
 }
 return document.elementFromPoint(x,y)?.closest('[data-drop]');
}
function returnArc(d){
 if(!d.ghost)return;const g=d.ghost.cloneNode(true),r=d.el.getBoundingClientRect();document.body.append(g);
 const a=g.animate([{left:d.x+'px',top:d.y+'px',opacity:1},{left:r.x+r.width/2+'px',top:r.y+r.height/2+'px',opacity:.1}],{duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:220,easing:'ease-out'});a.finished.finally(()=>g.remove());
}
function lookPanel(final=false){const s=chosenStyle(),key=s?.[final?'after':'before'];return '<div class="look-panel '+(art[key]?'has-look':'missing-look')+'">'+(art[key]?artImage(key,s.name+(final?' · 完整簪花造型':' · 已佩戴花围'),'complete-look'):'<div class="look-wait"><strong>'+esc(s?.name||'簪花造型')+'</strong><p>'+(final?'完整成妆人物图待补':'佩戴花围人物图待补')+'</p></div>')+'</div>';}

function seaChatArt(speaker=state.quiz.phase){
 const key=speaker==='grandma'?'grandma':speaker==='you'?(state.style==='festival'?'seaChatFestival':'seaChatEveryday'):null;
 const alt=speaker==='grandma'?'阿嬷':('戴着'+chosenStyle().name+'花围的我');
 return '<div class="sea-chat-art solo-portrait seaside-portrait '+(speaker==='grandma'?'portrait-grandma':state.style==='festival'?'portrait-festival':'portrait-everyday')+' '+(key&&art[key]?'has-art':'')+'"'+(key&&art[key]?'':' aria-hidden="true"')+'>'+(key?artImage(key,alt):'')+'</div>';
}
function dressBoard(){
 const q=state.quiz,n=q.answers.length;
 if(n<3){const question=QUESTIONS[n],branch=q.choice!==null?question.branches[q.choice]:null;return '<div class="sea-chat-layout">'+seaChatArt()+'<div class="visitor-conversation"><div class="conversation-heading"><small>'+['第一问','第二问','第三问'][n]+'</small></div>'+(q.phase==='question'?'<p class="visitor-question"><span>游客</span>“'+esc(question.question)+'”</p><div class="answer-options">'+question.options.map((o,i)=>'<button data-action="answer" data-index="'+i+'"><span>'+['A','B','C'][i]+'</span>'+esc(o)+'</button>').join('')+'</div>':'<div class="answer-branch"><span class="story-speaker">'+(q.phase==='you'?'我':'阿嬷')+'</span><p>“'+esc(q.phase==='you'?branch.you:branch.grandma)+'”</p><button class="primary" data-action="quiz-next">继续</button></div>')+'</div></div>';}
 return '<div class="sea-chat-layout final-text">'+seaChatArt('grandma')+'<div class="visitor-conversation farewell"><p>游客道了谢，我低头看见花篮里还留着清晨那朵素馨。</p><div class="answer-branch"><span class="story-speaker">阿嬷</span><p>“还给你留着呢，来，别在鬓边。”</p><button class="primary" data-action="wear-jasmine">别上素馨</button></div></div></div>';
}

function answerQuestion(i){if(route.page!=='game'||route.chapter!==3||state.quiz.answers.length>=3||state.quiz.phase!=='question'||![0,1,2].includes(i))return;state.quiz.choice=i;state.quiz.phase='you';save();render();}
function nextQuiz(){if(route.page!=='game'||route.chapter!==3||state.quiz.choice===null)return;const q=state.quiz;if(q.phase==='you')q.phase='grandma';else if(q.phase==='grandma'){q.answers.push(q.choice);q.choice=null;q.phase='question';}save();render();}

function galleryView(){return `<section><div class="page-heading"><div><div class="eyebrow">A COLLECTION OF FLOWERS</div><h1>把花香，收入图鉴</h1><p class="intro-line">花簪有形，故事长留。点击收藏，听阿嬷说一段旧时光。</p></div><div class="meta">已收藏<br>${ITEMS.filter(i=>owned(i.id)).length} / 3</div></div>${state.completed[3]?'<div class="gallery-banner"><div><h3>花事圆满 · 图鉴全开</h3><p>你已走过四段花事，愿这一份温柔，留在往后的日子里。</p></div><button class="secondary" data-action="ending">重温海边的约定 ↗</button></div>':''}<div class="album-grid">${ITEMS.map(it=>{const has=owned(it.id);return `<article class="album-card ${!has?'locked':''}"><div class="album-art">${has&&hasArt(it.asset)?artImage(it.asset,it.name):`<span class="art-title">${has?it.short:'待花开'}</span>`}<small>${has?'第 '+it.chapter+' 章 · 已收藏':'第 '+it.chapter+' 章解锁'}</small></div><div class="album-card-body"><span class="meta">COLLECTION ${num(it.chapter-1)} / ${it.category}</span><h2>${it.name}</h2><p>${has?it.story:'这段故事还藏在下一程的花香里。循着阿嬷的指引，完成对应章节，就能收藏。'}</p><button class="text-button" ${has?`data-action="item" data-id="${it.id}"`:'data-action="chapters"'}>${has?'展开花簪小记 ↗':'去寻花 ↗'}</button></div></article>`;}).join('')}</div>${state.completed[3]?knowledgeGallery():''}<div class="quiet-note">文化说明：本作以蟳埔女习俗为灵感进行互动改编。花语、花簪奖励和操作步骤为叙事设计，不作为固定民俗规范。人物与场景为艺术表达。</div></section>`;}
function knowledgeGallery(){return '<section class="complete-album"><h2>这一日，听阿嬷说</h2><div class="flower-album">'+FLOWERS.map(f=>'<article>'+artImage(f.asset,f.name)+'<h3>'+f.name+'</h3><p>'+JOURNEY.flowers[f.id]+'</p></article>').join('')+'</div><div class="sea-memories">'+QUESTIONS.map(q=>'<details><summary>'+q.question+'</summary><p>'+q.branches[1].you+'</p><p>阿嬷：'+q.branches[1].grandma+'</p></details>').join('')+'</div></section>';}
function aboutView(){return `<section><div class="page-heading"><div><div class="eyebrow">THE LIVING TRADITION</div><h1>花在头上，根在生活里</h1></div></div><div class="about-layout"><img class="about-photo" src="assets/scene-3.webp" alt="民俗故事场景水彩插画"><div class="about-copy"><div class="eyebrow">泉州蟳埔 · 日常里的花事</div><h2>一圈簪花围，<br>一个海边的故事。</h2><p>蟳埔位于福建泉州。当地妇女盘髻簪花的装束，承载着海边生活的记忆。鲜花围绕发髻，随日常、节庆与个人喜好呈现不同的色彩和层次。</p><p>“蟳埔女习俗”于 2008 年列入第二批国家级非物质文化遗产名录，项目类别为民俗。簪花围，是认识这一文化的一扇窗；窗的另一边，是劳动、家庭、邻里和代代相传的生活。</p><p>这段故事从一次久别归来开始：我跟着阿嬷采花、梳发、编花围，也重新认识了她日日簪花的心意。</p><p class="cultural-note">本作中的“阿嬷”为虚构叙事人物，使用带闽南亲切感的普通话，不冒充方言录音或传承人口述。花语与盘髻操作为交互改编；背景为艺术插画，并非蟳埔建筑的实景复原。<br>资料核对入口：<a href="https://www.ihchina.cn/" target="_blank" rel="noopener noreferrer">中国非物质文化遗产网</a>（检索“蟳埔女习俗”）、国务院第二批国家级非遗名录。</p><p class="music-credit">背景音乐：<a href="https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1400037" target="_blank" rel="noopener noreferrer">Carefree — Kevin MacLeod（incompetech.com）</a><br>依据 <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a> 授权使用；已压缩为网页播放版本，旋律未改动。</p><button class="primary" data-action="chapters">赴一场花事 <span class="arrow">⟶</span></button></div></div></section>`;}


function portraitReady(){return Boolean(art[chosenStyle()?.after]);}

function endingView(){return '<section class="journey-ending text-ending photo-ending">'+endingPhoto()+'<div class="ending-note"><small>日暮赴约 · 花海与晚风</small><h1>这一日，花香绵长。</h1><p>这一天，我跟着阿嬷，亲手学会了蟳埔簪花。</p><p>也终于静下心，读懂了藏在寻常烟火里，温柔绵长的岁月与热爱。</p><div class="ending-actions">'+(portraitReady()?'<button class="primary" data-action="export">保存簪花形象</button>':'')+'<button class="secondary" data-action="restart-journey">重新体验</button><button class="text-button" data-action="gallery">查看完整图鉴</button></div></div></section>';}

function completionLine(i){return ['花篮满了。我选出那朵素馨，想亲手递给阿嬷。','发髻挽好了。我望向镜子，忽然生出一种真切的暖意。','花围编好了，满满都是自己的心意。举起来给阿嬷看看吧。','最后一朵素馨也安放好了。阿嬷走近，替我扶正花饰。'][i];}


function applyDrop(type,id,target){
 if(route.page!=='game'||state.completed[route.chapter])return;clearSelection();
 if(type==='hairtool'&&route.chapter===1){const current=HAIR[state.toolStep];if(id!==current.id)return gentlePrompt('先'+current.verb+'，用'+current.name+'就好。咱们一步一步来。');if(target!==current.target)return gentlePrompt('把'+current.name+'轻轻放到'+current.area+'，不着急。');state.toolStep++;if(state.toolStep===4)return completeChapter(1);setDialogue(['','发丝梳顺了，再慢慢收拢、挽起。','髻挽好了，用发绳束稳些。','这下稳当了，拿骨簪固定就好。'][state.toolStep]);save();render();return;}
 if(type==='puzzle'&&route.chapter===2&&state.style){const n=Number(id);if(!Number.isInteger(n)||n<0||n>3||state.ring.includes(n)||id!==target)return;state.ring.push(n);if(state.ring.length===4){state.completed[2]=true;state.cursor={key:'after3',index:0};save();render();setTimeout(()=>{if(route.page==='game'&&route.chapter===2&&state.completed[2])startStory('after3');},1500);return;}save();render();return;}
 if(type==='ornament'&&route.chapter===3&&state.readyJasmine&&state.quiz.answers.length===3&&id==='jasmine'&&target==='jasmine'){state.jasminePlaced=true;completeChapter(3);}
}

function clearSelection(){selected=null;guideArc(null);$('.hair-mirror')?.classList.remove('comb-selected','tool-selected');$$('.selected').forEach(e=>e.classList.remove('selected'));$$('.target-selected').forEach(e=>e.classList.remove('target-selected'));}
function selectSource(e){
 const source={id:e.dataset.drag,type:e.dataset.type};
 if(selected?.id===source.id&&selected?.type===source.type){clearSelection();return;}
 clearSelection();selected=source;e.classList.add('selected');if(source.type==='puzzle'){guideArc(source.id);return;}$$(`.drop-target[data-type="${source.type}"]`).forEach(t=>t.classList.add('target-selected'));
 if(source.type==='hairtool'){const mirror=$('.hair-mirror');mirror?.classList.add('tool-selected');if(source.id==='comb')mirror?.classList.add('comb-selected');return;}
 if(source.type==='ornament') toast(`已选「${ITEMS.find(i=>i.id===source.id).name}」，点击头部对应落点。`);
 else toast('已选好，点击对应落点即可。');
}
function modal(html){const d=$('#modal');d.innerHTML=`<button class="modal-close" data-action="close-modal" aria-label="关闭弹窗">×</button>${html}`;if(!d.open)d.showModal();}
function showItem(id){const it=ITEMS.find(i=>i.id===id);if(!it||!owned(id))return;modal(`<div class="modal-meta">花囊小记 · 第 ${it.chapter} 章收藏</div><div class="item-preview">${art[it.asset]?artImage(it.asset,it.name):`<strong>${it.short}</strong>`}</div><h2 id="modal-title">${it.name}</h2><p>${it.story}</p><p class="speech-note">${it.note}</p><div class="modal-actions"><button class="secondary read-aloud" data-action="speak" data-id="${it.id}">听这段故事</button><button class="text-button" data-action="close-modal">收好花簪</button></div><p class="speech-note">朗读使用设备的普通话语音，不是闽南语真人录音。</p>`);}
function showSettings(){modal(`<h2 id="modal-title">把花事，留在这里</h2><div class="setting-row"><div><h3>自动记住进度</h3><p>此浏览器已完成 ${totalCompleted()} / 4 章。关闭网页后也可继续。</p></div><span>已开启</span></div><div class="setting-row"><div><h3>补入你的插画</h3><p>已接入 ${Object.keys(FILE_MAP).filter(f=>art[FILE_MAP[f]]).length} / ${Object.keys(FILE_MAP).length} 项。只在本地读取，不上传。</p></div><button class="secondary" data-action="import-art">导入插画</button></div><p>图片请按下列文件名命名，支持一次选择多张 PNG。导入后保存在当前浏览器；部署用路径配置请见项目内的《素材补齐指南》。</p><ul class="import-list">${Object.keys(FILE_MAP).map(f=>`<li>${f} ${art[FILE_MAP[f]]?'✓':''}</li>`).join('')}</ul><input id="art-upload" type="file" accept="image/png" multiple hidden><div class="setting-row"><div><h3>清除本地导入的插画</h3><p>不会删除你电脑里的原始图片。</p></div><button class="secondary" data-action="clear-art-confirm">清除</button></div><div class="modal-actions"><button class="setting-danger" data-action="reset-confirm">重新开始整段旅程</button></div>`);}
function confirmReset(){modal('<h2 id="modal-title">重新循花而行？</h2><p>会清空四章进度和花囊收藏。你导入的插画会保留。</p><div class="modal-actions"><button class="primary" data-action="reset">重新开始</button><button class="secondary" data-action="close-modal">保留这段花事</button></div>');}
document.addEventListener('click',e=>{
 if(suppressClick){e.preventDefault();return;}
 if(handledTouchSource&&e.target.closest('[data-drag]')===handledTouchSource){handledTouchSource=null;e.preventDefault();return;}
 const target=e.target.closest('[data-drop]');
 if(target&&!target.disabled){if(selected&&selected.type===target.dataset.type)applyDrop(selected.type,selected.id,target.dataset.drop);else setDialogue('先从花篮或花囊里选好一件，再轻轻放到这里。','阿嬷');return;}
 const source=e.target.closest('[data-drag]');
 if(source&&!source.disabled){selectSource(source);return;}
 const b=e.target.closest('[data-action]');if(!b||b.disabled)return;
 const action=b.dataset.action,i=Number(b.dataset.index);
 switch(action){
 case 'home': navigate('home'); break;
 case 'chapters':case 'gallery':case 'about':case 'ending':navigate(action);break;
 case 'continue':case 'begin':continueJourney();break;
 case 'story-next':advanceStory();break;
 case 'story-prev':if(route.index>0)startStory(route.key,route.index-1);break;
 case 'replay-opening':startStory('opening');break;
 case 'replay-chapter':startStory('before'+(route.chapter+1));break;
 case 'replay-ending':startStory('ending');break;
 case 'choose-style':chooseStyle(b.dataset.style);break;
 case 'change-style':if(!state.completed[2])modal('<h2 id="modal-title">重新选一圈花？</h2><p>会收起当前拼好的花片，让你重新选择款式。</p><button class="primary" data-action="confirm-style">重新选款</button>');break;
 case 'confirm-style':if(route.page==='game'&&route.chapter===2&&!state.completed[2]){state.style=null;state.ring=[];save();$('#modal').close();render();}break;
 case 'answer':answerQuestion(i);break;
 case 'quiz-next':nextQuiz();break;
 case 'wear-jasmine':if(route.page==='game'&&route.chapter===3&&state.quiz.answers.length===3&&!state.completed[3]){state.readyJasmine=true;state.jasminePlaced=true;completeChapter(3);}break;
 case 'pick-flower':pickFlower(b.dataset.id);break;

 case 'bag-toggle':bagOpen=!bagOpen;render();break;
 case 'dialogue':dialogueOpen=!dialogueOpen;render();break;
 case 'chapter-card':if(unlocked(i))navigate('game',i);else{navigate('chapters');toast(`带着「${CHAPTERS[i-1].reward}」再来开启这一章。`);}break;
 case 'enter':enterChapter(i);break;

 case 'item':showItem(b.dataset.id);break;
 case 'bag-stories':modal(`<h2 id="modal-title">花簪小记</h2><p>每一支簪，都有一段来时的故事。</p><div class="modal-actions">${ITEMS.filter(it=>owned(it.id)).map(it=>`<button class="secondary" data-action="item" data-id="${it.id}">${it.name}</button>`).join('')}</div>`);break;
 case 'settings':showSettings();break;
 case 'close-modal':$('#modal').close();if('speechSynthesis' in window)speechSynthesis.cancel();break;
 case 'sound':toggleSound();break;
 case 'speak':speakItem(b.dataset.id,b);break;
 case 'restart-journey':if(state.completed[3]){state=fresh();bagOpen=false;dialogueOpen=true;dialogue='';startStory('opening');}break;
 case 'reset-confirm':confirmReset();break;
 case 'reset':replaySnapshot=null;replayChapter=null;state=fresh();save();$('#modal').close();navigate('home');toast('新的一程，从一朵花开始。');break;
 case 'export':exportPostcard(b);break;
 case 'import-art':$('#art-upload').click();break;
 case 'clear-art-confirm':modal('<h2 id="modal-title">清除导入的插画？</h2><p>只清除本浏览器中导入的副本，原始文件和配置文件指定的插画不受影响。</p><div class="modal-actions"><button class="primary" data-action="clear-art">清除本地副本</button><button class="secondary" data-action="close-modal">保留</button></div>');break;
 case 'clear-art':clearImportedArt();break;
 }
});
$('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
$('#modal').addEventListener('close',()=>{if('speechSynthesis' in window)speechSynthesis.cancel();acknowledgeFlower();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){cancelDrag();clearSelection();}});


let combStroke=null;
document.addEventListener('pointermove',e=>{const mirror=$('.hair-mirror.comb-selected');if(!mirror)return;const r=mirror.getBoundingClientRect();mirror.style.setProperty('--cursor-x',(e.clientX-r.left)+'px');mirror.style.setProperty('--cursor-y',(e.clientY-r.top)+'px');mirror.classList.toggle('cursor-inside',e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom);});
document.addEventListener('pointerdown',e=>{if(e.button!==0||selected?.type!=='hairtool'||selected.id!=='comb'||state.toolStep!==0||!e.target.closest('.hair-mirror'))return;combStroke={id:e.pointerId,x:e.clientX,y:e.clientY};});
document.addEventListener('pointerup',e=>{if(!combStroke||combStroke.id!==e.pointerId)return;const s=combStroke;combStroke=null;if(route.page==='game'&&route.chapter===1&&state.toolStep===0&&e.clientY-s.y>35&&Math.abs(e.clientX-s.x)<120){suppressClick=true;setTimeout(()=>suppressClick=false,120);applyDrop('hairtool','comb','length');}});
document.addEventListener('pointercancel',()=>combStroke=null);window.addEventListener('blur',()=>combStroke=null);

document.addEventListener('pointerdown',e=>{
 suppressClick=false;handledTouchSource=null;
 const el=e.target.closest('[data-drag]');if(!el||el.disabled||e.button!==0)return;
 drag={el,id:el.dataset.drag,type:el.dataset.type,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,active:false,ghost:null};
 el.setPointerCapture?.(e.pointerId);
});
document.addEventListener('pointermove',e=>{
 if(!drag||drag.pointerId!==e.pointerId)return;
 drag.x=e.clientX;drag.y=e.clientY;
 if(!drag.active&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>6){
   drag.active=true;clearSelection();if(!(drag.type==='hairtool'&&drag.id==='hair')){const ghost=document.createElement('div');ghost.className=drag.type==='puzzle'?'drag-ghost arc-ghost':drag.type==='hairtool'?'drag-ghost hair-ghost':'drag-ghost';if(drag.type==='puzzle'){const r=drag.el.getBoundingClientRect();ghost.style.setProperty('--arc-size',r.width+'px');}ghost.setAttribute('aria-hidden','true');ghost.innerHTML=drag.el.innerHTML;document.body.append(ghost);drag.ghost=ghost;}if(drag.type==='puzzle')guideArc(drag.id);drag.el.classList.add('drag-origin');dragFrame=requestAnimationFrame(autoScrollDrag);
 }
 if(drag.active){e.preventDefault();if(drag.ghost){drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';}$$('.drop-hover').forEach(t=>t.classList.remove('drop-hover'));const t=dropAt(e.clientX,e.clientY,drag.type,drag.id);if(t&&!t.disabled&&t.dataset.type===drag.type)t.classList.add('drop-hover');}
},{passive:false});
document.addEventListener('pointerup',e=>{
 if(!drag||e.pointerId!==drag.pointerId)return;
 const d=drag,t=dropAt(e.clientX,e.clientY,drag.type,drag.id);
 if(d.active&&d.type==='puzzle'&&!t)returnArc(d);
 cancelDrag();
 if(d.active){suppressClick=true;setTimeout(()=>suppressClick=false,120);if(t&&!t.disabled&&t.dataset.type===d.type)applyDrop(d.type,d.id,t.dataset.drop);else if(d.type!=='puzzle')setDialogue('没关系，再对准落点轻轻放下就好。');}
 else if(e.pointerType==='touch'){selectSource(d.el);handledTouchSource=d.el;}
});
function autoScrollDrag(){
 if(!drag?.active)return;
 const edge=90,y=drag.y,speed=y<edge?-Math.ceil((edge-y)/9):y>innerHeight-edge?Math.ceil((y-(innerHeight-edge))/9):0;
 if(speed)window.scrollBy(0,speed);
 dragFrame=requestAnimationFrame(autoScrollDrag);
}
function cancelDrag(){guideArc(null);cancelAnimationFrame(dragFrame);if(drag){const d=drag;drag=null;d.ghost?.remove();d.el.classList.remove('drag-origin');try{d.el.releasePointerCapture?.(d.pointerId);}catch{}}$$('.drop-hover').forEach(t=>t.classList.remove('drop-hover'));}
document.addEventListener('pointercancel',cancelDrag);
document.addEventListener('lostpointercapture',()=>{if(drag)cancelDrag();});
window.addEventListener('blur',cancelDrag);
function updateMusicButton(loading=false){
 const button=$('.sound-button');button.setAttribute('aria-pressed',String(soundOn));
 button.title=soundOn?'关闭背景音乐':'播放 Carefree · Kevin MacLeod';
 $('.sound-label').textContent=soundOn?(loading?(musicProgress===null?'音乐加载中':`音乐加载 ${musicProgress}%`):'音乐播放中'):'听音乐';
}
const MUSIC_URL='assets/audio/carefree-kevin-macleod.mp3';
async function loadCompleteMusic(){
 if(musicObjectURL)return musicObjectURL;
 if(musicLoadPromise)return musicLoadPromise;
 musicLoadPromise=(async()=>{
  let cache=null,response=null;
  try{cache=await caches.open('zanhua-music-v1');response=await cache.match(MUSIC_URL);}catch{}
  let blob;
  if(response){blob=await response.blob();}
  else{
   response=await fetch(MUSIC_URL);if(!response.ok)throw new Error('Music download failed');
   const total=Number(response.headers.get('content-length'));
   if(response.body){
    const reader=response.body.getReader(),chunks=[];let received=0;
    while(true){const {done,value}=await reader.read();if(done)break;chunks.push(value);received+=value.byteLength;
     musicProgress=total>0?Math.min(99,Math.floor(received/total*100)):null;
     if(soundOn)updateMusicButton(true);
    }
    if(total>0&&received!==total)throw new Error('Incomplete music download');
    blob=new Blob(chunks,{type:'audio/mpeg'});
   }else blob=await response.blob();
   if(!blob.size)throw new Error('Empty music download');
   // Cache only a complete recording; storage restrictions must not prevent playback.
   if(cache)cache.put(MUSIC_URL,new Response(blob,{headers:{'Content-Type':'audio/mpeg'}})).catch(()=>{});
  }
  musicObjectURL=URL.createObjectURL(blob);musicProgress=100;return musicObjectURL;
 })();
 try{return await musicLoadPromise;}
 finally{musicLoadPromise=null;scheduleImageWarmup();}
}
function ensureMusic(){
 if(musicAudio)return musicAudio;
 musicAudio=new Audio();
 musicAudio.preload='none';musicAudio.loop=true;musicAudio.volume=.28;
 musicAudio.addEventListener('playing',()=>{if(soundOn)updateMusicButton();});
 musicAudio.addEventListener('waiting',()=>{if(soundOn)updateMusicButton(true);});
 musicAudio.addEventListener('error',()=>{
  if(!soundOn)return;soundOn=false;musicRequest++;updateMusicButton();toast('音乐暂时加载失败，点击可重试。');
 });
 return musicAudio;
}
async function playMusic(){
 const request=++musicRequest;
 try{
  const player=ensureMusic(),src=await loadCompleteMusic();
  if(request!==musicRequest||!soundOn||document.hidden)return;
  if(player.src!==src)player.src=src;
  if(player.error)player.load();
  await player.play();
  if(request===musicRequest&&soundOn){if(document.hidden)musicAudio.pause();else updateMusicButton();}
 }catch(error){
  if(request!==musicRequest||!soundOn||document.hidden)return;
  soundOn=false;updateMusicButton();toast('音乐暂时无法播放，请点击重试。');
 }
}
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){cancelDrag();musicRequest++;musicAudio?.pause();}
 else if(soundOn)playMusic();
});
window.addEventListener('pagehide',()=>{musicRequest++;musicAudio?.pause();});
window.addEventListener('pageshow',()=>{if(soundOn&&!document.hidden)playMusic();});
function toggleSound(){
 soundOn=!soundOn;
 if(soundOn){updateMusicButton(true);playMusic();}
 else{musicRequest++;musicAudio?.pause();updateMusicButton();scheduleImageWarmup();}
}
function speakItem(id,button){if(!('speechSynthesis' in window)){toast('此设备暂无可用的朗读功能。');return;}if(speechSynthesis.speaking){speechSynthesis.cancel();button.textContent='听这段故事';return;}const it=ITEMS.find(i=>i.id===id),u=new SpeechSynthesisUtterance(it.story);u.lang='zh-CN';u.rate=.86;u.pitch=1;const voice=speechSynthesis.getVoices().find(v=>v.lang.startsWith('zh'));if(voice)u.voice=voice;button.textContent='停止朗读';u.onend=()=>{if(button.isConnected)button.textContent='听这段故事';};u.onerror=()=>{if(button.isConnected)button.textContent='听这段故事';toast('设备语音暂不可用，你也可以阅读这段花簪小记。');};speechSynthesis.speak(u);}
function loadImage(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('图片加载失败'));im.src=src;});}
function drawCover(ctx,img,x,y,w,h){const ratio=Math.max(w/img.width,h/img.height),sw=w/ratio,sh=h/ratio;ctx.drawImage(img,(img.width-sw)/2,(img.height-sh)/2,sw,sh,x,y,w,h);}
function drawContain(ctx,img,x,y,w,h){const ratio=Math.min(w/img.width,h/img.height),iw=img.width*ratio,ih=img.height*ratio;ctx.drawImage(img,x+(w-iw)/2,y+(h-ih)/2,iw,ih);}

async function exportPostcard(button){
 if(exportBusy||!state.completed[3]||!portraitReady())return;exportBusy=true;button.disabled=true;
 try{const src=art[chosenStyle().after];const a=document.createElement('a');a.href=src;a.download='簪花寻踪-'+chosenStyle().name+'.png';document.body.append(a);a.click();a.remove();toast('已开始保存你的簪花形象。');}
 catch{toast('暂时无法保存，请重试。');}finally{exportBusy=false;button.disabled=false;}
}

async function openArtDB(){return new Promise(resolve=>{if(!window.indexedDB)return resolve(null);let done=false;const req=indexedDB.open('zanhua-art-v1',1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('images'))req.result.createObjectStore('images');};req.onsuccess=()=>{if(!done){done=true;resolve(req.result);}else req.result.close();};req.onerror=()=>{done=true;resolve(null);};req.onblocked=()=>{done=true;resolve(null);};setTimeout(()=>{if(!done){done=true;resolve(null);}},2500);});}
async function readImported(){if(!db)return {};return new Promise(resolve=>{const out={},tx=db.transaction('images','readonly'),req=tx.objectStore('images').openCursor();req.onsuccess=()=>{const c=req.result;if(c){out[c.key]=c.value;c.continue();}};tx.oncomplete=()=>resolve(out);tx.onerror=()=>resolve({});});}
async function persistArt(key,blob){if(!db)throw new Error('本地存储不可用');return new Promise((resolve,reject)=>{const tx=db.transaction('images','readwrite');tx.objectStore('images').put(blob,key);tx.oncomplete=resolve;tx.onerror=reject;tx.onabort=reject;});}
async function resolveArt(){
 Object.values(art).filter(s=>s.startsWith('blob:')).forEach(s=>URL.revokeObjectURL(s));
 const candidates={...window.ZANHUA_ART};Object.entries(artBlobs).forEach(([key,blob])=>candidates[key]=URL.createObjectURL(blob));
 // Let each visible image load independently; later chapters must not block this scene.
 art=Object.fromEntries(Object.entries(candidates).filter(([,src])=>src));
}
document.addEventListener('change',async e=>{
 if(e.target.id!=='art-upload')return;
 const files=[...e.target.files];let success=0,unknown=0,failed=0,sessionOnly=0;
 for(const f of files){const key=FILE_MAP[f.name.toLowerCase()];if(!key){unknown++;continue;}if(f.size>12*1024*1024||f.type!=='image/png'){failed++;continue;}
   const url=URL.createObjectURL(f);try{await loadImage(url);artBlobs[key]=f;try{await persistArt(key,f);}catch{sessionOnly++;}success++;}catch{failed++;}finally{URL.revokeObjectURL(url);}
 }
 await resolveArt();render();showSettings();toast(`已导入 ${success} 项${unknown?'，'+unknown+' 项文件名不匹配':''}${failed?'，'+failed+' 项格式或大小不符合要求':''}${sessionOnly?'；部分仅在本次页面有效':''}。`);
});
async function clearImportedArt(){try{if(db)await new Promise((resolve,reject)=>{const tx=db.transaction('images','readwrite');tx.objectStore('images').clear();tx.oncomplete=resolve;tx.onerror=reject;});artBlobs={};await resolveArt();render();showSettings();toast('已清除本地插画副本，原文件不受影响。');}catch{toast('本地插画暂时无法清除，请重试。');}}
render();
(async()=>{db=await openArtDB();artBlobs=await readImported();if(Object.keys(artBlobs).length){await resolveArt();render();}})();
})();


