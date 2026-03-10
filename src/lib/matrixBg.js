// Matrix background canvas — accepts canvas element
export function initMatrixBg(canvas) {
  if (!canvas) return () => {}
  const x = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ░▒▓█▄▀■□◆◇ABCDEF0123456789'
  const COL_W = 18
  let cols = Math.floor(canvas.width / COL_W)
  let drops = makeDrops(cols, canvas)
  let last = 0, rafId

  function makeDrops(n, c) {
    return Array.from({ length: n }, () => ({
      y: Math.random() * -c.height,
      speed: 10 + Math.random() * 24,
      trail: 8 + Math.floor(Math.random() * 18),
      chars: Array.from({ length: 40 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
      tick: 0, refreshEvery: 3 + Math.floor(Math.random() * 6),
    }))
  }

  function draw(ts) {
    const dt = Math.min((ts - last) / 1000, 0.05); last = ts
    x.fillStyle = 'rgba(10,10,10,0.18)'; x.fillRect(0, 0, canvas.width, canvas.height)
    drops.forEach((d, ci) => {
      d.y += d.speed * dt * 60 * 0.25; d.tick++
      if (d.tick % d.refreshEvery === 0) {
        const ri = Math.floor(Math.random() * d.chars.length)
        d.chars[ri] = CHARS[Math.floor(Math.random() * CHARS.length)]
      }
      for (let i = 0; i < d.trail; i++) {
        const cy = d.y - i * COL_W
        if (cy < 0 || cy > canvas.height) continue
        const ch = d.chars[i % d.chars.length], px = ci * COL_W
        if (i === 0) { x.fillStyle = '#ccffee'; x.shadowBlur = 8; x.shadowColor = '#00ff88' }
        else {
          const alpha = Math.max(0, 1 - i / d.trail)
          x.fillStyle = `rgba(0,${Math.floor(180 + 75 * alpha)},${Math.floor(80 * alpha)},${alpha * 0.85})`
          x.shadowBlur = i < 3 ? 4 : 0; x.shadowColor = '#00ff88'
        }
        x.font = `${COL_W - 2}px 'JetBrains Mono',monospace`
        x.fillText(ch, px, cy)
      }
      x.shadowBlur = 0
      if (d.y - d.trail * COL_W > canvas.height) {
        d.y = -COL_W * d.trail; d.speed = 10 + Math.random() * 24; d.trail = 8 + Math.floor(Math.random() * 18)
      }
    })
    rafId = requestAnimationFrame(draw)
  }
  rafId = requestAnimationFrame(draw)

  const onResize = () => {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight
    cols = Math.floor(canvas.width / COL_W)
    drops = makeDrops(cols, canvas)
  }
  window.addEventListener('resize', onResize)

  return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', onResize) }
}
