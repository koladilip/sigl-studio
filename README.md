# SIGL Engine

**Structured Image Generation Language (SIGL)** - A powerful domain-specific language for creating detailed, customizable scene illustrations.

## Overview

SIGL is a modular, text-based language for generating images and scenes using intuitive, natural language commands. It combines a powerful **Core System** with **Domain Extensions** for specialized use cases.

## Quick Start Guide

### Basic Example
Here's a complete example from input to output:

```sigl
// Load required extensions
LOAD EXTENSION hospital

// Create a medical checkup scene
CREATE SCENE "checkup":
  DRAW DOCTOR WITH WHITE COAT AND STETHOSCOPE AT LEFT
  DRAW PATIENT WITH AGE 30 AND CASUAL CLOTHES NEXT TO DOCTOR
  ADD ENVIRONMENT HOSPITAL_ROOM
  ADD TEXT "Annual Checkup" AT TOP CENTER WITH FONT SIZE 24

// Export the result
EXPORT AS PNG WITH SIZE 1024x768 TO "checkup_scene.png"
```

This creates a hospital scene with a doctor examining a patient, complete with appropriate environment and labeling.

### More Examples

#### Family Portrait
```sigl
CREATE SCENE "family_portrait":
  DRAW MAN WITH AGE 35 AND BLUE SHIRT AT LEFT
  DRAW WOMAN WITH AGE 32 AND RED DRESS NEXT TO MAN
  DRAW BOY WITH AGE 8 AND GREEN SHIRT IN FRONT OF MAN
  DRAW GIRL WITH AGE 6 AND YELLOW DRESS IN FRONT OF WOMAN
  ADD ENVIRONMENT PARK
  SET LIGHTING DIRECTION TOP-LEFT WITH INTENSITY SOFT
EXPORT AS PNG WITH SIZE 1920x1080
```

#### Space Mission
```sigl
LOAD EXTENSION space
CREATE SCENE "moon_landing":
  DRAW ASTRONAUT WITH SPACE_SUIT AT CENTER
  DRAW LUNAR_MODULE AT RIGHT
  DRAW EARTH IN BACKGROUND AT TOP-LEFT
  ADD ENVIRONMENT MOON_SURFACE
  ADD TEXT "One Small Step" AT BOTTOM WITH FONT SIZE 18
EXPORT AS PNG WITH SIZE 1024x768
```

#### Professional Portrait with Advanced Features
```sigl
CREATE SCENE "executive_portrait":
  // Advanced camera and composition
  SET_CAMERA:
    POSITION: (0, 1.6, 2)
    FOCAL_LENGTH: 85mm
    APERTURE: f/2.8
    DEPTH_OF_FIELD: SHALLOW
  
  SET_PORTRAIT_COMPOSITION:
    FRAMING: THREE_QUARTER
    HEAD_POSITION: RIGHT_THIRD
    EYE_LEVEL: SLIGHTLY_ABOVE
  
  // Professional lighting setup
  ADD_LIGHT "key":
    TYPE: SOFTBOX
    POSITION: (1, 2, 1)
    INTENSITY: 0.8
    COLOR_TEMPERATURE: 5600K
  
  ADD_LIGHT "fill":
    TYPE: UMBRELLA
    POSITION: (-0.5, 1.5, 1)
    INTENSITY: 0.3
  
  // Subject with advanced materials
  DRAW PERSON WITH AGE 45:
    CLOTHING: BUSINESS_SUIT
    MATERIAL: WOOL_BLEND
    PATTERN: SUBTLE_PINSTRIPE
    SKIN_MATERIAL: REALISTIC_SKIN WITH AGE_FACTOR 0.4
  
  // High-quality export
  EXPORT AS PNG:
    RESOLUTION: 4K
    COLOR_SPACE: ADOBE_RGB
    QUALITY: ULTRA
    DPI: 300
```

