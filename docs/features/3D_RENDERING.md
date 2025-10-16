# 3D Rendering in SIGL

**Status:** 📋 Ready to Implement

## Overview

SIGL can be enhanced with **Three.js** for 3D rendering, providing true depth, perspective, and realistic positioning.

## Current vs 3D Rendering

### Current (2D Canvas)
```sigl
DRAW MAN AT LEFT          // x=150, y=300, z=0 (flat)
DRAW WOMAN BEHIND MAN     // x=150, y=350, z=-30 (fake depth)
```
- ❌ No perspective (far objects same size as near)
- ❌ Z-index only for layering
- ⚠️ Fake depth using y-offset

### With Three.js (3D)
```sigl
DRAW MAN AT LEFT          // x=-2, y=0, z=0
DRAW WOMAN BEHIND MAN     // x=-2, y=0, z=-2 (actual 3D space!)
```
- ✅ Real perspective (far objects appear smaller)
- ✅ True 3D coordinates
- ✅ Lighting and shadows
- ✅ Camera positioning
- ✅ Realistic depth of field

## Implementation Options

### Option 1: Add Three.js Renderer (Recommended)

**Install:**
```bash
npm install three @types/three
```

**Architecture:**
```typescript
// src/rendering/engines/threejs-renderer.ts
export class ThreeJSRenderer implements SceneRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  
  render(sceneDefinition: SceneDefinition): Canvas {
    // Convert SIGL entities to Three.js meshes
    // Apply lighting, materials
    // Render to canvas
  }
}
```

**Benefits:**
- ✅ Professional 3D rendering
- ✅ Works in browser AND Node.js (with headless-gl)
- ✅ Extensive ecosystem
- ✅ Realistic depth

**Size Impact:**
- Bundle: +600KB (Three.js library)

### Option 2: 2.5D (Fake 3D - Current Enhanced)

**No new dependencies needed!**

```typescript
// Enhance current 2D renderer
- Scale entities based on z-distance (perspective)
- Blur entities based on distance (depth of field)
- Add shadows based on z-position
- Layer based on z-index
```

**Benefits:**
- ✅ Small bundle size
- ✅ Fast rendering
- ✅ Good enough for most use cases
- ✅ Works everywhere

**Limitations:**
- ❌ Not true 3D
- ❌ Limited realism

### Option 3: Hybrid Approach

- Use 2D canvas for simple scenes
- Use Three.js for complex 3D scenes
- Auto-detect based on z-depth usage

```sigl
// 2D rendering (no z-coordinates)
DRAW MAN AT LEFT
DRAW WOMAN AT RIGHT

// 3D rendering (z-coordinates present)
DRAW MAN AT POSITION 0, 0, 0
DRAW WOMAN AT POSITION 0, 0, -2  // Triggers 3D mode
```

## Proposed SIGL Syntax for 3D

### 3D Positioning
```sigl
// Absolute 3D coordinates
DRAW MAN AT POSITION 0, 0, 0         // x, y, z
DRAW WOMAN AT POSITION 2, 0, -1      // 2 units right, 1 unit back

// Relative with distance
DRAW BOY BEHIND MAN WITH DISTANCE 2  // Uses actual 3D distance

// Depth layers
DRAW TREE AT BACKGROUND DEPTH 5      // 5 units behind focal plane
DRAW PERSON AT FOREGROUND DEPTH 2    // 2 units in front
```

### Camera Control
```sigl
SET CAMERA POSITION 0, 2, 5          // Eye position
SET CAMERA TARGET 0, 0, 0            // Look at point
SET CAMERA FOV 45                    // Field of view

// Camera presets
SET CAMERA PORTRAIT                  // Close-up view
SET CAMERA LANDSCAPE                 // Wide view
SET CAMERA OVERHEAD                  // Top-down view
```

### Lighting for 3D
```sigl
ADD LIGHT SUN AT POSITION 10, 10, 10
ADD LIGHT AMBIENT WITH INTENSITY 0.5
ADD LIGHT SPOT AT POSITION 0, 5, 0 POINTING AT 0, 0, 0
```

## Implementation Timeline

### Phase 1: Enhanced 2.5D (1 week)
```typescript
// Add to current renderer
- Perspective scaling based on z
- Soft shadows
- Depth-based blur
- Better layering
```

### Phase 2: Three.js Integration (2 weeks)
```typescript
// New renderer
- Three.js scene setup
- 3D entity meshes
- Lighting system
- Camera controls
```

### Phase 3: Hybrid Mode (1 week)
```typescript
// Smart renderer selection
if (scene.has3DElements()) {
  use ThreeJSRenderer
} else {
  use Canvas2DRenderer // Faster
}
```

## Code Example

### With Three.js:

```typescript
// src/rendering/engines/threejs-renderer.ts
import * as THREE from 'three';

export class ThreeJSRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  
  constructor(config: SIGLConfig) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45, // FOV
      config.canvas.width / config.canvas.height, // Aspect
      0.1, // Near
      1000 // Far
    );
    this.camera.position.set(0, 2, 5);
    
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: config.rendering.antialiasing 
    });
    this.renderer.setSize(config.canvas.width, config.canvas.height);
  }
  
  renderEntity(entity: EntityDefinition): THREE.Object3D {
    const geometry = new THREE.BoxGeometry(1, 2, 0.5);
    const material = new THREE.MeshStandardMaterial({
      color: this.getClothingColor(entity)
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(
      entity.position.x,
      entity.position.y,
      entity.position.z || 0
    );
    
    return mesh;
  }
  
  render(scene: SceneDefinition): HTMLCanvasElement {
    // Clear scene
    this.scene.clear();
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(directionalLight);
    
    // Add entities
    scene.entities.forEach(entity => {
      const mesh = this.renderEntity(entity);
      this.scene.add(mesh);
    });
    
    // Render
    this.renderer.render(this.scene, this.camera);
    
    return this.renderer.domElement;
  }
}
```

## Performance Comparison

| Feature | 2D Canvas | 2.5D Enhanced | Three.js 3D |
|---------|-----------|---------------|-------------|
| Speed | ⚡⚡⚡ Fast | ⚡⚡ Good | ⚡ Moderate |
| Quality | ⭐⭐ Basic | ⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent |
| Depth | ❌ None | ⚠️ Simulated | ✅ Real |
| Bundle Size | 📦 Small (~50KB) | 📦 Small | 📦 Large (~600KB) |
| Browser Support | ✅ All | ✅ All | ✅ Modern |
| Node.js Support | ✅ Yes | ✅ Yes | ⚠️ Needs headless-gl |

## Recommendation

### For Current Project:
**Start with Enhanced 2.5D** (quick win):
- Add perspective scaling
- Better depth simulation
- Keeps bundle small
- Works everywhere

### For Future:
**Add Three.js as optional**:
- Enable with flag: `SET RENDERING_MODE 3D`
- Best of both worlds
- User chooses based on needs

## Want me to implement it?

I can add:

**Option A:** Enhanced 2.5D depth (30 min)
- Perspective scaling based on z
- Depth blur effects
- Soft shadows
- Still uses 2D canvas

**Option B:** Full Three.js 3D (2-3 hours)
- Real 3D rendering
- Lighting and shadows
- Camera controls
- Realistic depth

Which would you prefer? 🚀

