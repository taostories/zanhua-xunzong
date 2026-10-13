'use strict';
// No dependencies: combine entry files, retaining their original execution order.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=__dirname;
const backgrounds=JSON.parse(fs.readFileSync(path.join(root,'assets/backgrounds.json'),'utf8'));
function backgroundPath(src){return backgrounds[src]?.src||src}
const groups={css:['styles.css','story-layout.css','journey.css'],js:['assets/art-config.js','story.js','journey-data.js','app.js']};
const outputs={};
for(const [ext,files] of Object.entries(groups)){
 let text=files.map(file=>fs.readFileSync(path.join(root,file),'utf8')).join(ext==='js'?'\n;\n':'\n');
 if(ext==='css')text=text.replace(/url\((['"]?)assets\//g,'url($1./');
 const hash=crypto.createHash('sha256').update(text).digest('hex').slice(0,12);
 const file=`assets/site-${hash}.${ext}`;
 fs.writeFileSync(path.join(root,file),text);
 outputs[ext]=file;
}
const index=path.join(root,'index.html');
let html=fs.readFileSync(index,'utf8');
const cover=backgrounds['assets/cover-harbor-v2.webp'];
const tags=`<!-- web-entry:start -->\n  <style>.landscape{position:fixed;inset:0;z-index:-3;background-position:center;background-size:cover;background-repeat:no-repeat}</style>\n  <link id="scene-priority" rel="preload" as="image" href="${cover.src}" fetchpriority="high">\n  <link rel="preload" as="image" href="assets/art/title-flower-trace.webp" fetchpriority="high">\n  <script>window.ZANHUA_BACKGROUNDS=${JSON.stringify(backgrounds)};</script>\n  <link rel="stylesheet" href="${outputs.css}">\n  <script defer src="${outputs.js}"></script>\n  <!-- web-entry:end -->`;
html=html.replace(/<!-- web-entry:start -->[\s\S]*?<!-- web-entry:end -->|<link rel="stylesheet" href="styles.css">[\s\S]*?<script defer src="app.js[^\"]*"><\/script>/,tags);
html=html.replace(/<div class="landscape"[^>]*><\/div>/,`<div class="landscape" aria-hidden="true" style="background-image:url('${cover.preview}')"></div>`);
fs.writeFileSync(index,html);
console.log(JSON.stringify(outputs));

