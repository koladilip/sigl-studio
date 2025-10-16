# Materials and Textures System

## Overview

The SITL Materials and Textures System provides sophisticated control over surface properties, material behaviors, and texture application. This system enables realistic material representation through physically-based rendering (PBR) properties, procedural texture generation, and advanced surface characteristics.

## Core Concepts

- **Material Properties**: Physical characteristics that define how surfaces interact with light
- **Texture Mapping**: Application of 2D images to 3D surfaces for detail and variation
- **Surface Characteristics**: Roughness, smoothness, reflectivity, and other tactile qualities
- **Procedural Generation**: Algorithmic creation of textures and materials
- **Material Layering**: Combining multiple materials for complex surface effects

## Basic Material Definition

### Simple Material Application
```sitl
SET_MATERIAL:
  TARGET: CLOTHING | SKIN | HAIR | ENVIRONMENT | OBJECT
  TYPE: FABRIC | METAL | PLASTIC | WOOD | STONE | GLASS | ORGANIC
  
// Apply to specific elements
APPLY_MATERIAL COTTON TO SHIRT
APPLY_MATERIAL DENIM TO JEANS
APPLY_MATERIAL LEATHER TO SHOES
APPLY_MATERIAL SILK TO DRESS

// Global material settings
SET_DEFAULT_MATERIAL FABRIC FOR CLOTHING
SET_DEFAULT_MATERIAL SKIN FOR PERSON
```

### Material Properties
```sitl
DEFINE_MATERIAL "custom_fabric":
  BASE_COLOR: #3366CC
  ROUGHNESS: 0.7              // 0.0 = mirror, 1.0 = completely rough
  METALLIC: 0.0               // 0.0 = dielectric, 1.0 = metallic
  SPECULAR: 0.5               // Reflectivity for dielectrics
  TRANSPARENCY: 0.0           // 0.0 = opaque, 1.0 = transparent
  EMISSION: 0.0               // Self-illumination
  SUBSURFACE: 0.1             // Subsurface scattering
  
  // Physical properties
  DENSITY: LIGHT | MEDIUM | HEAVY
  FLEXIBILITY: RIGID | FLEXIBLE | SOFT
  TEXTURE_SCALE: 1.0          // UV mapping scale
```

## Physically-Based Rendering (PBR) Materials

### Metallic Materials
```sitl
DEFINE_MATERIAL "brushed_steel":
  BASE_COLOR: #C0C0C0
  METALLIC: 1.0
  ROUGHNESS: 0.3
  ANISOTROPY: 0.8             // Directional roughness
  ANISOTROPY_ROTATION: 45     // Degrees
  
DEFINE_MATERIAL "gold":
  BASE_COLOR: #FFD700
  METALLIC: 1.0
  ROUGHNESS: 0.1
  FRESNEL_IOR: 0.47           // Index of refraction for metals
  
DEFINE_MATERIAL "copper_patina":
  BASE_COLOR: #87CEEB
  METALLIC: 1.0
  ROUGHNESS: 0.6
  OXIDATION: 0.7              // Weathering effect
```

### Dielectric Materials
```sitl
DEFINE_MATERIAL "clear_glass":
  BASE_COLOR: #FFFFFF
  METALLIC: 0.0
  ROUGHNESS: 0.0
  TRANSPARENCY: 0.95
  IOR: 1.52                   // Index of refraction
  DISPERSION: 0.02            // Chromatic aberration
  
DEFINE_MATERIAL "frosted_glass":
  BASE_COLOR: #F0F0F0
  METALLIC: 0.0
  ROUGHNESS: 0.8
  TRANSPARENCY: 0.7
  SUBSURFACE: 0.3
  
DEFINE_MATERIAL "ceramic":
  BASE_COLOR: #F5F5DC
  METALLIC: 0.0
  ROUGHNESS: 0.2
  SPECULAR: 0.8
  CLEARCOAT: 0.9              // Glossy top layer
  CLEARCOAT_ROUGHNESS: 0.1
```

