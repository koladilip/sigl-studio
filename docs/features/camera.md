# Camera and Perspective Control System

## Overview

The SIGL Camera and Perspective Control System provides sophisticated camera positioning, lens controls, and cinematic effects for creating professional-quality images. This system supports everything from basic viewpoint adjustments to complex multi-camera setups with advanced depth of field and motion effects.

## Core Principles

- **Intuitive Positioning**: Natural camera placement using real-world concepts
- **Professional Controls**: Full range of camera parameters found in professional equipment
- **Cinematic Effects**: Advanced depth of field, motion blur, and lens effects
- **3D Perspective**: Complete 3D camera control with multiple projection types
- **Animation Support**: Smooth camera movements and transitions

## Basic Camera Positioning

### Camera Location and Orientation
```sigl
SET CAMERA:
  POSITION: (0, 1.7, 5)         // X, Y, Z in meters (eye level, 5m back)
  TARGET: (0, 1.7, 0)           // Look at point
  UP_VECTOR: (0, 1, 0)          // World up direction

SET CAMERA:
  POSITION: BEHIND SUBJECT DISTANCE 3 meters HEIGHT 1.8 meters
  LOOK_AT: SUBJECT
  TILT: 0 degrees               // Camera roll

SET CAMERA:
  POSITION: ABOVE SCENE HEIGHT 10 meters
  ANGLE: BIRD_EYE               // Looking down
  ORIENTATION: NORTH            // Camera facing direction
```

### Camera Presets
```sigl
SET CAMERA_PRESET:
  PORTRAIT: {
    position: FRONT_OF_SUBJECT,
    distance: 2 meters,
    height: EYE_LEVEL,
    angle: STRAIGHT_ON
  }
  
  FULL_BODY: {
    position: FRONT_OF_SUBJECT,
    distance: 4 meters,
    height: WAIST_LEVEL,
    angle: SLIGHT_LOW
  }
  
  GROUP_SHOT: {
    position: FRONT_OF_GROUP,
    distance: 6 meters,
    height: EYE_LEVEL,
    angle: STRAIGHT_ON,
    field_of_view: WIDE
  }
  
  LANDSCAPE: {
    position: ELEVATED,
    height: 3 meters,
    angle: SLIGHT_HIGH,
    field_of_view: ULTRA_WIDE
  }
```

## Lens and Optical Settings

### Focal Length and Field of View
```sigl
SET LENS:
  FOCAL_LENGTH: 50mm            // Standard lens
  FIELD_OF_VIEW: 46.8 degrees   // Calculated from focal length
  
SET LENS:
  FOCAL_LENGTH: 24mm            // Wide angle
  FIELD_OF_VIEW: 84 degrees
  DISTORTION: BARREL 0.1        // Slight barrel distortion
  
SET LENS:
  FOCAL_LENGTH: 85mm            // Portrait lens
  FIELD_OF_VIEW: 28.6 degrees
  COMPRESSION: 1.2              // Telephoto compression effect

SET LENS:
  FOCAL_LENGTH: 200mm           // Telephoto
  FIELD_OF_VIEW: 12.3 degrees
  COMPRESSION: 2.0
  ATMOSPHERIC_HAZE: 0.1         // Distance haze effect
```

### Lens Presets
```sigl
SET LENS_PRESET:
  ULTRA_WIDE: {focal_length: 14mm, fov: 114 degrees, distortion: FISHEYE}
  WIDE_ANGLE: {focal_length: 24mm, fov: 84 degrees, distortion: BARREL 0.05}
  STANDARD: {focal_length: 50mm, fov: 47 degrees, distortion: NONE}
  PORTRAIT: {focal_length: 85mm, fov: 29 degrees, compression: 1.1}
  TELEPHOTO: {focal_length: 135mm, fov: 18 degrees, compression: 1.5}
  SUPER_TELEPHOTO: {focal_length: 300mm, fov: 8 degrees, compression: 2.5}
```

### Aperture and Depth of Field
```sigl
SET APERTURE:
  F_STOP: f/2.8                 // Wide aperture
  DEPTH_OF_FIELD: SHALLOW
  FOCUS_DISTANCE: 3 meters
  BOKEH_QUALITY: HIGH
  BOKEH_SHAPE: CIRCULAR | HEXAGONAL | OCTAGONAL

SET APERTURE:
  F_STOP: f/8                   // Standard aperture
  DEPTH_OF_FIELD: MODERATE
  FOCUS_DISTANCE: AUTO          // Auto-focus on main subject
  HYPERFOCAL: false

SET APERTURE:
  F_STOP: f/16                  // Small aperture
  DEPTH_OF_FIELD: DEEP
  FOCUS_DISTANCE: INFINITY
  HYPERFOCAL: true              // Everything in focus
```

