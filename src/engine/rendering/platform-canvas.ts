// src/rendering/platform-canvas.ts
/**
 * Browser Canvas Abstraction
 * Browser-only implementation (no Node.js support)
 */

export type CanvasLike = HTMLCanvasElement;
export type ContextLike = CanvasRenderingContext2D;

export interface PlatformCanvas {
  createCanvas(width: number, height: number): HTMLCanvasElement;
  getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D;
  isBrowser(): boolean;
  toBuffer(canvas: HTMLCanvasElement, format: string, quality?: number): Promise<Buffer>;
  toBlob(canvas: HTMLCanvasElement, format: string, quality?: number): Promise<Blob>;
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
 * Factory to create browser canvas implementation
 */
export class CanvasFactory {
  private static instance: PlatformCanvas | null = null;

  static getInstance(): PlatformCanvas {
    if (!this.instance) {
      this.instance = new BrowserCanvas();
    }
    return this.instance;
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

