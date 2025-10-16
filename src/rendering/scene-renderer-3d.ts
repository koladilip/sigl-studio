// src/rendering/scene-renderer-3d.ts
/**
 * Wrapper to use Three.js renderer if available, fallback to 2D
 */

import type { SceneDefinition, RenderOptions, SIGLConfig } from '../core/types';
import { SceneRenderer } from './scene-renderer';

export interface RenderResult3D {
  success: boolean;
  canvas?: any;
  renderTime: number;
  errors: any[];
}

export class SceneRenderer3D {
  private config: SIGLConfig;
  private use3D: boolean = false;
  private renderer2D: SceneRenderer;
  private renderer3D: any = null;

  constructor(config: SIGLConfig, force3D: boolean = false) {
    this.config = config;
    this.renderer2D = new SceneRenderer(config);
    
    // Try to load Three.js renderer
    if (force3D || this.should Use3D()) {
      this.initialize3D();
    }
  }

  /**
   * Check if Three.js is available and should be used
   */
  private shouldUse3D(): boolean {
    try {
      require.resolve('three');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Initialize Three.js renderer
   */
  private async initialize3D(): Promise<void> {
    try {
      const { ThreeJSRenderer } = await import('./engines/threejs-renderer');
      this.renderer3D = new ThreeJSRenderer(this.config);
      this.use3D = true;
      console.log('✅ Three.js renderer initialized');
    } catch (error) {
      console.warn('⚠️  Three.js not available, using 2D renderer');
      this.use3D = false;
    }
  }

  /**
   * Render scene (auto-selects 2D or 3D)
   */
  async render(scene: SceneDefinition, options: RenderOptions = {}): Promise<RenderResult3D> {
    const startTime = Date.now();
    
    try {
      if (this.use3D && this.renderer3D) {
        // Use Three.js 3D renderer
        const result = await this.renderer3D.render(scene);
        return {
          success: true,
          canvas: result.canvas,
          renderTime: Date.now() - startTime,
          errors: []
        };
      } else {
        // Use 2D canvas renderer with Enhanced 2.5D
        const result = await this.renderer2D.render(scene, options);
        return {
          success: result.success,
          canvas: result.canvas,
          renderTime: result.renderTime,
          errors: result.errors
        };
      }
    } catch (error) {
      return {
        success: false,
        renderTime: Date.now() - startTime,
        errors: [{
          type: 'render_error',
          message: error instanceof Error ? error.message : 'Unknown error'
        }]
      };
    }
  }

  /**
   * Check if using 3D renderer
   */
  isUsing3D(): boolean {
    return this.use3D;
  }
}

export default SceneRenderer3D;

