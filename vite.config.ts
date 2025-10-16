import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { cpSync, mkdirSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-docs',
      closeBundle() {
        // Copy docs folder to dist after build
        const docsSource = path.resolve(__dirname, 'docs')
        const docsDest = path.resolve(__dirname, 'dist/docs')
        
        try {
          mkdirSync(docsDest, { recursive: true })
          cpSync(docsSource, docsDest, { recursive: true })
          console.log('✅ Copied docs to dist/docs')
        } catch (err) {
          console.error('Failed to copy docs:', err)
        }
      }
    }
  ],
  base: '/sigl-studio/', // GitHub Pages base path
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})

