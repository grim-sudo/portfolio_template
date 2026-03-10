import { useEffect, useRef, useState } from 'react'

const WORDS = ['PORTFOLIO', 'SYSTEMS', 'SECURITY', 'DEVOPS', 'LINUX', 'HACKER']
const DURATION = 3500

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

export default function WelcomeScreen({ data, onComplete }) {
  const [word, setWord]       = useState('')
  const [barPct, setBarPct]   = useState(0)
  const cyclingRef             = useRef(true)
  const wrapRef                = useRef(null)

  useEffect(() => {
    let alive = true
    cyclingRef.current = true

    // Word cycling
    async function cycle() {
      let wi = 0
      // type first word
      for (const ch of WORDS[0]) {
        if (!alive) return
        setWord(w => w + ch)
        await sleep(55)
      }
      while (cyclingRef.current && alive) {
        await sleep(1000)
        // erase
        let cur = WORDS[wi]
        while (cur.length > 0) {
          if (!alive) return
          cur = cur.slice(0, -1)
          setWord(cur)
          await sleep(30)
        }
        wi = (wi + 1) % WORDS.length
        // type
        for (const ch of WORDS[wi]) {
          if (!alive) return
          setWord(w => w + ch)
          await sleep(55)
        }
      }
    }
    cycle()

    // Progress bar
    const start = performance.now()
    let rafId
    function tickBar(now) {
      const pct = Math.min((now - start) / DURATION * 100, 100)
      setBarPct(pct)
      if (pct < 100 && alive) rafId = requestAnimationFrame(tickBar)
    }
    rafId = requestAnimationFrame(tickBar)

    // Auto dismiss
    const autoTimer = setTimeout(dismiss, DURATION)

    function dismiss() {
      if (!alive) return
      cyclingRef.current = false
      const el = wrapRef.current
      if (el) { el.style.transition = 'opacity .55s ease'; el.style.opacity = '0' }
      setTimeout(onComplete, 570)
    }

    function handleKey() { clearTimeout(autoTimer); cancelAnimationFrame(rafId); dismiss() }
    document.addEventListener('keydown', handleKey, { once: true })
    const el = wrapRef.current
    if (el) el.addEventListener('click', handleKey, { once: true })

    return () => {
      alive = false
      cyclingRef.current = false
      clearTimeout(autoTimer)
      cancelAnimationFrame(rafId)
      document.removeEventListener('keydown', handleKey)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div id="welcome" className="show" ref={wrapRef}>
      <div id="wc-scan" />
      <div id="wc-inner">
        <div id="wc-sig">
          <span id="wc-handle">{data.identity.github.toUpperCase()}</span>
          <span id="wc-sep"> · </span>
          <span id="wc-realname">{data.identity.realname}</span>
        </div>
        <div id="wc-headline">
          <div id="wc-top-line">Welcome to my</div>
          <div id="wc-bigword">
            <span id="wc-word">{word}</span>
            <span id="wc-cur">_</span>
          </div>
          <div id="wc-bottom-line">// {data.identity.role}</div>
        </div>
        <div id="wc-bar-wrap">
          <div id="wc-bar" style={{ width: barPct + '%' }} />
        </div>
        <div id="wc-skip">[ PRESS ANY KEY OR CLICK TO SKIP ]</div>
      </div>
    </div>
  )
}
