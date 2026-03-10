// Boot globe canvas — accepts { canvas, bootRightEl, data, onComplete }
export function initBootGlobe(canvas, bootRightEl, data) {
  if (!canvas || !bootRightEl) return () => {}
  const bx = canvas.getContext('2d')
  let rafId

  function resizeCanvas() {
    canvas.width  = bootRightEl.offsetWidth  || window.innerWidth / 2
    canvas.height = bootRightEl.offsetHeight || window.innerHeight
    canvas.style.position = 'absolute'
    canvas.style.top = '0'; canvas.style.left = '0'
    canvas.style.width = '100%'; canvas.style.height = '100%'
  }
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  function getCenter() {
    return { cx: canvas.width/2, cy: canvas.height/2, R: Math.min(canvas.width, canvas.height) * 0.42 }
  }
  let globeAngle = 0

  const CONTINENTS=[
    [[71,-142],[70,-130],[60,-130],[55,-132],[50,-125],[48,-124],[35,-120],[30,-117],[22,-110],[20,-105],[16,-92],[15,-85],[10,-85],[8,-77],[9,-78],[10,-75],[12,-72],[11,-63],[14,-62],[18,-66],[20,-72],[25,-77],[30,-80],[35,-76],[37,-76],[41,-71],[43,-70],[45,-64],[47,-54],[50,-56],[52,-56],[55,-60],[58,-64],[62,-64],[65,-64],[68,-64],[70,-68],[72,-78],[71,-85],[70,-90],[68,-97],[68,-105],[70,-110],[71,-120],[71,-130],[71,-142]],
    [[12,-72],[10,-62],[8,-60],[5,-52],[2,-50],[0,-50],[-5,-35],[-10,-37],[-15,-39],[-20,-40],[-25,-48],[-30,-51],[-35,-57],[-38,-57],[-40,-62],[-42,-64],[-45,-65],[-48,-66],[-52,-68],[-55,-68],[-55,-65],[-50,-68],[-45,-65],[-40,-60],[-35,-56],[-28,-48],[-22,-43],[-15,-39],[-10,-37],[-5,-35],[0,-50],[5,-52],[8,-60],[10,-62],[12,-72]],
    [[71,28],[70,20],[68,14],[65,14],[63,8],[60,5],[58,5],[55,8],[54,9],[52,5],[50,2],[48,-2],[46,-2],[43,-8],[36,-6],[36,0],[38,2],[40,3],[42,3],[44,8],[44,12],[45,13],[45,14],[46,15],[47,16],[48,17],[49,18],[50,19],[52,20],[54,19],[55,21],[57,21],[59,22],[60,24],[62,24],[64,26],[66,28],[68,28],[71,28]],
    [[37,10],[30,32],[22,37],[15,42],[12,43],[10,42],[8,38],[5,35],[0,42],[-5,40],[-10,40],[-20,35],[-26,33],[-34,26],[-35,20],[-32,18],[-28,16],[-22,14],[-18,12],[-10,14],[-5,10],[0,9],[5,2],[5,-5],[10,-15],[14,-17],[16,-16],[14,-12],[10,-8],[5,-4],[2,9],[5,10],[8,14],[12,14],[16,12],[20,16],[22,18],[24,24],[26,32],[30,32],[37,10]],
    [[70,130],[68,140],[65,142],[60,140],[55,132],[52,142],[48,138],[44,132],[40,128],[36,120],[30,122],[24,118],[22,114],[20,110],[18,108],[15,105],[12,109],[10,104],[5,103],[1,104],[-1,110],[5,118],[10,122],[15,120],[20,120],[25,121],[30,120],[35,120],[40,125],[44,130],[48,135],[52,140],[55,132],[60,130],[65,130],[70,130]],
    [[70,130],[68,100],[65,88],[62,75],[58,60],[55,50],[52,40],[48,38],[44,38],[40,36],[37,36],[35,32],[30,32],[26,50],[22,58],[18,54],[14,44],[10,44],[10,38],[15,42],[22,37],[30,32],[36,36],[40,36],[44,38],[48,38],[52,40],[55,50],[58,60],[62,72],[65,80],[68,88],[70,100],[70,130]],
    [[-14,135],[-18,122],[-22,114],[-28,114],[-32,116],[-35,117],[-38,145],[-38,148],[-35,150],[-32,152],[-28,154],[-24,151],[-20,148],[-18,146],[-14,135]],
    [[83,-30],[80,-18],[76,-18],[72,-22],[68,-28],[66,-38],[64,-50],[66,-52],[70,-52],[74,-52],[78,-56],[80,-44],[82,-36],[83,-30]],
  ]

  const CITIES=[
    {name:'NYC',lat:40.7,lng:-74.0,hot:true},{name:'LONDON',lat:51.5,lng:-0.1,hot:true},
    {name:'MOSCOW',lat:55.7,lng:37.6,hot:true},{name:'TOKYO',lat:35.7,lng:139.7,hot:true},
    {name:'BEIJING',lat:39.9,lng:116.4,hot:false},{name:'MUMBAI',lat:19.1,lng:72.9,hot:false},
    {name:'DUBAI',lat:25.2,lng:55.3,hot:false},{name:'SYDNEY',lat:-33.9,lng:151.2,hot:false},
    {name:'SAO',lat:-23.5,lng:-46.6,hot:false},{name:'LAGOS',lat:6.5,lng:3.4,hot:false},
    {name:'PARIS',lat:48.9,lng:2.3,hot:false},{name:'BERLIN',lat:52.5,lng:13.4,hot:false},
    {name:'SEOUL',lat:37.6,lng:127.0,hot:false},{name:'CHICAGO',lat:41.9,lng:-87.6,hot:false},
    {name:'NAIROBI',lat:-1.3,lng:36.8,hot:false},{name:'SGPORE',lat:1.4,lng:103.8,hot:false},
    {name:'TORONTO',lat:43.7,lng:-79.4,hot:false},{name:'CDMX',lat:19.4,lng:-99.1,hot:false},
  ]

  const ARCS=[
    ['NYC','LONDON'],['LONDON','MOSCOW'],['MOSCOW','BEIJING'],['BEIJING','TOKYO'],
    ['NYC','SAO'],['LONDON','PARIS'],['MOSCOW','DUBAI'],['TOKYO','SEOUL'],
    ['NYC','TORONTO'],['LONDON','BERLIN'],['DUBAI','MUMBAI'],['BEIJING','SGPORE'],
    ['SYDNEY','SGPORE'],['LAGOS','LONDON'],['NAIROBI','DUBAI'],['NYC','CDMX'],
  ]
  const arcState = ARCS.map(() => ({ t: Math.random(), speed: 0.0015 + Math.random() * 0.002 }))

  function proj(latDeg, lngDeg) {
    const { cx, cy, R } = getCenter()
    const lat = latDeg*Math.PI/180, lng = lngDeg*Math.PI/180
    const x3 = R*Math.cos(lat)*Math.sin(lng+globeAngle)
    const y3 = R*Math.sin(lat)
    const z3 = R*Math.cos(lat)*Math.cos(lng+globeAngle)
    const depth = (z3/R+1)/2
    return { x: cx+x3, y: cy-y3, z: z3, depth, vis: z3 > -R*0.15 }
  }

  function drawArc(c1, c2, t) {
    const { R } = getCenter()
    const p1=proj(c1.lat,c1.lng), p2=proj(c2.lat,c2.lng)
    if (!p1.vis && !p2.vis) return
    const STEPS=40, pts=[]
    for (let i=0;i<=STEPS;i++) {
      const f=i/STEPS
      const lat=c1.lat+(c2.lat-c1.lat)*f, lng=c1.lng+(c2.lng-c1.lng)*f
      const arcH=Math.sin(f*Math.PI)*R*0.18
      const p=proj(lat,lng)
      pts.push({ x:p.x, y:p.y-(p.vis?arcH*p.depth:0), z:p.z, vis:p.vis, depth:p.depth })
    }
    bx.save()
    const trailLen=0.35, head=t%1, tail=Math.max(0,head-trailLen)
    for (let i=0;i<STEPS;i++) {
      const f=i/STEPS
      if (f<tail||f>head) continue
      const pa=pts[i], pb=pts[i+1]
      if (!pa.vis||!pb.vis) continue
      const alpha=(f-tail)/(head-tail)*Math.min(pa.depth+0.3,1)*0.8
      bx.strokeStyle=`rgba(0,212,255,${alpha})`; bx.lineWidth=1.2
      bx.beginPath(); bx.moveTo(pa.x,pa.y); bx.lineTo(pb.x,pb.y); bx.stroke()
    }
    const headIdx=Math.floor(t%1*STEPS)
    const hp=pts[Math.min(headIdx,STEPS)]
    if (hp&&hp.vis) {
      bx.fillStyle=`rgba(0,212,255,${Math.min(hp.depth+0.4,1)})`
      bx.shadowBlur=8; bx.shadowColor='#00d4ff'
      bx.beginPath(); bx.arc(hp.x,hp.y,2.5,0,Math.PI*2); bx.fill(); bx.shadowBlur=0
    }
    bx.restore()
  }

  let scanY=null, scanDir=1

  function drawGlobe() {
    const { cx, cy, R } = getCenter()
    if (scanY===null) scanY=-R
    bx.clearRect(0,0,canvas.width,canvas.height)

    const bg=bx.createRadialGradient(cx,cy,0,cx,cy,canvas.width*0.8)
    bg.addColorStop(0,'rgba(4,8,16,0)'); bg.addColorStop(0.6,'rgba(2,6,12,0)'); bg.addColorStop(1,'rgba(0,0,0,.96)')
    bx.fillStyle=bg; bx.fillRect(0,0,canvas.width,canvas.height)

    const atm=bx.createRadialGradient(cx,cy,R*0.92,cx,cy,R*1.22)
    atm.addColorStop(0,'rgba(0,212,255,.08)'); atm.addColorStop(0.4,'rgba(0,255,136,.04)'); atm.addColorStop(1,'rgba(0,0,0,0)')
    bx.fillStyle=atm; bx.beginPath(); bx.arc(cx,cy,R*1.22,0,Math.PI*2); bx.fill()

    const ocean=bx.createRadialGradient(cx-R*0.25,cy-R*0.2,R*0.05,cx,cy,R)
    ocean.addColorStop(0,'rgba(0,20,35,.95)'); ocean.addColorStop(0.5,'rgba(0,12,25,.9)'); ocean.addColorStop(1,'rgba(0,5,15,.98)')
    bx.fillStyle=ocean; bx.beginPath(); bx.arc(cx,cy,R,0,Math.PI*2); bx.fill()

    for (let lat=-75;lat<=75;lat+=15) {
      bx.beginPath(); let first=true
      for (let l=0;l<=360;l+=2) {
        const p=proj(lat,l-180); if (!p.vis){first=true;continue}
        bx.strokeStyle=`rgba(0,255,136,${0.025+p.depth*0.04})`; bx.lineWidth=0.4
        if (first){bx.moveTo(p.x,p.y);first=false}else bx.lineTo(p.x,p.y)
      }; bx.stroke()
    }
    for (let lng=-180;lng<180;lng+=15) {
      bx.beginPath(); let first=true
      for (let l=-85;l<=85;l+=2) {
        const p=proj(l,lng); if (!p.vis){first=true;continue}
        bx.strokeStyle=`rgba(0,255,136,${0.025+p.depth*0.04})`; bx.lineWidth=0.4
        if (first){bx.moveTo(p.x,p.y);first=false}else bx.lineTo(p.x,p.y)
      }; bx.stroke()
    }

    CONTINENTS.forEach(poly => {
      bx.beginPath(); let started=false
      poly.forEach(([lat,lng]) => {
        const p=proj(lat,lng)
        if (!p.vis){started=false;return}
        if (!started){bx.moveTo(p.x,p.y);started=true}else bx.lineTo(p.x,p.y)
      })
      bx.closePath(); bx.fillStyle='rgba(0,40,24,.85)'; bx.strokeStyle='rgba(0,255,136,.22)'; bx.lineWidth=0.7; bx.fill(); bx.stroke()
    })

    ARCS.forEach(([a,b],i) => {
      arcState[i].t += arcState[i].speed
      const c1=CITIES.find(c=>c.name===a), c2=CITIES.find(c=>c.name===b)
      if (c1&&c2) drawArc(c1,c2,arcState[i].t)
    })

    CITIES.forEach(city => {
      const p=proj(city.lat,city.lng)
      if (!p.vis) return
      const alpha=0.4+p.depth*0.6, col=city.hot?'#00ff88':'#00d4ff'
      const pulse=(Math.sin(Date.now()*0.003+city.lng)*0.5+0.5)*0.4
      bx.beginPath(); bx.arc(p.x,p.y,(city.hot?5:3.5)+pulse*3,0,Math.PI*2)
      bx.strokeStyle=city.hot?`rgba(0,255,136,${alpha*0.25})`:`rgba(0,212,255,${alpha*0.25})`; bx.lineWidth=0.8; bx.stroke()
      bx.fillStyle=city.hot?`rgba(0,255,136,${alpha})`:`rgba(0,212,255,${alpha*0.8})`
      bx.shadowBlur=city.hot?10:6; bx.shadowColor=col
      bx.beginPath(); bx.arc(p.x,p.y,city.hot?2.5:1.8,0,Math.PI*2); bx.fill(); bx.shadowBlur=0
      if (city.hot&&p.depth>0.5) {
        bx.fillStyle=`rgba(200,255,220,${alpha*0.7})`
        bx.font=`${Math.max(9,Math.round(R*0.045))}px 'JetBrains Mono',monospace`
        bx.textAlign='left'; bx.textBaseline='middle'; bx.fillText(city.name,p.x+6,p.y)
      }
    })

    const spec=bx.createRadialGradient(cx-R*0.4,cy-R*0.35,0,cx-R*0.4,cy-R*0.35,R*0.9)
    spec.addColorStop(0,'rgba(0,212,255,.07)'); spec.addColorStop(0.4,'rgba(0,255,136,.03)'); spec.addColorStop(1,'rgba(0,0,0,0)')
    bx.fillStyle=spec; bx.beginPath(); bx.arc(cx,cy,R,0,Math.PI*2); bx.fill()

    const term=bx.createLinearGradient(cx-R*0.1-R*0.35,cy,cx-R*0.1+R*0.1,cy)
    term.addColorStop(0,'rgba(0,0,0,0)'); term.addColorStop(1,'rgba(0,0,0,.38)')
    bx.fillStyle=term; bx.beginPath(); bx.arc(cx,cy,R,0,Math.PI*2); bx.fill()

    bx.strokeStyle='rgba(0,212,255,.35)'; bx.lineWidth=1.2
    bx.beginPath(); bx.arc(cx,cy,R,0,Math.PI*2); bx.stroke()

    scanY += scanDir*1.2; if (scanY>R) scanDir=-1; if (scanY<-R) scanDir=1
    const sy=cy+scanY, sw=Math.sqrt(Math.max(0,R*R-scanY*scanY))
    const sg=bx.createLinearGradient(cx-sw,sy,cx+sw,sy)
    sg.addColorStop(0,'rgba(0,212,255,0)'); sg.addColorStop(0.5,'rgba(0,212,255,.22)'); sg.addColorStop(1,'rgba(0,212,255,0)')
    bx.fillStyle=sg; bx.fillRect(cx-sw,sy-1,sw*2,2)

    globeAngle += 0.003
    rafId = requestAnimationFrame(drawGlobe)
  }
  drawGlobe()

  return () => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('resize', resizeCanvas)
  }
}

