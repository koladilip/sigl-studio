import { useState, useEffect, useCallback } from 'react'
import { SIGLParser } from '@/engine/parser/sigl-parser'
import { SIGLEngine } from '@/engine/core/engine'
import type { SIGLConfig } from '@/engine/core/types'

export function useSIGLEngine() {
  const [engine, setEngine] = useState<SIGLEngine | null>(null)
  const [parser] = useState(() => new SIGLParser())
  const [isRendering, setIsRendering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rendererType, setRendererType] = useState<'3D' | '2.5D'>('2.5D')

  // Initialize engine on mount
  useEffect(() => {
    const config: SIGLConfig = {
      canvas: {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff'
      },
      rendering: {
        quality: 'high',
        antialiasing: true
      },
      export: {
        format: 'png',
        quality: 95
      }
    }

    const initEngine = async () => {
      console.log('🚀 Initializing SIGL Engine...')
      const siglEngine = new SIGLEngine(config)
      const initResult = await siglEngine.initialize()
      
      console.log('Init result:', initResult)
      
      // Check renderer type
      if (siglEngine.isUsing3D && siglEngine.isUsing3D()) {
        console.log('✅ Using Three.js 3D renderer')
        setRendererType('3D')
      } else {
        console.log('✅ Using Enhanced 2.5D renderer')
        setRendererType('2.5D')
      }
      
      setEngine(siglEngine)
      console.log('✅ Engine initialized')
    }

    initEngine().catch(err => {
      console.error('Failed to initialize engine:', err)
      setError('Failed to initialize engine: ' + (err instanceof Error ? err.message : 'Unknown error'))
    })
  }, [])

  const render = useCallback(async (siglCode: string): Promise<HTMLCanvasElement | null> => {
    if (!engine) {
      setError('Engine not initialized')
      return null
    }

    setIsRendering(true)
    setError(null)

    try {
      // Parse SIGL code in the browser!
      console.log('🔍 Parsing SIGL code...')
      const parseResult = parser.parse(siglCode)

      if (!parseResult.success || !parseResult.ast) {
        const errorMsg = parseResult.errors
          .map(e => `Line ${e.line}: ${e.message}`)
          .join('; ')
        setError(`Parse error: ${errorMsg}`)
        return null
      }

      console.log('✅ Parsed:', parseResult.ast.entities.length, 'entities')
      console.log('Entities:', parseResult.ast.entities)

      // Render the scene
      console.log('🎨 Rendering scene...')
      const renderResult = await engine.render(parseResult.ast, {
        width: 800,
        height: 600
      })

      console.log('Render result:', renderResult)

      if (!renderResult.success || !renderResult.data) {
        setError('Rendering failed: ' + (renderResult.errors?.map(e => e.message).join(', ') || 'Unknown error'))
        return null
      }

      console.log('✅ Canvas created:', renderResult.data)
      return renderResult.data as HTMLCanvasElement
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setIsRendering(false)
    }
  }, [engine, parser])

  return {
    render,
    isRendering,
    error,
    rendererType
  }
}

