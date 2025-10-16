import { 
  SceneDefinition, 
  EntityDefinition,
  ExportOptions, 
  SITLError,
  SITLConfig,
  BackgroundDefinition,
  GradientDefinition
} from '../core/types';
import { SceneRenderer } from './scene-renderer';

/**
 * Export result information
 */
export interface ExportResult {
  success: boolean;
  data?: Blob | string;
  filename: string;
  format: string;
  size: number;
  exportTime: number;
  errors: SITLError[];
}

/**
 * Export metadata
 */
export interface ExportMetadata {
  title?: string;
  description?: string;
  author?: string;
  created: Date;
  software: string;
  version: string;
  scene: {
    entities: number;
    dimensions: { width: number; height: number };
  };
}

/**
 * Export manager for handling scene exports to various formats
 */
export class ExportManager {
  private config: SITLConfig;
  private renderer: SceneRenderer;

  constructor(config: SITLConfig) {
    this.config = config;
    this.renderer = new SceneRenderer(config);
  }

  /**
   * Export a scene to the specified format
   */
  async export(scene: SceneDefinition, options: ExportOptions): Promise<ExportResult> {
    const startTime = performance.now();

    try {
      // Validate export options
      const validationErrors = this.validateExportOptions(options);
      if (validationErrors.length > 0) {
        return {
          success: false,
          filename: options.filename || 'scene',
          format: options.format,
          size: 0,
          exportTime: performance.now() - startTime,
          errors: validationErrors
        };
      }

      // Generate filename if not provided
      const filename = this.generateFilename(options);

      // Export based on format
      let result: ExportResult;
      switch (options.format) {
        case 'png':
          result = await this.exportToPNG(scene, options, filename);
          break;
        case 'jpg':
          result = await this.exportToJPG(scene, options, filename);
          break;
        case 'svg':
          result = await this.exportToSVG(scene, options, filename);
          break;
        case 'pdf':
          result = await this.exportToPDF(scene, options, filename);
          break;
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }

      result.exportTime = performance.now() - startTime;
      return result;

    } catch (error) {
      return {
        success: false,
        filename: options.filename || 'scene',
        format: options.format,
        size: 0,
        exportTime: performance.now() - startTime,
        errors: [{
          type: 'export_error',
          message: error instanceof Error ? error.message : 'Unknown export error'
        }]
      };
    }
  }

  /**
   * Export scene to PNG format
   */
  private async exportToPNG(scene: SceneDefinition, options: ExportOptions, filename: string): Promise<ExportResult> {
    const renderResult = await this.renderer.render(scene, {
      width: options.width,
      height: options.height,
      quality: 'high'
    });

    if (!renderResult.success || !renderResult.canvas) {
      return {
        success: false,
        filename,
        format: 'png',
        size: 0,
        exportTime: 0,
        errors: renderResult.errors
      };
    }

    return new Promise((resolve) => {
      renderResult.canvas!.toBlob((blob) => {
        if (!blob) {
          resolve({
            success: false,
            filename,
            format: 'png',
            size: 0,
            exportTime: 0,
            errors: [{ type: 'export_error', message: 'Failed to create PNG blob' }]
          });
          return;
        }

        resolve({
          success: true,
          data: blob,
          filename,
          format: 'png',
          size: blob.size,
          exportTime: 0,
          errors: []
        });
      }, 'image/png', options.quality || 0.9);
    });
  }

  /**
   * Export scene to JPG format
   */
  private async exportToJPG(scene: SceneDefinition, options: ExportOptions, filename: string): Promise<ExportResult> {
    const renderResult = await this.renderer.render(scene, {
      width: options.width,
      height: options.height,
      quality: 'high'
    });

    if (!renderResult.success || !renderResult.canvas) {
      return {
        success: false,
        filename,
        format: 'jpg',
        size: 0,
        exportTime: 0,
        errors: renderResult.errors
      };
    }

    return new Promise((resolve) => {
      renderResult.canvas!.toBlob((blob) => {
        if (!blob) {
          resolve({
            success: false,
            filename,
            format: 'jpg',
            size: 0,
            exportTime: 0,
            errors: [{ type: 'export_error', message: 'Failed to create JPG blob' }]
          });
          return;
        }

        resolve({
          success: true,
          data: blob,
          filename,
          format: 'jpg',
          size: blob.size,
          exportTime: 0,
          errors: []
        });
      }, 'image/jpeg', options.quality || 0.8);
    });
  }

