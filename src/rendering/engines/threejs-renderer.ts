// src/rendering/engines/threejs-renderer.ts
/**
 * Three.js 3D Renderer for SIGL
 * Provides real 3D rendering with proper depth, lighting, and perspective
 */

import * as THREE from 'three';
import type { SceneDefinition, EntityDefinition, SIGLConfig } from '../../core/types';

export interface ThreeJSRenderResult {
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
}

export class ThreeJSRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private config: SIGLConfig;

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
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: config.rendering.antialiasing,
      alpha: true,
      preserveDrawingBuffer: true // Needed for export
    });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(config.canvas.backgroundColor || '#ffffff');
    
    // Enable shadows for realism
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  /**
   * Render a SIGL scene to 3D
   */
  async render(sceneDefinition: SceneDefinition): Promise<ThreeJSRenderResult> {
    // Clear previous scene
    this.scene.clear();
    
    // Setup lighting
    this.setupLighting(sceneDefinition);
    
    // Setup background/environment
    this.setupEnvironment(sceneDefinition);
    
    // Add entities as 3D meshes
    for (const entity of sceneDefinition.entities) {
      const mesh = this.createEntityMesh(entity);
      if (mesh) {
        this.scene.add(mesh);
      }
    }
    
    // Render the scene
    this.renderer.render(this.scene, this.camera);
    
    return {
      canvas: this.renderer.domElement,
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer
    };
  }

  /**
   * Create 3D mesh for SIGL entity
   */
  private createEntityMesh(entity: EntityDefinition): THREE.Object3D | null {
    const attrs = entity.attributes as any;
    
    if (entity.entityType === 'human') {
      return this.createHumanMesh(entity);
    } else if (entity.entityType === 'object') {
      return this.createObjectMesh(entity);
    }
    
    return null;
  }

  /**
   * Create 3D human figure
   */
  private createHumanMesh(entity: EntityDefinition): THREE.Group {
    const attrs = entity.attributes as any;
    const group = new THREE.Group();
    
    // Scale based on age
    const age = attrs.age || 25;
    const scale = age < 12 ? 0.7 : 1.0;
    
    // Get colors
    const skinColor = this.getSkinColor(attrs.appearance?.skin);
    const hairColor = this.getHairColor(attrs.hair?.color || attrs.appearance?.hair);
    const clothing = attrs.clothing || {};
    const shirtColor = clothing.shirt || '#4a90e2';
    const dressColor = clothing.dress || '#FF69B4';
    const pantsColor = clothing.pants || '#2c3e50';
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.2 * scale, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 1.5 * scale, 0);
    head.castShadow = true;
    group.add(head);
    
    // Hair
    const hairGeometry = new THREE.SphereGeometry(0.22 * scale, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const hairMaterial = new THREE.MeshStandardMaterial({ color: hairColor });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.set(0, 1.6 * scale, 0);
    group.add(hair);
    
    // Body (shirt or dress)
    if (clothing.dress) {
      // Dress (cone shape)
      const dressGeometry = new THREE.ConeGeometry(0.25 * scale, 0.8 * scale, 8);
      const dressMaterial = new THREE.MeshStandardMaterial({ color: dressColor });
      const dress = new THREE.Mesh(dressGeometry, dressMaterial);
      dress.position.set(0, 0.9 * scale, 0);
      dress.castShadow = true;
      group.add(dress);
    } else {
      // Shirt (box)
      const bodyGeometry = new THREE.BoxGeometry(0.4 * scale, 0.6 * scale, 0.2 * scale);
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: shirtColor });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.set(0, 1.0 * scale, 0);
      body.castShadow = true;
      group.add(body);
      
      // Legs (pants)
      const legGeometry = new THREE.BoxGeometry(0.15 * scale, 0.5 * scale, 0.15 * scale);
      const legMaterial = new THREE.MeshStandardMaterial({ color: pantsColor });
      
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
      leftLeg.position.set(-0.1 * scale, 0.45 * scale, 0);
      leftLeg.castShadow = true;
      group.add(leftLeg);
      
      const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
      rightLeg.position.set(0.1 * scale, 0.45 * scale, 0);
      rightLeg.castShadow = true;
      group.add(rightLeg);
    }
    
    // Arms
    const armGeometry = new THREE.BoxGeometry(0.1 * scale, 0.5 * scale, 0.1 * scale);
    const armMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.3 * scale, 1.0 * scale, 0);
    group.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.3 * scale, 1.0 * scale, 0);
    group.add(rightArm);
    
    // Position the group
    const pos = entity.position;
    // Convert SIGL coordinates to Three.js world space
    group.position.set(
      (pos.x - 400) / 100, // Center at x=400, scale down
      -(pos.y - 300) / 100, // Invert Y, center at y=300
      -(pos.z || 0) / 100 // Z-axis (negative = away from camera)
    );
    
    return group;
  }

  /**
   * Create 3D object mesh
   */
  private createObjectMesh(entity: EntityDefinition): THREE.Mesh {
    const attrs = entity.attributes as any;
    
    // Simple box for now
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({
      color: attrs.color || '#888888'
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    // Position
    const pos = entity.position;
    mesh.position.set(
      (pos.x - 400) / 100,
      -(pos.y - 300) / 100,
      -(pos.z || 0) / 100
    );
    
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    return mesh;
  }

  /**
   * Setup scene lighting
   */
  private setupLighting(sceneDefinition: SceneDefinition): void {
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
   * Get skin color
   */
  private getSkinColor(skin?: string): string {
    const colors: Record<string, string> = {
      'light': '#FDBCB4',
      'medium': '#E1A95F',
      'dark': '#8D5524',
      'olive': '#C68642',
      'pale': '#FFE4C4',
      'tan': '#D2B48C'
    };
    return colors[skin || 'medium'] || '#E1A95F';
  }

  /**
   * Get hair color
   */
  private getHairColor(hair?: string): string {
    if (hair && hair.startsWith('#')) return hair;
    
    const colors: Record<string, string> = {
      'black': '#2C1B18',
      'brown': '#8B4513',
      'blonde': '#FAD5A5',
      'red': '#CC4125',
      'gray': '#808080',
      'white': '#F5F5F5'
    };
    return colors[hair || 'brown'] || '#8B4513';
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