### Organic Materials
```sitl
DEFINE_MATERIAL "human_skin":
  BASE_COLOR: #FDBCB4
  METALLIC: 0.0
  ROUGHNESS: 0.4
  SUBSURFACE: 0.8             // Strong subsurface scattering
  SUBSURFACE_COLOR: #FF6B6B
  SUBSURFACE_RADIUS: [1.0, 0.2, 0.1]  // RGB scattering distances
  
DEFINE_MATERIAL "tree_bark":
  BASE_COLOR: #8B4513
  METALLIC: 0.0
  ROUGHNESS: 0.9
  NORMAL_STRENGTH: 2.0        // Bump map intensity
  DISPLACEMENT: 0.1           // Height variation
  
DEFINE_MATERIAL "fresh_leaves":
  BASE_COLOR: #228B22
  METALLIC: 0.0
  ROUGHNESS: 0.6
  SUBSURFACE: 0.4
  TRANSLUCENCY: 0.3           // Light transmission
```

## Advanced Texture Mapping

### Texture Types and Channels
```sitl
APPLY_TEXTURE_MAP:
  TARGET: MATERIAL_NAME
  
  // Standard PBR texture maps
  DIFFUSE_MAP: "textures/fabric_diffuse.jpg"
  NORMAL_MAP: "textures/fabric_normal.jpg"
  ROUGHNESS_MAP: "textures/fabric_roughness.jpg"
  METALLIC_MAP: "textures/fabric_metallic.jpg"
  SPECULAR_MAP: "textures/fabric_specular.jpg"
  
  // Additional detail maps
  DISPLACEMENT_MAP: "textures/fabric_height.jpg"
  AMBIENT_OCCLUSION_MAP: "textures/fabric_ao.jpg"
  EMISSION_MAP: "textures/fabric_emission.jpg"
  OPACITY_MAP: "textures/fabric_alpha.jpg"
  
  // Texture settings
  UV_SCALE: (2.0, 2.0)        // Texture repetition
  UV_OFFSET: (0.0, 0.0)       // Texture position
  UV_ROTATION: 0              // Degrees
  WRAP_MODE: REPEAT | CLAMP | MIRROR
```

### Procedural Textures
```sitl
GENERATE_PROCEDURAL_TEXTURE:
  TYPE: NOISE | PATTERN | GEOMETRIC | ORGANIC
  
  // Noise-based textures
  NOISE_TEXTURE "fabric_weave":
    NOISE_TYPE: PERLIN | SIMPLEX | WORLEY | FRACTAL
    SCALE: 10.0
    OCTAVES: 4
    PERSISTENCE: 0.5
    LACUNARITY: 2.0
    SEED: 12345
    
  // Pattern-based textures
  PATTERN_TEXTURE "brick":
    PATTERN_TYPE: BRICK | TILE | HEXAGON | WEAVE
    BRICK_SIZE: (0.3, 0.1)
    MORTAR_WIDTH: 0.02
    MORTAR_COLOR: #CCCCCC
    BRICK_COLOR: #AA4444
    RANDOMNESS: 0.1
    
  // Geometric textures
  GEOMETRIC_TEXTURE "stripes":
    TYPE: STRIPES | CHECKERBOARD | DOTS | WAVES
    FREQUENCY: 8.0
    AMPLITUDE: 1.0
    COLOR_A: #FFFFFF
    COLOR_B: #000000
    BLEND_MODE: SHARP | SMOOTH | DITHERED
```

### Texture Blending and Layering
```sitl
BLEND_TEXTURES:
  BASE_TEXTURE: "wood_base"
  OVERLAY_TEXTURE: "wood_grain"
  BLEND_MODE: MULTIPLY | OVERLAY | SCREEN | NORMAL | ADD
  BLEND_FACTOR: 0.7
  
LAYER_TEXTURES:
  LAYER_1: {
    texture: "fabric_base",
    opacity: 1.0,
    blend_mode: NORMAL
  }
  LAYER_2: {
    texture: "fabric_pattern",
    opacity: 0.8,
    blend_mode: MULTIPLY
  }
  LAYER_3: {
    texture: "fabric_wear",
    opacity: 0.3,
    blend_mode: OVERLAY,
    mask: "wear_mask"           // Control where layer appears
  }
```

## Specialized Material Types

