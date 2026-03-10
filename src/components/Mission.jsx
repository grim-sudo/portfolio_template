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

  const cyanStart = { r: 0, g: 212, b: 255 }
  const greenEnd  = { r: 0, g: 255, b: 136 }
  const greenStart= { r: 0, g: 255, b: 136 }
  const greyEnd   = { r: 136, g: 136, b: 136 }

  return (
    <section id="mission">
      <div className="c-tl" /><div className="c-tr" /><div className="c-bl" /><div className="c-br" />
      <p className="sec-label">// Operator BRIEF</p>
      <h2 className="sec-title reveal">OPERATOR INFORMATION</h2>

      <div className="mission-grid">
        {/* OVERVIEW */}
        <div className="mission-block reveal">
          <p className="mb-label">OVERVIEW</p>
          <div className="mb-body">
            <strong>Systems Profile</strong>
            {M.overview}
          </div>
        </div>

        {/* FOCUS AREAS */}
        <div className="mission-block reveal">
          <p className="mb-label">FOCUS AREAS</p>
          <div className="mb-body">
            {focusAreas.map((f, i) => (
              <div key={i} className="mb-focus-item">{f}</div>
            ))}
          </div>
        </div>

        {/* PLATFORMS */}
        <div className="mission-block reveal">
          <p className="mb-label">PLATFORMS</p>
          <div className="mb-body">
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

        {/* TOOLSET */}
        <div className="mission-block reveal">
          <p className="mb-label">TOOLSET</p>
          <div className="mb-body">
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
    </section>
  )
}
