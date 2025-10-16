// src/rendering/engines/threejs-renderer.ts
/**
 * Three.js 3D Renderer for SIGL
 * Provides real 3D rendering with proper depth, lighting, and perspective
 * Works in both browser and Node.js environments
 */

import * as THREE from 'three';
import type { SceneDefinition, EntityDefinition, SIGLConfig } from '../../core/types';
import { EntityRegistry } from '../../entities/EntityRegistry';

export interface ThreeJSRenderResult {
  canvas: any;
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
}

export class ThreeJSRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private config: SIGLConfig;
  private canvas: any;

  constructor(config: SIGLConfig) {
    this.config = config;
    
    // Create Three.js scene
    this.scene = new THREE.Scene();
    
    // Create camera with perspective
    const width = config.canvas.width;
    const height = config.canvas.height;
    this.camera = new THREE.PerspectiveCamera(
      45, // FOV
      width / height, // Aspect ratio
      0.1, // Near clipping
      1000 // Far clipping
    );
    
    // Position camera to view scene
    this.camera.position.set(0, 1, 8);
    this.camera.lookAt(0, 0, 0);
    
    // Create platform-specific canvas and renderer
    this.canvas = this.createCanvas(width, height);
    this.renderer = this.createRenderer(width, height);
    
    // Enable shadows for realism
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  /**
   * Create canvas (browser-only)
   */
  private createCanvas(width: number, height: number): HTMLCanvasElement {
    if (typeof document === 'undefined') {
      throw new Error('Three.js renderer requires browser environment');
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  /**
   * Create WebGL renderer (browser-only)
   */
  private createRenderer(width: number, height: number): THREE.WebGLRenderer {
    if (typeof document === 'undefined') {
      throw new Error('Three.js renderer requires browser environment');
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.config.rendering.antialiasing,
      alpha: true,
      preserveDrawingBuffer: true
    });
    
    renderer.setSize(width, height);
    renderer.setClearColor(this.config.canvas.backgroundColor || '#ffffff');
    
    return renderer;
  }

  /**
   * Render a SIGL scene to 3D
   */
  async render(sceneDefinition: SceneDefinition): Promise<ThreeJSRenderResult> {
    console.log('🎨 Three.js Renderer: Starting render...')
    console.log('Scene has', sceneDefinition.entities.length, 'entities')
    
    // Clear previous scene
    this.scene.clear();
    
    // Setup lighting
    this.setupLighting(sceneDefinition);
    console.log('✅ Lighting set up')
    
    // Setup background/environment
    this.setupEnvironment(sceneDefinition);
    console.log('✅ Environment set up')
    
    // Add entities as 3D meshes
    let meshCount = 0;
    for (const entity of sceneDefinition.entities) {
      console.log(`  Creating mesh for: ${entity.entityType} - ${entity.attributes.entitySubType}`)
      const mesh = this.createEntityMesh(entity);
      if (mesh) {
        this.scene.add(mesh);
        meshCount++;
        console.log(`  ✅ Added mesh at position:`, mesh.position)
      } else {
        console.log(`  ⚠️ No mesh created for entity`)
      }
    }
    
    console.log(`✅ Added ${meshCount} meshes to scene`)
    console.log('Camera position:', this.camera.position)
    console.log('Scene children:', this.scene.children.length)
    
    // Render the scene
    this.renderer.render(this.scene, this.camera);
    console.log('✅ Three.js render complete')
    
    return {
      canvas: this.canvas,
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer
    };
  }

  /**
   * Export rendered scene to buffer (for Node.js)
   */
  async toBuffer(format: string = 'png', quality?: number): Promise<Buffer> {
    // Browser environment
    if (typeof document !== 'undefined') {
      return new Promise((resolve, reject) => {
        this.canvas.toBlob((blob: Blob | null) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          blob.arrayBuffer().then(buffer => {
            resolve(Buffer.from(buffer));
          }).catch(reject);
        }, `image/${format}`, quality);
      });
    }
    
    // Node.js environment
    try {
      if (format === 'png') {
        return this.canvas.toBuffer('image/png');
      } else if (format === 'jpeg' || format === 'jpg') {
        return this.canvas.toBuffer('image/jpeg', { quality: quality || 0.9 });
      } else {
        return this.canvas.toBuffer('image/png');
      }
    } catch (error) {
      throw new Error(`Failed to export to buffer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Export rendered scene to blob (for browser)
   */
  async toBlob(format: string = 'png', quality?: number): Promise<Blob> {
    if (typeof document !== 'undefined') {
      return new Promise((resolve, reject) => {
        this.canvas.toBlob((blob: Blob | null) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          resolve(blob);
        }, `image/${format}`, quality);
      });
    }
    
    // Node.js - convert buffer to blob
    const buffer = await this.toBuffer(format, quality);
    const uint8Array = new Uint8Array(buffer);
    return new Blob([uint8Array], { type: `image/${format}` });
  }

  /**
   * Create 3D mesh for SIGL entity using Entity Registry
   */
  private createEntityMesh(entity: EntityDefinition): THREE.Object3D | null {
    const registry = EntityRegistry.getInstance();
    return registry.buildEntity(entity);
  }


  /**
   * Setup scene lighting
   */
  private setupLighting(_sceneDefinition: SceneDefinition): void {
    // Ambient light (overall illumination)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    // Main directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(5, 10, 5);
    sunLight.castShadow = true;
    
    // Shadow settings
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    
    this.scene.add(sunLight);
    
    // Fill light (soften shadows)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);
  }

  /**
   * Setup environment/background
   */
  private setupEnvironment(sceneDefinition: SceneDefinition): void {
    const env = sceneDefinition.environment;
    
    // Set background color
    if (env.background?.type === 'solid' && env.background.color) {
      this.scene.background = new THREE.Color(env.background.color);
    } else if (env.background?.type === 'gradient') {
      // Create gradient texture for background
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      
      const gradient = ctx.createLinearGradient(0, 0, 0, 256);
      if (env.background.value && typeof env.background.value === 'object' && 'colors' in env.background.value) {
        const colors = env.background.value.colors;
        colors.forEach((color, i) => {
          gradient.addColorStop(i / (colors.length - 1), color);
        });
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
      
      const texture = new THREE.CanvasTexture(canvas);
      this.scene.background = texture;
    } else {
      this.scene.background = new THREE.Color('#ffffff');
    }
    
    // Add ground plane for shadows
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x90EE90,
      side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }


  /**
   * Update camera position
   */
  setCamera(position: [number, number, number], lookAt: [number, number, number]): void {
    this.camera.position.set(...position);
    this.camera.lookAt(...lookAt);
  }

  /**
   * Get renderer for export
   */
  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.renderer.dispose();
    this.scene.clear();
  }
}

export default ThreeJSRenderer;

