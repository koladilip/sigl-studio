import { useEffect, useRef } from 'react'
import './SceneViewer.css'

interface SceneViewerProps {
  canvas: HTMLCanvasElement | null
}

export default function SceneViewer({ canvas }: SceneViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!canvas || !containerRef.current) return

    // Clear previous canvas
    containerRef.current.innerHTML = ''
    
    // Append the original canvas (don't clone WebGL canvas!)
    canvas.style.maxWidth = '100%'
    canvas.style.height = 'auto'
    canvas.style.borderRadius = '8px'
    
    containerRef.current.appendChild(canvas)
  }, [canvas])

  return (
    <div className="scene-viewer">
      <div ref={containerRef} className="canvas-container">
        {!canvas && (
          <div className="empty-state">
            <div className="empty-icon">🎨</div>
            <h3>No Scene Yet</h3>
            <p>Write SIGL code and click "Generate" to create a 3D scene</p>
          </div>
        )}
      </div>
    </div>
  )
}

