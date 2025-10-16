import { useState } from 'react'
import CodeEditor from './components/CodeEditor'
import SceneViewer from './components/SceneViewer'
import { useSIGLEngine } from './hooks/useSIGLEngine'
import { examples, type ExampleKey } from './utils/examples'
import './App.css'

function App() {
  const [siglCode, setSiglCode] = useState(examples['family-portrait'].code)
  const { render, isRendering, error, rendererType } = useSIGLEngine()
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

  const handleGenerate = async () => {
    const result = await render(siglCode)
    if (result) {
      setCanvas(result)
    }
  }

  const handleDownload = () => {
    if (!canvas) return
    
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'sigl-scene.png'
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎨 SIGL 3D Scene Generator</h1>
        <div className="header-actions">
          <a 
            href="docs/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="docs-link"
          >
            📚 Docs
          </a>
          <div className="renderer-badge">
            {rendererType === '3D' ? '🎮 Three.js WebGL' : '🖼️ Canvas 2D'}
          </div>
        </div>
      </header>

      <div className="app-content">
        <div className="editor-panel">
          <div className="panel-header">
            <h2>SIGL Code</h2>
            <div className="panel-actions">
              <select 
                className="example-selector"
                onChange={(e) => setSiglCode(examples[e.target.value as ExampleKey].code)}
                defaultValue="family-portrait"
              >
                {Object.entries(examples).map(([key, example]) => (
                  <option key={key} value={key}>
                    {example.name}
                  </option>
                ))}
              </select>
              <button 
                onClick={handleGenerate}
                disabled={isRendering}
                className="btn btn-primary"
              >
                {isRendering ? '⏳ Rendering...' : '🎨 Generate'}
              </button>
              <button 
                onClick={handleDownload}
                disabled={!canvas}
                className="btn btn-secondary"
              >
                💾 Download PNG
              </button>
            </div>
          </div>
          <CodeEditor 
            value={siglCode} 
            onChange={setSiglCode}
          />
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}
        </div>

        <div className="viewer-panel">
          <div className="panel-header">
            <h2>3D Scene Preview</h2>
            <div className="info-badge">
              {canvas ? `${canvas.width}×${canvas.height}px` : 'No scene'}
            </div>
          </div>
          <SceneViewer canvas={canvas} />
        </div>
      </div>

      <footer className="app-footer">
        <p>Built with React + TypeScript + Three.js • SIGL Engine v0.1.0</p>
      </footer>
    </div>
  )
}

export default App

