# Composition and Layout System

## Overview

The SITL Composition and Layout System provides sophisticated tools for creating visually compelling and professionally composed images. This system incorporates classical composition principles, modern design theory, and advanced layout controls to help create balanced, engaging, and aesthetically pleasing scenes.

## Core Principles

- **Visual Balance**: Tools for achieving visual equilibrium in scenes
- **Focal Point Management**: Directing viewer attention to key elements
- **Spatial Relationships**: Controlling how elements relate to each other in space
- **Professional Guidelines**: Implementation of established composition rules
- **Dynamic Layouts**: Support for movement and flow within compositions

## Fundamental Composition Rules

### Rule of Thirds
```sitl
SET COMPOSITION_GRID: RULE_OF_THIRDS
SHOW_GRID_LINES: true           // Visual guide during composition

// Position elements at intersection points
PLACE SUBJECT AT GRID_INTERSECTION(1, 1)    // Top-left intersection
PLACE HORIZON AT GRID_LINE(HORIZONTAL, 1)   // Lower horizontal line
PLACE TREE AT GRID_LINE(VERTICAL, 2)        // Right vertical line

// Automatic rule of thirds positioning
AUTO_POSITION SUBJECT USING RULE_OF_THIRDS
AUTO_POSITION HORIZON USING RULE_OF_THIRDS LOWER
```

### Golden Ratio and Fibonacci Spiral
```sitl
SET COMPOSITION_GRID: GOLDEN_RATIO
SET COMPOSITION_GRID: FIBONACCI_SPIRAL

// Position elements along golden ratio lines
PLACE SUBJECT AT GOLDEN_POINT(PRIMARY)      // Main focal point
PLACE SECONDARY_ELEMENT AT GOLDEN_POINT(SECONDARY)

// Follow the spiral for dynamic composition
ARRANGE_ELEMENTS ALONG FIBONACCI_SPIRAL:
  START_ELEMENT: MAIN_SUBJECT
  FLOW_DIRECTION: CLOCKWISE | COUNTERCLOCKWISE
  ELEMENTS: [SUBJECT, TREE, BUILDING, HORIZON]
```

### Leading Lines
```sitl
CREATE_LEADING_LINES:
  TYPE: STRAIGHT | CURVED | DIAGONAL | S_CURVE | ZIGZAG
  START_POINT: (0, 0.8)         // Bottom of frame
  END_POINT: SUBJECT_POSITION   // Lead to main subject
  STRENGTH: SUBTLE | MODERATE | STRONG

// Specific line types
ADD_DIAGONAL_LINE FROM BOTTOM_LEFT TO SUBJECT
ADD_CURVED_PATH FROM FOREGROUND TO BACKGROUND
ADD_CONVERGING_LINES TO VANISHING_POINT AT SUBJECT

// Use existing elements as leading lines
USE_AS_LEADING_LINE: ROAD | FENCE | RIVER | SHORELINE | BUILDING_EDGE
```

### Framing and Borders
```sitl
CREATE_NATURAL_FRAME:
  TYPE: ARCHWAY | WINDOW | TREE_BRANCHES | DOORWAY | TUNNEL
  POSITION: FOREGROUND
  FRAME_SUBJECT: MAIN_SUBJECT
  FRAME_OPACITY: 0.8            // Partial transparency
  
ADD_VIGNETTE_FRAME:
  INTENSITY: 0.3
  SOFTNESS: 0.7
  SHAPE: CIRCULAR | OVAL | RECTANGULAR
  COLOR: BLACK | CUSTOM(#color)

// Compositional framing without physical elements
SET_VISUAL_FRAME:
  TIGHT_CROP: true              // Close framing
  BREATHING_ROOM: MINIMAL | MODERATE | GENEROUS
  EDGE_TENSION: 0.1             // Distance from frame edges
```

## Advanced Composition Techniques

