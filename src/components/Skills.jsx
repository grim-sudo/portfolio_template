import { useEffect, useRef } from 'react'
import { Code, Server, Box, Crosshair, TerminalSquare } from 'lucide-react'
import { initRadar } from '../lib/radarChart.js'

const iconMap = {
  'programming': <Code size={18} style={{ marginRight: 10, color: 'var(--g)' }} />,
  'web_stack': <Box size={18} style={{ marginRight: 10, color: 'var(--g)' }} />,
  'devops': <Server size={18} style={{ marginRight: 10, color: 'var(--g)' }} />,
  'security': <Crosshair size={18} style={{ marginRight: 10, color: 'var(--r)' }} />,
  'systems': <TerminalSquare size={18} style={{ marginRight: 10, color: 'var(--g)' }} />
}

export default function Skills({ data }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const { start, cleanup } = initRadar(canvasRef.current, () => data.skills)
    start()
    return cleanup
  }, [data.skills])

  return (
    <section id="skills">
      <div className="c-tl" /><div className="c-tr" /><div className="c-bl" /><div className="c-br" />
      <p className="sec-label">// Capability Matrix</p>
      <h2 className="sec-title reveal">How I Operate</h2>

      <div className="skills-layout">
        <div className="radar-wrap">
          <canvas id="radarChart" ref={canvasRef} width={400} height={400} />
        </div>
        <div id="skill-grid" className="skill-grid reveal">
          {data.skills.map((cat, i) => {
            const isRed = cat.type === 'red'
            return (
              <div key={i} className={`sc${isRed ? ' sec' : ''}`}>
                <div className="sc-name">
                  {iconMap[cat.category.toLowerCase()] || <Code size={18} style={{ marginRight: 10 }} />}
                  {cat.category.replace(/_/g, ' ')}
                </div>
                <div className="sk-tags">
                  {cat.items.map((s, j) => (
                    <span key={j} className={`sk-tag${isRed ? ' sk-tag-r' : ''}`}>
                      {s.name.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
