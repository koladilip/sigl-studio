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
  private parser: SIGLParser;

  constructor(config: SIGLConfig) {
    this.config = config;
    this.renderer = new SceneRenderer(config);
    this.parser = new SIGLParser();
  }

  /**
   * Initialize the SIGL engine
   */
  async initialize(): Promise<Result<void>> {
    try {
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
   * Render a scene definition
   */
  async render(scene: SceneDefinition, options?: RenderOptions): Promise<Result<HTMLCanvasElement>> {
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
      
      // Use the scene renderer to actually render the scene
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
      const canvasFactory = CanvasFactory.getInstance();
      const format = options.format || 'png';
      const quality = (options.quality || 90) / 100;
      
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
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    this.initialized = false;
  }
}