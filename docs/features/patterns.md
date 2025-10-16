# Pattern System

## Overview

The Pattern System in SITL allows you to apply various visual patterns to clothing items (dresses, shirts, pants) and other entities (curtains, flags) to add visual variety and creative flexibility. This system supports both predefined patterns and custom user-defined patterns.

## Core Principles

- **Pattern as a Parameterized Attribute**: Treat patterns as a customizable property of clothing or objects
- **Reusable Presets**: Allow users to define pattern presets for common styles
- **Contextual Defaults**: Infer patterns based on environment or domain
- **Extensibility**: Support custom patterns via user-defined assets or procedural generation
- **Cross-Domain Compatibility**: Patterns work across all domain extensions

## Basic Pattern Syntax

### Simple Pattern Application
```sitl
DRAW <ENTITY> WITH <CLOTHING>(PATTERN: <TYPE>, COLOR: <COLOR>)
```

**Examples:**
```sitl
DRAW WOMAN WITH DRESS(PATTERN: FLORAL, COLOR: PINK)
DRAW MAN WITH SHIRT(PATTERN: STRIPED, COLOR: BLUE_AND_WHITE)
DRAW GIRL WITH SKIRT(PATTERN: POLKA_DOT, COLOR: RED_AND_BLACK)
```

### Available Pattern Types
- `SOLID` (default)
- `STRIPED`
- `POLKA_DOT`
- `CHECKERED`
- `FLORAL`
- `GEOMETRIC`
- `PAISLEY`
- `CARTOON`
- `EMBROIDERED`
- `CAMOUFLAGE`
- `CUSTOM`

## Advanced Pattern Features

### Pattern Modifiers
Add fine-grained control for pattern properties:

```sitl
DRAW WOMAN WITH DRESS(PATTERN: STRIPED, STRIPE_WIDTH: THIN, ORIENTATION: HORIZONTAL)
DRAW MAN WITH SHIRT(PATTERN: POLKA_DOT, DOT_SIZE: SMALL, SPACING: DENSE)
```

**Available Modifiers:**
- `STRIPE_WIDTH`: THIN, MEDIUM, THICK
- `DOT_SIZE`: SMALL, MEDIUM, LARGE
- `SPACING`: DENSE, SPARSE
- `ORIENTATION`: HORIZONTAL, VERTICAL, DIAGONAL

### Pattern Presets
Define reusable pattern configurations:

```sitl
DEFINE VARIATION "floral_dress":
  DRESS(PATTERN: FLORAL, COLOR: PINK_AND_PURPLE, STYLE: SUMMER)

DRAW WOMAN WITH VARIATION "floral_dress"
DRAW WOMAN WITH VARIATION "floral_dress" AND COLOR: BLUE_AND_WHITE
```

### Custom Patterns
Load and use custom pattern assets:

```sitl
LOAD PATTERN ASSET "custom_tartan.svg" AS "TARTAN"
DRAW WOMAN WITH DRESS(PATTERN: TARTAN, COLOR: GREEN_AND_RED)
```

## Domain-Specific Examples

### Core Domain (Casual Clothing)
```sitl
// Basic dress with pattern
DRAW WOMAN WITH DRESS(PATTERN: FLORAL, COLOR: YELLOW_AND_GREEN)
// Shirt with pattern
DRAW MAN WITH SHIRT(PATTERN: CHECKERED, COLOR: BLUE_AND_WHITE)
```

### Hospital Domain
```sitl
LOAD EXTENSION hospital
DEFINE VARIATION "pediatric_scrubs":
  SCRUBS(PATTERN: CARTOON, COLOR: BLUE, ACCESSORIES: NAME_TAG)
DRAW NURSE WITH VARIATION "pediatric_scrubs"
```

### Military Domain
```sitl
LOAD EXTENSION military
DEFINE VARIATION "desert_camo":
  UNIFORM(PATTERN: CAMOUFLAGE, COLOR: TAN_AND_BROWN, STYLE: COMBAT)
DRAW SOLDIER WITH VARIATION "desert_camo"
```

### Religious Domain
```sitl
LOAD EXTENSION religious
DEFINE VARIATION "ceremonial_robe":
  ATTIRE(PATTERN: EMBROIDERED, COLOR: WHITE_AND_GOLD, STYLE: ORNATE)
DRAW PRIEST WITH VARIATION "ceremonial_robe"
```

