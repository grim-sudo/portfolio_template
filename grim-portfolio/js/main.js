// ═══════════════════════════════════════
// GRIM PORTFOLIO — main.js
// ═══════════════════════════════════════

// ── CURSOR ──────────────────────────────
const curDot  = document.getElementById('cur-dot');
const curSnap = document.getElementById('cur-snap');
const snapLbl = document.getElementById('snap-label');
let rawX=-200, rawY=-200, dotX=-200, dotY=-200, snapActive=false;

document.addEventListener('mousemove', e => { rawX=e.clientX; rawY=e.clientY; });
(function follow(){
  dotX += (rawX-dotX)*.28; dotY += (rawY-dotY)*.28;
  curDot.style.left=dotX+'px'; curDot.style.top=dotY+'px';
  requestAnimationFrame(follow);
})();
if('ontouchstart' in window){
  curDot.style.display='none'; curSnap.style.display='none';
}

const PAD=6;
function snapTo(el,label){
  const r=el.getBoundingClientRect(); snapActive=true;
  curSnap.style.left=(r.left-PAD)+'px'; curSnap.style.top=(r.top-PAD)+'px';
  curSnap.style.width=(r.width+PAD*2)+'px'; curSnap.style.height=(r.height+PAD*2)+'px';
  snapLbl.style.animation='none'; void snapLbl.offsetWidth;
  snapLbl.textContent='[ '+label.toUpperCase()+' ]';
  snapLbl.style.animation='';
  curSnap.classList.add('visible'); curDot.style.opacity='0';
}
function unsnap(){ snapActive=false; curSnap.classList.remove('visible'); curDot.style.opacity='1'; }

function bindCursor(){
  document.querySelectorAll('[data-label]').forEach(el=>{
    el.addEventListener('mouseenter',()=>snapTo(el,el.dataset.label));
    el.addEventListener('mouseleave',unsnap);
  });
  document.querySelectorAll('.nav-link').forEach(el=>{
    const label=el.dataset.label||el.textContent.trim();
    el.addEventListener('mouseenter',()=>snapTo(el,label));
    el.addEventListener('mouseleave',unsnap);
  });
  document.querySelectorAll('.sec-title:not([data-label])').forEach(el=>{
    el.addEventListener('mouseenter',()=>snapTo(el,el.textContent.trim().slice(0,20)));
    el.addEventListener('mouseleave',unsnap);
  });
  document.querySelectorAll('.pc,.rcard,.ach,.soc-card,.btn,.hero-tag,.hero-role').forEach(el=>{
    const label=el.querySelector('.pc-name,.rname,.at,.soc-platform')?.textContent.trim().slice(0,22)||el.textContent.trim().slice(0,18);
    el.addEventListener('mouseenter',()=>snapTo(el,label));
    el.addEventListener('mouseleave',unsnap);
  });
}

// ── NAV ─────────────────────────────────
function toggleMob(){ document.getElementById('mobmenu').classList.toggle('open'); document.getElementById('ham').classList.toggle('open'); }
function closeMob(){ document.getElementById('mobmenu').classList.remove('open'); document.getElementById('ham').classList.remove('open'); }
function goTo(id){ document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); }

