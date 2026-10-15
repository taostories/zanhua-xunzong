window.mountZanhuaGarden=(root,options)=>{'use strict';
const controller=new AbortController(),listen=(node,type,handler)=>node.addEventListener(type,handler,{signal:controller.signal});
const $=s=>root.querySelector(s),garden=$('#garden'),world=$('#world'),player=$('#player'),hint=$('#hint');
const flowers=[
 {id:'jasmine',name:'素馨花',x:.15,y:.68,w:.26,h:.35,approach:{x:.32,y:.84},description:'素馨花：白色小花，香气清雅，用于花围中的点缀与增香。'},
 {id:'magnolia',name:'白兰花',x:.32,y:.36,w:.24,h:.36,approach:{x:.48,y:.57},description:'白兰花：花瓣细长，香气浓郁，穿插在花簇之间。'},
 {id:'chrysanthemum',name:'菊花',x:.65,y:.47,w:.25,h:.36,approach:{x:.52,y:.69},description:'菊花：花瓣层叠，花形饱满，为花围增添层次和暖黄色。'},
 {id:'red',name:'红花',x:.85,y:.74,w:.25,h:.32,approach:{x:.69,y:.89},description:'红花：用于点缀亮色、丰富花围配色。'}
];
let x=options.position?.x??.51,y=options.position?.y??.92,target={x,y},pending=null,picking=false,collected=new Set(options.flowers),last=0,frame=0,keys=new Set(),epoch=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
$('#flowers').innerHTML=flowers.map(f=>`<button class="flower" data-id="${f.id}" style="left:${f.x*100}%;top:${f.y*100}%;width:${f.w*100}%;height:${f.h*100}%" aria-label="走近并采摘${f.name}"><span>${f.name}</span></button>`).join('');
function blocked(){return picking||options.isBlocked()||collected.size===4||controller.signal.aborted;}
// Follow the open stone path between the four painted flower beds.
function bounds(px,py){const y=Math.max(.52,Math.min(.94,py)),t=(y-.52)/.42;return{x:Math.max(.46-t*.20,Math.min(.52+t*.21,px)),y};}
function moveTo(clientX,clientY){const r=world.getBoundingClientRect();target=bounds((clientX-r.left)/r.width,(clientY-r.top)/r.height);$('#destination').style.cssText=`left:${target.x*100}%;top:${target.y*100}%;opacity:1`;wake();}
function wake(){if(!frame&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}}
function tick(now){frame=0;const dt=Math.min((now-last)/1000,.04);last=now;const r=world.getBoundingClientRect();
 if(!blocked()){
  if(keys.size){pending=null;target=bounds(x+((keys.has('ArrowRight')||keys.has('d'))?dt*.25:0)-((keys.has('ArrowLeft')||keys.has('a'))?dt*.25:0),y+((keys.has('ArrowDown')||keys.has('s'))?dt*.3:0)-((keys.has('ArrowUp')||keys.has('w'))?dt*.3:0));}
  const dx=(target.x-x)*r.width,dy=(target.y-y)*r.height,d=Math.hypot(dx,dy),step=Math.min(d,Math.max(120,r.width*.25)*dt);
  if(d>1){x+=dx/d*step/r.width;y+=dy/d*step/r.height;if(Math.abs(dx)>2)player.style.setProperty('--facing',dx<0?-1:1);}player.classList.toggle('walking',d>3);paint();
  let nearest=null;for(const f of flowers){const near=!collected.has(f.id)&&Math.hypot((f.approach.x-x)*r.width,(f.approach.y-y)*r.height)<r.width*.085;root.querySelector(`[data-id="${f.id}"]`).classList.toggle('near',near);if(near)nearest=f;}
  if(pending&&d<3){const f=pending;pending=null;pick(f);}else if(!pending)hint.textContent=nearest?`点击${nearest.name}，采进花篮。`:'沿着石径，去花边看看。';
  if(d>1||keys.size||pending)wake();else{$('#destination').style.opacity=0;player.classList.remove('walking');}
 }else player.classList.remove('walking');
}
function paint(){player.style.left=x*100+'%';player.style.top=y*100+'%';player.style.setProperty('--depth',.7+y*.32);}
listen(garden,'pointermove',e=>{if(blocked()||pending||e.pointerType==='touch'&&!e.buttons)return;if(e.target.closest('.basket'))return;moveTo(e.clientX,e.clientY);});
listen(garden,'pointerdown',e=>{if(blocked()||e.target.closest('.flower'))return;pending=null;garden.focus({preventScroll:true});moveTo(e.clientX,e.clientY);});
listen($('#flowers'),'click',e=>{const b=e.target.closest('[data-id]');if(!b||blocked()||collected.has(b.dataset.id))return;const f=flowers.find(f=>f.id===b.dataset.id);pending=f;target=bounds(f.approach.x,f.approach.y);hint.textContent=`走近${f.name}…`;garden.focus({preventScroll:true});wake();});
async function pick(f){if(blocked()||collected.has(f.id))return;picking=true;const turn=epoch,b=root.querySelector(`[data-id="${f.id}"]`),r=b.getBoundingClientRect(),basket=$('.basket').getBoundingClientRect();b.disabled=true;b.classList.add('picked');player.classList.remove('walking');
 const flight=new Image();flight.src=`assets/art/flower-${f.id}.webp`;flight.className='garden-flight';flight.style.left=r.left+r.width/2-25+'px';flight.style.top=r.top+'px';document.body.append(flight);controller.signal.addEventListener('abort',()=>{flight.getAnimations().forEach(a=>a.cancel());flight.remove();},{once:true});
 try{await flight.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${basket.x+basket.width/2-r.x-r.width/2}px,${basket.y+50-r.y}px) scale(.6)`,opacity:.8}],{duration:reduced?0:600,easing:'ease-in-out'}).finished;}catch{}finally{flight.remove();}
 if(turn!==epoch)return;collected.add(f.id);b.querySelector('span').textContent=`${f.name} ✓`;b.setAttribute('aria-label',`${f.name}，已采摘`);$('#count').textContent=`${collected.size} / 4`;$('#collected').insertAdjacentHTML('beforeend',`<img src="assets/art/flower-${f.id}.webp" alt="${f.name}">`);picking=false;
 options.onPick(f.id,{x,y});
}
listen(garden,'keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key)&&!blocked()){e.preventDefault();keys.add(e.key);wake();}});listen(window,'keyup',e=>keys.delete(e.key));
function stop(){keys.clear();target={x,y};pending=null;player.classList.remove('walking');cancelAnimationFrame(frame);frame=0;$('#destination').style.opacity=0;}
listen(garden,'pointerleave',()=>{if(!pending)stop();});listen(window,'blur',stop);listen(document,'visibilitychange',()=>{if(document.hidden)stop();else wake();});listen(window,'resize',()=>{const p=bounds(x,y);x=p.x;y=p.y;target={x,y};paint();});
if(matchMedia('(pointer:coarse)').matches)$('#instructions').textContent='轻点石径移动，点花丛走近并采摘。';
flowers.forEach(f=>{const i=new Image();i.src=`assets/art/flower-${f.id}.webp`;});
function loadArt(){const overlay=$('#loading');if(!overlay)return;overlay.textContent='花园准备中…';Promise.all([...root.querySelectorAll('#world img,.basket>img')].map(i=>i.decode())).then(()=>{if(!controller.signal.aborted)overlay.remove();}).catch(()=>{if(controller.signal.aborted)return;overlay.textContent='部分图片未加载，点击重试';overlay.onclick=()=>{root.querySelectorAll('#world img,.basket>img').forEach(i=>{if(!i.complete||!i.naturalWidth)i.src=i.src;});loadArt();};});}
for(const f of flowers){if(!collected.has(f.id))continue;const b=$(`[data-id="${f.id}"]`);b.disabled=true;b.classList.add('picked');b.querySelector('span').textContent=f.name+' ✓';b.setAttribute('aria-label',f.name+'，已采摘');$('#collected').insertAdjacentHTML('beforeend',`<img src="assets/art/flower-${f.id}.webp" alt="${f.name}">`);}
$('#count').textContent=collected.size+' / 4';loadArt();paint();
return ()=>{options.onPosition({x,y});epoch++;stop();controller.abort();};
};
