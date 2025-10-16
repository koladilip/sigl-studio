# Core Entity Commands

This document describes the fundamental drawing commands available in the SITL core system for creating basic entities.

## Humans

The core system provides commands for drawing human figures of different ages and genders:

```sitl
DRAW MAN
DRAW WOMAN  
DRAW BOY
DRAW GIRL
DRAW BABY
```

### Usage Examples
```sitl
// Basic human entities
DRAW MAN AT LEFT
DRAW WOMAN AT CENTER
DRAW BOY NEXT TO MAN
DRAW GIRL NEXT TO WOMAN
DRAW BABY IN FRONT OF WOMAN

// With basic attributes
DRAW MAN WITH AGE 35
DRAW WOMAN WITH HAPPY FACE
DRAW BOY WITH BLUE SHIRT
```

## Animals

The core system includes basic animal entities:

```sitl
DRAW ANIMAL DOG
DRAW ANIMAL CAT
DRAW ANIMAL BIRD
DRAW ANIMAL HORSE
DRAW ANIMAL FISH
```

### Usage Examples
```sitl
// Basic animals
DRAW ANIMAL DOG AT RIGHT
DRAW ANIMAL CAT ON FENCE
DRAW ANIMAL BIRD IN TREE
DRAW ANIMAL HORSE IN FIELD
DRAW ANIMAL FISH IN POND

// With attributes
DRAW ANIMAL DOG WITH SIZE LARGE
DRAW ANIMAL CAT WITH COLOR BLACK
DRAW ANIMAL BIRD WITH WINGS SPREAD
```

## Objects

Basic objects for scene composition:

```sitl
DRAW TREE
DRAW HOUSE
DRAW CAR
DRAW BUILDING
DRAW BOAT
```

### Usage Examples
```sitl
// Basic objects
DRAW TREE AT BACKGROUND
DRAW HOUSE AT CENTER
DRAW CAR IN DRIVEWAY
DRAW BUILDING AT LEFT
DRAW BOAT ON WATER

// With attributes
DRAW TREE WITH GREEN LEAVES
DRAW HOUSE WITH RED ROOF
DRAW CAR WITH COLOR BLUE
DRAW BUILDING WITH HEIGHT TALL
```

## Entity Attributes

All entities can be modified with various attributes:

### Size Attributes
```sitl
DRAW MAN WITH SIZE LARGE
DRAW TREE WITH SIZE SMALL
DRAW HOUSE WITH SIZE MEDIUM
```

### Color Attributes
```sitl
DRAW CAR WITH COLOR RED
DRAW BUILDING WITH COLOR GRAY
DRAW BOAT WITH COLOR WHITE
```

### Position Attributes
```sitl
DRAW MAN AT POSITION 100,200
DRAW TREE AT LEFT
DRAW HOUSE AT CENTER
```

## Combining Entities

Entities can be combined in scenes:

```sitl
CREATE SCENE "basic_scene":
  DRAW MAN WITH AGE 30 AT LEFT
  DRAW WOMAN WITH AGE 28 NEXT TO MAN
  DRAW ANIMAL DOG WITH SIZE MEDIUM AT RIGHT
  DRAW TREE WITH SIZE LARGE AT BACKGROUND
  DRAW HOUSE WITH RED ROOF AT CENTER BACKGROUND
```

## Related Documentation

- **[Human Attributes](human-attributes.md)** - Detailed customization options for human entities
- **[Positioning & Layout](positioning.md)** - Advanced positioning and layout options
- **[Color System](colors.md)** - Comprehensive color specification system
- **[Composition](composition.md)** - Scene creation and entity grouping