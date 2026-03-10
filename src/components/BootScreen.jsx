import { useEffect, useRef } from 'react'
import { initBootGlobe, buildBootSequence } from '../lib/bootGlobe.js'

export default function BootScreen({ data, onComplete }) {
  const canvasRef    = useRef(null)
  const rightRef     = useRef(null)
  const blogRef      = useRef(null)
  const bbarRef      = useRef(null)
  const bootWrapRef  = useRef(null)

  useEffect(() => {
    const canvas    = canvasRef.current
    const bootRight = rightRef.current

    // initBootGlobe handles the spinning globe
    const cleanup = initBootGlobe(canvas, bootRight, data)

    // Build boot log lines
    const BOOT = buildBootSequence(data)
    const blogEl = blogRef.current
    const bbarEl = bbarRef.current
    const total  = BOOT.length

    const timers = BOOT.map((l, i) =>
      setTimeout(() => {
        const d = document.createElement('div')
        d.className = 'bl' + (l.c ? ' ' + l.c : '')
        d.textContent = l.t || '\u00a0'
        blogEl.appendChild(d)
        setTimeout(() => d.classList.add('in'), 20)
        blogEl.scrollTop = blogEl.scrollHeight
        bbarEl.style.width = ((i / total) * 100) + '%'
      }, l.d)
    )

    // Dismiss boot screen
    const doneTimer = setTimeout(() => {
      cleanup()
      bbarEl.style.width = '100%'
      const bootEl = bootWrapRef.current
      if (!bootEl) return
      bootEl.style.transition = 'opacity .85s ease'
      bootEl.style.opacity    = '0'
      setTimeout(onComplete, 870)
    }, 2700)

    return () => {
      cleanup()
      timers.forEach(clearTimeout)
      clearTimeout(doneTimer)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div id="boot" ref={bootWrapRef}>
      <div id="boot-left">
        <div id="blog-wrap">
          <div id="boot-label">// SYSTEM BOOT SEQUENCE</div>
          <div id="blog" ref={blogRef} />
          <div id="bbar-wrap">
            <div id="bbar" ref={bbarRef} />
          </div>
        </div>
      </div>
      <div id="boot-right" ref={rightRef}>
        <canvas id="boot-canvas" ref={canvasRef} />
      </div>
    </div>
  )
}
