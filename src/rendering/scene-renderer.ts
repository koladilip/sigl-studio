import { 
  SceneDefinition, 
  EntityDefinition, 
  RenderOptions, 
  SITLConfig,
  SITLError,
  LightingDefinition,
  AtmosphereDefinition,
  FogDefinition
} from '../core/types';

/**
 * Rendering context for managing canvas and drawing operations
 */
export interface RenderContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  scale: number;
  camera: {
    x: number;
    y: number;
    zoom: number;
  };
}

/**
 * Rendered entity information
 */
export interface RenderedEntity {
  id: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  visible: boolean;
  zIndex: number;
}

/**
 * Scene rendering result
 */
export interface RenderResult {
  success: boolean;
  canvas?: HTMLCanvasElement;
  entities: RenderedEntity[];
  renderTime: number;
  errors: SITLError[];
}

/**
 * Main scene renderer class
 */
export class SceneRenderer {
  private config: SITLConfig;
  private context?: RenderContext;

  constructor(config: SITLConfig) {
    this.config = config;
  }

  /**
   * Render a scene to a canvas
   */
  async render(scene: SceneDefinition, options: RenderOptions = {}): Promise<RenderResult> {
    const startTime = performance.now();
    const errors: SITLError[] = [];
    const renderedEntities: RenderedEntity[] = [];

    try {
      // Create or update render context
      this.context = this.createRenderContext(options);
      
      // Clear canvas
      this.clearCanvas();
      
      // Render background
      await this.renderBackground(scene);
      
      // Sort entities by z-index for proper layering
      const sortedEntities = this.sortEntitiesByDepth(scene.entities);
      
      // Render each entity
      for (const entity of sortedEntities) {
        try {
          const renderedEntity = await this.renderEntity(entity);
          renderedEntities.push(renderedEntity);
        } catch (error) {
          errors.push({
            type: 'render_error',
            message: `Failed to render entity ${entity.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            context: `Entity: ${entity.id}`
          });
        }
      }
      
      // Apply post-processing effects
      await this.applyPostProcessing(scene);
      
      const renderTime = performance.now() - startTime;
      
      return {
        success: errors.length === 0,
        canvas: this.context.canvas,
        entities: renderedEntities,
        renderTime,
        errors
      };
      
    } catch (error) {
      const renderTime = performance.now() - startTime;
      
      return {
        success: false,
        entities: renderedEntities,
        renderTime,
        errors: [{
          type: 'render_error',
          message: error instanceof Error ? error.message : 'Unknown rendering error'
        }]
      };
    }
  }

  /**
   * Create a render context
   */
  private createRenderContext(options: RenderOptions): RenderContext {
    const width = options.width || this.config.canvas.width;
    const height = options.height || this.config.canvas.height;
    
    // Create canvas if not provided
    let canvas: HTMLCanvasElement;
    if (typeof document !== 'undefined') {
      canvas = document.createElement('canvas');
    } else {
      // For Node.js environments, we'd need a canvas library like node-canvas
      throw new Error('Canvas rendering not supported in this environment');
    }
    
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D rendering context');
    }
    
    // Configure context
    ctx.imageSmoothingEnabled = this.config.rendering.antialiasing;
    
    return {
      canvas,
      ctx,
      width,
      height,
      scale: window.devicePixelRatio || 1,
      camera: {
        x: 0,
        y: 0,
        zoom: 1
      }
    };
  }

  /**
   * Clear the canvas
   */
  private clearCanvas(): void {
    if (!this.context) return;
    
    const { ctx, width, height } = this.context;
    ctx.clearRect(0, 0, width, height);
    
    // Set background color
    ctx.fillStyle = this.config.canvas.backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  /**
   * Render scene background
   */
  private async renderBackground(scene: SceneDefinition): Promise<void> {
    if (!this.context || !scene.environment.background) return;
    
    const { ctx, width, height } = this.context;
    const background = scene.environment.background;
    
    switch (background.type) {
      case 'solid':
        ctx.fillStyle = background.color || '#ffffff';
        ctx.fillRect(0, 0, width, height);
        break;
        
      case 'gradient':
        if (background.value && typeof background.value === 'object' && 'colors' in background.value) {
          const gradient = background.value;
          const canvasGradient = gradient.type === 'linear' 
            ? ctx.createLinearGradient(0, 0, width, height)
            : ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
          
          gradient.colors.forEach((color, index) => {
            const stop = gradient.stops?.[index] || index / (gradient.colors.length - 1);
            canvasGradient.addColorStop(stop, color);
          });
          
          ctx.fillStyle = canvasGradient;
          ctx.fillRect(0, 0, width, height);
        }
        break;
        
      case 'image':
        // Image background would require loading the image first
        // TODO: Implement image background support
        break;
    }
  }

  /**
   * Sort entities by depth for proper rendering order
   */
  private sortEntitiesByDepth(entities: EntityDefinition[]): EntityDefinition[] {
    return [...entities].sort((a, b) => {
      const aZ = a.position.z || 0;
      const bZ = b.position.z || 0;
      return aZ - bZ; // Render back to front
    });
  }

  /**
   * Render a single entity
   */
  private async renderEntity(entity: EntityDefinition): Promise<RenderedEntity> {
    if (!this.context) {
      throw new Error('No render context available');
    }
    
    const { ctx } = this.context;
    const worldPos = this.worldToScreen(entity.position.x, entity.position.y);
    
    // Save context state
    ctx.save();
    
    try {
      // Apply transformations
      ctx.translate(worldPos.x, worldPos.y);
      
      if (entity.position.rotation) {
        ctx.rotate(entity.position.rotation);
      }
      
      if (entity.position.scale) {
        ctx.scale(entity.position.scale, entity.position.scale);
      }
      
      // Render based on entity type
      const bounds = await this.renderEntityByType(entity);
      
      return {
        id: entity.id,
        bounds: {
          x: worldPos.x + bounds.x,
          y: worldPos.y + bounds.y,
          width: bounds.width,
          height: bounds.height
        },
        visible: true,
        zIndex: entity.position.z || 0
      };
      
    } finally {
      // Restore context state
      ctx.restore();
    }
  }

  /**
   * Render entity based on its type
   */
  private async renderEntityByType(entity: EntityDefinition): Promise<{ x: number; y: number; width: number; height: number }> {
    if (!this.context) {
      throw new Error('No render context available');
    }
    
    const { ctx } = this.context;
    
    switch (entity.entityType) {
      case 'human':
        return this.renderHuman(entity);
        
      case 'object':
        return this.renderObject(entity);
        
      case 'prop':
        return this.renderProp(entity);
        
      default:
        // Default rendering as a simple rectangle
        ctx.fillStyle = '#cccccc';
        ctx.fillRect(-25, -25, 50, 50);
        return { x: -25, y: -25, width: 50, height: 50 };
    }
  }

  /**
   * Render a human entity
   */
  private renderHuman(entity: EntityDefinition): { x: number; y: number; width: number; height: number } {
    if (!this.context) {
      throw new Error('No render context available');
    }
    
    const { ctx } = this.context;
    const attributes = entity.attributes as Record<string, unknown>;
    
    const width = 30;
    const height = 60;
    const x = -width / 2;
    const y = -height;
    
    // Simple human representation
    // Head
    ctx.fillStyle = this.getSkinColor(attributes.skin as string || 'medium');
    ctx.fillRect(x + 5, y, 20, 20);
    
    // Hair
    ctx.fillStyle = this.getHairColor(attributes.hair as string || 'brown');
    ctx.fillRect(x + 3, y - 5, 24, 10);
    
    // Body
    ctx.fillStyle = '#4a90e2';
    ctx.fillRect(x + 8, y + 20, 14, 25);
    
    // Arms
    ctx.fillStyle = this.getSkinColor(attributes.skin as string || 'medium');
    ctx.fillRect(x, y + 22, 8, 20);
    ctx.fillRect(x + 22, y + 22, 8, 20);
    
    // Legs
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(x + 8, y + 45, 6, 15);
    ctx.fillRect(x + 16, y + 45, 6, 15);
    
    return { x, y, width, height };
  }

  /**
   * Render an object entity
   */
  private renderObject(entity: EntityDefinition): { x: number; y: number; width: number; height: number } {
    if (!this.context) {
      throw new Error('No render context available');
    }
    
    const { ctx } = this.context;
    const attributes = entity.attributes as Record<string, unknown>;
    
    const width = 40;
    const height = 40;
    const x = -width / 2;
    const y = -height / 2;
    
    // Simple object representation
    ctx.fillStyle = attributes.color as string || '#888888';
    ctx.fillRect(x, y, width, height);
    
    // Add some shading
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(x + width - 5, y, 5, height);
    ctx.fillRect(x, y + height - 5, width, 5);
    
    return { x, y, width, height };
  }

  /**
   * Render a prop entity
   */
  private renderProp(entity: EntityDefinition): { x: number; y: number; width: number; height: number } {
    if (!this.context) {
      throw new Error('No render context available');
    }
    
    const { ctx } = this.context;
    const attributes = entity.attributes as Record<string, unknown>;
    
    const width = 20;
    const height = 20;
    const x = -width / 2;
    const y = -height / 2;
    
    // Simple prop representation
    ctx.fillStyle = attributes.color as string || '#666666';
    ctx.fillRect(x, y, width, height);
    
    // Add highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(-5, -5, width / 4, 0, Math.PI * 2);
    ctx.fill();
    
    return { x, y, width, height };
  }

  /**
   * Apply post-processing effects
   */
  private async applyPostProcessing(scene: SceneDefinition): Promise<void> {
    if (!this.context) return;
    
    // Apply lighting effects
    if (scene.environment.lighting) {
      await this.applyLighting(scene.environment.lighting);
    }
    
    // Apply atmosphere effects
    if (scene.environment.atmosphere) {
      await this.applyAtmosphere(scene.environment.atmosphere);
    }
  }

  /**
   * Apply lighting effects
   */
  private async applyLighting(lighting: LightingDefinition): Promise<void> {
    if (!this.context) return;
    
    const { ctx, width, height } = this.context;
    
    // Simple ambient lighting overlay
    const intensity = lighting.intensity || 1.0;
    const alpha = Math.max(0, Math.min(1, 1 - intensity));
    
    if (alpha > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.3})`;
      ctx.fillRect(0, 0, width, height);
    }
  }

  /**
   * Apply atmosphere effects
   */
  private async applyAtmosphere(atmosphere: AtmosphereDefinition): Promise<void> {
    if (!this.context || !atmosphere.fog) return;
    
    const { ctx, width, height } = this.context;
    const fog = atmosphere.fog as FogDefinition;
    
    // Simple fog effect
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 2
    );
    
    gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
    gradient.addColorStop(1, `${fog.color}${Math.round((fog.density || 0) * 255).toString(16).padStart(2, '0')}`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  /**
   * Convert world coordinates to screen coordinates
   */
  private worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    if (!this.context) {
      return { x: 0, y: 0 };
    }
    
    const { width, height, camera } = this.context;
    
    return {
      x: (worldX - camera.x) * camera.zoom + width / 2,
      y: (worldY - camera.y) * camera.zoom + height / 2
    };
  }

  /**
   * Get skin color hex value
   */
  private getSkinColor(skin: string): string {
    const colors = {
      light: '#FDBCB4',
      medium: '#E1A95F',
      dark: '#8D5524',
      olive: '#C68642',
      tan: '#D2B48C'
    };
    return colors[skin as keyof typeof colors] || colors.medium;
  }

  /**
   * Get hair color hex value
   */
  private getHairColor(hair: string): string {
    const colors = {
      black: '#2C1B18',
      brown: '#8B4513',
      blonde: '#FAD5A5',
      red: '#CC4125',
      gray: '#808080',
      white: '#F5F5F5'
    };
    return colors[hair as keyof typeof colors] || colors.brown;
  }

  /**
   * Update camera position
   */
  setCamera(x: number, y: number, zoom: number = 1): void {
    if (this.context) {
      this.context.camera = { x, y, zoom };
    }
  }

  /**
   * Get current render context
   */
  getContext(): RenderContext | undefined {
    return this.context;
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.context = undefined;
  }
}

export default SceneRenderer;