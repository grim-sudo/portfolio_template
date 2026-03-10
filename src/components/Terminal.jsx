import { useEffect, useRef } from 'react'
import { initTerminal } from '../lib/terminal.js'

export default function Terminal({ data }) {
  const tbodyRef   = useRef(null)
  const tinputRef  = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const cleanup = initTerminal(tbodyRef.current, tinputRef.current, sectionRef.current, data)
    return cleanup
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="terminal" ref={sectionRef}>
      <div className="c-tl" /><div className="c-tr" /><div className="c-bl" /><div className="c-br" />
      <p className="sec-label">// INTERFACE</p>
      <h2 className="sec-title reveal">TERMINAL</h2>
      <div id="tsec" className="term-box reveal">
        <div className="term-bar">
          <div className="tbar-dot td-r" />
          <div className="tbar-dot td-y" />
          <div className="tbar-dot td-g" />
          <span className="tbar-title">root@GRIM — zsh</span>
        </div>
        <div id="tbody" ref={tbodyRef} />
        <div className="term-input-row">
          <span className="term-ps">grim@arch:~$&nbsp;</span>
          <input id="tinput" ref={tinputRef} type="text" spellCheck={false} autoComplete="off" autoCorrect="off" />
        </div>
      </div>
    </section>
  )
}
