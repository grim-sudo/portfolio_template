import { useEffect, useState } from 'react'

export default function Hero({ data }) {
  const { identity } = data
  const handle = identity.handle || 'GRIM'
  const roles = identity.rotatingRoles?.length ? identity.rotatingRoles : [identity.role]
  const topCapabilities = (data.mission?.focusAreas || []).slice(0, 3)
  const offensiveCount = (data.achievements || []).filter(a => a.type === 'red').length
  const proofStats = [
    { k: 'tracks', v: data.achievements?.length || 0, l: 'validated tracks' },
    { k: 'offense', v: offensiveCount, l: 'offensive lanes' },
    { k: 'tools', v: data.mission?.toolset?.length || 0, l: 'tools in rotation' },
  ]

  const [typedRole, setTypedRole] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)
  const [heroNote, setHeroNote] = useState('Hover a control to inspect intent.')

  useEffect(() => {
    let alive = true
    let timeoutId
    const current = roles[roleIndex % roles.length]

    function typeIn(i = 0) {
      if (!alive) return
      setTypedRole(current.slice(0, i))
      if (i <= current.length) {
        timeoutId = setTimeout(() => typeIn(i + 1), 46)
        return
      }
      timeoutId = setTimeout(() => erase(current.length - 1), 1300)
    }

    function erase(i) {
      if (!alive) return
      setTypedRole(current.slice(0, Math.max(i, 0)))
      if (i >= 0) {
        timeoutId = setTimeout(() => erase(i - 1), 24)
        return
      }
      setRoleIndex(idx => (idx + 1) % roles.length)
    }

    typeIn(0)

    return () => {
      alive = false
      clearTimeout(timeoutId)
    }
  }, [roleIndex, roles])

  return (
    <section id="hero" className="ctos-sweep">
      <div className="hero-dp">
        {[
          { k: 'uid',      v: identity.github },
          { k: 'platform', v: identity.platform },
          { k: 'shell',    v: identity.shell },
          { k: 'status',   v: identity.available ? 'AVAILABLE' : 'UNAVAILABLE' },
        ].map(dp => (
          <div key={dp.k} className="hero-dp-item" data-k={dp.k + ' //'}>
            {dp.v}
          </div>
        ))}
      </div>

      <h1 className="hero-name" data-text={handle}>{handle}</h1>
      <div className="hero-sub">{identity.realname}</div>
      <div className="hero-role" aria-live="polite">
        <span className="hero-role-label">ACTIVE ROLE //</span> {typedRole}
        <span className="hero-role-caret">_</span>
      </div>

      <div className="hero-cap-strip" aria-label="Primary capabilities">
        {topCapabilities.map((cap, i) => (
          <button
            key={cap}
            type="button"
            className={`hero-cap${i === 0 ? ' hot' : ''}`}
            onMouseEnter={() => setHeroNote(`${cap} is one of my highest-leverage lanes.`)}
            onMouseLeave={() => setHeroNote('Hover a control to inspect intent.')}
          >
            {cap}
          </button>
        ))}
      </div>

      <p className="hero-tagline">{identity.tagline}</p>

      <div className="hero-proof reveal in">
        {proofStats.map(s => (
          <div key={s.k} className="hero-proof-item">
            <span className="hero-proof-val">{s.v}</span>
            <span className="hero-proof-label">{s.l}</span>
          </div>
        ))}
      </div>

      <p className="hero-note">{heroNote}</p>

      <div className="hero-btns">
        <a
          href={`https://github.com/${identity.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-g"
          onMouseEnter={() => setHeroNote('Open-source trail. Tooling, builds, and experiments.')}
          onMouseLeave={() => setHeroNote('Hover a control to inspect intent.')}
        >
          VIEW ARSENAL
        </a>
        <button
          className="btn btn-d"
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          onMouseEnter={() => setHeroNote('Direct channel for collabs, audits, and high-signal work.')}
          onMouseLeave={() => setHeroNote('Hover a control to inspect intent.')}
        >
          OPEN COMMS
        </button>
      </div>

      <div className="hero-identity" style={{ marginTop: 40 }}>
        <div><span className="hi-key">handle    // </span><span className="hi-val green">{identity.handle}</span></div>
        <div><span className="hi-key">realname  // </span><span className="hi-val">{identity.realname}</span></div>
        <div><span className="hi-key">role      // </span><span className="hi-val cyan">{identity.role}</span></div>
        <div><span className="hi-key">location  // </span><span className="hi-val">{identity.location}</span></div>
        <div><span className="hi-key">clearance // </span><span className="hi-val">{identity.clearance}</span></div>
        <div><span className="hi-key">status    // </span><span className="hi-val green">{identity.available ? 'ONLINE // AVAILABLE' : 'OFFLINE'}</span></div>
      </div>
    </section>
  )
}