#### Cinematic Landscape
```sigl
CREATE_SCENE "golden_hour_vista":
  // Cinematic camera setup
  SET_CAMERA:
    POSITION: (0, 10, -50)
    FOCAL_LENGTH: 24mm
    TILT_SHIFT: SUBTLE
  
  // Advanced composition
  SET_LANDSCAPE_COMPOSITION:
    HORIZON_PLACEMENT: LOWER_THIRD
    LEADING_LINES: RIVER_PATH
    FOCAL_POINT: MOUNTAIN_PEAK AT GOLDEN_RATIO
  
  // Dynamic lighting
  SET_TIME_OF_DAY: GOLDEN_HOUR
  ADD_ATMOSPHERIC_EFFECTS:
    VOLUMETRIC_LIGHTING: true
    GOD_RAYS: INTENSITY 0.6
    ATMOSPHERIC_SCATTERING: true
  
  // Advanced materials
  APPLY_MATERIAL "mountain_rock":
    TYPE: GRANITE
    WEATHERING: 0.7
    MOSS_COVERAGE: 0.2
  
  APPLY_MATERIAL "flowing_water":
    TRANSPARENCY: 0.9
    WAVE_HEIGHT: 0.1
    FOAM_COVERAGE: 0.15
  
  // Environment with depth layers
  CREATE_DEPTH_LAYERS:
    FOREGROUND: WILDFLOWERS WITH SOFT_BLUR
    MIDGROUND: RIVER WITH SHARP_FOCUS
    BACKGROUND: MOUNTAINS WITH ATMOSPHERIC_PERSPECTIVE
  
  EXPORT AS PNG WITH HDR_TONE_MAPPING
```

### Command Structure
All SIGL commands follow this standardized pattern:
```
ACTION ENTITY [WITH ATTRIBUTES] [AT POSITION] [MODIFIERS]
```

### Error Prevention
Common mistakes to avoid:
- **Ambiguous positioning**: Use specific coordinates or relative positioning
- **Missing extensions**: Always load required extensions before using domain-specific entities
- **Conflicting attributes**: Check for logical conflicts (e.g., BABY WITH BEARD)
- **Invalid combinations**: Some extensions may not work together

## Glossary

- **SCENE**: A complete composition containing multiple entities and environments
- **BIOME**: A predefined natural environment template (forest, desert, etc.)
- **TEMPLATE**: A reusable entity or scene definition
- **EXTENSION**: A domain-specific module that adds specialized entities and commands
- **ENTITY**: Any drawable object (person, animal, object, etc.)
- **ATTRIBUTE**: Properties that modify an entity's appearance (age, color, size, etc.)
- **ENVIRONMENT**: Background and contextual elements for scenes

## Documentation Structure

This specification has been organized into logical modules for better navigation and maintainability:

### Core System Documentation
- **[Core Entities](docs/core/entities.md)** - Basic drawing commands for humans, animals, and objects
- **[Human Attributes](docs/core/human-attributes.md)** - Age, emotion, physical features, clothing, and appearance
- **[Color System](docs/core/colors.md)** - Color specifications, themes, and patterns
- **[Nature Elements](docs/core/nature.md)** - Trees, water, terrain, weather, and biomes
- **[Positioning & Layout](docs/core/positioning.md)** - Coordinate systems, relative positioning, and alignment
- **[Composition](docs/core/composition.md)** - Scenes, groups, and combining elements
- **[Text & Labels](docs/core/text.md)** - Text rendering, fonts, and labeling
- **[Shapes & Primitives](docs/core/shapes.md)** - Basic geometric shapes and drawing primitives
- **[Lighting & Effects](docs/core/lighting.md)** - Lighting systems and visual effects
- **[Backgrounds & Environments](docs/core/environments.md)** - Background elements and environmental settings

### Domain Extensions
- **[Hospital Domain](docs/extensions/hospital.md)** - Medical staff, equipment, and hospital environments
- **[Space Domain](docs/extensions/space.md)** - Astronauts, spacecraft, and celestial bodies
- **[Court/Legal Domain](docs/extensions/legal.md)** - Judges, lawyers, and courtroom settings
- **[Military Domain](docs/extensions/military.md)** - Soldiers, weapons, and military vehicles
- **[Religious Domain](docs/extensions/religious.md)** - Clergy, religious buildings, and ceremonies
- **[Transportation Domain](docs/extensions/transportation.md)** - Vehicles and travel scenarios
- **[Educational Domain](docs/extensions/educational.md)** - Schools, teachers, and students

