// Network map SVG — cyber ops dashboard redesign
export function initNetMap(svg, networkData, setNodeInfo) {
  if (!svg) return () => {}
  const NS  = 'http://www.w3.org/2000/svg'
  const VW  = 920, VH = 610
  const NW  = networkData || { nodes: [] }

  function svgEl(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag)
    Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k,v))
    if (parent) parent.appendChild(e)
    return e
  }

  // ── LAYOUT — router is visual center, wide spread ─────────
  const LAYOUT = {
    inet:   { x:460, y:40,  r:24 },
    fw:     { x:460, y:145, r:30 },
    router: { x:460, y:290, r:42 },
    dev:    { x:110, y:430, r:29 },
    sec:    { x:460, y:430, r:29 },
    devops: { x:810, y:430, r:29 },
    db:     { x:30,  y:565, r:20 },
    kali:   { x:365, y:565, r:20 },
    k8s:    { x:670, y:565, r:20 },
    mon:    { x:890, y:565, r:20 },
  }

  const EDGES = [
    ['inet','fw'], ['fw','router'],
    ['router','dev'], ['router','sec'], ['router','devops'],
    ['dev','db'], ['sec','kali'], ['devops','k8s'], ['devops','mon'], ['k8s','mon'],
  ]

  const nodes = NW.nodes.filter(nd => LAYOUT[nd.id]).map(nd => ({...nd,...LAYOUT[nd.id]}))
  const nn    = id => nodes.find(n => n.id === id)

  function hexToRgb(h) {
    if (!h || h.length < 7) return '128,128,128'
    return `${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)}`
  }
  function arcPath(cx, cy, r, sDeg, eDeg) {
    const s = sDeg*Math.PI/180, e = eDeg*Math.PI/180
    const lg = eDeg - sDeg > 180 ? 1 : 0
    return `M${(cx+r*Math.cos(s)).toFixed(2)},${(cy+r*Math.sin(s)).toFixed(2)} A${r},${r},0,${lg},1,${(cx+r*Math.cos(e)).toFixed(2)},${(cy+r*Math.sin(e)).toFixed(2)}`
  }

  // ── DEFS ──────────────────────────────────────────────────
  while (svg.firstChild) svg.removeChild(svg.firstChild)
  const defs = svgEl('defs', {}, svg)

  function makeGlow(id, blur, x='-60%', y='-60%', w='220%', h='220%') {
    const f  = svgEl('filter', {id, x, y, width:w, height:h}, defs)
    const fm = svgEl('feMerge', {}, f)
    svgEl('feGaussianBlur', {in:'SourceGraphic', stdDeviation:blur, result:'blur'}, f)
    svgEl('feMergeNode', {in:'blur'}, fm)
    svgEl('feMergeNode', {in:'SourceGraphic'}, fm)
  }
  makeGlow('nm-glow',        '4',   '-60%', '-60%', '220%','220%')
  makeGlow('nm-glow-sm',     '2',   '-40%', '-40%', '180%','180%')
  makeGlow('nm-glow-strong', '9',   '-80%', '-80%', '260%','260%')
  makeGlow('nm-glow-pkt',    '3.5', '-100%','-100%','300%','300%')

  nodes.forEach(n => {
    const g = svgEl('radialGradient', {id:`nmg-${n.id}`, cx:'50%', cy:'50%', r:'50%'}, defs)
    svgEl('stop', {offset:'0%',   'stop-color':n.col, 'stop-opacity':'0.5' }, g)
    svgEl('stop', {offset:'55%',  'stop-color':n.col, 'stop-opacity':'0.16'}, g)
    svgEl('stop', {offset:'100%', 'stop-color':n.col, 'stop-opacity':'0'   }, g)
  })
  EDGES.forEach(([a,b]) => {
    const na=nn(a), nb=nn(b); if (!na||!nb) return
    const col = (nb.id==='fw'||nb.id==='sec'||nb.id==='kali') ? '#ff3b3b' : '#00d4ff'
    const lg = svgEl('linearGradient', {id:`nml-${a}-${b}`,
      x1:`${na.x}`,y1:`${na.y}`,x2:`${nb.x}`,y2:`${nb.y}`,
      gradientUnits:'userSpaceOnUse'}, defs)
    svgEl('stop', {offset:'0%',   'stop-color':col, 'stop-opacity':'0.0'}, lg)
    svgEl('stop', {offset:'50%',  'stop-color':col, 'stop-opacity':'0.9'}, lg)
    svgEl('stop', {offset:'100%', 'stop-color':col, 'stop-opacity':'0.0'}, lg)
  })

  // ── BACKGROUND GRID ───────────────────────────────────────
  const gridG = svgEl('g', {'class':'nm-grid'}, svg)
  for (let gx=0; gx<=VW; gx+=46)
    svgEl('line', {x1:gx,y1:0,x2:gx,y2:VH, stroke:'rgba(0,255,136,0.025)','stroke-width':'0.5'}, gridG)
  for (let gy=0; gy<=VH; gy+=46)
    svgEl('line', {x1:0,y1:gy,x2:VW,y2:gy, stroke:'rgba(0,255,136,0.025)','stroke-width':'0.5'}, gridG)
  for (let gx=46; gx<VW; gx+=92)
    for (let gy=46; gy<VH; gy+=92)
      svgEl('circle', {cx:gx,cy:gy,r:'0.9', fill:'rgba(0,255,136,0.06)'}, gridG)
  for (let gx=184; gx<VW; gx+=184)
    for (let gy=138; gy<VH; gy+=138) {
      svgEl('line', {x1:gx-7,y1:gy,x2:gx+7,y2:gy, stroke:'rgba(0,212,255,0.07)','stroke-width':'0.7'}, gridG)
      svgEl('line', {x1:gx,y1:gy-7,x2:gx,y2:gy+7, stroke:'rgba(0,212,255,0.07)','stroke-width':'0.7'}, gridG)
    }

  // ── EDGES ─────────────────────────────────────────────────
  const edgeG   = svgEl('g', {'class':'nm-edges'}, svg)
  const edgeEls = {}

  EDGES.forEach(([a,b]) => {
    const na=nn(a), nb=nn(b); if (!na||!nb) return
    const isRed = nb.id==='fw'||nb.id==='sec'||nb.id==='kali'
    const col   = isRed ? '#ff3b3b' : '#00d4ff'
    const rgb   = hexToRgb(col)
    const dx=nb.x-na.x, dy=nb.y-na.y, len=Math.hypot(dx,dy)
    const ux=dx/len, uy=dy/len, px=-uy, py=ux

    const eg = svgEl('g', {'class':'nm-edge-g','data-a':a,'data-b':b}, edgeG)

    // Layer 1: wide soft bloom base
    const el1 = svgEl('line', {x1:na.x,y1:na.y,x2:nb.x,y2:nb.y,
      stroke:`rgba(${rgb},.04)`, 'stroke-width':'12','stroke-linecap':'round'}, eg)

    // Layer 2: dim base line
    svgEl('line', {x1:na.x,y1:na.y,x2:nb.x,y2:nb.y,
      stroke:`rgba(${rgb},.18)`, 'stroke-width':'1.1','stroke-linecap':'round'}, eg)

    // Layer 3: animated data stream (dash-offset driven in RAF)
    const dash = 22, gap = Math.max(len - dash, 6)
    const el2 = svgEl('line', {x1:na.x,y1:na.y,x2:nb.x,y2:nb.y,
      stroke:`url(#nml-${a}-${b})`, 'stroke-width':'2.5',
      'stroke-linecap':'round',
      'stroke-dasharray':`${dash} ${gap}`,
      'stroke-dashoffset':'0',
      filter:'url(#nm-glow-sm)'}, eg)

    // Layer 4: tick marks
    ;[0.25, 0.5, 0.75].forEach(t => {
      const tx=na.x+dx*t, ty=na.y+dy*t
      svgEl('line', {x1:tx-px*5,y1:ty-py*5,x2:tx+px*5,y2:ty+py*5,
        stroke:`rgba(${rgb},.25)`, 'stroke-width':'0.7'}, eg)
    })

    edgeEls[`${a}-${b}`] = {el1, el2, col, rgb, eg, len, isRed,
      dashSpd: isRed ? 0.9 : 0.6,
      offset:  -Math.random()*len }
  })

  // ── NODES ─────────────────────────────────────────────────
  const nodeG = svgEl('g', {'class':'nm-nodes'}, svg)

  nodes.forEach(n => {
    const {x,y,r,col} = n
    const rgb      = hexToRgb(col)
    const isRouter = n.id === 'router'
    const isBranch = ['dev','sec','devops','fw'].includes(n.id)

    const g = svgEl('g', {'class':'nm-node','data-id':n.id}, nodeG)

    // Outermost ambient halo
    svgEl('circle', {'class':'nm-halo', cx:x,cy:y,r:r+30,
      fill:`url(#nmg-${n.id})`, opacity:'0.9'}, g)

    // Router — extra wide ring
    if (isRouter) {
      svgEl('circle', {'class':'nm-orbit-wide', cx:x,cy:y,r:r+24,
        fill:'none', stroke:`rgba(${rgb},.10)`, 'stroke-width':'1',
        'stroke-dasharray':'5 9'}, g)
    }

    // Outer dashed orbit
    svgEl('circle', {'class':'nm-orbit', cx:x,cy:y,r:r+15,
      fill:'none', stroke:`rgba(${rgb},.26)`, 'stroke-width':'0.9',
      'stroke-dasharray':'7 8'}, g)

    // Inner dashed orbit
    svgEl('circle', {'class':'nm-orbit2', cx:x,cy:y,r:r+7,
      fill:'none', stroke:`rgba(${rgb},.16)`, 'stroke-width':'0.6',
      'stroke-dasharray':'3 10'}, g)

    // Scan arc
    if (isRouter || isBranch) {
      const scanG = svgEl('g', {'class':'nm-scan'}, g)
      const sr = r * 0.68
      svgEl('path', {d:arcPath(x,y,sr,-60,155),
        fill:'none', stroke:col,
        'stroke-width': isRouter ? '1.4' : '1.0',
        'stroke-linecap':'round', opacity:'0.55',
        'stroke-dasharray':`${sr*.8} ${sr*.25} ${sr*.18} ${sr*1.4}`}, scanG)
    }

    // Main glowing ring
    svgEl('circle', {'class':'nm-ring', cx:x,cy:y,r:r,
      fill:'none', stroke:col,
      'stroke-width': isRouter?'2.2':isBranch?'1.7':'1.4',
      filter:'url(#nm-glow)'}, g)

    // Dark fill + inner gradient
    svgEl('circle', {cx:x,cy:y,r:r-0.8, fill:'rgba(3,6,11,.97)'}, g)
    svgEl('circle', {cx:x,cy:y,r:r-0.8, fill:`url(#nmg-${n.id})`}, g)

    // Detail rings
    if (isRouter) {
      svgEl('circle', {cx:x,cy:y,r:r*.58, fill:'none', stroke:`rgba(${rgb},.32)`,'stroke-width':'1.1'}, g)
      svgEl('circle', {cx:x,cy:y,r:r*.32, fill:'none', stroke:`rgba(${rgb},.18)`,'stroke-width':'0.7'}, g)
    } else if (isBranch) {
      svgEl('circle', {cx:x,cy:y,r:r*.52, fill:'none', stroke:`rgba(${rgb},.22)`,'stroke-width':'0.8'}, g)
    }

    // Crosshair
    const cl = r * 0.54
    svgEl('line', {x1:x-cl,y1:y,x2:x+cl,y2:y, stroke:`rgba(${rgb},.2)`,'stroke-width':'0.7'}, g)
    svgEl('line', {x1:x,y1:y-cl,x2:x,y2:y+cl, stroke:`rgba(${rgb},.2)`,'stroke-width':'0.7'}, g)

    // Corner brackets (router + branch)
    if (isRouter || isBranch) {
      const br=r*.72, bl=r*.22, bop='0.35'
      ;[[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([sx,sy]) => {
        svgEl('line', {x1:x+sx*br,y1:y+sy*br,x2:x+sx*(br-bl),y2:y+sy*br,
          stroke:`rgba(${rgb},${bop})`,'stroke-width':'1.2'}, g)
        svgEl('line', {x1:x+sx*br,y1:y+sy*br,x2:x+sx*br,y2:y+sy*(br-bl),
          stroke:`rgba(${rgb},${bop})`,'stroke-width':'1.2'}, g)
      })
    }

    // Core dot + white center
    svgEl('circle', {'class':'nm-dot', cx:x,cy:y,r:isRouter?4.5:3,
      fill:col, filter:'url(#nm-glow-sm)'}, g)
    svgEl('circle', {cx:x,cy:y,r:isRouter?2.2:1.5, fill:'#ffffff'}, g)

    // Status pip
    svgEl('circle', {'class':'nm-pip', cx:x+r*.78,cy:y-r*.78,r:'2.3',
      fill:'#00ff88', filter:'url(#nm-glow-sm)'}, g)

    // Label
    const lbl = svgEl('text', {'class':'nm-label', x:x, y:y+r+13,
      'text-anchor':'middle', 'dominant-baseline':'hanging',
      'font-family':"'JetBrains Mono',monospace",
      'font-size': Math.max(9, Math.min(11, r*0.46)),
      fill:col, 'letter-spacing':'2', opacity:'0.92'}, g)
    lbl.textContent = n.label

    g.addEventListener('mouseenter', () => {
      g.querySelector('.nm-ring').setAttribute('filter','url(#nm-glow-strong)')
      g.querySelector('.nm-ring').setAttribute('stroke-width', isRouter?'3.2':isBranch?'2.6':'2')
      g.querySelector('.nm-halo').setAttribute('opacity','1')
      g.querySelector('.nm-label').setAttribute('opacity','1')
      Object.values(edgeEls).forEach(e => {
        const hit = e.eg.dataset.a===n.id || e.eg.dataset.b===n.id
        e.el2.setAttribute('stroke-width', hit?'4':'2.5')
        e.el1.setAttribute('stroke', hit?`rgba(${e.rgb},.15)`:`rgba(${e.rgb},.04)`)
      })
    })
    g.addEventListener('mouseleave', () => {
      g.querySelector('.nm-ring').setAttribute('filter','url(#nm-glow)')
      g.querySelector('.nm-ring').setAttribute('stroke-width', isRouter?'2.2':isBranch?'1.7':'1.4')
      g.querySelector('.nm-halo').setAttribute('opacity','0.9')
      g.querySelector('.nm-label').setAttribute('opacity','0.92')
      Object.values(edgeEls).forEach(e => {
        e.el2.setAttribute('stroke-width','2.5')
        e.el1.setAttribute('stroke',`rgba(${e.rgb},.04)`)
      })
    })
    g.addEventListener('click', ev => {
      ev.stopPropagation()
      const bnd    = svg.getBoundingClientRect()
      const scaleX = bnd.width/VW, scaleY = bnd.height/VH
      const screenX = bnd.left + x*scaleX, screenY = bnd.top + y*scaleY
      const px = Math.min(screenX + r*scaleX + 20, window.innerWidth - 300)
      const py = Math.max(screenY - 70, 8)
      setNodeInfo({ visible:true, x:px, y:py, node:n })
    })
  })

  // ── PACKETS ───────────────────────────────────────────────
  const pktG = svgEl('g', {'class':'nm-pkts'}, svg)
  const pkts = []

  EDGES.forEach(([a,b]) => {
    const na=nn(a), nb=nn(b); if (!na||!nb) return
    const isRed   = nb.id==='fw'||nb.id==='sec'||nb.id==='kali'
    const col     = isRed ? '#ff3b3b' : '#00d4ff'
    const isTrunk = ['router','fw','inet'].includes(a) || ['router','fw','inet'].includes(b)
    const count   = isTrunk ? 3 : 2

    for (let i=0; i<count; i++) {
      const trail = Array.from({length:6}, () =>
        svgEl('circle', {r:'1.2', fill:col, opacity:'0', 'class':'nm-pkt'}, pktG))
      pkts.push({
        a:na, b:nb,
        t:   (i/count) + Math.random()*0.12,
        spd: 0.00045 + Math.random()*0.00065,
        col,
        el:  svgEl('circle', {r:'3', fill:col, opacity:'0.92',
               'class':'nm-pkt', filter:'url(#nm-glow-pkt)'}, pktG),
        trail,
      })
    }
  })

  // ── BROADCAST RINGS from router ────────────────────────────
  const routerNode = nn('router')
  const broadcasts = routerNode ? Array.from({length:4}, (_,i) => ({
    el: svgEl('circle', {cx:routerNode.x, cy:routerNode.y,
      r:`${routerNode.r+8}`, fill:'none',
      stroke:'rgba(0,212,255,0.55)', 'stroke-width':'1.8',
      opacity:'0', 'class':'nm-broadcast'}, pktG),
    phase: i / 4,
  })) : []

  // ── RAF LOOP ──────────────────────────────────────────────
  let tick = 0, rafId

  ;(function loop() {
    tick += 0.013

    // Animate edge data streams via dash offset
    Object.values(edgeEls).forEach(e => {
      e.offset -= e.dashSpd
      e.el2.setAttribute('stroke-dashoffset', e.offset.toFixed(2))
    })

    // Animate packets + trails
    pkts.forEach(p => {
      p.t += p.spd
      if (p.t >= 1) p.t = 0
      const {a,b,el,trail} = p
      const px = a.x + (b.x-a.x)*p.t
      const py = a.y + (b.y-a.y)*p.t
      el.setAttribute('cx', px.toFixed(1))
      el.setAttribute('cy', py.toFixed(1))
      trail.forEach((tr,i) => {
        const tt = Math.max(0, p.t - (i+1)*0.016)
        tr.setAttribute('cx', (a.x+(b.x-a.x)*tt).toFixed(1))
        tr.setAttribute('cy', (a.y+(b.y-a.y)*tt).toFixed(1))
        tr.setAttribute('opacity', (0.6 - i*0.09).toFixed(2))
        tr.setAttribute('r',       (1.8 - i*0.24).toFixed(1))
      })
    })

    // Broadcast rings expanding from router
    if (routerNode) {
      broadcasts.forEach(ring => {
        const phase = (tick/3.2 + ring.phase) % 1
        const rMin  = routerNode.r + 8, rMax = routerNode.r + 90
        const alpha = phase < 0.7 ? (1 - phase/0.7)*0.4 : 0
        ring.el.setAttribute('r',       (rMin + (rMax-rMin)*phase).toFixed(1))
        ring.el.setAttribute('opacity', alpha.toFixed(3))
      })
    }

    rafId = requestAnimationFrame(loop)
  })()

  return () => cancelAnimationFrame(rafId)
}

