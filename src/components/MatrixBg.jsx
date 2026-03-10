import { useEffect, useRef } from 'react'
import { initMatrixBg } from '../lib/matrixBg.js'

export default function MatrixBg() {
  const ref = useRef(null)

  useEffect(() => {
    const cleanup = initMatrixBg(ref.current)
    return cleanup
  }, [])

  return <canvas id="bgcanvas" ref={ref} />
}