### Advanced Features
- **[Pattern System](docs/features/patterns.md)** - Clothing patterns, textures, and visual variations
- **[Animation System](docs/features/animations.md)** - Entity animations, movements, and dynamic behaviors
- **[Aliasing System](docs/features/aliasing.md)** - Entity aliases and shorthand configurations
- **[Enhanced Expressions](docs/features/expressions.md)** - Playful attributes, interactivity, and educational features
- **[Advanced Templates](docs/features/advanced.md)** - Complex template systems and variations
- **[Background Systems](docs/features/backgrounds.md)** - Advanced background and environment features
- **[Template Variations](docs/features/variations.md)** - Template variation and customization systems
- **[Rendering & Output](docs/features/rendering.md)** - Advanced image generation, export formats, and quality controls
- **[Lighting & Visual Effects](docs/features/lighting.md)** - Sophisticated lighting systems, shadows, and atmospheric effects
- **[Camera & Perspective](docs/features/camera.md)** - Camera positioning, lens effects, and perspective controls
- **[Composition & Layout](docs/features/composition.md)** - Professional composition techniques and visual design principles
- **[Materials & Textures](docs/features/materials.md)** - Advanced surface properties, PBR materials, and texture systems
- **[Performance & Optimization](docs/features/performance.md)** - Rendering optimization, memory management, and quality scaling

### System Features
- **[Templates & Reusability](docs/system/templates.md)** - Creating and using reusable templates
- **[Export & Output](docs/system/export.md)** - Output formats and export options
- **[Language Rules](docs/system/language-rules.md)** - Syntax rules and conventions
- **[Grammar Specification](docs/system/grammar.md)** - Formal grammar definition
- **[Security & Validation](docs/system/security.md)** - Input validation and security considerations
- **[Performance Guidelines](docs/system/performance.md)** - Optimization and performance best practices
- **[Testing & Examples](docs/system/testing.md)** - Test cases and example scenarios
- **[Implementation Notes](docs/system/implementation.md)** - Technical implementation details
- **[Integration & APIs](docs/system/integration.md)** - API integration and external interfaces
- **[Future Enhancements](docs/system/future.md)** - Planned features and roadmap

## Architecture

### Core System
The core system provides fundamental drawing capabilities:
- Basic entities (humans, animals, objects)
- Essential attributes (age, emotion, colors)
- Nature elements (trees, water, terrain)
- Basic positioning and layout
- Core composition features

### Domain Extensions
Specialized extensions for specific contexts that can be loaded as needed to extend the core functionality with domain-specific entities and commands.

### Extension System Rules

#### Loading Extensions
```sigl
LOAD EXTENSION hospital
LOAD EXTENSION space
LOAD EXTENSION military
```

#### Namespace Resolution
When multiple extensions define the same entity:
1. **Core System** takes precedence over extensions
2. **Last loaded extension** takes precedence over earlier ones
3. Use explicit namespacing to resolve conflicts:
   ```sigl
   DRAW CORE:CAR          // Uses core car definition
   DRAW TRANSPORT:CAR     // Uses transportation extension car
   DRAW MILITARY:CAR      // Uses military extension vehicle
   ```

#### Cross-Extension Compatibility
Extensions can be combined when they don't conflict:
```sigl
LOAD EXTENSION hospital
LOAD EXTENSION military
CREATE SCENE "field_hospital":
  DRAW MILITARY:MEDIC WITH HOSPITAL:STETHOSCOPE
  ADD ENVIRONMENT MILITARY:FIELD_TENT WITH HOSPITAL:MEDICAL_EQUIPMENT
```

## Getting Started

1. Start with the [Core Entities](docs/core/entities.md) to understand basic drawing commands
2. Learn about [Human Attributes](docs/core/human-attributes.md) for character customization
3. Explore [Positioning & Layout](docs/core/positioning.md) for scene composition
4. Check out domain extensions relevant to your use case
5. Review [Templates & Reusability](docs/system/templates.md) for efficient workflows

For complete examples and test cases, see [Testing & Examples](docs/system/testing.md).