### Focus Controls
```sigl
SET FOCUS:
  MODE: SINGLE_POINT | ZONE | TRACKING
  TARGET: SUBJECT_EYES | SUBJECT_FACE | CUSTOM_POINT(x, y, z)
  TRANSITION: SMOOTH | SNAP
  SPEED: 0.5                    // Focus transition speed (0-1)

SET FOCUS:
  RACK_FOCUS FROM FOREGROUND_OBJECT TO BACKGROUND_OBJECT OVER 2 seconds
  FOCUS_PULL_SPEED: SLOW | MEDIUM | FAST

SET FOCUS:
  FOCUS_STACKING: {
    enabled: true,
    slices: 10,
    start_distance: 1 meter,
    end_distance: 10 meters,
    blend_method: MAXIMUM | AVERAGE
  }
```

## Advanced Camera Controls

### Camera Movement and Animation
```sigl
ANIMATE CAMERA:
  DOLLY FROM (0, 1.7, 5) TO (0, 1.7, 2) OVER 3 seconds
  EASING: EASE_IN_OUT

ANIMATE CAMERA:
  PAN FROM 0 degrees TO 45 degrees OVER 2 seconds
  TILT FROM 0 degrees TO -10 degrees OVER 2 seconds
  
ANIMATE CAMERA:
  ORBIT AROUND SUBJECT RADIUS 4 meters ANGLE 360 degrees OVER 10 seconds
  HEIGHT_VARIATION: SINE(amplitude: 0.5 meters, frequency: 0.5)

ANIMATE CAMERA:
  ZOOM FROM 50mm TO 85mm OVER 1.5 seconds
  MAINTAIN_FRAMING: true        // Adjust distance to keep subject size
```

### Camera Shake and Handheld Effects
```sigl
SET CAMERA_SHAKE:
  INTENSITY: 0.1                // Subtle shake
  FREQUENCY: 2.0 Hz
  TYPE: HANDHELD | VEHICLE | EARTHQUAKE | CUSTOM
  
SET HANDHELD_CAMERA:
  INTENSITY: 0.05               // Very subtle
  BREATHING: 0.02               // Slight zoom variation
  DRIFT: 0.01                   // Slow position drift
  MICRO_JITTER: 0.005           // High-frequency shake

SET CAMERA_STABILIZATION:
  OPTICAL: true                 // Lens-based stabilization
  DIGITAL: true                 // Post-processing stabilization
  STRENGTH: 0.8                 // Stabilization effectiveness
```

### Multi-Camera Setup
```sigl
DEFINE_CAMERA "main_camera":
  POSITION: (0, 1.7, 4)
  FOCAL_LENGTH: 50mm
  APERTURE: f/2.8

DEFINE_CAMERA "wide_shot":
  POSITION: (-2, 2, 6)
  FOCAL_LENGTH: 24mm
  APERTURE: f/5.6

DEFINE_CAMERA "close_up":
  POSITION: (1, 1.6, 2)
  FOCAL_LENGTH: 85mm
  APERTURE: f/1.8

SET_ACTIVE_CAMERA: "main_camera"
SWITCH_TO_CAMERA: "close_up" WITH TRANSITION: CROSS_FADE DURATION 1 second
```

## Projection and Perspective Types

### Perspective Projection
```sigl
SET PROJECTION: PERSPECTIVE WITH:
  FIELD_OF_VIEW: 50 degrees
  ASPECT_RATIO: 16:9 | 4:3 | 1:1 | CUSTOM(width/height)
  NEAR_PLANE: 0.1 meters
  FAR_PLANE: 1000 meters
  
SET PERSPECTIVE_CORRECTION:
  KEYSTONE: AUTO | MANUAL(horizontal: 0, vertical: 0)
  LENS_DISTORTION: AUTO_CORRECT | PRESERVE | ENHANCE
```

### Orthographic Projection
```sigl
SET PROJECTION: ORTHOGRAPHIC WITH:
  WIDTH: 10 meters              // Orthographic width
  HEIGHT: 7.5 meters            // Calculated from aspect ratio
  NEAR_PLANE: -100 meters
  FAR_PLANE: 100 meters

SET PROJECTION: ISOMETRIC WITH:
  ANGLE: (30, 45, 0) degrees    // Standard isometric angles
  SCALE: 1.0
```

