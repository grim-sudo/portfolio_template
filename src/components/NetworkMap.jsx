import { useEffect, useRef, useState } from 'react'
import { initNetMap } from '../lib/networkMap.js'

export default function NetworkMap({ data }) {
  const svgRef   = useRef(null)
  const [nodeInfo, setNodeInfo] = useState({ visible: false, x: 0, y: 0, node: null })

  useEffect(() => {
    const cleanup = initNetMap(svgRef.current, data.network, (info) => setNodeInfo(info))
    return cleanup
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function closeInfo() { setNodeInfo(n => ({ ...n, visible: false })) }

  const n = nodeInfo.node

  return (
    <section id="network">
      <div className="c-tl" /><div className="c-tr" /><div className="c-bl" /><div className="c-br" />
      <p className="sec-label">// TOPOLOGY</p>
      <h2 className="sec-title reveal">NETWORK MAP</h2>

      <svg
        id="nmap"
        ref={svgRef}
        viewBox="-50 -20 1020 650"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible' }}
        className="reveal"
      />

      {nodeInfo.visible && n && (
        <div
          id="ninfo"
          style={{
            display: 'block',
            position: 'fixed',
            left: nodeInfo.x,
            top: nodeInfo.y,
          }}
        >
          <div className="ninfo-hdr">
            <span>NODE_INFO</span>
            <span className="ninfo-x" onClick={closeInfo}>✕</span>
          </div>
          <div className="ninfo-body">
            <div><span className="ninfo-lbl">ID</span>{n.id?.toUpperCase()}</div>
            <div><span className="ninfo-lbl">LABEL</span>{n.label}</div>
            <div><span className="ninfo-lbl">STATUS</span>ONLINE</div>
            {n.info && <div style={{ marginTop: 8, color: 'rgba(0,255,136,.5)', fontSize: 10 }}>{n.info}</div>}
          </div>
        </div>
      )}
    </section>
  )
}