### Fabric and Clothing Materials
```sitl
FABRIC_MATERIALS:
  COTTON: {
    roughness: 0.8,
    subsurface: 0.2,
    fiber_detail: HIGH,
    weave_pattern: PLAIN | TWILL | SATIN
  }
  
  SILK: {
    roughness: 0.1,
    specular: 0.9,
    anisotropy: 0.6,
    sheen: 0.8                  // Fabric sheen effect
  }
  
  DENIM: {
    roughness: 0.7,
    normal_strength: 1.5,
    weave_pattern: TWILL,
    fade_pattern: WHISKERS | HONEYCOMBS | STACKS
  }
  
  LEATHER: {
    roughness: 0.4,
    specular: 0.6,
    grain_pattern: FINE | MEDIUM | COARSE,
    aging: NEW | WORN | VINTAGE
  }
  
  WOOL: {
    roughness: 0.9,
    subsurface: 0.4,
    fiber_fuzz: 0.3,
    knit_pattern: STOCKINETTE | RIBBED | CABLE
  }
```

### Hair and Fur Materials
```sitl
HAIR_MATERIAL:
  STRAND_WIDTH: 0.001         // Individual hair thickness
  STRAND_COUNT: HIGH | MEDIUM | LOW
  CURL_PATTERN: STRAIGHT | WAVY | CURLY | KINKY
  
  // Hair-specific properties
  MELANIN_CONCENTRATION: 0.8  // Natural pigmentation
  MELANIN_REDNESS: 0.2        // Red pigment ratio
  ROUGHNESS_ROOT: 0.3         // Roughness at hair root
  ROUGHNESS_TIP: 0.8          // Roughness at hair tip
  
  // Styling properties
  HAIR_PRODUCT: NONE | GEL | POMADE | WAX | SPRAY
  WETNESS: 0.0                // Wet hair appearance
  STATIC: 0.0                 // Flyaway hairs
```

### Skin Materials
```sitl
SKIN_MATERIAL:
  SKIN_TYPE: CAUCASIAN | AFRICAN | ASIAN | HISPANIC | MIXED
  AGE_FACTOR: 0.3             // 0.0 = young, 1.0 = elderly
  
  // Skin layers
  EPIDERMIS: {
    thickness: 0.1,
    melanin: 0.4,
    roughness: 0.3
  }
  DERMIS: {
    subsurface_color: #FF9999,
    subsurface_radius: [2.0, 1.0, 0.5],
    blood_oxygenation: 0.8
  }
  HYPODERMIS: {
    subsurface_color: #FFFF99,
    subsurface_radius: [4.0, 2.0, 1.0]
  }
  
  // Skin details
  PORE_DETAIL: FINE | MEDIUM | COARSE
  WRINKLE_DETAIL: NONE | LIGHT | MODERATE | HEAVY
  BLEMISH_DETAIL: NONE | LIGHT | MODERATE
  FRECKLE_DETAIL: NONE | LIGHT | MODERATE | HEAVY
```

## Environmental Materials

### Natural Materials
```sitl
NATURAL_MATERIALS:
  WATER: {
    transparency: 0.9,
    ior: 1.33,
    roughness: 0.0,
    wave_height: 0.1,
    wave_frequency: 2.0,
    foam_coverage: 0.1
  }
  
  SAND: {
    base_color: #F4A460,
    roughness: 0.8,
    grain_size: FINE | MEDIUM | COARSE,
    moisture: 0.0,              // Wet sand effect
    shell_fragments: 0.1
  }
  
  GRASS: {
    blade_width: 0.002,
    blade_height: 0.05,
    density: HIGH,
    wind_effect: 0.3,
    seasonal_color: SPRING | SUMMER | AUTUMN | WINTER
  }
  
  ROCK: {
    rock_type: GRANITE | LIMESTONE | SANDSTONE | SLATE,
    weathering: 0.5,
    moss_coverage: 0.2,
    lichen_coverage: 0.1
  }
```

### Architectural Materials
```sitl
ARCHITECTURAL_MATERIALS:
  CONCRETE: {
    roughness: 0.7,
    age: NEW | WEATHERED | OLD,
    staining: 0.3,
    crack_detail: NONE | LIGHT | MODERATE
  }
  
  BRICK: {
    brick_type: CLAY | CONCRETE | FIRE,
    mortar_color: #CCCCCC,
    weathering: 0.4,
    efflorescence: 0.1          // White salt deposits
  }
  
  WOOD: {
    wood_type: OAK | PINE | MAHOGANY | BAMBOO,
    grain_direction: VERTICAL | HORIZONTAL,
    finish: RAW | STAINED | PAINTED | VARNISHED,
    weathering: 0.2
  }
```

## Dynamic Material Effects

