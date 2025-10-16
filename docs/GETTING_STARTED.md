# Getting Started with SIGL

Welcome to SIGL (Structured Image Generation Language)! This guide will help you create your first scene illustration in minutes.

## Installation

### Prerequisites

- **Node.js** 22.0.0 or higher
- **npm** or **pnpm** package manager

### Install SIGL

```bash
# Clone the repository
git clone https://github.com/your-org/sigl-engine.git
cd sigl-engine

# Install dependencies
npm install

# Build the project
npm run build
```

## Your First Scene

### 1. Create a SIGL File

Create a new file called `my-first-scene.sigl`:

```sigl
// my-first-scene.sigl
DRAW MAN WITH AGE 30 AND BLUE SHIRT AT LEFT
DRAW WOMAN WITH AGE 28 AND RED DRESS AT RIGHT
ADD ENVIRONMENT PARK
```

### 2. Generate the Image

```bash
# Using CLI (coming soon)
sigl generate my-first-scene.sigl -o output.png

# Or using Node.js
node -e "
const { SIGLEngine } = require('./dist/index.js');
const fs = require('fs');

const sigl = fs.readFileSync('my-first-scene.sigl', 'utf8');
const engine = new SIGLEngine();

engine.initialize()
  .then(() => engine.parse(sigl))
  .then(result => engine.render(result.data))
  .then(canvas => engine.export(canvas, { format: 'png' }))
  .then(blob => fs.writeFileSync('output.png', blob));
"
```

### 3. View Your Scene

Open `output.png` to see your generated scene!

## Core Concepts

### Entities

Entities are the objects in your scene. SIGL supports several types:

**Humans:**
```sigl
DRAW MAN
DRAW WOMAN
DRAW BOY
DRAW GIRL
DRAW BABY
DRAW PERSON  // Gender-neutral
```

**Animals:**
```sigl
DRAW ANIMAL DOG
DRAW ANIMAL CAT
DRAW ANIMAL BIRD
DRAW ANIMAL HORSE
```

**Objects:**
```sigl
DRAW TREE
DRAW HOUSE
DRAW CAR
DRAW BUILDING
```

### Attributes

Customize entities with attributes:

```sigl
// Age
DRAW MAN WITH AGE 35

// Clothing
DRAW WOMAN WITH RED DRESS

// Multiple attributes
DRAW BOY WITH AGE 8 AND GREEN SHIRT AND HAPPY FACE

// Parameterized attributes
DRAW WOMAN WITH HAIR(COLOR: BLONDE, STYLE: LONG, TEXTURE: WAVY)
```

### Positioning

Place entities in your scene:

```sigl
// Named positions
DRAW MAN AT LEFT
DRAW WOMAN AT RIGHT
DRAW TREE AT CENTER

// Relative positioning
DRAW BOY NEXT TO MAN
DRAW GIRL BEHIND WOMAN
DRAW DOG IN FRONT OF BOY

// Coordinates
DRAW HOUSE AT POSITION 100, 200
DRAW CAR AT (512, 384)

// Grid positioning
DRAW TREE AT GRID 1, 1
DRAW FLOWER AT GRID 2, 3
```

### Environments

Set the scene context:

```sigl
ADD ENVIRONMENT PARK
ADD ENVIRONMENT OFFICE
ADD ENVIRONMENT BEACH
ADD ENVIRONMENT CLASSROOM
```

## Common Patterns

### Family Portrait

```sigl
CREATE SCENE "family_portrait": {
    DRAW MAN WITH AGE 35 AND BLUE SHIRT AT LEFT
    DRAW WOMAN WITH AGE 32 AND RED DRESS NEXT TO MAN
    DRAW BOY WITH AGE 8 AND GREEN SHIRT IN FRONT OF MAN
    DRAW GIRL WITH AGE 6 AND YELLOW DRESS IN FRONT OF WOMAN
    ADD ENVIRONMENT PARK
}

EXPORT "family_portrait" AS PNG WITH RESOLUTION: 1920x1080
```

### Classroom Scene