### Specialized Projections
```sigl
SET PROJECTION: FISHEYE WITH:
  FIELD_OF_VIEW: 180 degrees
  DISTORTION_MODEL: EQUIDISTANT | STEREOGRAPHIC | ORTHOGRAPHIC
  
SET PROJECTION: PANORAMIC WITH:
  TYPE: CYLINDRICAL | SPHERICAL | CUBIC
  HORIZONTAL_FOV: 360 degrees
  VERTICAL_FOV: 180 degrees
  
SET PROJECTION: TILT_SHIFT WITH:
  TILT_ANGLE: 8 degrees
  SHIFT_AMOUNT: 2mm
  FOCUS_PLANE: CUSTOM
```

## Cinematic Effects

### Motion Blur
```sigl
SET MOTION_BLUR:
  ENABLED: true
  SHUTTER_SPEED: 1/60 second    // Slower = more blur
  SAMPLES: 16                   // Quality vs performance
  
  OBJECT_BLUR: true             // Blur moving objects
  CAMERA_BLUR: true             // Blur from camera movement
  
SET MOTION_BLUR_ADVANCED:
  PER_OBJECT_VECTORS: true      // Individual object motion
  VELOCITY_SCALE: 1.0
  MAX_BLUR_RADIUS: 32 pixels
```

### Depth of Field Effects
```sigl
SET_DOF_ADVANCED:
  FOCUS_METHOD: DISTANCE | OBJECT | POINT
  FOCUS_TARGET: SUBJECT_EYES
  
  NEAR_BLUR: {
    start: 1 meter,
    transition: 0.5 meters,
    intensity: 1.0
  }
  
  FAR_BLUR: {
    start: 5 meters,
    transition: 2 meters,
    intensity: 1.0
  }
  
  BOKEH_SETTINGS: {
    shape: CIRCULAR,
    rotation: 0 degrees,
    chromatic_aberration: 0.02,
    highlight_threshold: 1.0,
    highlight_gain: 1.0
  }
```

### Lens Effects
```sigl
SET LENS_EFFECTS:
  VIGNETTE: {
    intensity: 0.3,
    smoothness: 0.5,
    roundness: 1.0,
    color: BLACK
  }
  
  CHROMATIC_ABERRATION: {
    intensity: 0.01,
    samples: 3,
    focus_falloff: true
  }
  
  LENS_FLARE: {
    enabled: true,
    threshold: 1.0,
    intensity: 0.5,
    ghosts: 8,
    halo_width: 0.1,
    dirt_texture: "lens_dirt.png"
  }
  
  FILM_GRAIN: {
    intensity: 0.02,
    size: 1.0,
    luminance_contribution: 0.8,
    color_contribution: 0.2
  }
```

## Camera Tracking and Following

### Subject Tracking
```sigl
SET CAMERA_TRACKING:
  TARGET: PERSON_1
  MODE: SMOOTH | RIGID | PREDICTIVE
  OFFSET: (0, 0.2, 0)           // Slight upward offset
  SMOOTHING: 0.8                // 0 = instant, 1 = very smooth
  
  LOOK_AHEAD: {
    enabled: true,
    distance: 2 meters,
    weight: 0.3
  }

SET_TRACKING_CONSTRAINTS:
  MAX_DISTANCE: 10 meters       // Don't track beyond this distance
  MIN_DISTANCE: 1 meter         // Don't get closer than this
  VERTICAL_LIMITS: (-30, 30) degrees  // Tilt constraints
  HORIZONTAL_LIMITS: (-90, 90) degrees // Pan constraints
```

### Path Following
```sigl
DEFINE_CAMERA_PATH "reveal_shot":
  KEYFRAMES: [
    {time: 0s, position: (10, 2, 10), target: BUILDING},
    {time: 3s, position: (5, 3, 5), target: BUILDING},
    {time: 6s, position: (0, 1.7, 2), target: PERSON}
  ]
  INTERPOLATION: SMOOTH | LINEAR | BEZIER
  
ANIMATE_CAMERA_ON_PATH "reveal_shot" DURATION 6 seconds
```

## Environmental Camera Effects

