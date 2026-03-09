// ═══════════════════════════════════════
// GRIM PORTFOLIO — main.js
// ═══════════════════════════════════════

// ── CURSOR ──────────────────────────────
(function initCursor(){
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const canvas = document.getElementById('cursor-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize(){
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const C_GREEN  = '#00ff88';
  const C_CYAN   = '#00d4ff';
  const ARM      = 7;    // bracket arm length in px
  const GAP      = 11;   // half-size of bracket box (center to corner)
  const DOT_R    = 2;    // center dot radius
  const SPIN     = (2 * Math.PI) / (3.4 * 60); // rad/frame

  let mouseX = window.innerWidth  / 2;
  let mouseY = window.innerHeight / 2;
  let curX   = mouseX, curY = mouseY;
  let curHW  = GAP,    curHH = GAP;   // current half-width / half-height of bracket box
  let angle  = 0;
  let locked = false;
  let lockOpacity = 0;   // 0 = free, 1 = locked (dot fades)
  let hoverEl = null;

  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function drawBrackets(cx, cy, hw, hh, ang, alpha, glow){
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(ang);
    ctx.strokeStyle = C_GREEN;
    ctx.lineWidth   = 1.5;
    ctx.globalAlpha = alpha;
    if (glow) {
      ctx.shadowColor = C_GREEN;
      ctx.shadowBlur  = 7;
    }
    // four corners: [signX, signY] pairs
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx, sy]) => {
      const ox = sx * hw;
      const oy = sy * hh;
      ctx.beginPath();
      ctx.moveTo(ox + sx * -ARM, oy);          // horizontal arm
      ctx.lineTo(ox, oy);
      ctx.lineTo(ox, oy + sy * -ARM);          // vertical arm
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawDot(cx, cy, alpha){
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(cx, cy, DOT_R, 0, Math.PI * 2);
    ctx.fillStyle = C_GREEN;
    ctx.shadowColor = C_GREEN;
    ctx.shadowBlur  = 8;
    ctx.fill();
    ctx.restore();
  }

  (function frame(){
    // read rect once per frame
    let tx = mouseX, ty = mouseY, ttHW = GAP, ttHH = GAP;
    if (locked && hoverEl) {
      const r = hoverEl.getBoundingClientRect();
      tx   = r.left + r.width  / 2;
      ty   = r.top  + r.height / 2;
      ttHW = Math.max(GAP, r.width  / 2 + 8);
      ttHH = Math.max(GAP, r.height / 2 + 8);
    }

    curX  += (tx   - curX)  * 0.26;
    curY  += (ty   - curY)  * 0.26;
    curHW += (ttHW - curHW) * 0.24;
    curHH += (ttHH - curHH) * 0.24;
    lockOpacity += ((locked ? 1 : 0) - lockOpacity) * 0.18;

    if (!locked) {
      angle += SPIN;
    } else {
      // smoothly rotate back to 0 so brackets align with element edges
      angle += (0 - angle) * 0.14;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBrackets(curX, curY, curHW, curHH, angle, 0.92, locked);
    drawDot(curX, curY, 1 - lockOpacity);

    requestAnimationFrame(frame);
  })();

  function bindCursorHover(){
    const els = document.querySelectorAll(
      'a, button, [data-label], .pc, .rcard, .ach, .soc-card, .hero-tag, .hero-role, input, textarea, select'
    );
    els.forEach(el => {
      el.addEventListener('mouseenter', () => { hoverEl = el; locked = true;  });
      el.addEventListener('mouseleave', () => { hoverEl = null; locked = false; });
    });
  }

  // expose so initApp can call after DOM is rendered
  window._bindCursorHover = bindCursorHover;
  bindCursorHover();
})();

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
    if(mp){
      const platforms=M.platforms||[];
      const start={ r:0, g:212, b:255 };
      const end={ r:0, g:255, b:136 };
      const lastIndex=Math.max(platforms.length-1,1);
      mp.innerHTML=platforms.map((p,i)=>{
        const ratio=i/lastIndex;
        const r=Math.round(start.r + (end.r-start.r)*ratio);
        const g=Math.round(start.g + (end.g-start.g)*ratio);
        const b=Math.round(start.b + (end.b-start.b)*ratio);
        return `<span class="mb-tag" style="color:rgb(${r},${g},${b});border-color:rgba(${r},${g},${b},.35)">${p}</span>`;
      }).join('');
    }
    const mf=document.getElementById('mission-focus');
    if(mf) mf.innerHTML=(M.focusAreas||[]).map(f=>`<div class="mb-focus-item">${f}</div>`).join('');
    const mt=document.getElementById('mission-toolset');
    if(mt){
      const toolset=M.toolset||[];
      const start={ r:0, g:255, b:136 };
      const end={ r:136, g:136, b:136 };
      const lastIndex=Math.max(toolset.length-1,1);
      mt.innerHTML=toolset.map((t,i)=>{
        const ratio=i/lastIndex;
        const r=Math.round(start.r + (end.r-start.r)*ratio);
        const g=Math.round(start.g + (end.g-start.g)*ratio);
        const b=Math.round(start.b + (end.b-start.b)*ratio);
        return `<span class="mb-tag" style="color:rgb(${r},${g},${b});border-color:rgba(${r},${g},${b},.35)">${t}</span>`;
      }).join('');
    }
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
    const _GH=`<svg viewBox="0 0 24 24"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.3-3.2-.2-.3-.6-1.6.1-3.2 0 0 1.1-.3 3.5 1.3a12 12 0 0 1 6.4 0c2.4-1.6 3.5-1.3 3.5-1.3.7 1.6.3 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/></svg>`;
    const _LI=`<svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.55V14.9c0-1.3-.02-3-1.83-3-1.84 0-2.12 1.43-2.12 2.91v5.64H9.4V9h3.41v1.56h.05c.48-.9 1.64-1.84 3.37-1.84 3.6 0 4.27 2.37 4.27 5.45v6.28zM5.34 7.43A2.06 2.06 0 1 1 5.34 3.3a2.06 2.06 0 0 1 0 4.13zM6.9 20.45H3.56V9H6.9v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z"/></svg>`;
    const _TW=`<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
    const _DC=`<svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.042.032.055a20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.201 13.201 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-2.981.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>`;
    const _EM=`<svg viewBox="0 0 24 24"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/></svg>`;
    const _BL=`<svg viewBox="0 0 24 24"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>`;
    const _IG=`<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`;
    const _YT=`<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`;
    const _TG=`<svg viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`;
    const _RD=`<svg viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>`;
    const _TW2=`<svg viewBox="0 0 24 24"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>`;
    // support both short codes (legacy) and full platform names (admin export)
    const ICONS={
      gh:_GH, github:_GH,
      li:_LI, linkedin:_LI,
      tw:_TW, twitter:_TW, x:_TW,
      dc:_DC, discord:_DC,
      em:_EM, email:_EM, mail:_EM,
      bl:_BL, medium:_BL,
      ig:_IG, instagram:_IG,
      yt:_YT, youtube:_YT,
      tg:_TG, telegram:_TG,
      rd:_RD, reddit:_RD,
      tc:_TW2, twitch:_TW2,
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
  const svg=document.getElementById('nmap');
  if(!svg)return;
  const NS='http://www.w3.org/2000/svg';
  const VW=800,VH=540;
  const NW=GRIM_DATA.network||{nodes:[]};

  function svgEl(tag,attrs,parent){
    const e=document.createElementNS(NS,tag);
    Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));
    if(parent)parent.appendChild(e);
    return e;
  }

  // ─ Layout ──────────────────────────────────
  const LAYOUT={
    inet:  {x:400,y:44, r:30},
    fw:    {x:400,y:128,r:26},
    router:{x:400,y:228,r:24},
    dev:   {x:155,y:348,r:22},
    sec:   {x:400,y:348,r:22},
    devops:{x:645,y:348,r:22},
    db:    {x:72, y:476,r:17},
    kali:  {x:318,y:476,r:17},
    k8s:   {x:572,y:476,r:17},
    mon:   {x:726,y:476,r:17},
  };

  const EDGES=[
    ['inet','fw'],['fw','router'],
    ['router','dev'],['router','sec'],['router','devops'],
    ['dev','db'],['sec','kali'],
    ['devops','k8s'],['devops','mon'],['k8s','mon'],
  ];

  const nodes=NW.nodes
    .filter(nd=>LAYOUT[nd.id])
    .map(nd=>({...nd,...LAYOUT[nd.id]}));
  const nn=id=>nodes.find(n=>n.id===id);

  // ─ Helpers ─────────────────────────────────
  function hexToRgb(h){
    if(!h||h.length<7)return'128,128,128';
    return`${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)}`;
  }
  function arc(cx,cy,r,startDeg,endDeg){
    const s=startDeg*Math.PI/180,e=endDeg*Math.PI/180;
    const large=endDeg-startDeg>180?1:0;
    return`M${(cx+r*Math.cos(s)).toFixed(2)},${(cy+r*Math.sin(s)).toFixed(2)} A${r},${r},0,${large},1,${(cx+r*Math.cos(e)).toFixed(2)},${(cy+r*Math.sin(e)).toFixed(2)}`;
  }

  // ─ Defs ────────────────────────────────────
  while(svg.firstChild)svg.removeChild(svg.firstChild);
  const defs=svgEl('defs',{},svg);

  const fGlow=svgEl('filter',{id:'nm-glow',x:'-60%',y:'-60%',width:'220%',height:'220%'},defs);
  svgEl('feGaussianBlur',{in:'SourceGraphic',stdDeviation:'3.5',result:'blur'},fGlow);
  const fm=svgEl('feMerge',{},fGlow);
  svgEl('feMergeNode',{in:'blur'},fm);svgEl('feMergeNode',{in:'SourceGraphic'},fm);

  const fGlowSm=svgEl('filter',{id:'nm-glow-sm',x:'-40%',y:'-40%',width:'180%',height:'180%'},defs);
  svgEl('feGaussianBlur',{in:'SourceGraphic',stdDeviation:'2',result:'blur'},fGlowSm);
  const fm2=svgEl('feMerge',{},fGlowSm);
  svgEl('feMergeNode',{in:'blur'},fm2);svgEl('feMergeNode',{in:'SourceGraphic'},fm2);

  const fStrong=svgEl('filter',{id:'nm-glow-strong',x:'-80%',y:'-80%',width:'260%',height:'260%'},defs);
  svgEl('feGaussianBlur',{in:'SourceGraphic',stdDeviation:'7',result:'blur'},fStrong);
  const fm3=svgEl('feMerge',{},fStrong);
  svgEl('feMergeNode',{in:'blur'},fm3);svgEl('feMergeNode',{in:'SourceGraphic'},fm3);

  nodes.forEach(n=>{
    const g=svgEl('radialGradient',{id:`nmg-${n.id}`,cx:'50%',cy:'50%',r:'50%'},defs);
    svgEl('stop',{offset:'0%','stop-color':n.col,'stop-opacity':'0.35'},g);
    svgEl('stop',{offset:'55%','stop-color':n.col,'stop-opacity':'0.12'},g);
    svgEl('stop',{offset:'100%','stop-color':n.col,'stop-opacity':'0'},g);
  });

  EDGES.forEach(([a,b])=>{
    const na=nn(a),nb=nn(b);
    if(!na||!nb)return;
    const isRed=nb.id==='fw'||nb.id==='sec'||nb.id==='kali';
    const col=isRed?'#ff3b3b':'#00d4ff';
    const lg=svgEl('linearGradient',{
      id:`nml-${a}-${b}`,x1:`${na.x}`,y1:`${na.y}`,x2:`${nb.x}`,y2:`${nb.y}`,
      gradientUnits:'userSpaceOnUse'
    },defs);
    svgEl('stop',{offset:'0%','stop-color':col,'stop-opacity':'0.04'},lg);
    svgEl('stop',{offset:'50%','stop-color':col,'stop-opacity':'0.55'},lg);
    svgEl('stop',{offset:'100%','stop-color':col,'stop-opacity':'0.04'},lg);
  });

  // ─ Background grid ──────────────────────────
  const gridG=svgEl('g',{'class':'nm-grid'},svg);
  for(let gx=0;gx<=VW;gx+=44)
    svgEl('line',{x1:gx,y1:0,x2:gx,y2:VH,stroke:'rgba(0,255,136,0.022)','stroke-width':'0.5'},gridG);
  for(let gy=0;gy<=VH;gy+=44)
    svgEl('line',{x1:0,y1:gy,x2:VW,y2:gy,stroke:'rgba(0,255,136,0.022)','stroke-width':'0.5'},gridG);
  for(let gx=88;gx<VW;gx+=176)
    for(let gy=88;gy<VH;gy+=176)
      svgEl('circle',{cx:gx,cy:gy,r:'1.2',fill:'rgba(0,255,136,0.07)'},gridG);

  // ─ Edges ───────────────────────────────────
  const edgeG=svgEl('g',{'class':'nm-edges'},svg);
  const edgeEls={};
  EDGES.forEach(([a,b])=>{
    const na=nn(a),nb=nn(b);
    if(!na||!nb)return;
    const isRed=nb.id==='fw'||nb.id==='sec'||nb.id==='kali';
    const col=isRed?'#ff3b3b':'#00d4ff';
    const rgb=hexToRgb(col);
    const key=`${a}-${b}`;
    const eg=svgEl('g',{'class':'nm-edge-glow','data-a':a,'data-b':b},edgeG);
    // Thick soft base track
    const el1=svgEl('line',{x1:na.x,y1:na.y,x2:nb.x,y2:nb.y,
      stroke:`rgba(${rgb},.06)`,'stroke-width':'5','stroke-linecap':'round'},eg);
    // Main glowing line
    const el2=svgEl('line',{x1:na.x,y1:na.y,x2:nb.x,y2:nb.y,
      stroke:`url(#nml-${a}-${b})`,'stroke-width':'1.1',
      'stroke-linecap':'round',filter:'url(#nm-glow-sm)'},eg);
    // Tick marks along edge (connector stubs)
    const dx=nb.x-na.x,dy=nb.y-na.y,len=Math.hypot(dx,dy);
    const ux=dx/len,uy=dy/len,px2=-uy,py2=ux;
    for(let s=1;s<=3;s++){
      const t=s/4;
      const tx=na.x+dx*t,ty=na.y+dy*t;
      svgEl('line',{x1:tx-px2*4,y1:ty-py2*4,x2:tx+px2*4,y2:ty+py2*4,
        stroke:`rgba(${rgb},.22)`,'stroke-width':'0.6'},eg);
    }
    edgeEls[key]={el1,el2,col,rgb,eg};
  });

  // ─ Nodes ───────────────────────────────────
  const nodeG=svgEl('g',{'class':'nm-nodes'},svg);
  const nodeEls={};
  const ni=document.getElementById('ninfo');

  nodes.forEach(n=>{
    const{x,y,r,col}=n;
    const rgb=hexToRgb(col);
    const g=svgEl('g',{'class':'nm-node','data-id':n.id},nodeG);

    // Outer pulse halo
    svgEl('circle',{'class':'nm-halo',cx:x,cy:y,r:r+22,
      fill:`url(#nmg-${n.id})`,opacity:'0.8'},g);
    // Dual orbit rings
    svgEl('circle',{'class':'nm-orbit',cx:x,cy:y,r:r+11,
      fill:'none',stroke:`rgba(${rgb},.18)`,'stroke-width':'0.7','stroke-dasharray':'5 7'},g);
    svgEl('circle',{'class':'nm-orbit2',cx:x,cy:y,r:r+5.5,
      fill:'none',stroke:`rgba(${rgb},.11)`,'stroke-width':'0.5','stroke-dasharray':'2 10'},g);
    // Glowing border ring
    svgEl('circle',{'class':'nm-ring',cx:x,cy:y,r:r,
      fill:'none',stroke:col,'stroke-width':'1.4',filter:'url(#nm-glow)'},g);
    // Dark core fill
    svgEl('circle',{cx:x,cy:y,r:r-.7,fill:'rgba(4,6,10,.95)'},g);
    // Inner radial gradient
    svgEl('circle',{cx:x,cy:y,r:r-.7,fill:`url(#nmg-${n.id})`},g);
    // Crosshair lines
    svgEl('line',{x1:x-r*.5,y1:y,x2:x+r*.5,y2:y,
      stroke:`rgba(${rgb},.13)`,'stroke-width':'0.6'},g);
    svgEl('line',{x1:x,y1:y-r*.5,x2:x,y2:y+r*.5,
      stroke:`rgba(${rgb},.13)`,'stroke-width':'0.6'},g);
    // Rotating scan arc
    const scanG=svgEl('g',{'class':'nm-scan'},g);
    svgEl('path',{d:arc(x,y,r*.66,-50,160),fill:'none',stroke:col,
      'stroke-width':'0.9','stroke-linecap':'round',opacity:'0.5',
      'stroke-dasharray':`${r*.6} ${r*.2} ${r*.15} ${r*.8}`},scanG);
    // Center dot (pulsing)
    svgEl('circle',{'class':'nm-dot',cx:x,cy:y,r:'2.8',fill:col,
      filter:'url(#nm-glow-sm)'},g);
    // Online status pip (blinking)
    svgEl('circle',{'class':'nm-pip',cx:x+r*.78,cy:y-r*.78,r:'2.1',
      fill:'#00ff88',filter:'url(#nm-glow-sm)'},g);
    // Node label
    const lbl=svgEl('text',{'class':'nm-label',x:x,y:y+r+12,
      'text-anchor':'middle','dominant-baseline':'hanging',
      'font-family':"'JetBrains Mono',monospace",'font-size':Math.max(8,Math.min(10,r*.42)),
      fill:col,'letter-spacing':'1.5',opacity:'0.85',filter:'url(#nm-glow-sm)'},g);
    lbl.textContent=n.label;

    nodeEls[n.id]=g;

    g.addEventListener('mouseenter',()=>{
      g.querySelector('.nm-ring').setAttribute('filter','url(#nm-glow-strong)');
      g.querySelector('.nm-ring').setAttribute('stroke-width','2.4');
      g.querySelector('.nm-halo').setAttribute('opacity','1');
      g.querySelector('.nm-label').setAttribute('opacity','1');
      Object.values(edgeEls).forEach(e=>{
        const connected=e.eg.dataset.a===n.id||e.eg.dataset.b===n.id;
        e.el2.setAttribute('stroke-width',connected?'2.2':'1.1');
        e.el1.setAttribute('stroke',connected?`rgba(${e.rgb},.18)`:`rgba(${e.rgb},.06)`);
      });
    });
    g.addEventListener('mouseleave',()=>{
      g.querySelector('.nm-ring').setAttribute('filter','url(#nm-glow)');
      g.querySelector('.nm-ring').setAttribute('stroke-width','1.4');
      g.querySelector('.nm-halo').setAttribute('opacity','0.8');
      g.querySelector('.nm-label').setAttribute('opacity','0.85');
      Object.values(edgeEls).forEach(e=>{
        e.el2.setAttribute('stroke-width','1.1');
        e.el1.setAttribute('stroke',`rgba(${e.rgb},.06)`);
      });
    });
    g.addEventListener('click',ev=>{
      ev.stopPropagation();
      const bnd=svg.getBoundingClientRect();
      const scaleX=bnd.width/VW,scaleY=bnd.height/VH;
      const screenX=bnd.left+x*scaleX,screenY=bnd.top+y*scaleY;
      const px=Math.min(screenX+r*scaleX+18,window.innerWidth-300);
      const py=Math.max(screenY-70,8);
      ni.style.left=px+'px';ni.style.top=py+'px';ni.style.display='block';
      ni.innerHTML=`<div class="ninfo-hdr"><span>◉ NODE::${n.id.toUpperCase()}</span><span class="ninfo-x" onclick="document.getElementById('ninfo').style.display='none'">✕</span></div><div class="ninfo-body"><span class="ninfo-lbl">LABEL </span> ${n.label}<br><span class="ninfo-lbl">STATUS</span> <span style="color:#00ff88">ONLINE</span><br><br><span class="ninfo-lbl">INFO  </span><br>${n.info||'—'}</div>`;
      clearTimeout(ni._t);ni._t=setTimeout(()=>ni.style.display='none',7000);
    });
  });

  // ─ Animated packets (RAF) ──────────────────
  const pktG=svgEl('g',{'class':'nm-pkts'},svg);
  const pkts=[];
  EDGES.forEach(([a,b])=>{
    const na=nn(a),nb=nn(b);
    if(!na||!nb)return;
    const isRed=nb.id==='fw'||nb.id==='sec'||nb.id==='kali';
    const col=isRed?'#ff3b3b':'#00d4ff';
    for(let i=0;i<2;i++){
      const trail=Array.from({length:3},()=>
        svgEl('circle',{r:'1.3',fill:col,opacity:'0','class':'nm-pkt'},pktG));
      pkts.push({
        a:na,b:nb,t:i*.5+Math.random()*.2,
        spd:.0005+Math.random()*.0009,col,
        el:svgEl('circle',{r:'2.4',fill:col,opacity:'0.9','class':'nm-pkt',
          filter:'url(#nm-glow-sm)'},pktG),
        trail,
      });
    }
  });

  (function raf(){
    pkts.forEach(p=>{
      p.t+=p.spd;if(p.t>=1)p.t=0;
      const{a,b,el,trail}=p;
      const px=a.x+(b.x-a.x)*p.t,py=a.y+(b.y-a.y)*p.t;
      el.setAttribute('cx',px.toFixed(1));el.setAttribute('cy',py.toFixed(1));
      trail.forEach((tr,i)=>{
        const tt=Math.max(0,p.t-(i+1)*.02);
        tr.setAttribute('cx',(a.x+(b.x-a.x)*tt).toFixed(1));
        tr.setAttribute('cy',(a.y+(b.y-a.y)*tt).toFixed(1));
        tr.setAttribute('opacity',(.5-(i*.15)).toFixed(2));
        tr.setAttribute('r',(1.4-i*.28).toFixed(1));
      });
    });
    requestAnimationFrame(raf);
  })();
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
  window._bindCursorHover?.(); // re-bind after dynamic content is rendered
}
