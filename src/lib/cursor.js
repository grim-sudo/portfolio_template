// Cursor canvas — accepts the canvas element directly
export function initCursor(canvas) {
  if (window.matchMedia('(pointer: coarse)').matches) return () => {}
  if (!canvas) return () => {}
  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const C_GREEN = '#00ff88'
  const ARM = 7, GAP = 11, DOT_R = 2
  const SPIN = (2 * Math.PI) / (3.4 * 60)

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2
  let curX = mouseX, curY = mouseY
  let curHW = GAP, curHH = GAP
  let angle = 0, locked = false, lockOpacity = 0, hoverEl = null

  const onMove = e => { mouseX = e.clientX; mouseY = e.clientY }
  document.addEventListener('mousemove', onMove)

  function drawBrackets(cx, cy, hw, hh, ang, alpha, glow) {
    ctx.save()
    ctx.translate(cx, cy); ctx.rotate(ang)
    ctx.strokeStyle = C_GREEN; ctx.lineWidth = 1.5; ctx.globalAlpha = alpha
    if (glow) { ctx.shadowColor = C_GREEN; ctx.shadowBlur = 7 }
    ;[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sy]) => {
      const ox = sx*hw, oy = sy*hh
      ctx.beginPath()
      ctx.moveTo(ox + sx * -ARM, oy); ctx.lineTo(ox, oy); ctx.lineTo(ox, oy + sy * -ARM)
      ctx.stroke()
    })
    ctx.restore()
  }

  function drawDot(cx, cy, alpha) {
    if (alpha <= 0) return
    ctx.save(); ctx.globalAlpha = alpha
    ctx.beginPath(); ctx.arc(cx, cy, DOT_R, 0, Math.PI * 2)
    ctx.fillStyle = C_GREEN; ctx.shadowColor = C_GREEN; ctx.shadowBlur = 8; ctx.fill()
    ctx.restore()
  }

  let rafId
  ;(function frame() {
    let tx = mouseX, ty = mouseY, ttHW = GAP, ttHH = GAP
    if (locked && hoverEl) {
      const r = hoverEl.getBoundingClientRect()
      tx = r.left + r.width/2; ty = r.top + r.height/2
      ttHW = Math.max(GAP, r.width/2 + 8); ttHH = Math.max(GAP, r.height/2 + 8)
    }
    curX += (tx - curX)*0.26; curY += (ty - curY)*0.26
    curHW += (ttHW - curHW)*0.24; curHH += (ttHH - curHH)*0.24
    lockOpacity += ((locked ? 1 : 0) - lockOpacity)*0.18
    if (!locked) angle += SPIN
    else angle += (0 - angle)*0.14

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBrackets(curX, curY, curHW, curHH, angle, 0.92, locked)
    drawDot(curX, curY, 1 - lockOpacity)
    rafId = requestAnimationFrame(frame)
  })()

  const SELECTOR = 'a, button, .pc, .rcard, .ach, .soc-card, .sk-tag, input, textarea, select'
  const onOver = e => { const el = e.target.closest(SELECTOR); if (el) { hoverEl = el; locked = true } }
  const onOut  = e => { const el = e.target.closest(SELECTOR); if (el && !el.contains(e.relatedTarget)) { hoverEl = null; locked = false } }
  document.addEventListener('mouseover', onOver)
  document.addEventListener('mouseout',  onOut)

  return () => {
    cancelAnimationFrame(rafId)
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseover', onOver)
    document.removeEventListener('mouseout',  onOut)
    window.removeEventListener('resize', resize)
  }
}
