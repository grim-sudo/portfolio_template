import { useState } from 'react'

const NAV_ITEMS = [
  { label: 'MISSION',  id: 'mission'  },
  { label: 'SKILLS',   id: 'skills'   },
  { label: 'ARSENAL',  id: 'arsenal'  },
  { label: 'TERMINAL', id: 'terminal' },
  { label: 'NETWORK',  id: 'network'  },
  { label: 'CONTACT',  id: 'contact'  },
]

function goTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Nav({ data }) {
  const [open, setOpen] = useState(false)

  function toggleMob() { setOpen(o => !o) }
  function handleMobClick(id) { goTo(id); setOpen(false) }

  return (
    <>
      <nav>
        <div className="nav-logo" onClick={() => goTo('hero')} style={{ cursor: 'none' }}>
          {(data.identity.handle || data.identity.realname).toUpperCase()}
        </div>
        <div className="nav-links">
          {NAV_ITEMS.map(it => (
            <button key={it.id} className="nav-link" onClick={() => goTo(it.id)}>{it.label}</button>
          ))}
        </div>
        <button id="ham" className={open ? 'open' : ''} onClick={toggleMob} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
      <div id="mobmenu" className={open ? 'open' : ''}>
        {NAV_ITEMS.map(it => (
          <button key={it.id} className="mob-link" onClick={() => handleMobClick(it.id)}>{it.label}</button>
        ))}
      </div>
    </>
  )
}