### Visual Weight and Balance
```sitl
SET_VISUAL_WEIGHT:
  ELEMENT: SUBJECT
  WEIGHT: HEAVY | MEDIUM | LIGHT
  FACTORS: [SIZE, COLOR, CONTRAST, POSITION, TEXTURE]

BALANCE_COMPOSITION:
  TYPE: SYMMETRICAL | ASYMMETRICAL | RADIAL
  PIVOT_POINT: CENTER | CUSTOM(x, y)
  
  // Asymmetrical balance example
  HEAVY_ELEMENT: SUBJECT AT (0.3, 0.4)
  LIGHT_ELEMENTS: [TREE, CLOUD] AT (0.7, 0.6)
  BALANCE_FACTOR: 1.0           // Perfect balance
```

### Depth and Layering
```sitl
CREATE_DEPTH_LAYERS:
  FOREGROUND: {
    elements: [FLOWERS, ROCKS],
    depth: 0-2 meters,
    focus: SOFT_BLUR,
    size_scale: 1.2
  }
  
  MIDGROUND: {
    elements: [SUBJECT, TREES],
    depth: 2-10 meters,
    focus: SHARP,
    size_scale: 1.0
  }
  
  BACKGROUND: {
    elements: [MOUNTAINS, SKY],
    depth: 10+ meters,
    focus: ATMOSPHERIC_PERSPECTIVE,
    size_scale: 0.8
  }

SET_DEPTH_CUES:
  OVERLAP: true                 // Objects overlap to show depth
  SIZE_PERSPECTIVE: true        // Distant objects smaller
  ATMOSPHERIC_PERSPECTIVE: true // Distant objects hazier
  LINEAR_PERSPECTIVE: true      // Converging lines
```

### Symmetry and Patterns
```sitl
CREATE_SYMMETRY:
  TYPE: VERTICAL | HORIZONTAL | RADIAL | BILATERAL
  AXIS: CENTER | CUSTOM(position)
  PRECISION: PERFECT | NEAR_PERFECT | LOOSE
  
  // Reflection symmetry
  REFLECT_ELEMENTS ACROSS VERTICAL_AXIS
  REFLECT_ELEMENTS ACROSS HORIZONTAL_AXIS

CREATE_PATTERN:
  TYPE: REPETITION | RHYTHM | ALTERNATION
  ELEMENTS: [WINDOWS, COLUMNS, TREES]
  SPACING: REGULAR | IRREGULAR | PROGRESSIVE
  VARIATION: NONE | SIZE | COLOR | ORIENTATION
```

## Dynamic Composition

### Movement and Flow
```sitl
CREATE_VISUAL_FLOW:
  DIRECTION: LEFT_TO_RIGHT | TOP_TO_BOTTOM | CIRCULAR | SPIRAL
  SPEED: SLOW | MEDIUM | FAST
  RHYTHM: STEADY | ACCELERATING | DECELERATING
  
  // Guide viewer's eye through the composition
  FLOW_PATH: [ENTRY_POINT, SUBJECT, SECONDARY_ELEMENT, EXIT_POINT]

ADD_MOVEMENT_INDICATORS:
  MOTION_BLUR: SUBTLE
  DIRECTIONAL_ELEMENTS: [HAIR, CLOTHING, LEAVES]
  IMPLIED_MOVEMENT: GESTURE | POSE | GAZE_DIRECTION
```

### Tension and Energy
```sitl
CREATE_VISUAL_TENSION:
  TYPE: EDGE_TENSION | DIRECTIONAL_TENSION | SIZE_TENSION
  INTENSITY: LOW | MEDIUM | HIGH
  
  // Edge tension - elements near frame edges
  PLACE_NEAR_EDGE: SUBJECT DISTANCE 0.05 FROM TOP_EDGE
  
  // Directional tension - opposing forces
  OPPOSING_DIRECTIONS: [SUBJECT_GAZE, WIND_DIRECTION]
  
  // Size tension - contrasting scales
  CONTRAST_SIZES: [LARGE_BUILDING, SMALL_PERSON]
```