  /**
   * Export scene to SVG format
   */
  private async exportToSVG(scene: SceneDefinition, options: ExportOptions, filename: string): Promise<ExportResult> {
    try {
      const width = options.width || this.config.canvas.width;
      const height = options.height || this.config.canvas.height;
      
      let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;

      // Add metadata if requested
      if (options.metadata) {
        const metadata = this.generateMetadata(scene, { width, height });
        svg += `
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
             xmlns:dc="http://purl.org/dc/elements/1.1/">
      <rdf:Description>
        <dc:title>${metadata.title || 'SITL Scene'}</dc:title>
        <dc:creator>${metadata.author || 'SITL Engine'}</dc:creator>
        <dc:date>${metadata.created.toISOString()}</dc:date>
        <dc:description>${metadata.description || 'Generated by SITL Engine'}</dc:description>
      </rdf:Description>
    </rdf:RDF>
  </metadata>`;
      }

      // Render background
      if (scene.environment.background) {
        svg += this.renderBackgroundSVG(scene.environment.background, width, height);
      }

      // Render entities
      const sortedEntities = scene.entities.sort((a, b) => (a.position.z || 0) - (b.position.z || 0));
      for (const entity of sortedEntities) {
        svg += this.renderEntitySVG(entity, width, height);
      }

      svg += '\n</svg>';

      const blob = new Blob([svg], { type: 'image/svg+xml' });

      return {
        success: true,
        data: blob,
        filename,
        format: 'svg',
        size: blob.size,
        exportTime: 0,
        errors: []
      };

    } catch (error) {
      return {
        success: false,
        filename,
        format: 'svg',
        size: 0,
        exportTime: 0,
        errors: [{
          type: 'export_error',
          message: error instanceof Error ? error.message : 'SVG export failed'
        }]
      };
    }
  }

  /**
   * Export scene to PDF format
   */
  private async exportToPDF(scene: SceneDefinition, options: ExportOptions, filename: string): Promise<ExportResult> {
    // For PDF export, we'll create a simple text-based representation
    // In a real implementation, you'd use a library like jsPDF
    
    try {
      const width = options.width || this.config.canvas.width;
      const height = options.height || this.config.canvas.height;
      
      const pdfContent = `%PDF-1.4

1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 ${width} ${height}]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 100
>>
stream
BT
/F1 12 Tf
50 ${height - 50} Td
(SITL Scene Export) Tj
0 -20 Td
(Entities: ${scene.entities.length}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
356
%%EOF`;

      const blob = new Blob([pdfContent], { type: 'application/pdf' });

      return {
        success: true,
        data: blob,
        filename,
        format: 'pdf',
        size: blob.size,
        exportTime: 0,
        errors: []
      };

    } catch (error) {
      return {
        success: false,
        filename,
        format: 'pdf',
        size: 0,
        exportTime: 0,
        errors: [{
          type: 'export_error',
          message: error instanceof Error ? error.message : 'PDF export failed'
        }]
      };
    }
  }

  /**
   * Render background for SVG
   */
  private renderBackgroundSVG(background: BackgroundDefinition, width: number, height: number): string {
    switch (background.type) {
      case 'solid':
        return `\n  <rect width="${width}" height="${height}" fill="${background.color || '#ffffff'}" />`;
      
      case 'gradient': {
        if (background.value && typeof background.value === 'object' && 'colors' in background.value) {
          const gradient = background.value as GradientDefinition;
          const gradientId = 'bg-gradient';
          
          let gradientDef = gradient.type === 'linear'
            ? `\n  <defs><linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">`
            : `\n  <defs><radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%">`;
          
          gradient.colors.forEach((color: string, index: number) => {
            const offset = gradient.stops?.[index] || (index / (gradient.colors.length - 1)) * 100;
            gradientDef += `\n    <stop offset="${offset}%" stop-color="${color}" />`;
          });
          
          gradientDef += gradient.type === 'linear' 
            ? '\n  </linearGradient></defs>'
            : '\n  </radialGradient></defs>';
          
          return gradientDef + `\n  <rect width="${width}" height="${height}" fill="url(#${gradientId})" />`;
        }
        break;
      }
    }
    
    return `\n  <rect width="${width}" height="${height}" fill="#ffffff" />`;
  }

