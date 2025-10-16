// src/rendering/platform-canvas.ts
/**
 * Platform Canvas Abstraction
 * Supports both browser (HTMLCanvasElement) and Node.js (node-canvas)
 */

export type CanvasLike = HTMLCanvasElement | any;
export type ContextLike = CanvasRenderingContext2D | any;

export interface PlatformCanvas {
  createCanvas(width: number, height: number): CanvasLike;
  getContext(canvas: CanvasLike): ContextLike;
  isBrowser(): boolean;
  toBuffer(canvas: CanvasLike, format: string, quality?: number): Promise<Buffer>;
  toBlob(canvas: CanvasLike, format: string, quality?: number): Promise<Blob>;
}

/**
 * Browser implementation
 */
class BrowserCanvas implements PlatformCanvas {
  createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D rendering context');
    }
    return ctx;
  }

  isBrowser(): boolean {
    return true;
  }

  async toBuffer(canvas: HTMLCanvasElement, format: string, quality?: number): Promise<Buffer> {
    // In browser, convert blob to buffer
    const blob = await this.toBlob(canvas, format, quality);
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async toBlob(canvas: HTMLCanvasElement, format: string, quality?: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        `image/${format}`,
        quality
      );
    });
  }
}

/**
 * Node.js implementation using node-canvas
 */
class NodeCanvas implements PlatformCanvas {
  private createCanvasFn: any;

  constructor() {
    try {
      // Dynamic import for node-canvas
      let canvas;
      try {
        // Try ES module import first
        canvas = require('canvas');
      } catch {
        // Fallback: try to import directly
        throw new Error('Canvas module not found');
      }
      
      this.createCanvasFn = canvas.createCanvas || canvas.default?.createCanvas;
      
      if (!this.createCanvasFn) {
        throw new Error('createCanvas function not found in canvas module');
      }
    } catch (error) {
      throw new Error(
        'node-canvas is required for Node.js environment. Install it with: npm install canvas\n' +
        `Error: ${error instanceof Error ? error.message : 'Unknown'}`
      );
    }
  }

  createCanvas(width: number, height: number): any {
    return this.createCanvasFn(width, height);
  }

  getContext(canvas: any): any {
    return canvas.getContext('2d');
  }

  isBrowser(): boolean {
    return false;
  }

  async toBuffer(canvas: any, format: string, quality?: number): Promise<Buffer> {
    const mimeType = `image/${format}`;
    
    if (format === 'png') {
      return canvas.toBuffer('image/png');
    } else if (format === 'jpeg' || format === 'jpg') {
      return canvas.toBuffer('image/jpeg', { quality: quality || 0.9 });
    } else if (format === 'webp') {
      // node-canvas may not support webp, fallback to png
      try {
        return canvas.toBuffer('image/webp', { quality: quality || 0.9 });
      } catch {
        console.warn('WebP not supported, falling back to PNG');
        return canvas.toBuffer('image/png');
      }
    } else {
      // Default to PNG
      return canvas.toBuffer('image/png');
    }
  }

  async toBlob(canvas: any, format: string, quality?: number): Promise<Blob> {
    const buffer = await this.toBuffer(canvas, format, quality);
    return new Blob([buffer], { type: `image/${format}` });
  }
}

/**
 * Factory to create the appropriate canvas implementation
 */
export class CanvasFactory {
  private static instance: PlatformCanvas | null = null;

  static getInstance(): PlatformCanvas {
    if (!this.instance) {
      this.instance = this.detectPlatform();
    }
    return this.instance;
  }

  private static detectPlatform(): PlatformCanvas {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      return new BrowserCanvas();
    }

    // Check if we're in Node.js
    if (typeof process !== 'undefined' && process.versions && process.versions.node) {
      return new NodeCanvas();
    }

    // Fallback - try browser first, then Node
    try {
      return new BrowserCanvas();
    } catch {
      return new NodeCanvas();
    }
  }

  /**
   * Reset instance (useful for testing)
   */
  static reset(): void {
    this.instance = null;
  }

  /**
   * Set custom canvas implementation
   */
  static setInstance(canvas: PlatformCanvas): void {
    this.instance = canvas;
  }
}

export default CanvasFactory;