```sigl
LOAD EXTENSION educational

CREATE SCENE "classroom": {
    ADD ENVIRONMENT CLASSROOM
    DRAW TEACHER WITH PROFESSIONAL_ATTIRE AT LEFT
    DRAW STUDENT WITH AGE 10 AND SCHOOL_UNIFORM AT GRID 1, 1
    DRAW STUDENT WITH AGE 11 AND SCHOOL_UNIFORM AT GRID 2, 1
    DRAW STUDENT WITH AGE 10 AND SCHOOL_UNIFORM AT GRID 1, 2
    DRAW BLACKBOARD BEHIND TEACHER
}

EXPORT AS PNG
```

### Medical Consultation

```sigl
LOAD EXTENSION hospital

CREATE SCENE "checkup": {
    ADD ENVIRONMENT EXAMINATION_ROOM
    DRAW DOCTOR WITH WHITE_COAT AND STETHOSCOPE AT LEFT
    DRAW PATIENT WITH AGE 45 AND CASUAL_WEAR NEXT TO DOCTOR
    DRAW EXAMINATION_TABLE AT CENTER
}

EXPORT AS PNG WITH QUALITY: HIGH
```

## Using Extensions

Extensions add domain-specific entities and features:

```sigl
// Load an extension
LOAD EXTENSION educational

// Now you can use extension entities
DRAW TEACHER
DRAW STUDENT
DRAW PRINCIPAL
```

**Available Extensions:**
- `educational` - Schools, teachers, students
- `hospital` - Medical professionals, equipment
- `military` - Soldiers, officers, vehicles
- `religious` - Religious figures, buildings
- `transportation` - Vehicles, pilots, drivers
- `court` - Legal professionals, courtrooms
- `space` - Astronauts, spacecraft

## Templates

Create reusable scene components:

```sigl
// Define a template
DEFINE TEMPLATE "office_worker": {
    PERSON WITH ATTIRE(STYLE: BUSINESS, COLOR: NAVY)
    ACCESSORIES(BADGE: CORPORATE, BRIEFCASE: LEATHER)
}

// Use the template
USE TEMPLATE "office_worker" AT LEFT
USE TEMPLATE "office_worker" AT RIGHT
```

## Variations

Define reusable attribute sets:

```sigl
// Define a variation
DEFINE VARIATION "business_casual":
    OUTFIT(SHIRT: POLO, PANTS: KHAKI, SHOES: LOAFERS)
    STYLE: RELAXED_PROFESSIONAL

// Use the variation
DRAW MAN WITH VARIATION "business_casual"
DRAW WOMAN WITH VARIATION "business_casual" AND LONG_HAIR
```

## Export Options

Control your output format and quality:

```sigl
// Basic export
EXPORT AS PNG

// With resolution
EXPORT AS PNG WITH RESOLUTION: 1920x1080

// With quality
EXPORT AS JPEG WITH QUALITY: HIGH

// Multiple options
EXPORT AS PDF WITH RESOLUTION: 4K AND DPI: 300

// Named scene export
EXPORT "my_scene" AS PNG WITH RESOLUTION: HD AND QUALITY: ULTRA
```

**Supported Formats:**
- `PNG` - Lossless raster (default)
- `JPEG` - Lossy raster (smaller files)
- `WEBP` - Modern web format
- `SVG` - Vector format (scalable)
- `PDF` - Document format
- `GIF` - Animated format

**Quality Presets:**
- `LOW` - Fast generation, lower quality
- `MEDIUM` - Balanced (default)
- `HIGH` - Better quality, slower
- `ULTRA` - Best quality, slowest

**Resolution Presets:**
- `THUMBNAIL` - 150x150
- `HD` - 1920x1080
- `FULL_HD` - 1920x1080
- `4K` - 3840x2160

## Common Mistakes & Solutions

### ❌ Undefined Entity

```sigl
DRAW UNICORN
// Error: Unknown entity 'UNICORN'
```

**Solution:** Use valid entity types or load required extension

```sigl
DRAW ANIMAL HORSE  // ✓ Correct
LOAD EXTENSION fantasy
DRAW UNICORN  // ✓ Correct if extension provides it
```

### ❌ Missing Extension

