import { useEffect, useRef } from 'react'
import { initRadar } from '../lib/radarChart.js'

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
      <p className="sec-label">// CAPABILITY_MATRIX</p>
      <h2 className="sec-title reveal">SKILLS</h2>

      <div className="skills-layout">
        <div className="radar-wrap">
          <canvas id="radarChart" ref={canvasRef} width={400} height={400} />
        </div>
        <div id="skill-grid" className="skill-grid reveal">
          {data.skills.map((cat, i) => (
            <div key={i} className={`sc${cat.type === 'red' ? ' sec' : ''}`}>
              <div className="sc-name">{cat.category.replace(/_/g, ' ')}</div>
              <div className="sk-tags">
                {cat.items.map((s, j) => (
                  <span key={j} className={`sk-tag${cat.type === 'red' ? ' sk-tag-r' : ''}`}>
                    {s.name.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
