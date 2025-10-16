# Positioning and Layout

This document describes the comprehensive positioning and layout system in SITL, including basic positioning, grid systems, anchoring, coordinates, relative positioning, rotation, sizing, layering, and alignment.

## Basic Positioning

### Simple Directional Positioning
```sitl
DRAW MAN AT LEFT
DRAW WOMAN AT RIGHT
DRAW BOY AT CENTER
DRAW GIRL AT TOP LEFT
DRAW TREE AT BOTTOM RIGHT
DRAW HOUSE AT TOP CENTER
DRAW CAR AT BOTTOM LEFT
DRAW FLOWER AT BOTTOM CENTER
```

### Named Position Constants
```sitl
// Horizontal positions
DRAW ENTITY AT FAR_LEFT
DRAW ENTITY AT LEFT
DRAW ENTITY AT CENTER_LEFT
DRAW ENTITY AT CENTER
DRAW ENTITY AT CENTER_RIGHT
DRAW ENTITY AT RIGHT
DRAW ENTITY AT FAR_RIGHT

// Vertical positions
DRAW ENTITY AT TOP
DRAW ENTITY AT UPPER
DRAW ENTITY AT MIDDLE
DRAW ENTITY AT LOWER
DRAW ENTITY AT BOTTOM

// Combined positions
DRAW ENTITY AT TOP_LEFT
DRAW ENTITY AT TOP_RIGHT
DRAW ENTITY AT BOTTOM_LEFT
DRAW ENTITY AT BOTTOM_RIGHT
```

## Grid-Based Positioning

### Basic Grid System
```sitl
SET GRID SIZE 3x3
DRAW MAN AT GRID 1,1        // Top-left cell
DRAW WOMAN AT GRID 2,2      // Center cell
DRAW BOY AT GRID 3,3        // Bottom-right cell
DRAW GIRL AT GRID 1,3       // Bottom-left cell
```

### Advanced Grid Configuration
```sitl
// Custom grid with spacing
SET GRID SIZE 5x4 WITH SPACING 50
DRAW FAMILY AT GRID RANGE 2,2 TO 3,3  // Spans multiple cells

// Grid with custom dimensions
SET GRID SIZE 4x4 WITH CELL_SIZE 100x80
DRAW TREE AT GRID 1,1
DRAW HOUSE AT GRID 4,4

// Named grid positions
SET GRID SIZE 3x3
DEFINE GRID_POSITION "center" AS GRID 2,2
DEFINE GRID_POSITION "corners" AS GRID [1,1], [1,3], [3,1], [3,3]
DRAW MAN AT GRID_POSITION "center"
```

### Grid Spanning and Alignment
```sitl
// Spanning multiple cells
DRAW BUILDING AT GRID SPAN 1,1 TO 2,3  // Spans 2x3 cells
DRAW RIVER AT GRID SPAN HORIZONTAL 1,2 TO 3,2  // Horizontal span
DRAW MOUNTAIN AT GRID SPAN VERTICAL 2,1 TO 2,4  // Vertical span

// Grid alignment within cells
DRAW MAN AT GRID 2,2 ALIGN TOP_LEFT
DRAW WOMAN AT GRID 2,2 ALIGN CENTER
DRAW BOY AT GRID 2,2 ALIGN BOTTOM_RIGHT
```

## Anchor-Based Positioning

### Basic Anchoring
```sitl
ANCHOR BOTTOM CENTER
DRAW TREE AT ANCHOR

ANCHOR TOP RIGHT
DRAW SUN AT ANCHOR

ANCHOR LEFT MIDDLE
DRAW MOUNTAIN AT ANCHOR
```

### Anchors with Offsets
```sitl
ANCHOR TOP RIGHT WITH OFFSET 20,10
DRAW CLOUD AT ANCHOR

ANCHOR BOTTOM CENTER WITH OFFSET 0,-50
DRAW GROUND AT ANCHOR

ANCHOR CENTER WITH OFFSET -100,50
DRAW HOUSE AT ANCHOR
```