export function buildBootSequence(data) {
  const BOOT_DATA = data.boot || { lines: [], accessMessage: 'ACCESS GRANTED' }
  const DELAYS = [0,120,280,440,600,720,780]
  const bootLines = BOOT_DATA.lines.map((l,i) => ({ ...l, d: DELAYS[i] || (600+i*140) }))
  const last = bootLines.length ? bootLines[bootLines.length-1].d : 780
  return [
    ...bootLines,
    { t: '',                                                                   d: last+80,  c: '' },
    { t: 'Loading operator profile...',                                        d: last+160, c: '' },
    { t: `  ✔  identity   : ${data.identity.handle} / ${data.identity.realname}`, d: last+240, c: 'ok' },
    { t: '  ✔  clearance  : CLASSIFIED',                                      d: last+380, c: 'ok' },
    { t: `  ✔  platform   : ${data.identity.platform||'Arch / Kali / Debian'}`,d: last+480, c: 'ok' },
    { t: '  ✔  blackarch  : tooling active',                                  d: last+580, c: 'ok' },
    { t: '  ✔  docker     : daemon running',                                  d: last+680, c: 'ok' },
    { t: '  ✔  k8s        : cluster online',                                  d: last+780, c: 'ok' },
    { t: '  ✔  firewall   : 247 rules active',                                d: last+880, c: 'ok' },
    { t: '  ✔  encryption : AES-256 established',                             d: last+980, c: 'ok' },
    { t: '',                                                                   d: last+1060,c: '' },
    { t: `root@arch:~$ echo "${BOOT_DATA.accessMessage}"`,                    d: last+1120,c: '' },
    { t: BOOT_DATA.accessMessage,                                              d: last+1280,c: 'big' },
  ]
}