### Time-Based Material Changes
```sitl
ANIMATE_MATERIAL_PROPERTIES:
  MATERIAL: "fabric"
  PROPERTY: ROUGHNESS | COLOR | TRANSPARENCY | EMISSION
  
  KEYFRAMES:
    TIME 0.0: VALUE 0.3
    TIME 2.0: VALUE 0.8
    TIME 4.0: VALUE 0.3
  
  INTERPOLATION: LINEAR | SMOOTH | EASE_IN | EASE_OUT
  LOOP: true
```

### Weather-Responsive Materials
```sitl
WEATHER_RESPONSIVE_MATERIALS:
  RAIN_EFFECT: {
    wetness_buildup: 0.8,
    droplet_formation: true,
    reflectivity_increase: 0.3,
    darkening_factor: 0.2
  }
  
  SNOW_EFFECT: {
    snow_accumulation: 0.5,
    ice_formation: 0.2,
    frost_pattern: DENDRITIC | FEATHERY | CRYSTALLINE
  }
  
  SUN_EXPOSURE: {
    fading_rate: 0.1,
    bleaching_effect: 0.3,
    heat_distortion: 0.1
  }
```

### Wear and Aging Effects
```sitl
APPLY_WEAR_PATTERNS:
  WEAR_TYPE: FRICTION | CHEMICAL | UV | MECHANICAL
  INTENSITY: LIGHT | MODERATE | HEAVY
  
  FRICTION_WEAR: {
    areas: [ELBOWS, KNEES, COLLAR],
    pattern: SMOOTH | PILLED | THREADBARE,
    color_change: LIGHTER | DARKER | FADED
  }
  
  CHEMICAL_WEAR: {
    stain_type: OIL | WATER | ACID | ORGANIC,
    stain_age: FRESH | SET | PERMANENT,
    color_shift: true
  }
  
  UV_DEGRADATION: {
    fade_pattern: UNIFORM | PATCHY | GRADIENT,
    color_shift: YELLOW | BLUE | GRAY,
    fiber_breakdown: 0.3
  }
```

## Material Interaction and Physics

### Material Collision Properties
```sitl
SET_COLLISION_PROPERTIES:
  MATERIAL: "fabric"
  
  FRICTION_COEFFICIENT: 0.6   // Surface friction
  RESTITUTION: 0.1            // Bounciness
  DENSITY: 0.8                // Mass per unit volume
  HARDNESS: SOFT | MEDIUM | HARD
  
  DEFORMATION: {
    elastic_limit: 0.1,
    plastic_deformation: 0.05,
    breaking_point: 0.8
  }
```

### Fluid Interaction
```sitl
FLUID_INTERACTION:
  MATERIAL: "cotton_shirt"
  
  ABSORPTION_RATE: 0.7        // How quickly fluid is absorbed
  SATURATION_POINT: 0.9       // Maximum fluid capacity
  WICKING_SPEED: 0.3          // Horizontal fluid spread
  DRYING_RATE: 0.2            // Evaporation speed
  
  STAIN_RESISTANCE: LOW | MEDIUM | HIGH
  WATER_REPELLENCY: 0.1       // Hydrophobic properties
```

### Thermal Properties
```sitl
THERMAL_PROPERTIES:
  MATERIAL: "wool_sweater"
  
  THERMAL_CONDUCTIVITY: 0.04  // Heat transfer rate
  SPECIFIC_HEAT: 1.3          // Heat capacity
  INSULATION_VALUE: HIGH      // Thermal resistance
  
  TEMPERATURE_RESPONSE: {
    expansion_coefficient: 0.001,
    color_change_threshold: 60,  // Celsius
    degradation_temperature: 150
  }
```

## Quality and Performance Controls

### Level of Detail (LOD) for Materials
```sitl
SET_MATERIAL_LOD:
  DISTANCE_NEAR: {
    texture_resolution: 4096,
    normal_detail: HIGH,
    subsurface_quality: HIGH,
    fiber_detail: FULL
  }
  
  DISTANCE_MEDIUM: {
    texture_resolution: 1024,
    normal_detail: MEDIUM,
    subsurface_quality: MEDIUM,
    fiber_detail: SIMPLIFIED
  }
  
  DISTANCE_FAR: {
    texture_resolution: 256,
    normal_detail: LOW,
    subsurface_quality: LOW,
    fiber_detail: NONE
  }
```