## Pattern Defaults and Context

### Global Pattern Defaults
```sitl
SET DEFAULT PATTERN FOR DRESS: SOLID
SET DEFAULT PATTERN FOR SHIRT: SOLID
```

### Contextual Pattern Inference
Patterns can be automatically inferred based on environment:

```sitl
ADD ENVIRONMENT WEDDING
DRAW WOMAN WITH DRESS // Infers PATTERN: LACE or FLORAL

ADD ENVIRONMENT HOSPITAL
DRAW NURSE WITH SCRUBS // Infers PATTERN: SOLID or CARTOON (pediatric)

ADD ENVIRONMENT DESERT
DRAW SOLDIER WITH UNIFORM // Infers PATTERN: CAMOUFLAGE
```

## Error Handling

### Invalid Patterns
```sitl
DRAW WOMAN WITH DRESS(PATTERN: UNKNOWN)
// Warning: Invalid pattern "UNKNOWN" for DRESS. Using default SOLID pattern.
```

### Conflicting Patterns
```sitl
DRAW WOMAN WITH DRESS(PATTERN: FLORAL AND PATTERN: STRIPED)
// Error: Multiple patterns specified for DRESS. Choose one (e.g., FLORAL or STRIPED).
```

### Pattern Compatibility
Certain patterns are restricted to appropriate entities:
- `CAMOUFLAGE`: Military uniforms, not civilian dresses (unless explicitly allowed)
- `CARTOON`: Pediatric scrubs, children's clothing
- `EMBROIDERED`: Ceremonial or formal attire

## Implementation Notes

### Pattern Rendering
- **Procedural Patterns**: Use HTML5 Canvas `createPattern` for simple patterns (STRIPED, POLKA_DOT)
- **Complex Patterns**: Use SVG assets for detailed patterns (FLORAL, PAISLEY)
- **Custom Patterns**: Support user-uploaded SVG files

### Asset Management
- Store patterns as SVG/PNG textures or procedural algorithms
- Cache rendered patterns for performance optimization
- Support pattern libraries with predefined textures

### Performance Considerations
- Pre-render common patterns as reusable textures
- Limit pattern complexity to avoid rendering lag
- Use WebGL for complex scenes with multiple patterned entities

## Cultural and Custom Patterns

### Cultural Patterns
Support culturally specific patterns:

```sitl
DRAW MAN WITH KILT(PATTERN: TARTAN, COLOR: BLUE_AND_GREEN)
DRAW WOMAN WITH DRESS(PATTERN: KENTE, COLOR: TRADITIONAL)
```

### Pattern Scaling
Control pattern size and density:

```sitl
DRAW DRESS WITH PATTERN: POLKA_DOT, DOT_SIZE: SMALL, PATTERN_SCALE: 0.5
```

## Future Enhancements

- **Procedural Pattern Generator**: Dynamic pattern creation based on seed values
- **Pattern Animation**: Support animated patterns (e.g., shimmering sequins)
- **AI-Assisted Patterns**: Suggest patterns based on context or user history
- **Pattern Blending**: Combine multiple patterns for complex designs

## Examples and Use Cases

### Fashion Design
```sitl
CREATE SCENE "fashion_show":
  DRAW WOMAN WITH DRESS(PATTERN: GEOMETRIC, COLOR: BLACK_AND_WHITE) AT LEFT
  DRAW WOMAN WITH DRESS(PATTERN: FLORAL, COLOR: SPRING_COLORS) AT CENTER
  DRAW WOMAN WITH DRESS(PATTERN: STRIPED, ORIENTATION: DIAGONAL) AT RIGHT
```

### Children's Book Illustration
```sitl
CREATE SCENE "playground":
  DRAW GIRL WITH DRESS(PATTERN: POLKA_DOT, COLOR: BRIGHT_PINK) AT SWING
  DRAW BOY WITH SHIRT(PATTERN: CARTOON, COLOR: BLUE) AT SLIDE
```

### Historical Recreation
```sitl
CREATE SCENE "medieval_court":
  DRAW KING WITH ROBE(PATTERN: EMBROIDERED, COLOR: ROYAL_PURPLE)
  DRAW QUEEN WITH DRESS(PATTERN: BROCADE, COLOR: GOLD_AND_SILVER)
```