### Rhythm and Repetition
```sitl
CREATE_VISUAL_RHYTHM:
  PATTERN: REGULAR | PROGRESSIVE | FLOWING | STACCATO
  ELEMENTS: [FENCE_POSTS, WINDOWS, WAVES]
  INTERVAL: CONSISTENT | VARYING | ACCELERATING
  
  // Progressive rhythm - gradually changing
  PROGRESSIVE_SCALE: START 1.0 END 0.3 OVER 5 ELEMENTS
  PROGRESSIVE_COLOR: START #FF0000 END #0000FF OVER 3 ELEMENTS
```

## Specialized Composition Types

### Portrait Composition
```sitl
SET_PORTRAIT_COMPOSITION:
  FRAMING: HEADSHOT | BUST | THREE_QUARTER | FULL_BODY
  ORIENTATION: VERTICAL | HORIZONTAL | SQUARE
  
  HEAD_POSITION: {
    horizontal: CENTER | LEFT_THIRD | RIGHT_THIRD,
    vertical: UPPER_THIRD | CENTER | GOLDEN_RATIO
  }
  
  EYE_LEVEL: {
    camera_height: EYE_LEVEL | SLIGHTLY_ABOVE | SLIGHTLY_BELOW,
    eye_contact: DIRECT | AVERTED | PROFILE
  }
  
  NEGATIVE_SPACE: {
    around_subject: MINIMAL | MODERATE | GENEROUS,
    direction_of_gaze: EXTRA_SPACE | BALANCED
  }
```

### Landscape Composition
```sitl
SET_LANDSCAPE_COMPOSITION:
  HORIZON_PLACEMENT: LOWER_THIRD | UPPER_THIRD | CENTER | GOLDEN_RATIO
  FOREGROUND_INTEREST: REQUIRED | OPTIONAL | NONE
  
  FOCAL_POINT: {
    type: MOUNTAIN_PEAK | TREE | BUILDING | ROCK_FORMATION,
    position: RULE_OF_THIRDS | GOLDEN_RATIO | CENTER
  }
  
  DEPTH_ELEMENTS: {
    foreground: [ROCKS, FLOWERS, WATER],
    midground: [TREES, HILLS],
    background: [MOUNTAINS, SKY]
  }
```

### Group Composition
```sitl
ARRANGE_GROUP:
  FORMATION: TRIANGLE | LINE | CIRCLE | CLUSTER | SCATTERED
  HIERARCHY: EQUAL | LEADER_FOCUSED | PYRAMID
  
  // Triangle formation for stability
  TRIANGLE_FORMATION:
    APEX: TALLEST_PERSON | LEADER | CENTER_PERSON
    BASE: [PERSON_1, PERSON_2]
    ANGLE: EQUILATERAL | ISOSCELES | SCALENE
  
  // Dynamic group arrangements
  STAGGERED_HEIGHTS: true       // Vary head heights
  OVERLAPPING: SLIGHT | MODERATE | MINIMAL
  SPACING: TIGHT | COMFORTABLE | LOOSE
```

### Action and Sports Composition
```sitl
SET_ACTION_COMPOSITION:
  ANTICIPATION: SHOW_BUILDUP | PEAK_ACTION | FOLLOW_THROUGH
  DIRECTION_OF_ACTION: LEFT_TO_RIGHT | RIGHT_TO_LEFT | TOWARD_CAMERA
  
  FREEZE_MOMENT: {
    timing: PEAK_ACTION | DECISIVE_MOMENT,
    shutter_speed: FREEZE | SLIGHT_BLUR | MOTION_BLUR
  }
  
  SPACE_FOR_MOVEMENT: {
    leading_space: GENEROUS | MODERATE | TIGHT,
    trailing_space: MINIMAL | BALANCED
  }
```

## Layout and Grid Systems