### Material Optimization
```sitl
OPTIMIZE_MATERIALS:
  TEXTURE_COMPRESSION: DXT | BC7 | ASTC
  MIPMAP_GENERATION: AUTO | MANUAL | NONE
  TEXTURE_STREAMING: true
  
  SHADER_COMPLEXITY: SIMPLE | STANDARD | COMPLEX
  SUBSURFACE_APPROXIMATION: FAST | ACCURATE
  REFLECTION_QUALITY: LOW | MEDIUM | HIGH
```

### Memory Management
```sitl
MATERIAL_MEMORY_SETTINGS:
  TEXTURE_CACHE_SIZE: 512MB
  MATERIAL_INSTANCES: SHARED | UNIQUE
  GARBAGE_COLLECTION: AGGRESSIVE | BALANCED | CONSERVATIVE
  
  PRELOAD_MATERIALS: [COMMON_FABRICS, SKIN_TYPES]
  LAZY_LOAD_MATERIALS: [SPECIALIZED_EFFECTS]
```

## Integration Examples

### Complete Character Material Setup
```sitl
CREATE_SCENE "detailed_character":
  // Skin material
  APPLY_MATERIAL "realistic_skin" TO PERSON:
    SKIN_TYPE: CAUCASIAN
    AGE_FACTOR: 0.25
    SUBSURFACE: 0.8
    PORE_DETAIL: MEDIUM
  
  // Hair material
  APPLY_MATERIAL "brown_hair" TO HAIR:
    BASE_COLOR: #8B4513
    MELANIN_CONCENTRATION: 0.7
    CURL_PATTERN: WAVY
    STRAND_COUNT: HIGH
  
  // Clothing materials
  APPLY_MATERIAL "cotton_shirt" TO SHIRT:
    BASE_COLOR: #4169E1
    ROUGHNESS: 0.8
    WEAVE_PATTERN: PLAIN
    WEAR_LEVEL: LIGHT
  
  APPLY_MATERIAL "denim_jeans" TO JEANS:
    BASE_COLOR: #1E90FF
    WEAVE_PATTERN: TWILL
    FADE_PATTERN: WHISKERS
    WEAR_LEVEL: MODERATE
  
  DRAW PERSON WITH AGE 25 AND CASUAL_ATTIRE
```

### Environmental Scene with Material Variety
```sitl
CREATE_SCENE "urban_environment":
  // Building materials
  APPLY_MATERIAL "weathered_concrete" TO BUILDINGS:
    ROUGHNESS: 0.7
    WEATHERING: 0.6
    STAINING: 0.4
    CRACK_DETAIL: LIGHT
  
  // Street materials
  APPLY_MATERIAL "wet_asphalt" TO STREET:
    WETNESS: 0.8
    REFLECTIVITY: 0.4
    PUDDLE_FORMATION: true
  
  // Natural elements
  APPLY_MATERIAL "city_grass" TO GRASS:
    SEASONAL_COLOR: AUTUMN
    DENSITY: MEDIUM
    WEAR_PATTERN: HIGH_TRAFFIC
  
  // Metal elements
  APPLY_MATERIAL "rusted_steel" TO RAILINGS:
    METALLIC: 1.0
    RUST_COVERAGE: 0.3
    OXIDATION: 0.5
  
  ADD ENVIRONMENT URBAN_STREET
  ADD WEATHER LIGHT_RAIN
```

### Dynamic Material Animation
```sitl
CREATE_SCENE "fabric_in_wind":
  DEFINE_MATERIAL "silk_scarf":
    BASE_COLOR: #FF69B4
    ROUGHNESS: 0.1
    ANISOTROPY: 0.8
    TRANSLUCENCY: 0.3
  
  ANIMATE_MATERIAL_PROPERTIES:
    MATERIAL: "silk_scarf"
    PROPERTY: ANISOTROPY_ROTATION
    KEYFRAMES:
      TIME 0.0: VALUE 0
      TIME 2.0: VALUE 180
      TIME 4.0: VALUE 360
    LOOP: true
  
  ADD_WIND_EFFECT:
    STRENGTH: MODERATE
    DIRECTION: VARIABLE
    TURBULENCE: 0.3
  
  DRAW PERSON WITH SILK_SCARF
  APPLY_MATERIAL "silk_scarf" TO SCARF
```

This materials system provides comprehensive control over surface properties and visual characteristics while maintaining SITL's intuitive syntax, enabling everything from simple material assignments to complex, physically-accurate material behaviors.