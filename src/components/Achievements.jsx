import { useEffect, useMemo, useRef, useState } from 'react'
import { Target, Server, Code, Terminal, Shield, Laptop, Network, ShieldCheck, Crosshair } from 'lucide-react'

export default function Achievements({ data }) {
  const sectionRef = useRef(null)
  const [hovered, setHovered] = useState(-1)
  const [stats, setStats] = useState({ tracks: 0, offensive: 0, tools: 0 })

  const totals = useMemo(() => {
    const all = data.achievements || []
    const offensive = all.filter(a => a.type === 'red').length
    return {
      tracks: all.length,
      offensive,
      tools: data.mission?.toolset?.length || 0,
    }
  }, [data.achievements, data.mission?.toolset])

  useEffect(() => {
    const target = sectionRef.current
    if (!target) return undefined

    let started = false
    let rafId

    function animate() {
      const start = performance.now()
      const duration = 900

      function tick(now) {
        const t = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        setStats({
          tracks: Math.round(totals.tracks * eased),
          offensive: Math.round(totals.offensive * eased),
          tools: Math.round(totals.tools * eased),
        })
        if (t < 1) rafId = requestAnimationFrame(tick)
      }

      rafId = requestAnimationFrame(tick)
    }

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true
        animate()
        obs.disconnect()
      }
    }, { threshold: 0.25 })

    obs.observe(target)
    return () => {
      obs.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [totals])

  return (
    <section id="achievements" ref={sectionRef}>
      <div className="c-tl" /><div className="c-tr" /><div className="c-bl" /><div className="c-br" />
      <p className="sec-label">// Record</p>
      <h2 className="sec-title reveal">Proof of Work</h2>

      <div className="ach-stats reveal">
        <div className="ach-stat"><span>{stats.tracks}</span> tracks cleared</div>
        <div className="ach-stat"><span>{stats.offensive}</span> offensive lanes</div>
        <div className="ach-stat"><span>{stats.tools}</span> tools in rotation</div>
      </div>

      <div className="agrid reveal">
        {data.achievements.map((a, i) => (
          <div
            key={i}
            className={`ach${a.type === 'red' ? ' red-ach' : ''}`}
            style={{ '--d': `${i * 0.07}s` }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(-1)}
          >
            <div>
              <div className="at">
                {a.type === 'red' ? <Crosshair size={14} style={{ marginRight: 6 }}/> : <ShieldCheck size={14} style={{ marginRight: 6 }}/>}
                {a.label}
              </div>
              <div className="ad">{hovered === i && a.hover ? a.hover : a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