### Weather Effects on Camera
```sigl
SET_WEATHER_CAMERA_EFFECTS:
  RAIN: {
    droplets_on_lens: true,
    intensity: 0.3,
    streak_length: 0.1,
    refraction: 0.02
  }
  
  FOG: {
    atmospheric_perspective: true,
    visibility_distance: 50 meters,
    density_variation: 0.1
  }
  
  SNOW: {
    flakes_on_lens: true,
    accumulation: 0.1,
    visibility_reduction: 0.2
  }
```

### Underwater Camera
```sigl
SET_UNDERWATER_CAMERA:
  DEPTH: 5 meters
  VISIBILITY: 20 meters
  COLOR_ABSORPTION: {
    red_loss: 0.3,
    blue_enhancement: 0.2
  }
  CAUSTICS: true
  PARTICLE_DENSITY: 0.1
  BUBBLE_EFFECTS: true
```

## Performance and Quality Settings

### Rendering Quality
```sigl
SET_CAMERA_QUALITY:
  ANTI_ALIASING: 4X | 8X | 16X
  ANISOTROPIC_FILTERING: 16X
  TEXTURE_QUALITY: HIGH | ULTRA
  
  LOD_BIAS: 0.0                 // Negative = higher detail
  MIPMAP_BIAS: 0.0
  
  TEMPORAL_UPSAMPLING: {
    enabled: true,
    factor: 2.0,                // Render at half resolution, upscale
    quality: HIGH
  }
```

### Culling and Optimization
```sigl
SET_CAMERA_CULLING:
  FRUSTUM_CULLING: true
  OCCLUSION_CULLING: true
  DISTANCE_CULLING: true
  
  NEAR_CLIP_OPTIMIZATION: true  // Cull very close objects
  FAR_CLIP_OPTIMIZATION: true   // Cull very distant objects
  
  LOD_SYSTEM: {
    enabled: true,
    distance_multiplier: 1.0,
    bias: 0.0
  }
```

## Integration Examples

### Portrait Photography Setup
```sigl
CREATE_SCENE "professional_portrait":
  SET_CAMERA_PRESET: PORTRAIT
  
  SET LENS:
    FOCAL_LENGTH: 85mm
    APERTURE: f/2.8
    FOCUS_TARGET: SUBJECT_EYES
  
  SET_DOF_ADVANCED:
    NEAR_BLUR: {start: 2m, transition: 0.3m}
    FAR_BLUR: {start: 4m, transition: 1m}
    BOKEH_SHAPE: CIRCULAR
  
  SET LENS_EFFECTS:
    VIGNETTE: {intensity: 0.2}
    FILM_GRAIN: {intensity: 0.01}
  
  DRAW PERSON AT CENTER
```

### Cinematic Reveal Shot
```sigl
CREATE_SCENE "dramatic_reveal":
  DEFINE_CAMERA_PATH "reveal":
    KEYFRAMES: [
      {time: 0s, position: (20, 10, 20), focal_length: 200mm, target: HORIZON},
      {time: 2s, position: (10, 5, 10), focal_length: 85mm, target: BUILDING},
      {time: 4s, position: (2, 1.8, 3), focal_length: 35mm, target: PERSON}
    ]
  
  SET MOTION_BLUR:
    ENABLED: true
    SHUTTER_SPEED: 1/30 second
  
  SET_DOF_ADVANCED:
    FOCUS_METHOD: OBJECT
    FOCUS_TARGET: DYNAMIC        // Focus follows camera target
  
  ANIMATE_CAMERA_ON_PATH "reveal" DURATION 4 seconds
  
  DRAW PERSON AT CENTER
  ADD ENVIRONMENT URBAN
```

### Action Scene with Camera Shake
```sigl
CREATE_SCENE "action_sequence":
  SET CAMERA:
    POSITION: BEHIND SUBJECT DISTANCE 3 meters
    FOCAL_LENGTH: 35mm
    
  SET HANDHELD_CAMERA:
    INTENSITY: 0.08
    BREATHING: 0.03
    MICRO_JITTER: 0.01
  
  SET MOTION_BLUR:
    ENABLED: true
    SHUTTER_SPEED: 1/120 second
    OBJECT_BLUR: true
  
  SET_CAMERA_TRACKING:
    TARGET: SUBJECT
    MODE: PREDICTIVE
    SMOOTHING: 0.6
  
  DRAW PERSON RUNNING AT CENTER
  ADD ENVIRONMENT STREET
```

This camera system provides professional-grade control over every aspect of image capture while maintaining the intuitive SIGL syntax, enabling everything from simple snapshots to complex cinematic sequences.