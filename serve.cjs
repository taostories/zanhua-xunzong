'use strict';
require('./build-web.cjs');
// 无依赖静态服务。运行 node serve.cjs，浏览器打开 http://127.0.0.1:5188
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
const port=Number(process.env.ZANHUA_PORT||5188);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp3':'audio/mpeg','.md':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
  let filename;
  try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);filename=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));}catch{res.writeHead(400);return res.end('Bad request');}
  if(filename!==root&&!filename.startsWith(root+path.sep)){res.writeHead(403);return res.end('Forbidden');}
  fs.stat(filename,(err,stat)=>{
    if(err||!stat.isFile()){res.writeHead(404);return res.end('Not found');}
    res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    fs.createReadStream(filename).pipe(res);
  });
}).listen(port,'127.0.0.1',()=>console.log(`簪花寻踪已启动：http://127.0.0.1:${port}`));