// ── BOOT ─────────────────────────────────
(function initBoot(){
  const bootRight = document.getElementById('boot-right');
  const bc = document.getElementById('boot-canvas');
  const bx = bc.getContext('2d');

  function resizeCanvas(){
    bc.width  = bootRight.offsetWidth  || window.innerWidth/2;
    bc.height = bootRight.offsetHeight || window.innerHeight;
    bc.style.position = 'absolute';
    bc.style.top = '0'; bc.style.left = '0';
    bc.style.width = '100%'; bc.style.height = '100%';
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function getCenter(){ return { cx: bc.width/2, cy: bc.height/2, R: Math.min(bc.width, bc.height) * .42 }; }
  let globeAngle = 0, rafId;

  // ── Real continent outlines (simplified lat/lng polygons) ──
  const CONTINENTS=[
    // North America
    [[71,-142],[70,-130],[60,-130],[55,-132],[50,-125],[48,-124],[35,-120],[30,-117],[22,-110],[20,-105],
     [16,-92],[15,-85],[10,-85],[8,-77],[9,-78],[10,-75],[12,-72],[11,-63],[14,-62],[18,-66],[20,-72],
     [25,-77],[30,-80],[35,-76],[37,-76],[41,-71],[43,-70],[45,-64],[47,-54],[50,-56],[52,-56],[55,-60],
     [58,-64],[62,-64],[65,-64],[68,-64],[70,-68],[72,-78],[71,-85],[70,-90],[68,-97],[68,-105],[70,-110],
     [71,-120],[71,-130],[71,-142]],
    // South America
    [[12,-72],[10,-62],[8,-60],[5,-52],[2,-50],[0,-50],[-5,-35],[-10,-37],[-15,-39],[-20,-40],[-25,-48],
     [-30,-51],[-35,-57],[-38,-57],[-40,-62],[-42,-64],[-45,-65],[-48,-66],[-52,-68],[-55,-68],[-55,-65],
     [-50,-68],[-45,-65],[-40,-60],[-35,-56],[-28,-48],[-22,-43],[-15,-39],[-10,-37],[-5,-35],[0,-50],
     [5,-52],[8,-60],[10,-62],[12,-72]],
    // Europe
    [[71,28],[70,20],[68,14],[65,14],[63,8],[60,5],[58,5],[55,8],[54,9],[52,5],[50,2],[48,-2],[46,-2],
     [43,-8],[36,-6],[36,0],[38,2],[40,3],[42,3],[44,8],[44,12],[45,13],[45,14],[46,15],[47,16],[48,17],
     [49,18],[50,19],[52,20],[54,19],[55,21],[57,21],[59,22],[60,24],[62,24],[64,26],[66,28],[68,28],[71,28]],
    // Africa
    [[37,10],[30,32],[22,37],[15,42],[12,43],[10,42],[8,38],[5,35],[0,42],[-5,40],[-10,40],[-20,35],
     [-26,33],[-34,26],[-35,20],[-32,18],[-28,16],[-22,14],[-18,12],[-10,14],[-5,10],[0,9],[5,2],
     [5,-5],[10,-15],[14,-17],[16,-16],[14,-12],[10,-8],[5,-4],[2,9],[5,10],[8,14],[12,14],[16,12],
     [20,16],[22,18],[24,24],[26,32],[30,32],[37,10]],
    // Asia (simplified)
    [[70,130],[68,140],[65,142],[60,140],[55,132],[52,142],[48,138],[44,132],[40,128],[36,120],[30,122],
     [24,118],[22,114],[20,110],[18,108],[15,105],[12,109],[10,104],[5,103],[1,104],[-1,110],[5,118],
     [10,122],[15,120],[20,120],[25,121],[30,120],[35,120],[40,125],[44,130],[48,135],[52,140],[55,132],
     [60,130],[65,130],[70,130]],
    [[70,130],[68,100],[65,88],[62,75],[58,60],[55,50],[52,40],[48,38],[44,38],[40,36],[37,36],[35,32],
     [30,32],[26,50],[22,58],[18,54],[14,44],[10,44],[10,38],[15,42],[22,37],[30,32],[36,36],[40,36],
     [44,38],[48,38],[52,40],[55,50],[58,60],[62,72],[65,80],[68,88],[70,100],[70,130]],
    // Australia
    [[-14,135],[-18,122],[-22,114],[-28,114],[-32,116],[-35,117],[-38,145],[-38,148],[-35,150],[-32,152],
     [-28,154],[-24,151],[-20,148],[-18,146],[-14,135]],
    // Greenland
    [[83,-30],[80,-18],[76,-18],[72,-22],[68,-28],[66,-38],[64,-50],[66,-52],[70,-52],[74,-52],[78,-56],
     [80,-44],[82,-36],[83,-30]],
  ];

  // ── Major cities with coordinates ──
  const CITIES=[
    {name:'NYC',     lat:40.7,  lng:-74.0, hot:true},
    {name:'LONDON',  lat:51.5,  lng:-0.1,  hot:true},
    {name:'MOSCOW',  lat:55.7,  lng:37.6,  hot:true},
    {name:'TOKYO',   lat:35.7,  lng:139.7, hot:true},
    {name:'BEIJING', lat:39.9,  lng:116.4, hot:false},
    {name:'MUMBAI',  lat:19.1,  lng:72.9,  hot:false},
    {name:'DUBAI',   lat:25.2,  lng:55.3,  hot:false},
    {name:'SYDNEY',  lat:-33.9, lng:151.2, hot:false},
    {name:'SAO',     lat:-23.5, lng:-46.6, hot:false},
    {name:'LAGOS',   lat:6.5,   lng:3.4,   hot:false},
    {name:'PARIS',   lat:48.9,  lng:2.3,   hot:false},
    {name:'BERLIN',  lat:52.5,  lng:13.4,  hot:false},
    {name:'SEOUL',   lat:37.6,  lng:127.0, hot:false},
    {name:'CHICAGO', lat:41.9,  lng:-87.6, hot:false},
    {name:'NAIROBI', lat:-1.3,  lng:36.8,  hot:false},
    {name:'SGPORE',  lat:1.4,   lng:103.8, hot:false},
    {name:'TORONTO', lat:43.7,  lng:-79.4, hot:false},
    {name:'CDMX',    lat:19.4,  lng:-99.1, hot:false},
  ];

  // ── Arc connections between cities ──
  const ARCS=[
    ['NYC','LONDON'],['LONDON','MOSCOW'],['MOSCOW','BEIJING'],['BEIJING','TOKYO'],
    ['NYC','SAO'],['LONDON','PARIS'],['MOSCOW','DUBAI'],['TOKYO','SEOUL'],
    ['NYC','TORONTO'],['LONDON','BERLIN'],['DUBAI','MUMBAI'],['BEIJING','SGPORE'],
    ['SYDNEY','SGPORE'],['LAGOS','LONDON'],['NAIROBI','DUBAI'],['NYC','CDMX'],
  ];

  // Arc animation state
  const arcState=ARCS.map(()=>({t:Math.random(), speed:.0015+Math.random()*.002}));

  function proj(latDeg, lngDeg){
    const {cx,cy,R} = getCenter();
    const lat=latDeg*Math.PI/180, lng=lngDeg*Math.PI/180;
    const x3=R*Math.cos(lat)*Math.sin(lng+globeAngle);
    const y3=R*Math.sin(lat);
    const z3=R*Math.cos(lat)*Math.cos(lng+globeAngle);
    const depth=(z3/R+1)/2;
    return{x:cx+x3, y:cy-y3, z:z3, depth, vis:z3>-R*.15};
  }

  function drawArc(c1,c2,t){
    const {R} = getCenter();
    const p1=proj(c1.lat,c1.lng), p2=proj(c2.lat,c2.lng);
    if(!p1.vis&&!p2.vis) return;
    const STEPS=40;
    const pts=[];
    for(let i=0;i<=STEPS;i++){
      const f=i/STEPS;
      const lat=c1.lat+(c2.lat-c1.lat)*f;
      const lng=c1.lng+(c2.lng-c1.lng)*f;
      const arcH=Math.sin(f*Math.PI)*R*.18;
      const p=proj(lat,lng);
      pts.push({x:p.x, y:p.y-(p.vis?arcH*p.depth:0), z:p.z, vis:p.vis, depth:p.depth});
    }
    bx.save();
    const trailLen=0.35;
    const head=t%1, tail=Math.max(0,head-trailLen);
    for(let i=0;i<STEPS;i++){
      const f=i/STEPS;
      if(f<tail||f>head) continue;
      const pa=pts[i], pb=pts[i+1];
      if(!pa.vis||!pb.vis) continue;
      const alpha=(f-tail)/(head-tail)*Math.min(pa.depth+.3,1)*.8;
      bx.strokeStyle=`rgba(0,212,255,${alpha})`;
      bx.lineWidth=1.2;
      bx.beginPath(); bx.moveTo(pa.x,pa.y); bx.lineTo(pb.x,pb.y); bx.stroke();
    }
    const headIdx=Math.floor(t%1*STEPS);
    const hp=pts[Math.min(headIdx,STEPS)];
    if(hp&&hp.vis){
      bx.fillStyle=`rgba(0,212,255,${Math.min(hp.depth+.4,1)})`;
      bx.shadowBlur=8; bx.shadowColor='#00d4ff';
      bx.beginPath(); bx.arc(hp.x,hp.y,2.5,0,Math.PI*2); bx.fill();
      bx.shadowBlur=0;
    }
    bx.restore();
  }

  let scanY=null, scanDir=1;

  function drawGlobe(){
    const {cx,cy,R} = getCenter();
    if(scanY===null) scanY=-R;
    bx.clearRect(0,0,bc.width,bc.height);

    // Deep space bg
    const bg=bx.createRadialGradient(cx,cy,0,cx,cy,bc.width*.8);
    bg.addColorStop(0,'rgba(4,8,16,0)'); bg.addColorStop(.6,'rgba(2,6,12,0)'); bg.addColorStop(1,'rgba(0,0,0,.96)');
    bx.fillStyle=bg; bx.fillRect(0,0,bc.width,bc.height);

    // Atmosphere
    const atm=bx.createRadialGradient(cx,cy,R*.92,cx,cy,R*1.22);
    atm.addColorStop(0,'rgba(0,212,255,.08)');
    atm.addColorStop(.4,'rgba(0,255,136,.04)');
    atm.addColorStop(1,'rgba(0,0,0,0)');
    bx.fillStyle=atm; bx.beginPath(); bx.arc(cx,cy,R*1.22,0,Math.PI*2); bx.fill();

    // Ocean
    const ocean=bx.createRadialGradient(cx-R*.25,cy-R*.2,R*.05,cx,cy,R);
    ocean.addColorStop(0,'rgba(0,20,35,.95)');
    ocean.addColorStop(.5,'rgba(0,12,25,.9)');
    ocean.addColorStop(1,'rgba(0,5,15,.98)');
    bx.fillStyle=ocean;
    bx.beginPath(); bx.arc(cx,cy,R,0,Math.PI*2); bx.fill();

    // Grid lines
    for(let lat=-75;lat<=75;lat+=15){
      bx.beginPath(); let first=true;
      for(let l=0;l<=360;l+=2){
        const p=proj(lat,l-180); if(!p.vis){first=true;continue;}
        bx.strokeStyle=`rgba(0,255,136,${.025+p.depth*.04})`; bx.lineWidth=.4;
        if(first){bx.moveTo(p.x,p.y);first=false;}else bx.lineTo(p.x,p.y);
      }
      bx.stroke();
    }
    for(let lng=-180;lng<180;lng+=15){
      bx.beginPath(); let first=true;
      for(let l=-85;l<=85;l+=2){
        const p=proj(l,lng); if(!p.vis){first=true;continue;}
        bx.strokeStyle=`rgba(0,255,136,${.025+p.depth*.04})`; bx.lineWidth=.4;
        if(first){bx.moveTo(p.x,p.y);first=false;}else bx.lineTo(p.x,p.y);
      }
      bx.stroke();
    }

    // Continents
    CONTINENTS.forEach(poly=>{
      bx.beginPath(); let started=false;
      poly.forEach(([lat,lng])=>{
        const p=proj(lat,lng);
        if(!p.vis){started=false;return;}
        if(!started){bx.moveTo(p.x,p.y);started=true;}else bx.lineTo(p.x,p.y);
      });
      bx.closePath();
      bx.fillStyle='rgba(0,40,24,.85)';
      bx.strokeStyle='rgba(0,255,136,.22)';
      bx.lineWidth=.7; bx.fill(); bx.stroke();
    });

    // Arcs
    ARCS.forEach(([a,b],i)=>{
      arcState[i].t+=arcState[i].speed;
      const c1=CITIES.find(c=>c.name===a), c2=CITIES.find(c=>c.name===b);
      if(c1&&c2) drawArc(c1,c2,arcState[i].t);
    });

    // Cities
    CITIES.forEach(city=>{
      const p=proj(city.lat,city.lng);
      if(!p.vis) return;
      const alpha=.4+p.depth*.6;
      const col=city.hot?'#00ff88':'#00d4ff';
      const pulse=(Math.sin(Date.now()*.003+city.lng)*.5+.5)*.4;
      bx.beginPath(); bx.arc(p.x,p.y,(city.hot?5:3.5)+pulse*3,0,Math.PI*2);
      bx.strokeStyle=city.hot?`rgba(0,255,136,${alpha*.25})`:`rgba(0,212,255,${alpha*.25})`;
      bx.lineWidth=.8; bx.stroke();
      bx.fillStyle=city.hot?`rgba(0,255,136,${alpha})`:`rgba(0,212,255,${alpha*.8})`;
      bx.shadowBlur=city.hot?10:6; bx.shadowColor=col;
      bx.beginPath(); bx.arc(p.x,p.y,city.hot?2.5:1.8,0,Math.PI*2); bx.fill();
      bx.shadowBlur=0;
      if(city.hot&&p.depth>.5){
        bx.fillStyle=`rgba(200,255,220,${alpha*.7})`;
        bx.font=`${Math.max(9,Math.round(R*.045))}px 'JetBrains Mono',monospace`;
        bx.textAlign='left'; bx.textBaseline='middle';
        bx.fillText(city.name,p.x+6,p.y);
      }
    });

    // Specular highlight
    const spec=bx.createRadialGradient(cx-R*.4,cy-R*.35,0,cx-R*.4,cy-R*.35,R*.9);
    spec.addColorStop(0,'rgba(0,212,255,.07)');
    spec.addColorStop(.4,'rgba(0,255,136,.03)');
    spec.addColorStop(1,'rgba(0,0,0,0)');
    bx.fillStyle=spec; bx.beginPath(); bx.arc(cx,cy,R,0,Math.PI*2); bx.fill();

    // Night shadow
    const term=bx.createLinearGradient(cx-R*.1-R*.35,cy,cx-R*.1+R*.1,cy);
    term.addColorStop(0,'rgba(0,0,0,0)'); term.addColorStop(1,'rgba(0,0,0,.38)');
    bx.fillStyle=term; bx.beginPath(); bx.arc(cx,cy,R,0,Math.PI*2); bx.fill();

    // Globe border
    bx.strokeStyle='rgba(0,212,255,.35)'; bx.lineWidth=1.2;
    bx.beginPath(); bx.arc(cx,cy,R,0,Math.PI*2); bx.stroke();

    // Scanline
    scanY+=scanDir*1.2; if(scanY>R)scanDir=-1; if(scanY<-R)scanDir=1;
    const sy=cy+scanY, sw=Math.sqrt(Math.max(0,R*R-scanY*scanY));
    const sg=bx.createLinearGradient(cx-sw,sy,cx+sw,sy);
    sg.addColorStop(0,'rgba(0,212,255,0)'); sg.addColorStop(.5,'rgba(0,212,255,.22)'); sg.addColorStop(1,'rgba(0,212,255,0)');
    bx.fillStyle=sg; bx.fillRect(cx-sw,sy-1,sw*2,2);

    globeAngle+=.003;
    rafId=requestAnimationFrame(drawGlobe);
  }
  drawGlobe();

  // Build boot lines — use data.js if available, else defaults
  const BOOT_DATA=GRIM_DATA.boot||{lines:[],accessMessage:'ACCESS GRANTED'};
  const DELAYS=[0,120,280,440,600,720,780];
  const bootLines=BOOT_DATA.lines.map((l,i)=>({...l,d:DELAYS[i]||(600+i*140)}));
  const BOOT=[
    ...bootLines,
    {t:'',d:bootLines.length?bootLines[bootLines.length-1].d+80:780,c:''},
    {t:'Loading operator profile...',d:bootLines.length?bootLines[bootLines.length-1].d+160:860,c:''},
    {t:`  ✔  identity   : ${GRIM_DATA.identity.handle} / ${GRIM_DATA.identity.realname}`,d:940, c:'ok'},
    {t:'  ✔  clearance  : CLASSIFIED',                               d:1080,c:'ok'},
    {t:`  ✔  platform   : ${GRIM_DATA.identity.platform||'Arch / Kali / Debian'}`,d:1180,c:'ok'},
    {t:'  ✔  blackarch  : tooling active',                           d:1280,c:'ok'},
    {t:'  ✔  docker     : daemon running',                           d:1380,c:'ok'},
    {t:'  ✔  k8s        : cluster online',                           d:1480,c:'ok'},
    {t:'  ✔  firewall   : 247 rules active',                         d:1580,c:'ok'},
    {t:'  ✔  encryption : AES-256 established',                      d:1680,c:'ok'},
    {t:'',                                                            d:1760,c:''},
    {t:'root@arch:~$ echo "'+BOOT_DATA.accessMessage+'"',            d:1820,c:''},
    {t:BOOT_DATA.accessMessage,                                       d:1980,c:'big'},
  ];
  const blogEl=document.getElementById('blog');
  const bbarEl=document.getElementById('bbar');
  BOOT.forEach((l,i)=>{
    setTimeout(()=>{
      const d=document.createElement('div');
      d.className='bl'+(l.c?' '+l.c:'');
      d.textContent=l.t||'\u00a0';
      blogEl.appendChild(d);
      setTimeout(()=>d.classList.add('in'),20);
      blogEl.scrollTop=blogEl.scrollHeight;
      bbarEl.style.width=((i/BOOT.length)*100)+'%';
    },l.d);
  });
  setTimeout(()=>{
    cancelAnimationFrame(rafId);
    bbarEl.style.width='100%';
    const boot=document.getElementById('boot');
    boot.style.transition='opacity .85s ease'; boot.style.opacity='0';
    setTimeout(()=>{
      boot.style.display='none';
      document.getElementById('app').classList.add('show');
      initApp();
    },870);
  },2700);
})();

// ── MATRIX BG ───────────────────────────
function initBg(){
  const c=document.getElementById('bgcanvas');
  const x=c.getContext('2d');
  c.width=window.innerWidth; c.height=window.innerHeight;
  const CHARS='01アイウエオカキクケコサシスセソタチツテトナニヌネノ░▒▓█▄▀■□◆◇ABCDEF0123456789';
  const COL_W=18, cols=Math.floor(c.width/COL_W);
  const drops=Array.from({length:cols},()=>({
    y:Math.random()*-c.height, speed:10+Math.random()*24,
    trail:8+Math.floor(Math.random()*18),
    chars:Array.from({length:40},()=>CHARS[Math.floor(Math.random()*CHARS.length)]),
    tick:0, refreshEvery:3+Math.floor(Math.random()*6),
  }));
  let last=0;
  function draw(ts){
    const dt=Math.min((ts-last)/1000,.05); last=ts;
    x.fillStyle='rgba(10,10,10,0.18)'; x.fillRect(0,0,c.width,c.height);
    drops.forEach((d,ci)=>{
      d.y+=d.speed*dt*60*.25; d.tick++;
      if(d.tick%d.refreshEvery===0){const ri=Math.floor(Math.random()*d.chars.length);d.chars[ri]=CHARS[Math.floor(Math.random()*CHARS.length)];}
      for(let i=0;i<d.trail;i++){
        const cy=d.y-i*COL_W;
        if(cy<0||cy>c.height)continue;
        const ch=d.chars[i%d.chars.length], px=ci*COL_W;
        if(i===0){x.fillStyle='#ccffee';x.shadowBlur=8;x.shadowColor='#00ff88';}
        else{const alpha=Math.max(0,1-i/d.trail);x.fillStyle=`rgba(0,${Math.floor(180+75*alpha)},${Math.floor(80*alpha)},${alpha*.85})`;x.shadowBlur=i<3?4:0;x.shadowColor='#00ff88';}
        x.font=`${COL_W-2}px 'JetBrains Mono',monospace`; x.fillText(ch,px,cy);
      }
      x.shadowBlur=0;
      if(d.y-d.trail*COL_W>c.height){d.y=-COL_W*d.trail;d.speed=10+Math.random()*24;d.trail=8+Math.floor(Math.random()*18);}
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
  window.addEventListener('resize',()=>{c.width=window.innerWidth;c.height=window.innerHeight;});
}

// ── RENDER FROM DATA ─────────────────────
function renderContent(){
  const D=GRIM_DATA;

  // Hero
  document.querySelectorAll('.hero-name').forEach(el=>{ el.textContent=D.identity.handle; el.dataset.text=D.identity.handle; });
  const sub=document.querySelector('.hero-sub');       if(sub) sub.textContent=D.identity.realname;
  const role=document.querySelector('.hero-role');     if(role) role.textContent=D.identity.role;
  const tag=document.querySelector('.hero-tagline');   if(tag) tag.textContent=D.identity.tagline;
  // Mission Brief
  const M=D.mission;
  if(M){
    const mo=document.getElementById('mission-overview'); if(mo) mo.textContent=M.overview||'';
    const mp=document.getElementById('mission-platforms');
    if(mp) mp.innerHTML=(M.platforms||[]).map((p,i)=>`<span class="mb-tag ${i<3?'cyan':'green'}">${p}</span>`).join('');
    const mf=document.getElementById('mission-focus');
    if(mf) mf.innerHTML=(M.focusAreas||[]).map(f=>`<div class="mb-focus-item">${f}</div>`).join('');
    const mt=document.getElementById('mission-toolset');
    if(mt) mt.innerHTML=(M.toolset||[]).map((t,i)=>`<span class="mb-tag ${i<3?'green':''}">${t}</span>`).join('');
  }

  // Skills bars
  const sg=document.getElementById('skill-grid');
  if(sg){
    sg.innerHTML=D.skills.map(cat=>`
      <div class="sc${cat.type==='red'?' sec':''}">
        <div class="sc-name">${cat.category}</div>
        ${cat.items.map(s=>`
          <div class="si">
            <div class="si-row">${s.name}<span class="si-pct">${s.level}%</span></div>
            <div class="si-track"><div class="si-fill" data-w="${s.level}"></div></div>
          </div>`).join('')}
      </div>`).join('');
  }

  // Projects
  const pg=document.getElementById('proj-grid');
  if(pg){
    pg.innerHTML=D.projects.map(p=>`
      <div class="pc">
        <div class="pc-corner"></div>
        <div class="pc-badge badge-${p.badge}">${p.badge}</div>
        <div class="pc-name">${p.name}</div>
        <div class="pc-desc">${p.desc}</div>
        <div class="pc-tags">${p.tags.map(t=>`<span class="pc-tag">${t}</span>`).join('')}</div>
        <a href="${p.url}" target="_blank" class="plink">→ repository</a>
      </div>`).join('');
  }

  // Socials
  const sg2=document.getElementById('social-grid');
  if(sg2){
    const ICONS={
      gh:`<svg viewBox="0 0 24 24"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.3-3.2-.2-.3-.6-1.6.1-3.2 0 0 1.1-.3 3.5 1.3a12 12 0 0 1 6.4 0c2.4-1.6 3.5-1.3 3.5-1.3.7 1.6.3 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/></svg>`,
      li:`<svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.55V14.9c0-1.3-.02-3-1.83-3-1.84 0-2.12 1.43-2.12 2.91v5.64H9.4V9h3.41v1.56h.05c.48-.9 1.64-1.84 3.37-1.84 3.6 0 4.27 2.37 4.27 5.45v6.28zM5.34 7.43A2.06 2.06 0 1 1 5.34 3.3a2.06 2.06 0 0 1 0 4.13zM6.9 20.45H3.56V9H6.9v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z"/></svg>`,
      tw:`<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
      dc:`<svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.042.032.055a20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.201 13.201 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-2.981.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>`,
      em:`<svg viewBox="0 0 24 24"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/></svg>`,
      bl:`<svg viewBox="0 0 24 24"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>`,
    };
    sg2.innerHTML=D.socials.map(s=>`
      <a href="${s.url}" target="_blank" class="soc-card">
        <div class="soc-icon">${ICONS[s.icon]||ICONS.em}</div>
        <div class="soc-info">
          <span class="soc-platform">${s.label}</span>
          <span class="soc-handle">${s.url.replace(/^https?:\/\//,'').replace(/^mailto:/,'')}</span>
        </div>
      </a>`).join('');
  }

  // Achievements
  const ag=document.getElementById('ach-grid');
  if(ag){
    ag.innerHTML=D.achievements.map((a,i)=>{
      const d=(i*.25)+'s';
      return `<div class="ach${a.type==='red'?' red-ach':''}" style="--d:${d}">
        <div class="ai">${a.icon}</div>
        <div><div class="at">${a.label}</div><div class="ad">${a.desc}</div></div>
      </div>`;
    }).join('');
  }
}

// ── RADAR CHART ──────────────────────────
function initRadar(){
  const canvas=document.getElementById('radarChart');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const size=canvas.width=canvas.height=Math.min(canvas.offsetWidth,340);
  const cx=size/2, cy=size/2, R=size*.38;

  // build axes from skill category averages
  const cats=GRIM_DATA.skills.map(cat=>({
    label:cat.category.replace('_',' '),
    value:Math.round(cat.items.reduce((a,b)=>a+b.level,0)/cat.items.length)/100,
    color: cat.type==='red' ? '#ff3b3b'
         : (cat.category==='devops'||cat.category==='web_stack') ? '#00d4ff'
         : '#00ff88',
  }));
  const N=cats.length;
  const angle=i=>(Math.PI*2*i/N)-Math.PI/2;

  // bg
  ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,size,size);

  // grid rings
  [.25,.5,.75,1].forEach(r=>{
    ctx.beginPath();
    cats.forEach((_,i)=>{
      const a=angle(i), x=cx+Math.cos(a)*R*r, y=cy+Math.sin(a)*R*r;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    ctx.closePath();
    ctx.strokeStyle=`rgba(34,34,34,${r===1?.8:.5})`;
    ctx.lineWidth=1; ctx.stroke();
    // ring label
    ctx.fillStyle='#333'; ctx.font='9px JetBrains Mono, monospace';
    ctx.textAlign='center';
    ctx.fillText(Math.round(r*100)+'%', cx+4, cy-R*r+4);
  });

  // spokes
  cats.forEach((_,i)=>{
    const a=angle(i);
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(a)*R, cy+Math.sin(a)*R);
    ctx.strokeStyle='rgba(34,34,34,.8)'; ctx.lineWidth=1; ctx.stroke();
  });

  // data polygon — fill
  ctx.beginPath();
  cats.forEach((c,i)=>{
    const a=angle(i), x=cx+Math.cos(a)*R*c.value, y=cy+Math.sin(a)*R*c.value;
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.closePath();
  const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,R);
  grad.addColorStop(0,'rgba(0,212,255,.18)'); grad.addColorStop(.6,'rgba(0,255,136,.12)'); grad.addColorStop(1,'rgba(0,255,136,.02)');
  ctx.fillStyle=grad; ctx.fill();
  ctx.strokeStyle='rgba(0,212,255,.6)'; ctx.lineWidth=1.5; ctx.stroke();

  // data points
  cats.forEach((c,i)=>{
    const a=angle(i), x=cx+Math.cos(a)*R*c.value, y=cy+Math.sin(a)*R*c.value;
    ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fillStyle=c.color; ctx.shadowBlur=8; ctx.shadowColor=c.color; ctx.fill();
    ctx.shadowBlur=0;
    // outer ring
    ctx.beginPath(); ctx.arc(x,y,7,0,Math.PI*2);
    ctx.strokeStyle=c.color+'44'; ctx.lineWidth=1; ctx.stroke();
  });

  // axis labels
  cats.forEach((c,i)=>{
    const a=angle(i);
    const lx=cx+Math.cos(a)*(R+26), ly=cy+Math.sin(a)*(R+26);
    ctx.fillStyle=c.color;
    ctx.font='bold 10px Syne, sans-serif';
    ctx.textAlign = lx<cx-8 ? 'right' : lx>cx+8 ? 'left' : 'center';
    ctx.textBaseline = ly<cy-8 ? 'bottom' : ly>cy+8 ? 'top' : 'middle';
    ctx.fillText(c.label, lx, ly);
    // value badge
    ctx.fillStyle='rgba(0,0,0,.7)';
    const vx=cx+Math.cos(a)*R*c.value, vy=cy+Math.sin(a)*R*c.value;
    ctx.font='9px JetBrains Mono, monospace';
    ctx.textAlign='center'; ctx.textBaseline='bottom';
    ctx.fillText(Math.round(c.value*100)+'%', vx, vy-10);
  });

  // legend
  const legend=document.getElementById('radar-legend');
  if(legend){
    legend.innerHTML=cats.map(c=>`
      <div class="rl-item">
        <div class="rl-dot" style="background:${c.color}"></div>
        ${c.label}
      </div>`).join('');
  }
}

// ── TERMINAL ─────────────────────────────
function initTerminal(){
  const body=document.getElementById('tbody');
  const input=document.getElementById('tinput');
  let hist=[],hi=-1;
  function addL(text,cls){
    const d=document.createElement('div');
    d.className='tl '+(cls||''); d.textContent=text||'\u00a0';
    body.appendChild(d); body.scrollTop=body.scrollHeight;
  }
  function typeAsync(lines){ lines.forEach(l=>setTimeout(()=>addL(l.t,l.c),l.d)); return null; }

  const cmds={
    help:()=>[
      {t:'available commands:',c:'ti'},{t:'',c:''},
      {t:'  whoami           — operator profile',c:'to'},
      {t:'  skills           — capability matrix',c:'to'},
      {t:'  projects         — project manifest',c:'to'},
      {t:'  status           — system status report',c:'to'},
      {t:'  socials          — contact/social links',c:'to'},
      {t:'  github           — open github profile',c:'to'},
      {t:'  scan-network     — run nmap scan',c:'to'},
      {t:'  launch-recon     — osint recon operation',c:'to'},
      {t:'  sudo access-root — privilege escalation',c:'to'},
      {t:'  clear            — clear terminal',c:'to'},
      {t:'',c:''},
    ],
    whoami:()=>[
      {t:'',c:''},
      {t:'  ██████╗ ██████╗ ██╗███╗   ███╗',c:'ts'},
      {t:'  ██╔════╝██╔══██╗██║████╗ ████║',c:'ts'},
      {t:'  ██║  ███╗██████╔╝██║██╔████╔██║',c:'ts'},
      {t:'  ██║   ██║██╔══██╗██║██║╚██╔╝██║',c:'ts'},
      {t:'  ╚██████╔╝██║  ██║██║██║ ╚═╝ ██║',c:'ts'},
      {t:'   ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝',c:'ts'},
      {t:'',c:''},
      {t:`  UID:      ${GRIM_DATA.identity.github}`,c:'to'},
      {t:`  ROLE:     Pentester | Systems Developer | DevOps`,c:'to'},
      {t:'  PLATFORM: Arch / Kali / Debian',c:'ti'},
      {t:'  TOOLSET:  BlackArch / Metasploit / Burp Suite',c:'ti'},
      {t:'  SHELL:    zsh / bash',c:'to'},
      {t:'  KERNEL:   6.6.30-arch1',c:'to'},
      {t:'  GROUPS:   sudo, docker, pentest, dev, wheel',c:'to'},
      {t:'',c:''},
    ],
    skills:()=>{
      const lines=[{t:'> LOADING capability_matrix.db...',c:'ti'},{t:'',c:''}];
      GRIM_DATA.skills.forEach(cat=>{
        cat.items.forEach(s=>{
          const bars=Math.round(s.level/10);
          const bar='■'.repeat(bars)+'□'.repeat(10-bars);
          const tag=cat.type==='red'?'[SEC]':'['+cat.category.slice(0,3).toUpperCase()+']';
          lines.push({t:`  ${tag.padEnd(8)} ${s.name.padEnd(14)} ${bar}  ${s.level}%`,c:cat.type==='red'?'te':'to'});
        });
      });
      lines.push({t:'',c:''});
      return lines;
    },
    projects:()=>{
      const lines=[{t:'> RETRIEVING project_manifest.dat...',c:'ti'},{t:'',c:''}];
      GRIM_DATA.projects.forEach((p,i)=>{
        lines.push({t:`  [${String(i+1).padStart(3,'0')}] ${p.name.padEnd(30)} [${p.badge.toUpperCase()}]`,c:'to'});
      });
      lines.push({t:'',c:''},{t:`  → github.com/${GRIM_DATA.identity.github}`,c:'ts'},{t:'',c:''});
      return lines;
    },
    socials:()=>{
      const lines=[{t:'> LOADING social_links.conf...',c:'ti'},{t:'',c:''}];
      GRIM_DATA.socials.forEach(s=>{
        lines.push({t:`  [${s.platform.toUpperCase().padEnd(8)}] ${s.url}`,c:'to'});
      });
      lines.push({t:'',c:''});
      return lines;
    },
    status:()=>{
      const t=new Date().toISOString();
      return[
        {t:'> SYSTEM STATUS REPORT',c:'ti'},{t:'',c:''},
        {t:`  TIMESTAMP:  ${t}`,c:'to'},
        {t:'  CPU:        ██████░░░░  62% [6-core 5.2GHz]',c:'ts'},
        {t:'  MEMORY:     ████░░░░░░  38% [32GB DDR5]',c:'ts'},
        {t:'  NETWORK:    ACTIVE // TLS 1.3 ENCRYPTED',c:'ts'},
        {t:'  FIREWALL:   ENABLED // 247 RULES ACTIVE',c:'ts'},
        {t:'  VPN:        CONNECTED // Switzerland',c:'ts'},
        {t:'  INTRUSION:  NO THREATS DETECTED',c:'ts'},
        {t:'',c:''},
      ];
    },
    github:()=>{ window.open('https://github.com/'+GRIM_DATA.identity.github,'_blank'); return[{t:`> Opening github.com/${GRIM_DATA.identity.github}...`,c:'ti'}]; },
    clear:()=>{ body.innerHTML=''; return[]; },
    'scan-network':()=>typeAsync([
      {t:'> Initializing network scan...',c:'ti',d:0},
      {t:'> TARGET: 192.168.1.0/24',c:'to',d:280},
      {t:'> SCAN TYPE: SYN stealth (-sS)',c:'to',d:520},
      {t:'',c:'',d:760},
      {t:'  Scanning... ████████████████████ 100%',c:'to',d:1080},
      {t:'',c:'',d:1380},
      {t:'  HOST: 192.168.1.1    [UP]  OPEN: 22, 80, 443',c:'ts',d:1660},
      {t:'  HOST: 192.168.1.10   [UP]  OPEN: 22, 3306',c:'ts',d:1940},
      {t:'  HOST: 192.168.1.25   [UP]  OPEN: 8080, 9090',c:'ts',d:2220},
      {t:'  HOST: 192.168.1.50   [UP]  OPEN: 22, 80',c:'ts',d:2500},
      {t:'',c:'',d:2750},
      {t:'  [!] Port 22 open on multiple hosts — ATTACK SURFACE',c:'te',d:2960},
      {t:'  Scan complete. 4 hosts up. 14 open ports.',c:'ti',d:3200},
      {t:'',c:'',d:3450},
    ]),
    'launch-recon':()=>typeAsync([
      {t:'> Launching OSINT reconnaissance...',c:'ti',d:0},
      {t:'',c:'',d:320},
      {t:'  [DNS]    Resolving targets...      ✔ DONE',c:'ts',d:680},
      {t:'  [WHOIS]  Gathering domain data...  ✔ DONE',c:'ts',d:1080},
      {t:'  [SHODAN] Querying indexed hosts...  ✔ DONE',c:'ts',d:1480},
      {t:'  [NMAP]   Port enumeration...       ✔ DONE',c:'ts',d:1880},
      {t:'  [NSE]    Script scan...            ✔ DONE',c:'ts',d:2280},
      {t:'',c:'',d:2580},
      {t:'  FINDINGS: 3 potential CVEs identified',c:'te',d:2840},
      {t:'  REPORT:   recon_classified.pdf generated',c:'ti',d:3100},
      {t:'  STATUS:   Awaiting orders.',c:'ts',d:3360},
      {t:'',c:'',d:3620},
    ]),
    'sudo access-root':()=>typeAsync([
      {t:'[sudo] password for grim: ••••••••',c:'to',d:0},
      {t:'',c:'',d:720},
      {t:'  Verifying credentials...',c:'ti',d:980},
      {t:'  Escalating privileges...',c:'ti',d:1480},
      {t:'',c:'',d:1880},
      {t:'  ████████████████████████████████████████',c:'ts',d:2080},
      {t:'  PERMISSION GRANTED. WELCOME, ROOT.',c:'ts',d:2280},
      {t:'  You now have full system access.',c:'ts',d:2480},
      {t:'  ████████████████████████████████████████',c:'ts',d:2680},
      {t:'',c:'',d:2880},
      {t:'  [!] ALL ACTIONS ARE LOGGED AND AUDITED.',c:'te',d:3080},
      {t:'',c:'',d:3330},
    ]),
  };

  function run(cmd){
    cmd=cmd.trim(); if(!cmd)return;
    hist.unshift(cmd); hi=-1;
    addL('grim@arch:~$ '+cmd,'tp');
    const fn=cmds[cmd];
    if(fn){ const r=fn(); if(Array.isArray(r)) r.forEach(l=>addL(l.t,l.c)); }
    else{ addL('bash: '+cmd+': command not found','te'); addL("Type 'help' for available commands.",'to'); }
    addL('','');
  }
  input.addEventListener('keydown',e=>{
    if(e.key==='Enter'){ run(input.value); input.value=''; }
    else if(e.key==='ArrowUp'){ e.preventDefault(); if(hi<hist.length-1){hi++;input.value=hist[hi];} }
    else if(e.key==='ArrowDown'){ e.preventDefault(); hi>0?input.value=hist[--hi]:(hi=-1,input.value=''); }
    else if(e.key==='Tab'){ e.preventDefault(); const v=input.value.toLowerCase(); const m=Object.keys(cmds).find(c=>c.startsWith(v)); if(m)input.value=m; }
  });
  document.getElementById('tsec')?.addEventListener('click',()=>input.focus());
}

// ── NETWORK MAP ──────────────────────────
function initNetMap(){
  const c=document.getElementById('nmap');
  if(!c)return;
  const x=c.getContext('2d');
  c.width=c.offsetWidth; c.height=c.offsetHeight||320;
  const W=c.width,H=c.height;
  const NW=GRIM_DATA.network||{nodes:[]};
  // Positions are layout-computed, not in data
  const POS=[
    {id:'inet',  x:W*.5, y:H*.08,r:Math.max(14,W*.034)},
    {id:'fw',    x:W*.5, y:H*.28,r:Math.max(12,W*.030)},
    {id:'router',x:W*.5, y:H*.50,r:Math.max(12,W*.027)},
    {id:'dev',   x:W*.2, y:H*.76,r:Math.max(10,W*.023)},
    {id:'sec',   x:W*.5, y:H*.76,r:Math.max(10,W*.023)},
    {id:'ops',   x:W*.8, y:H*.76,r:Math.max(10,W*.023)},
    {id:'db',    x:W*.08,y:H*.95,r:Math.max(8,W*.015)},
    {id:'kali',  x:W*.38,y:H*.95,r:Math.max(8,W*.015)},
    {id:'k8s',   x:W*.65,y:H*.95,r:Math.max(8,W*.015)},
    {id:'mon',   x:W*.9, y:H*.95,r:Math.max(8,W*.015)},
  ];
  const nodes=NW.nodes.map(nd=>{
    const pos=POS.find(p=>p.id===nd.id)||{x:W*.5,y:H*.5,r:10};
    return{...nd,...pos};
  });
  const edges=[['inet','fw'],['fw','router'],['router','dev'],['router','sec'],['router','ops'],['dev','db'],['sec','kali'],['ops','k8s'],['ops','mon']];
  const pkts=edges.map(([a,b])=>({a,b,t:Math.random(),spd:.003+Math.random()*.004}));
  const nn=id=>nodes.find(n=>n.id===id);
  let hov=null,ao=0;
  const ni=document.getElementById('ninfo');
  function draw(){
    x.clearRect(0,0,W,H); ao+=.018;
    edges.forEach(([a,b])=>{
      const na=nn(a),nb=nn(b);
      x.strokeStyle='rgba(34,34,34,.9)'; x.lineWidth=1;
      x.setLineDash([3,8]); x.lineDashOffset=-ao*12;
      x.beginPath(); x.moveTo(na.x,na.y); x.lineTo(nb.x,nb.y); x.stroke();
    });
    x.setLineDash([]);
    pkts.forEach(p=>{
      p.t+=p.spd; if(p.t>1)p.t=0;
      const na=nn(p.a),nb=nn(p.b);
      const px=na.x+(nb.x-na.x)*p.t,py=na.y+(nb.y-na.y)*p.t;
      const isR=nb.id==='fw'||nb.id==='sec'||nb.id==='kali';
      x.fillStyle=isR?'rgba(255,59,59,.85)':'rgba(0,212,255,.75)';
      x.shadowBlur=6; x.shadowColor=isR?'rgba(255,59,59,.6)':'rgba(0,212,255,.6)';
      x.beginPath(); x.arc(px,py,2,0,Math.PI*2); x.fill();
    });
    x.shadowBlur=0;
    nodes.forEach(n=>{
      const isH=hov===n.id;
      x.shadowBlur=isH?16:6; x.shadowColor=n.col;
      x.strokeStyle=n.col; x.lineWidth=1;
      x.beginPath(); x.arc(n.x,n.y,n.r+(isH?3:0),0,Math.PI*2); x.stroke();
      x.fillStyle='rgba(0,0,0,.9)';
      x.beginPath(); x.arc(n.x,n.y,n.r,0,Math.PI*2); x.fill();
      const g=x.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r);
      g.addColorStop(0,n.col+'22'); g.addColorStop(1,'transparent');
      x.fillStyle=g; x.shadowBlur=0;
      x.beginPath(); x.arc(n.x,n.y,n.r,0,Math.PI*2); x.fill();
      x.fillStyle=n.col;
      x.font=`${Math.max(7,n.r*.52)}px 'JetBrains Mono',monospace`;
      x.textAlign='center'; x.textBaseline='middle';
      x.fillText(n.label,n.x,n.y);
    });
    requestAnimationFrame(draw);
  }
  draw();
  c.addEventListener('mousemove',e=>{
    const rc=c.getBoundingClientRect(),mx=e.clientX-rc.left,my=e.clientY-rc.top;
    let f=null;
    nodes.forEach(n=>{const dx=mx-n.x,dy=my-n.y;if(Math.sqrt(dx*dx+dy*dy)<n.r+8)f=n;});
    hov=f?f.id:null;
  });
  c.addEventListener('click',e=>{
    const rc=c.getBoundingClientRect(),mx=e.clientX-rc.left,my=e.clientY-rc.top;
    nodes.forEach(n=>{
      const dx=mx-n.x,dy=my-n.y;
      if(Math.sqrt(dx*dx+dy*dy)<n.r+8){
        ni.style.display='block';
        ni.style.left=Math.min(e.clientX+n.r+10,window.innerWidth-210)+'px';
        ni.style.top=(e.clientY-18)+'px';
        ni.innerHTML=`<strong>${n.label}</strong>${n.info}`;
        setTimeout(()=>ni.style.display='none',3000);
      }
    });
  });
  window.addEventListener('resize',()=>{c.width=c.offsetWidth;c.height=c.offsetHeight||320;});
}

// ── SCROLL REVEAL + SKILL BARS ───────────
function initReveal(){
  let sb=false;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      e.target.classList.add('in');
      if(e.target.id==='skills'&&!sb){
        sb=true;
        setTimeout(()=>{
          document.querySelectorAll('.si-fill').forEach(f=>{ f.style.width=f.dataset.w+'%'; });
        },150);
      }
    });
  },{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

// ── GITHUB ───────────────────────────────
async function fetchGH(){
  try{
    const gh=GRIM_DATA.identity.github;
    const [ur,rr]=await Promise.all([
      fetch('https://api.github.com/users/'+gh),
      fetch('https://api.github.com/users/'+gh+'/repos?per_page=12&sort=updated'),
    ]);
    if(ur.ok){
      const u=await ur.json();
      document.getElementById('ghrepos').textContent=u.public_repos||0;
      document.getElementById('ghfoll').textContent=u.followers||0;
      document.getElementById('ghfing').textContent=u.following||0;
    }
    if(rr.ok){
      const repos=await rr.json();
      if(!repos.length){document.getElementById('rgrid').innerHTML='<div style="color:var(--muted);padding:16px;font-size:.75em">no public repos found.</div>';return;}
      document.getElementById('rgrid').innerHTML=repos.map(r=>`
        <a href="${r.html_url}" target="_blank" class="rcard">
          <div class="rname">${r.name}</div>
          <div class="rdesc">${r.description||'no description.'}</div>
          <div class="rmeta">
            <span>★ ${r.stargazers_count}</span>
            <span>⑂ ${r.forks_count}</span>
            ${r.language?`<span class="rlang">${r.language.toLowerCase()}</span>`:''}
          </div>
        </a>`).join('');
    } else throw new Error();
  } catch{
    document.getElementById('rgrid').innerHTML = `
      <div style="color:var(--muted);font-size:.75em;padding:16px;line-height:1.8">
        [!] <span style="color:var(--r)">github api unavailable</span><br>
        <a href="https://github.com/${GRIM_DATA.identity.github}" target="_blank" style="color:var(--c);text-decoration:none">→ github.com/${GRIM_DATA.identity.github}</a>
      </div>`;
  }
}

// ── INIT ─────────────────────────────────
function initApp(){
  renderContent();
  initBg();
  initRadar();
  initTerminal();
  initNetMap();
  initReveal();
  fetchGH();
  bindCursor();
}
