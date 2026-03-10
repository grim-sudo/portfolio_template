import { useEffect, useRef } from 'react'
import { initCursor } from '../lib/cursor.js'

export default function CursorCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const cleanup = initCursor(ref.current)
    return cleanup
  }, [])

  return <canvas id="cursor-canvas" ref={ref} />
}
