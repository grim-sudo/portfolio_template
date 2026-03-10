export default function Hero({ data }) {
  const { identity } = data
  const handle = identity.handle || 'GRIM'

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
      <div className="hero-role">{identity.role}</div>
      <p className="hero-tagline">{identity.tagline}</p>

      <div className="hero-btns">
        <a
          href={`https://github.com/${identity.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-g"
        >
          VIEW ARSENAL
        </a>
        <button
          className="btn btn-d"
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
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
