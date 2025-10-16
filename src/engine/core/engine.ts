/**
 * SIGL Engine - Core engine implementation
 * Works in both browser and Node.js environments
 */

import type {
  SIGLConfig,
  SceneDefinition,
  RenderOptions,
  ExportOptions,
  Result,
} from './types';
import { SceneRenderer } from '../rendering/scene-renderer';
import { SIGLParser } from '../parser/sigl-parser';
import { CanvasFactory } from '../rendering/platform-canvas';

export class SIGLEngine {
  private config: SIGLConfig;
  private initialized: boolean = false;
  private renderer: SceneRenderer;
  private renderer3D: any = null;
  private use3D: boolean = false;
  private parser: SIGLParser;

  constructor(config: SIGLConfig) {
    this.config = config;
    this.renderer = new SceneRenderer(config);
    this.parser = new SIGLParser();
  }

  /**
   * Initialize the SIGL engine (loads Three.js if available)
   */
  async initialize(): Promise<Result<void>> {
    try {
      // Try to initialize Three.js renderer
      await this.tryInitialize3D();
      
      // Initialize rendering engine
      // Initialize parser
      // Initialize extension system
      
      this.initialized = true;
      
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          type: 'engine_error',
          code: 'ENGINE_INIT_ERROR',
          message: `Failed to initialize engine: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }],
      };
    }
  }

  /**
   * Try to initialize Three.js renderer if available
   */
  private async tryInitialize3D(): Promise<void> {
    try {
      const { ThreeJSRenderer } = await import('../rendering/engines/threejs-renderer');
      this.renderer3D = new ThreeJSRenderer(this.config);
      this.use3D = true;
      console.log('✅ Three.js 3D renderer initialized successfully');
    } catch (error) {
      console.warn('⚠️  Three.js initialization failed, falling back to 2.5D renderer');
      console.warn('   Error:', error instanceof Error ? error.message : 'Unknown error');
      this.use3D = false;
    }
  }

  /**
   * Parse SIGL code and generate scene definition
   */
  async parse(siglCode: string): Promise<Result<SceneDefinition>> {
    if (!this.initialized) {
      return {
        success: false,
        errors: [{
          type: 'engine_error',
          code: 'ENGINE_NOT_INITIALIZED',
          message: 'Engine must be initialized before parsing',
        }],
      };
    }

    try {
      // Parse using the new SIGL parser
      const parseResult = this.parser.parse(siglCode);
      
      if (!parseResult.success || !parseResult.ast) {
        return {
          success: false,
          errors: parseResult.errors.map(err => ({
            type: err.type,
            code: err.code || 'PARSE_ERROR',
            message: err.message,
            line: err.line,
            column: err.column
          }))
        };
      }

      return {
        success: true,
        data: parseResult.ast
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          type: 'parse_error',
          code: 'PARSE_ERROR',
          message: `Failed to parse SIGL code: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }],
      };
    }
  }

  /**
   * Render a scene definition (auto-selects 2D or 3D)
   */
  async render(scene: SceneDefinition, options?: RenderOptions): Promise<Result<any>> {
    if (!this.initialized) {
      return {
        success: false,
        errors: [{
          type: 'engine_error',
          code: 'ENGINE_NOT_INITIALIZED',
          message: 'Engine must be initialized before rendering',
        }],
      };
    }

    try {
      console.log('Rendering scene:', scene.id || 'unnamed');
      
      // Use Three.js 3D renderer if available
      if (this.use3D && this.renderer3D) {
        console.log('🎨 Using Three.js 3D renderer');
        const result = await this.renderer3D.render(scene);
        return {
          success: true,
          data: result.canvas
        };
      }
      
      // Fall back to 2D renderer with Enhanced 2.5D
      console.log('🎨 Using Enhanced 2.5D renderer');
      const renderResult = await this.renderer.render(scene, options || {});
      
      if (!renderResult.success || !renderResult.canvas) {
        return {
          success: false,
          errors: renderResult.errors.map(error => ({
            type: 'render_error',
            code: 'RENDER_ERROR',
            message: error.message,
          })),
        };
      }

      return {
        success: true,
        data: renderResult.canvas,
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          type: 'render_error',
          code: 'RENDER_ERROR',
          message: `Failed to render scene: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }],
      };
    }
  }

  /**
   * Export rendered scene (works in browser and Node.js)
   */
  async export(canvas: any, options: ExportOptions): Promise<Result<Blob>> {
    try {
      const format = options.format || 'png';
      const quality = (options.quality || 90) / 100;
      
      // If using Three.js renderer, use its export method
      if (this.use3D && this.renderer3D) {
        const blob = await this.renderer3D.toBlob(format, quality);
        return {
          success: true,
          data: blob
        };
      }
      
      // Otherwise use canvas factory for 2D renderer
      const canvasFactory = CanvasFactory.getInstance();
      const blob = await canvasFactory.toBlob(canvas, format, quality);
      
      return {
        success: true,
        data: blob
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          type: 'export_error',
          code: 'EXPORT_ERROR',
          message: `Failed to export: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }],
      };
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): SIGLConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SIGLConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Check if using 3D renderer
   */
  isUsing3D(): boolean {
    return this.use3D;
  }

  /**
   * Get renderer type
   */
  getRendererType(): '3D' | '2.5D' {
    return this.use3D ? '3D' : '2.5D';
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    if (this.renderer3D && typeof this.renderer3D.dispose === 'function') {
      this.renderer3D.dispose();
    }
    this.initialized = false;
  }
}