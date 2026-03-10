// Radar chart canvas — accepts canvas element and data getter function
// Pass getData as a function so it reads live GRIM_DATA each frame
export function initRadar(canvas, getData) {
  if (!canvas) return () => {}
  const ctx = canvas.getContext('2d')

  let progress = 0, scanAngle = 0, animating = false
  let pulseT = 0, dashOffset = 0

  function buildCats() {
    const skills = getData()
    return skills.map(cat => ({
      label: cat.category.replace(/_/g, ' ').toUpperCase(),
      value: 0.9,
      color: cat.type === 'red' ? '#ff3b3b'
           : (cat.category === 'devops' || cat.category === 'web_stack') ? '#00d4ff'
           : '#00ff88',
    }))
  }

  let CATS = buildCats()
  let N = CATS.length
  const ang = i => (Math.PI*2*i/N) - Math.PI/2

  function makeParticles() {
    return Array.from({ length: 3 }, (_, k) => ({ t: k/3, spd: 0.004 + Math.random()*0.003 }))
  }
  let particles = CATS.map(makeParticles)

  function draw() {
    const fresh = buildCats()
    if (fresh.length !== N) {
      CATS = fresh; N = fresh.length
      particles = CATS.map(makeParticles)
      progress = 0
    } else {
      CATS = fresh
    }

    const S = canvas.width, cx = S/2, cy = S/2

    ctx.font = 'bold 9px Syne,sans-serif'
    const maxLW = Math.max(...CATS.map(c => ctx.measureText(c.label).width))
    const labelGap = 10, labelPad = 6, labelH = 15
    const maxR = S/2 - labelGap - maxLW/2 - labelPad - 4
    const R = Math.min(S*0.28, maxR)

    ctx.clearRect(0, 0, S, S)

    // rings
    ;[.25,.5,.75,1].forEach((r, ri) => {
      ctx.beginPath()
      CATS.forEach((_, i) => {
        const a = ang(i), x = cx+Math.cos(a)*R*r, y = cy+Math.sin(a)*R*r
        i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
      })
      ctx.closePath()
      if (ri===3) {
        ctx.setLineDash([5,5]); ctx.lineDashOffset = -dashOffset*0.4
        ctx.strokeStyle = 'rgba(0,255,136,.28)'; ctx.lineWidth = 1
      } else {
        ctx.setLineDash([]); ctx.strokeStyle = `rgba(0,255,136,${.05+ri*.05})`; ctx.lineWidth = .8
      }
      ctx.stroke(); ctx.setLineDash([]); ctx.lineDashOffset = 0
      ctx.fillStyle = 'rgba(0,255,136,.28)'; ctx.font = '8px JetBrains Mono,monospace'
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
      ctx.fillText(Math.round(r*100)+'%', cx, cy-R*r-3)
    })

    // spokes + particles
    CATS.forEach((c, i) => {
      const a = ang(i), ex = cx+Math.cos(a)*R, ey = cy+Math.sin(a)*R
      const grd = ctx.createLinearGradient(cx,cy,ex,ey)
      grd.addColorStop(0,'rgba(0,0,0,0)'); grd.addColorStop(1,c.color+'44')
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(ex,ey)
      ctx.strokeStyle = grd; ctx.lineWidth = 1; ctx.stroke()

      if (particles[i]) particles[i].forEach(p => {
        p.t += p.spd; if (p.t > 1) { p.t = 0; p.spd = 0.003+Math.random()*0.004 }
        const px = cx+Math.cos(a)*R*p.t, py = cy+Math.sin(a)*R*p.t
        const alpha = Math.sin(p.t*Math.PI)*0.7
        ctx.beginPath(); ctx.arc(px,py,1.4,0,Math.PI*2)
        ctx.fillStyle = c.color.replace(')',`,${alpha})`).replace('rgb','rgba')
        ctx.shadowBlur = 6; ctx.shadowColor = c.color; ctx.fill(); ctx.shadowBlur = 0
      })
    })

    // scan sweep
    ctx.save()
    for (let layer=0;layer<2;layer++) {
      const arcW = layer===0?0.7:0.25, opacity = layer===0?0.06:0.13
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,R,scanAngle,scanAngle+arcW); ctx.closePath()
      const sweep = ctx.createRadialGradient(cx,cy,0,cx,cy,R)
      sweep.addColorStop(0,`rgba(0,255,136,0)`)
      sweep.addColorStop(0.5,`rgba(0,255,136,${opacity})`)
      sweep.addColorStop(1,`rgba(0,255,136,${opacity*1.6})`)
      ctx.fillStyle = sweep; ctx.fill()
    }
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(scanAngle)*R, cy+Math.sin(scanAngle)*R)
    ctx.strokeStyle = 'rgba(0,255,136,.55)'; ctx.lineWidth = 1.2
    ctx.shadowBlur = 8; ctx.shadowColor = '#00ff88'; ctx.stroke(); ctx.shadowBlur = 0
    ctx.restore()

    // data polygon
    const p = Math.min(progress, 1)
    const breathe = i => 1 + Math.sin(pulseT*0.8+i*1.3)*0.012

    // blur glow
    ctx.save(); ctx.filter = 'blur(6px)'
    ctx.beginPath()
    CATS.forEach((c,i) => {
      const a=ang(i), bv=c.value*p*breathe(i)
      i===0 ? ctx.moveTo(cx+Math.cos(a)*R*bv, cy+Math.sin(a)*R*bv)
             : ctx.lineTo(cx+Math.cos(a)*R*bv, cy+Math.sin(a)*R*bv)
    })
    ctx.closePath(); ctx.strokeStyle = 'rgba(0,212,255,.5)'; ctx.lineWidth = 4; ctx.stroke()
    ctx.restore()

    // main polygon
    ctx.beginPath()
    CATS.forEach((c,i) => {
      const a=ang(i), bv=c.value*p*breathe(i)
      i===0 ? ctx.moveTo(cx+Math.cos(a)*R*bv, cy+Math.sin(a)*R*bv)
             : ctx.lineTo(cx+Math.cos(a)*R*bv, cy+Math.sin(a)*R*bv)
    })
    ctx.closePath()
    const hShift = Math.sin(pulseT*0.3)*0.08
    const fill = ctx.createRadialGradient(cx,cy,0,cx,cy,R)
    fill.addColorStop(0,`rgba(${Math.round(hShift*60)},212,255,.28)`)
    fill.addColorStop(0.5,'rgba(0,255,136,.16)'); fill.addColorStop(1,'rgba(0,255,136,.04)')
    ctx.fillStyle = fill; ctx.fill()
    ctx.setLineDash([8,4]); ctx.lineDashOffset = -dashOffset
    ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 1.8
    ctx.shadowBlur = 14; ctx.shadowColor = '#00d4ff'; ctx.stroke()
    ctx.shadowBlur = 0; ctx.setLineDash([]); ctx.lineDashOffset = 0

    // nodes
    CATS.forEach((c,i) => {
      const a=ang(i), bv=c.value*p*breathe(i)
      const nx=cx+Math.cos(a)*R*bv, ny=cy+Math.sin(a)*R*bv
      const pr=(Math.sin(pulseT+i*1.2)*0.5+0.5)*14+4
      ctx.beginPath(); ctx.arc(nx,ny,pr,0,Math.PI*2)
      ctx.strokeStyle = c.color+(Math.round((Math.sin(pulseT+i)*0.2+0.15)*255).toString(16).padStart(2,'0'))
      ctx.lineWidth = 1; ctx.stroke()
      ctx.beginPath(); ctx.arc(nx,ny,5,0,Math.PI*2)
      ctx.fillStyle = c.color; ctx.shadowBlur = 18; ctx.shadowColor = c.color; ctx.fill(); ctx.shadowBlur = 0
      ctx.beginPath(); ctx.arc(nx,ny,2,0,Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill()
    })

    // labels
    ctx.font = 'bold 9px Syne,sans-serif'
    CATS.forEach((c,i) => {
      const a = ang(i)
      const lx = cx+Math.cos(a)*(R+labelGap), ly = cy+Math.sin(a)*(R+labelGap)
      const txt = c.label, tw = ctx.measureText(txt).width
      const bw = tw + labelPad*2
      let bx2 = lx < cx-4 ? lx-bw : lx > cx+4 ? lx : lx-bw/2
      let by = ly < cy-4 ? ly-labelH : ly > cy+4 ? ly : ly-labelH/2
      bx2 = Math.max(2, Math.min(bx2, S-bw-2)); by = Math.max(2, Math.min(by, S-labelH-2))
      ctx.fillStyle = 'rgba(6,10,6,.88)'; ctx.strokeStyle = c.color+'66'; ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect ? ctx.roundRect(bx2,by,bw,labelH,2) : ctx.rect(bx2,by,bw,labelH)
      ctx.fill(); ctx.stroke()
      ctx.fillStyle = c.color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.shadowBlur = 5; ctx.shadowColor = c.color
      ctx.fillText(txt, bx2+bw/2, by+labelH/2); ctx.shadowBlur = 0
    })

    scanAngle += 0.010; pulseT += 0.035; dashOffset += 0.3
    if (progress < 1) progress += 0.014
    if (animating) requestAnimationFrame(draw)
  }

  function start() { if (!animating) { animating = true; draw() } }
  function stop()  { animating = false }
  function resize() {
    const wrap = canvas.parentElement
    const W = Math.min(wrap ? wrap.offsetWidth : 400, 400)
    canvas.width = W; canvas.height = W
  }
  resize()
  window.addEventListener('resize', resize)

  return { start, stop, cleanup: () => window.removeEventListener('resize', resize) }
}
