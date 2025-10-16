/**
 * Color System - Utilities for color manipulation and validation
 */

import chroma from 'chroma-js';

export interface ColorInfo {
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  alpha: number;
}

export class ColorSystem {
  /**
   * Parse a color string and return color information
   */
  static parseColor(color: string): ColorInfo {
    try {
      const chromaColor = chroma(color);
      return {
        hex: chromaColor.hex(),
        rgb: chromaColor.rgb() as [number, number, number],
        hsl: chromaColor.hsl() as [number, number, number],
        alpha: chromaColor.alpha(),
      };
    } catch (_error) {
      throw new Error(`Invalid color format: ${color}`);
    }
  }

  /**
   * Validate if a color string is valid
   */
  static isValidColor(color: string): boolean {
    try {
      chroma(color);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Convert color to hex format
   */
  static toHex(color: string): string {
    return chroma(color).hex();
  }

  /**
   * Convert color to RGB format
   */
  static toRgb(color: string): [number, number, number] {
    return chroma(color).rgb() as [number, number, number];
  }

  /**
   * Convert color to HSL format
   */
  static toHsl(color: string): [number, number, number] {
    return chroma(color).hsl() as [number, number, number];
  }

  /**
   * Lighten a color by a given amount
   */
  static lighten(color: string, amount: number): string {
    return chroma(color).brighten(amount).hex();
  }

  /**
   * Darken a color by a given amount
   */
  static darken(color: string, amount: number): string {
    return chroma(color).darken(amount).hex();
  }

  /**
   * Adjust color saturation
   */
  static saturate(color: string, amount: number): string {
    return chroma(color).saturate(amount).hex();
  }

  /**
   * Desaturate a color
   */
  static desaturate(color: string, amount: number): string {
    return chroma(color).desaturate(amount).hex();
  }

  /**
   * Mix two colors
   */
  static mix(color1: string, color2: string, ratio: number = 0.5): string {
    return chroma.mix(color1, color2, ratio).hex();
  }

  /**
   * Generate a color palette
   */
  static generatePalette(baseColor: string, count: number = 5): string[] {
    const base = chroma(baseColor);
    const palette: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const factor = (i - Math.floor(count / 2)) * 0.3;
      palette.push(base.brighten(factor).hex());
    }
    
    return palette;
  }

  /**
   * Get complementary color
   */
  static getComplementary(color: string): string {
    const hsl = chroma(color).hsl();
    const complementaryHue = (hsl[0] + 180) % 360;
    return chroma.hsl(complementaryHue, hsl[1], hsl[2]).hex();
  }

  /**
   * Get analogous colors
   */
  static getAnalogous(color: string, count: number = 3): string[] {
    const hsl = chroma(color).hsl();
    const colors: string[] = [];
    const step = 30; // degrees
    
    for (let i = 0; i < count; i++) {
      const hue = (hsl[0] + (i - Math.floor(count / 2)) * step) % 360;
      colors.push(chroma.hsl(hue, hsl[1], hsl[2]).hex());
    }
    
    return colors;
  }

  /**
   * Get triadic colors
   */
  static getTriadic(color: string): [string, string, string] {
    const hsl = chroma(color).hsl();
    return [
      chroma.hsl(hsl[0], hsl[1], hsl[2]).hex(),
      chroma.hsl((hsl[0] + 120) % 360, hsl[1], hsl[2]).hex(),
      chroma.hsl((hsl[0] + 240) % 360, hsl[1], hsl[2]).hex(),
    ];
  }

  /**
   * Calculate color contrast ratio
   */
  static getContrastRatio(color1: string, color2: string): number {
    return chroma.contrast(color1, color2);
  }

  /**
   * Check if color combination meets accessibility standards
   */
  static isAccessible(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean {
    const contrast = this.getContrastRatio(foreground, background);
    return level === 'AA' ? contrast >= 4.5 : contrast >= 7;
  }
}