### Named Anchors
```sitl
CREATE ANCHOR "family_center" AT POSITION 400,300
DRAW FAMILY AROUND ANCHOR "family_center" WITH RADIUS 100

CREATE ANCHOR "horizon" AT BOTTOM CENTER WITH OFFSET 0,100
DRAW MOUNTAINS AT ANCHOR "horizon"

CREATE ANCHOR "sky_center" AT TOP CENTER WITH OFFSET 0,50
DRAW SUN AT ANCHOR "sky_center"
```

### Dynamic Anchoring
```sitl
// Anchor to existing entities
ANCHOR TO ENTITY "house" AT TOP
DRAW CHIMNEY AT ANCHOR

ANCHOR TO ENTITY "tree" AT BASE
DRAW FLOWERS AROUND ANCHOR WITH RADIUS 30

// Anchor between entities
ANCHOR BETWEEN ENTITY "man" AND ENTITY "woman"
DRAW CHILD AT ANCHOR
```

## Coordinate Positioning

### Absolute Coordinates
```sitl
DRAW MAN AT POSITION 100,200
DRAW WOMAN AT COORDINATES 300,150
DRAW BOY AT PIXEL 450,250
DRAW TREE AT POINT 600,400
```

### Coordinate Systems
```sitl
// Different coordinate origins
SET COORDINATE_SYSTEM ORIGIN TOP_LEFT     // Default
SET COORDINATE_SYSTEM ORIGIN CENTER       // Center-based
SET COORDINATE_SYSTEM ORIGIN BOTTOM_LEFT  // Cartesian-style

// Custom coordinate bounds
SET COORDINATE_BOUNDS WIDTH 1000 HEIGHT 800
DRAW MAN AT POSITION 500,400  // Center of 1000x800 canvas
```

### Relative Coordinates
```sitl
// Relative to scene dimensions
DRAW MAN AT POSITION 25%,50%    // 25% from left, 50% from top
DRAW WOMAN AT POSITION 75%,50%  // 75% from left, 50% from top

// Relative to other entities
DRAW BOY AT POSITION RELATIVE TO "man" OFFSET 50,0
DRAW GIRL AT POSITION RELATIVE TO "woman" OFFSET -50,0
```

## Relative Positioning

### Distance-Based Positioning
```sitl
DRAW WOMAN NEXT TO MAN WITH DISTANCE 50
DRAW BOY BEHIND WOMAN WITH DISTANCE 30
DRAW GIRL IN FRONT OF BOY WITH DISTANCE 25
DRAW TREE NEAR RIVER WITH DISTANCE 100
DRAW MOUNTAIN BEHIND FOREST WITH DISTANCE 200
```

### Directional Relative Positioning
```sitl
// Cardinal directions
DRAW HOUSE NORTH OF TREE WITH DISTANCE 100
DRAW CAR SOUTH OF HOUSE WITH DISTANCE 75
DRAW FLOWER EAST OF TREE WITH DISTANCE 50
DRAW ROCK WEST OF FLOWER WITH DISTANCE 25

// Diagonal directions
DRAW CLOUD NORTHEAST OF MOUNTAIN WITH DISTANCE 150
DRAW LAKE SOUTHWEST OF FOREST WITH DISTANCE 200
```

### Advanced Relative Positioning
```sitl
// Multiple reference points
DRAW CHILD BETWEEN "man" AND "woman" WITH OFFSET FORWARD 20
DRAW PET NEAR GROUP "family" WITH DISTANCE 80

// Circular positioning
DRAW TREES AROUND "lake" WITH RADIUS 150 AND COUNT 8
DRAW FLOWERS AROUND "tree" WITH RADIUS 50 AND ANGLE_STEP 45

// Linear arrangements
DRAW CARS IN LINE FROM "start_point" TO "end_point" WITH COUNT 5
DRAW FENCE ALONG PATH "garden_path" WITH SPACING 20
```

## Rotation and Orientation

### Basic Rotation
```sitl
DRAW MAN WITH ROTATION 45 DEGREES
DRAW CAR WITH ROTATION 90 DEGREES CLOCKWISE
DRAW TREE WITH TILT 15 DEGREES LEFT
DRAW BUILDING WITH ORIENTATION FACING LEFT
```