  /**
   * Render entity for SVG
   */
  private renderEntitySVG(entity: EntityDefinition, canvasWidth: number, canvasHeight: number): string {
    const x = entity.position.x + canvasWidth / 2;
    const y = entity.position.y + canvasHeight / 2;
    
    switch (entity.entityType) {
      case 'human':
        return `\n  <g transform="translate(${x}, ${y})">
    <circle cx="0" cy="-50" r="10" fill="#FDBCB4" />
    <rect x="-15" y="-30" width="30" height="40" fill="#4A90E2" />
  </g>`;
      
      case 'object': {
        const color = (entity.attributes as Record<string, unknown>).color || '#888888';
        return `\n  <rect x="${x - 20}" y="${y - 20}" width="40" height="40" fill="${color}" />`;
      }
      
      case 'prop':
        return `\n  <circle cx="${x}" cy="${y}" r="15" fill="#9B59B6" />`;
      
      default:
        return `\n  <rect x="${x - 25}" y="${y - 25}" width="50" height="50" fill="#cccccc" />`;
    }
  }

  /**
   * Validate export options
   */
  private validateExportOptions(options: ExportOptions): SITLError[] {
    const errors: SITLError[] = [];

    if (!options.format) {
      errors.push({
        type: 'validation_error',
        message: 'Export format is required'
      });
    }

    if (!['png', 'jpg', 'svg', 'pdf'].includes(options.format)) {
      errors.push({
        type: 'validation_error',
        message: `Unsupported export format: ${options.format}`
      });
    }

    if (options.quality !== undefined && (options.quality < 0 || options.quality > 1)) {
      errors.push({
        type: 'validation_error',
        message: 'Quality must be between 0 and 1'
      });
    }

    if (options.width !== undefined && options.width <= 0) {
      errors.push({
        type: 'validation_error',
        message: 'Width must be greater than 0'
      });
    }

    if (options.height !== undefined && options.height <= 0) {
      errors.push({
        type: 'validation_error',
        message: 'Height must be greater than 0'
      });
    }

    return errors;
  }

  /**
   * Generate filename with proper extension
   */
  private generateFilename(options: ExportOptions): string {
    const base = options.filename || `scene_${Date.now()}`;
    const extension = options.format;
    
    // Remove existing extension if present
    const baseName = base.replace(/\.[^/.]+$/, '');
    
    return `${baseName}.${extension}`;
  }

  /**
   * Generate export metadata
   */
  private generateMetadata(scene: SceneDefinition, dimensions: { width: number; height: number }): ExportMetadata {
    return {
      title: scene.name || 'SITL Scene',
      description: scene.description || 'Scene generated by SITL Engine',
      author: scene.metadata?.author || 'SITL Engine',
      created: new Date(),
      software: 'SITL Engine',
      version: scene.metadata?.version || '1.0.0',
      scene: {
        entities: scene.entities.length,
        dimensions
      }
    };
  }

  /**
   * Download exported file (browser only)
   */
  async downloadExport(exportResult: ExportResult): Promise<void> {
    if (!exportResult.success || !exportResult.data) {
      throw new Error('Cannot download failed export');
    }

    if (typeof window === 'undefined') {
      throw new Error('Download not supported in this environment');
    }

    const url = URL.createObjectURL(exportResult.data as Blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exportResult.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Get supported export formats
   */
  getSupportedFormats(): string[] {
    return ['png', 'jpg', 'svg', 'pdf'];
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.renderer.dispose();
  }
}

export default ExportManager;