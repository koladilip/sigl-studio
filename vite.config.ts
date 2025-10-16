import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SITLEngine',
      fileName: 'sitl-engine',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['canvas', 'sharp', 'fs', 'path'],
      output: {
        globals: {
          canvas: 'Canvas',
          sharp: 'Sharp'
        }
      }
    },
    target: 'node22',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/core': resolve(__dirname, 'src/core'),
      '@/parser': resolve(__dirname, 'src/parser'),
      '@/entities': resolve(__dirname, 'src/entities'),
      '@/rendering': resolve(__dirname, 'src/rendering'),
      '@/extensions': resolve(__dirname, 'src/extensions'),
      '@/utils': resolve(__dirname, 'src/utils')
    }
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/parser/generated/',
        'tests/',
        '**/*.d.ts'
      ]
    }
  }
});