### Advanced Rotation
```sitl
// Rotation around different axes
DRAW OBJECT WITH ROTATION_X 30 DEGREES
DRAW OBJECT WITH ROTATION_Y 45 DEGREES
DRAW OBJECT WITH ROTATION_Z 60 DEGREES

// Rotation around custom pivot points
DRAW DOOR WITH ROTATION 90 DEGREES AROUND PIVOT LEFT_EDGE
DRAW WHEEL WITH ROTATION 180 DEGREES AROUND PIVOT CENTER

// Facing directions
DRAW MAN FACING NORTH
DRAW CAR FACING SOUTHEAST
DRAW HOUSE FACING TOWARDS "road"
DRAW ANIMAL FACING AWAY FROM "predator"
```

### Orientation Presets
```sitl
// Common orientations
DRAW ENTITY WITH ORIENTATION PORTRAIT
DRAW ENTITY WITH ORIENTATION LANDSCAPE
DRAW ENTITY WITH ORIENTATION UPSIDE_DOWN

// Directional orientations
DRAW ARROW POINTING NORTH
DRAW SIGN POINTING TOWARDS "destination"
DRAW WEATHERVANE POINTING WITH WIND
```

## Sizing and Scale

### Basic Sizing
```sitl
DRAW MAN WITH SIZE LARGE
DRAW BOY WITH SIZE SMALL
DRAW TREE WITH SIZE MEDIUM
DRAW HOUSE WITH SIZE EXTRA_LARGE
DRAW FLOWER WITH SIZE TINY
```

### Precise Sizing
```sitl
DRAW HOUSE WITH SCALE 1.5
DRAW CAR WITH WIDTH 200 AND HEIGHT 100
DRAW BUILDING WITH SIZE(WIDTH:300, HEIGHT:500, DEPTH:200)
DRAW TREE WITH DIMENSIONS 50x150
```

### Proportional Sizing
```sitl
// Relative to other entities
DRAW CHILD WITH SIZE 60% OF "adult"
DRAW PET WITH SIZE HALF OF "child"
DRAW HOUSE WITH SIZE 3X "car"

// Relative to scene
DRAW MOUNTAIN WITH SIZE 40% OF SCENE_HEIGHT
DRAW RIVER WITH WIDTH 20% OF SCENE_WIDTH
```

### Dynamic Sizing
```sitl
// Size based on distance
DRAW MOUNTAIN WITH SIZE DECREASING BY DISTANCE
DRAW TREES WITH SIZE VARYING BY DEPTH

// Size based on importance
DRAW MAIN_CHARACTER WITH SIZE EMPHASIZED
DRAW BACKGROUND_CHARACTERS WITH SIZE DIMINISHED
```

## Layered Positioning (Z-Index)

### Basic Layering
```sitl
DRAW BACKGROUND MOUNTAINS WITH Z-INDEX 1
DRAW MIDDLE GROUND FOREST WITH Z-INDEX 2
DRAW FOREGROUND RIVER WITH Z-INDEX 3
DRAW SKY ABOVE ALL WITH Z-INDEX 0
```

### Named Layers
```sitl
// Explicit layering
DRAW MAN WITH LAYER FOREGROUND
DRAW TREE WITH LAYER BACKGROUND
DRAW CLOUD WITH LAYER SKY
DRAW GROUND WITH LAYER BASE

// Custom layer definitions
DEFINE LAYER "far_background" WITH Z-INDEX 1
DEFINE LAYER "near_background" WITH Z-INDEX 2
DEFINE LAYER "main_content" WITH Z-INDEX 3
DEFINE LAYER "overlay" WITH Z-INDEX 4

DRAW MOUNTAIN WITH LAYER "far_background"
DRAW HOUSE WITH LAYER "main_content"
```

### Layer Management
```sitl
// Moving between layers
MOVE ENTITY "bird" TO LAYER FOREGROUND
BRING ENTITY "important_text" TO FRONT
SEND ENTITY "background_detail" TO BACK

// Layer visibility
HIDE LAYER "background"
SHOW LAYER "foreground"
SET LAYER "overlay" OPACITY 0.5
```

## Alignment and Distribution

