export default function Achievements({ data }) {
  return (
    <section id="achievements">
      <div className="c-tl" /><div className="c-tr" /><div className="c-bl" /><div className="c-br" />
      <p className="sec-label">// RECORD</p>
      <h2 className="sec-title reveal">ACHIEVEMENTS</h2>
      <div className="agrid reveal">
        {data.achievements.map((a, i) => (
          <div
            key={i}
            className={`ach${a.type === 'red' ? ' red-ach' : ''}`}
            style={{ '--d': `${i * 0.07}s` }}
          >
            <div>
              <div className="at">{a.label}</div>
              <div className="ad">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