### Grid-Based Layouts
```sitl
SET_LAYOUT_GRID:
  TYPE: MODULAR | HIERARCHICAL | MANUSCRIPT | COLUMN
  COLUMNS: 2 | 3 | 4 | 6 | 12
  GUTTERS: NARROW | MEDIUM | WIDE | CUSTOM(width)
  MARGINS: UNIFORM | ASYMMETRICAL | CUSTOM(top, right, bottom, left)

ALIGN_TO_GRID:
  ELEMENT: SUBJECT
  SNAP_TO: GRID_LINES | GRID_INTERSECTIONS | COLUMN_EDGES
  PRECISION: EXACT | APPROXIMATE
```

### Modular Composition
```sitl
CREATE_MODULES:
  MODULE_SIZE: UNIFORM | VARIED | PROPORTIONAL
  MODULE_SPACING: TIGHT | MEDIUM | LOOSE
  
  // Define content modules
  MODULE "hero": {
    size: (2, 2),               // Grid units
    content: MAIN_SUBJECT,
    position: (0, 0)
  }
  
  MODULE "supporting": {
    size: (1, 1),
    content: SECONDARY_ELEMENTS,
    position: (2, 0)
  }
```

### Responsive Composition
```sitl
SET_RESPONSIVE_LAYOUT:
  BREAKPOINTS: [MOBILE, TABLET, DESKTOP, LARGE_SCREEN]
  
  MOBILE_LAYOUT: {
    orientation: VERTICAL,
    elements: STACKED,
    margins: MINIMAL
  }
  
  DESKTOP_LAYOUT: {
    orientation: HORIZONTAL,
    elements: SIDE_BY_SIDE,
    margins: GENEROUS
  }
```

## Color and Composition Integration

### Color Balance in Composition
```sitl
BALANCE_COLOR_COMPOSITION:
  DOMINANT_COLOR: 60% | CUSTOM_PERCENTAGE
  SECONDARY_COLOR: 30% | CUSTOM_PERCENTAGE
  ACCENT_COLOR: 10% | CUSTOM_PERCENTAGE
  
  COLOR_WEIGHT_DISTRIBUTION: BALANCED | ASYMMETRICAL
  WARM_COOL_BALANCE: WARM_DOMINANT | COOL_DOMINANT | BALANCED
```

### Color as Compositional Element
```sitl
USE_COLOR_FOR_COMPOSITION:
  FOCAL_POINT_COLOR: CONTRASTING | SATURATED | BRIGHT
  BACKGROUND_COLORS: MUTED | DESATURATED | NEUTRAL
  
  COLOR_FLOW: {
    path: [WARM_AREA, TRANSITION, COOL_AREA],
    gradient: SMOOTH | STEPPED | ABRUPT
  }
```

## Advanced Composition Analysis

### Composition Validation
```sitl
ANALYZE_COMPOSITION:
  BALANCE_CHECK: true
  FOCAL_POINT_STRENGTH: MEASURE
  VISUAL_FLOW_ANALYSIS: true
  RULE_ADHERENCE: [RULE_OF_THIRDS, GOLDEN_RATIO, LEADING_LINES]
  
  GENERATE_REPORT: {
    balance_score: 0-100,
    focal_clarity: 0-100,
    visual_interest: 0-100,
    technical_quality: 0-100
  }
```

### Composition Suggestions
```sitl
GET_COMPOSITION_SUGGESTIONS:
  CURRENT_LAYOUT: AUTO_DETECT
  IMPROVEMENT_AREAS: [BALANCE, FOCAL_POINT, DEPTH, COLOR]
  
  SUGGEST_IMPROVEMENTS: {
    reposition_elements: true,
    adjust_framing: true,
    modify_colors: true,
    add_elements: true
  }
```

### A/B Composition Testing
```sitl
CREATE_COMPOSITION_VARIANTS:
  VARIANT_A: RULE_OF_THIRDS_PLACEMENT
  VARIANT_B: GOLDEN_RATIO_PLACEMENT
  VARIANT_C: CENTER_COMPOSITION
  
  COMPARE_VARIANTS: {
    visual_impact: MEASURE,
    balance_quality: MEASURE,
    viewer_engagement: PREDICT
  }
```

