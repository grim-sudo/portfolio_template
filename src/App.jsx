import { useState, useEffect } from 'react'
import { GRIM_DATA } from './data/data.js'

import CursorCanvas   from './components/CursorCanvas'
import BootScreen     from './components/BootScreen'
import WelcomeScreen  from './components/WelcomeScreen'
import MatrixBg       from './components/MatrixBg'
import Nav            from './components/Nav'
import Hero           from './components/Hero'
import Mission        from './components/Mission'
import Skills         from './components/Skills'
import Arsenal        from './components/Arsenal'
import TerminalSection from './components/Terminal'
import NetworkMap     from './components/NetworkMap'
import Socials        from './components/Socials'
import Achievements   from './components/Achievements'
import Footer         from './components/Footer'

export default function App() {
  // 'boot' → 'welcome' → 'app'
  const [phase, setPhase] = useState('boot')

  // Scroll-reveal observer + #app fade-in
  useEffect(() => {
    if (phase !== 'app') return
    // Trigger CSS transition: insert element first, then add .show on next paint
    const appEl = document.getElementById('app')
    if (appEl) requestAnimationFrame(() => requestAnimationFrame(() => appEl.classList.add('show')))
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.12 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [phase])

  return (
    <>
      <CursorCanvas />

      {phase === 'boot' && (
        <BootScreen data={GRIM_DATA} onComplete={() => setPhase('welcome')} />
      )}

      {phase === 'welcome' && (
        <WelcomeScreen data={GRIM_DATA} onComplete={() => setPhase('app')} />
      )}

      {phase === 'app' && (
        <>
          <MatrixBg />
          <Nav data={GRIM_DATA} />
          <div id="app">
            <Hero data={GRIM_DATA} />
            <div className="divl" />
            <Mission data={GRIM_DATA} />
            <div className="divl" />
            <Skills data={GRIM_DATA} />
            <div className="divl" />
            <Arsenal data={GRIM_DATA} />
            <div className="divl" />
            <TerminalSection data={GRIM_DATA} />
            <div className="divl" />
            <NetworkMap data={GRIM_DATA} />
            <div className="divl" />
            <Socials data={GRIM_DATA} />
            <div className="divl" />
            <Achievements data={GRIM_DATA} />
            <Footer data={GRIM_DATA} />
          </div>
        </>
      )}
    </>
  )
}