### Basic Alignment
```sitl
ALIGN ENTITIES "man1,woman1,boy1" HORIZONTALLY
ALIGN ENTITIES "tree1,tree2,tree3" VERTICALLY
CENTER ENTITY "title_text" IN SCENE
```

### Advanced Alignment
```sitl
// Alignment with spacing
ALIGN ENTITIES "car1,car2,car3" HORIZONTALLY WITH SPACING 50
ALIGN ENTITIES "building1,building2" VERTICALLY WITH SPACING 100

// Alignment to specific edges
ALIGN ENTITIES "button1,button2,button3" TO LEFT EDGE
ALIGN ENTITIES "tree1,tree2" TO BOTTOM EDGE
ALIGN ENTITIES "cloud1,cloud2,cloud3" TO CENTER LINE
```

### Distribution
```sitl
DISTRIBUTE ENTITIES "car1,car2,car3" EVENLY ACROSS WIDTH
DISTRIBUTE ENTITIES "tree1,tree2,tree3,tree4" EVENLY ACROSS HEIGHT
DISTRIBUTE ENTITIES "flower1,flower2,flower3" WITH EQUAL_SPACING

// Custom distribution
DISTRIBUTE ENTITIES "house1,house2,house3" FROM POSITION 100 TO POSITION 500
DISTRIBUTE ENTITIES "star1,star2,star3,star4,star5" IN ARC WITH RADIUS 200
```

### Justification
```sitl
// Text-like justification for entity groups
JUSTIFY ENTITIES "word1,word2,word3" LEFT
JUSTIFY ENTITIES "item1,item2,item3" RIGHT
JUSTIFY ENTITIES "element1,element2,element3" CENTER
JUSTIFY ENTITIES "block1,block2,block3" SPACE_BETWEEN
```

## Layout Containers

### Container Types
```sitl
// Create layout containers
CREATE CONTAINER "main_area" WITH TYPE FLEX
CREATE CONTAINER "sidebar" WITH TYPE GRID
CREATE CONTAINER "header" WITH TYPE HORIZONTAL

// Add entities to containers
ADD ENTITY "logo" TO CONTAINER "header"
ADD ENTITY "navigation" TO CONTAINER "header"
ADD ENTITY "content" TO CONTAINER "main_area"
```

### Flex Layout
```sitl
CREATE FLEX_CONTAINER "family_row":
  DIRECTION: HORIZONTAL
  JUSTIFY: SPACE_BETWEEN
  ALIGN: CENTER
  GAP: 20

ADD ENTITIES "father,mother,child1,child2" TO CONTAINER "family_row"
```

### Grid Layout
```sitl
CREATE GRID_CONTAINER "photo_grid":
  COLUMNS: 3
  ROWS: 2
  GAP: 10
  CELL_SIZE: 150x150

ADD ENTITIES "photo1,photo2,photo3,photo4,photo5,photo6" TO CONTAINER "photo_grid"
```

## Responsive Positioning

### Viewport-Based Positioning
```sitl
// Position based on viewport size
DRAW ENTITY AT POSITION RESPONSIVE:
  SMALL_SCREEN: 10%,20%
  MEDIUM_SCREEN: 15%,25%
  LARGE_SCREEN: 20%,30%

// Responsive sizing
DRAW ENTITY WITH SIZE RESPONSIVE:
  MOBILE: SMALL
  TABLET: MEDIUM
  DESKTOP: LARGE
```

### Adaptive Layouts
```sitl
// Layout that adapts to content
CREATE ADAPTIVE_LAYOUT "content_area":
  MIN_WIDTH: 300
  MAX_WIDTH: 800
  PADDING: 20
  OVERFLOW: SCROLL

// Auto-positioning based on available space
DRAW ENTITIES WITH AUTO_POSITION:
  STRATEGY: BEST_FIT
  AVOID_OVERLAP: TRUE
  MAINTAIN_RELATIONSHIPS: TRUE
```

## Related Documentation

- **[Core Entities](entities.md)** - Basic entities that can be positioned
- **[Human Attributes](human-attributes.md)** - Attributes that affect positioning
- **[Nature Elements](nature.md)** - Natural elements and their positioning
- **[Composition](composition.md)** - Scene and group composition
- **[Animation](animation.md)** - Animating position changes