## Integration Examples

### Professional Portrait with Advanced Composition
```sitl
CREATE_SCENE "executive_portrait":
  SET_PORTRAIT_COMPOSITION:
    FRAMING: THREE_QUARTER
    ORIENTATION: VERTICAL
    HEAD_POSITION: {horizontal: RIGHT_THIRD, vertical: UPPER_THIRD}
  
  CREATE_DEPTH_LAYERS:
    FOREGROUND: {elements: [DESK_EDGE], focus: SOFT_BLUR}
    MIDGROUND: {elements: [SUBJECT], focus: SHARP}
    BACKGROUND: {elements: [OFFICE_WALL], focus: SOFT_BLUR}
  
  ADD_LEADING_LINES:
    TYPE: DIAGONAL
    ELEMENT: DESK_EDGE
    DIRECTION: TO_SUBJECT
  
  BALANCE_COMPOSITION:
    TYPE: ASYMMETRICAL
    HEAVY_ELEMENT: SUBJECT AT RIGHT_THIRD
    LIGHT_ELEMENTS: [WINDOW_LIGHT] AT LEFT_SIDE
  
  DRAW PERSON WITH AGE 45 AND BUSINESS_ATTIRE
```

### Dynamic Landscape with Multiple Focal Points
```sitl
CREATE_SCENE "mountain_vista":
  SET_LANDSCAPE_COMPOSITION:
    HORIZON_PLACEMENT: LOWER_THIRD
    FOREGROUND_INTEREST: REQUIRED
  
  CREATE_VISUAL_FLOW:
    DIRECTION: S_CURVE
    FLOW_PATH: [FOREGROUND_ROCKS, RIVER, MOUNTAIN_PEAK, SKY]
  
  ARRANGE_ELEMENTS ALONG FIBONACCI_SPIRAL:
    START_ELEMENT: FOREGROUND_BOULDER
    ELEMENTS: [BOULDER, TREE, MOUNTAIN_PEAK, CLOUD]
    FLOW_DIRECTION: CLOCKWISE
  
  CREATE_DEPTH_LAYERS:
    FOREGROUND: {elements: [ROCKS, WILDFLOWERS], depth: 0-5m}
    MIDGROUND: {elements: [RIVER, TREES], depth: 5-100m}
    BACKGROUND: {elements: [MOUNTAINS], depth: 100m+}
  
  ADD ENVIRONMENT MOUNTAIN_LANDSCAPE
  ADD RIVER WINDING THROUGH SCENE
  ADD WILDFLOWERS IN FOREGROUND
```

### Complex Group Composition
```sitl
CREATE_SCENE "family_reunion":
  ARRANGE_GROUP:
    FORMATION: TRIANGLE
    HIERARCHY: GRANDPARENTS_FOCUSED
    STAGGERED_HEIGHTS: true
  
  CREATE_VISUAL_RHYTHM:
    PATTERN: FLOWING
    ELEMENTS: [FAMILY_MEMBERS]
    INTERVAL: VARYING
  
  BALANCE_COLOR_COMPOSITION:
    DOMINANT_COLOR: EARTH_TONES 60%
    ACCENT_COLOR: BRIGHT_BLUE 10%
    COLOR_WEIGHT_DISTRIBUTION: ASYMMETRICAL
  
  SET_DEPTH_LAYERS:
    FOREGROUND: [CHILDREN_SITTING]
    MIDGROUND: [PARENTS_STANDING]
    BACKGROUND: [GRANDPARENTS_SEATED]
  
  DRAW FAMILY_GROUP WITH 12 PEOPLE
  ADD ENVIRONMENT PARK_SETTING
```

This composition system provides comprehensive tools for creating visually compelling images while maintaining the intuitive SITL syntax, enabling everything from simple balanced layouts to complex professional compositions.