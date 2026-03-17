import { useState } from 'react'
import { Target, Server, Code, Terminal, Shield, Laptop, Network } from 'lucide-react'

function gradColor(start, end, ratio) {
  const r = Math.round(start.r + (end.r - start.r) * ratio)
  const g = Math.round(start.g + (end.g - start.g) * ratio)
  const b = Math.round(start.b + (end.b - start.b) * ratio)
  return `rgb(${r},${g},${b})`
}
function gradBorder(start, end, ratio) {
  const r = Math.round(start.r + (end.r - start.r) * ratio)
  const g = Math.round(start.g + (end.g - start.g) * ratio)
  const b = Math.round(start.b + (end.b - start.b) * ratio)
  return `rgba(${r},${g},${b},.35)`
}

export default function Mission({ data }) {
  const M = data.mission || {}
  const platforms = M.platforms || []
  const toolset   = M.toolset   || []
  const focusAreas= M.focusAreas|| []
  const overviewLines = (M.overview || '').split('\n').map(s => s.trim()).filter(Boolean)
  const [focusHint, setFocusHint] = useState('Hover an operation lane for context.')

  const focusHints = {
    'Attack Surface Mapping': 'Map exposed services first, then prioritize exploitability.',
    'OSINT & Target Profiling': 'Correlate public artifacts before touching the perimeter.',
    'Network Recon + Enumeration': 'Enumerate quietly, validate twice, report once.',
    'Linux Internals & Kernel Work': 'Deep understanding of system behavior beats guesswork.',
    'Red Team Labs / CTF Ops': 'Pressure-test tactics in controlled high-speed environments.'
  }

  const iconMap = {
    'Attack Surface Mapping': <Target size={14} style={{ marginRight: 8, color: 'var(--c)' }} />,
    'OSINT & Target Profiling': <Network size={14} style={{ marginRight: 8, color: 'var(--c)' }} />,
    'Network Recon + Enumeration': <Server size={14} style={{ marginRight: 8, color: 'var(--c)' }} />,
    'Linux Internals & Kernel Work': <Terminal size={14} style={{ marginRight: 8, color: 'var(--c)' }} />,
    'Red Team Labs / CTF Ops': <Shield size={14} style={{ marginRight: 8, color: 'var(--c)' }} />
  }

  const cyanStart = { r: 0, g: 212, b: 255 }
  const greenEnd  = { r: 0, g: 255, b: 136 }
  const greenStart= { r: 0, g: 255, b: 136 }
  const greyEnd   = { r: 136, g: 136, b: 136 }

  return (
    <section id="mission">
      <div className="c-tl" /><div className="c-tr" /><div className="c-bl" /><div className="c-br" />
      <p className="sec-label">// Operator Brief</p>
      <h2 className="sec-title reveal">What I Do</h2>

      <div className="mission-grid">
        {/* OVERVIEW */}
        <div className="mission-block reveal full-width-block snapshot-block">
          <p className="mb-label">MISSION SNAPSHOT</p>
          <div className="mb-body">
            <strong style={{ fontSize: '1.4rem', marginBottom: '1.2rem', color: 'var(--g)' }}>In Plain Terms</strong>
            <div className="mb-overview-lines" style={{ gap: '12px' }}>
              {overviewLines.map((line, i) => (
                <p key={i} className="mb-overview-line" style={{ '--line-delay': `${i * 0.08}s`, fontSize: '1.1rem', paddingLeft: '16px' }}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* FOCUS AREAS */}
        <div className="mission-block reveal full-width-block">
          <p className="mb-label">OPERATION LANES</p>
          <div className="mb-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
            {focusAreas.map((f, i) => (
              <div
                key={i}
                className="mb-focus-item has-icon"
                onMouseEnter={() => setFocusHint(focusHints[f] || 'Practical security work, no fluff.')}
                onMouseLeave={() => setFocusHint('Hover an operation lane for context.')}
              >
                {iconMap[f] || <Code size={14} style={{ marginRight: 8, color: 'var(--c)' }} />}
                <span>{f}</span>
              </div>
            ))}
          </div>
          <p className="mb-focus-hint" style={{ marginTop: '16px' }}>{focusHint}</p>
        </div>

        {/* PLATFORMS & TOOLS COMBINED FOR WIDER LAYOUT */}
        <div className="mission-block reveal full-width-block">
          <p className="mb-label">TECH STACK & DEPLOYMENTS</p>
          <div className="mb-tech-row">
            <div className="mb-tech-col">
              <span className="mb-tech-title"><Laptop size={14} style={{ marginRight: 6 }}/> Platforms</span>
              <div className="mb-tag-group">
                {platforms.map((p, i) => {
                  const ratio = platforms.length > 1 ? i / (platforms.length - 1) : 0
                  return (
                    <span
                      key={i}
                      className="mb-tag"
                      style={{ color: gradColor(cyanStart, greenEnd, ratio), borderColor: gradBorder(cyanStart, greenEnd, ratio) }}
                    >
                      {p}
                    </span>
                  )
                })}
              </div>
            </div>
            
            <div className="mb-tech-divider" />
            
            <div className="mb-tech-col">
              <span className="mb-tech-title"><Terminal size={14} style={{ marginRight: 6 }}/> Toolkit</span>
              <div className="mb-tag-group">
                {toolset.map((t, i) => {
                  const ratio = toolset.length > 1 ? i / (toolset.length - 1) : 0
                  return (
                    <span
                      key={i}
                      className="mb-tag"
                      style={{ color: gradColor(greenStart, greyEnd, ratio), borderColor: gradBorder(greenStart, greyEnd, ratio) }}
                    >
                      {t}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