```sigl
DRAW DOCTOR
// Error: DOCTOR requires hospital extension
```

**Solution:** Load the extension first

```sigl
LOAD EXTENSION hospital  // ✓ Add this first
DRAW DOCTOR
```

### ❌ Invalid Attribute Combination

```sigl
DRAW MAN WITH BLUE SHIRT AND RED SHIRT
// Warning: Multiple conflicting shirt colors
```

**Solution:** Use one attribute or parameterized syntax

```sigl
DRAW MAN WITH BLUE SHIRT  // ✓ Single color
DRAW MAN WITH SHIRT(COLOR: BLUE, PATTERN: STRIPES)  // ✓ Detailed
```

### ❌ Context Mismatch

```sigl
ADD ENVIRONMENT OFFICE
DRAW MAN WITH SWIMWEAR
// Warning: Swimwear inappropriate for office
```

**Solution:** Match clothing to environment

```sigl
ADD ENVIRONMENT OFFICE
DRAW MAN WITH BUSINESS_SUIT  // ✓ Context-appropriate
```

## Next Steps

### Learn More

- **[Core Entities](core/entities.md)** - All available entity types
- **[Human Attributes](core/human-attributes.md)** - Customization options
- **[Positioning](core/positioning.md)** - Layout and arrangement
- **[Extensions](extensions/)** - Domain-specific features
- **[Templates](features/templates.md)** - Reusable components

### Advanced Topics

- **[Animations](features/animations.md)** - Movement and transitions
- **[Patterns](features/patterns.md)** - Visual patterns
- **[Lighting](features/lighting.md)** - Light and shadows
- **[Camera](features/camera.md)** - Viewpoint control

### Examples

Check out the `examples/` directory for more complete scenes:

```bash
# Basic scenes
examples/basic/simple-scene.sigl
examples/basic/family-portrait.sigl

# Domain-specific scenes
examples/educational/classroom.sigl
examples/hospital/examination.sigl
```

### Get Help

- **Documentation:** [docs/README.md](README.md)
- **Grammar Spec:** [docs/system/grammar-specification.md](system/grammar-specification.md)
- **Issues:** [GitHub Issues](https://github.com/your-org/sigl-engine/issues)

## Quick Reference Card

```sigl
// ===== BASIC STRUCTURE =====
DRAW <entity> [WITH <attributes>] [AT <position>]

// ===== ENTITIES =====
MAN, WOMAN, BOY, GIRL, BABY, PERSON
ANIMAL DOG|CAT|BIRD|HORSE|FISH
TREE, HOUSE, CAR, BUILDING

// ===== ATTRIBUTES =====
AGE <number>
<color> SHIRT|DRESS|PANTS|SKIRT
HAPPY|SAD|ANGRY FACE
TALL|SHORT HEIGHT

// ===== PARAMETERIZED =====
HAIR(COLOR: <color>, STYLE: <style>)
OUTFIT(SHIRT: <item>, PANTS: <item>)

// ===== POSITIONING =====
AT LEFT|RIGHT|CENTER|TOP|BOTTOM
NEXT TO <entity>
BEHIND <entity>
AT POSITION <x>, <y>
AT GRID <row>, <col>

// ===== SCENES =====
CREATE SCENE "<name>": { <statements> }
ADD ENVIRONMENT <type>
LOAD EXTENSION <name>

// ===== EXPORT =====
EXPORT AS PNG|JPEG|SVG|PDF
WITH RESOLUTION: <width>x<height>
AND QUALITY: LOW|MEDIUM|HIGH|ULTRA
```

## Tips for Success

1. **Start Simple** - Begin with basic entities and add complexity gradually
2. **Use Extensions** - Load domain extensions for specialized entities
3. **Leverage Templates** - Create reusable components for common patterns
4. **Check Context** - Match clothing and attributes to your environment
5. **Preview Often** - Export frequently to see your progress
6. **Read Errors** - Error messages include helpful suggestions

---

**Ready to create amazing scenes?** Start with the examples above and experiment! 🎨

Need help? Check the [documentation](README.md) or [open an issue](https://github.com/your-org/sigl-engine/issues).

