# Core Color System

This document describes the comprehensive color system in SITL, including basic colors, advanced specifications, patterns, themes, and special color handling.

## Basic Clothing Colors

Simple color specifications for clothing items:

```sitl
DRAW MAN WITH RED SHIRT
DRAW WOMAN WITH BLUE DRESS
DRAW BOY WITH GREEN PANTS
DRAW GIRL WITH YELLOW TOP
DRAW MAN WITH BLACK SUIT
DRAW WOMAN WITH WHITE BLOUSE
```

### Available Basic Colors
- `RED`, `BLUE`, `GREEN`, `YELLOW`, `BLACK`, `WHITE`
- `BROWN`, `GRAY`, `PINK`, `PURPLE`, `ORANGE`
- `NAVY`, `MAROON`, `TEAL`, `LIME`, `SILVER`

## Multiple Clothing Items

Specify colors for multiple clothing pieces:

```sitl
DRAW MAN WITH RED SHIRT AND BLUE PANTS
DRAW WOMAN WITH GREEN DRESS AND BLACK SHOES
DRAW BOY WITH YELLOW SHIRT AND BROWN SHORTS
DRAW GIRL WITH PINK DRESS AND WHITE SOCKS
```

## Advanced Color Specifications

### Color Modifiers

Add intensity and shade modifiers to basic colors:

```sitl
DRAW MAN WITH DARK BLUE SHIRT
DRAW WOMAN WITH LIGHT GREEN DRESS
DRAW BOY WITH BRIGHT RED JACKET
DRAW GIRL WITH PALE PINK DRESS
```

### Available Modifiers
- **Intensity**: `BRIGHT`, `DARK`, `LIGHT`, `PALE`
- **Saturation**: `VIVID`, `MUTED`, `SOFT`, `BOLD`
- **Tone**: `WARM`, `COOL`, `NEUTRAL`

### Examples
```sitl
DRAW MAN WITH BRIGHT RED SHIRT
DRAW WOMAN WITH MUTED BLUE DRESS
DRAW BOY WITH SOFT GREEN JACKET
DRAW GIRL WITH BOLD YELLOW TOP
```

## Hex Color Support

Use precise hex color codes for exact color matching:

```sitl
DRAW MAN WITH SHIRT COLOR #FF5733
DRAW WOMAN WITH DRESS COLOR #3498DB
DRAW BOY WITH PANTS COLOR #2ECC71
DRAW GIRL WITH SKIRT COLOR #E74C3C
```

### Hex Color Format
- Standard 6-digit hex: `#RRGGBB`
- Short 3-digit hex: `#RGB` (expanded to `#RRGGBB`)
- Case insensitive: `#ff5733` or `#FF5733`

## Pattern Colors

Create patterned clothing with multiple colors:

```sitl
DRAW MAN WITH STRIPED SHIRT IN BLUE AND WHITE
DRAW WOMAN WITH POLKA DOT DRESS IN RED AND BLACK
DRAW BOY WITH CHECKERED SHIRT IN GREEN AND YELLOW
DRAW GIRL WITH FLORAL DRESS IN PINK AND PURPLE
```

### Available Patterns
- `STRIPED` - Horizontal or vertical stripes
- `POLKA DOT` - Circular dots pattern
- `CHECKERED` - Square checkerboard pattern
- `FLORAL` - Flower-based pattern
- `PLAID` - Tartan-style crossed lines
- `GEOMETRIC` - Abstract geometric shapes

### Pattern Syntax
```sitl
DRAW ENTITY WITH PATTERN_TYPE ITEM IN COLOR1 AND COLOR2
DRAW ENTITY WITH PATTERN_TYPE ITEM IN COLOR1 AND COLOR2 AND COLOR3
```

## Color Themes

Set overall color schemes for scenes or groups:

```sitl
SET COLOR THEME WARM
SET COLOR THEME COOL
SET COLOR THEME PASTEL
SET COLOR THEME VIBRANT
SET COLOR THEME MONOCHROME

DRAW FAMILY WITH THEME WARM
DRAW GROUP WITH THEME PASTEL
```

### Available Themes

#### Warm Theme
- Emphasizes reds, oranges, yellows, and browns
- Creates cozy, energetic atmospheres

#### Cool Theme
- Emphasizes blues, greens, and purples
- Creates calm, professional atmospheres

#### Pastel Theme
- Uses soft, light versions of colors
- Creates gentle, soothing atmospheres

#### Vibrant Theme
- Uses bright, saturated colors
- Creates energetic, attention-grabbing scenes

#### Monochrome Theme
- Uses variations of a single color or grayscale
- Creates sophisticated, artistic effects

### Theme Application
```sitl
// Apply theme to entire scene
CREATE SCENE "family_portrait" WITH THEME WARM:
  DRAW MAN WITH AGE 35
  DRAW WOMAN WITH AGE 32
  DRAW BOY WITH AGE 8

// Apply theme to specific groups
CREATE GROUP "children" WITH THEME PASTEL:
  DRAW BOY WITH AGE 8
  DRAW GIRL WITH AGE 6
```

## Clothing Toggle and Color Interaction

### Clothing Omission
```sitl
// WITHOUT keyword for omitting clothing items
DRAW MAN WITHOUT SHIRT
DRAW WOMAN WITHOUT PANTS
DRAW BOY WITHOUT SHOES
DRAW GIRL WITHOUT HAT

// CLOTHING attribute with NONE option
DRAW MAN WITH CLOTHING(SHIRT: NONE, PANTS: BLUE)
DRAW WOMAN WITH CLOTHING(SHIRT: NONE, PANTS: BLACK, SHOES: BROWN)
DRAW BOY WITH CLOTHING(SHIRT: RED, PANTS: NONE, SHOES: WHITE)

// Combined omission and specification
DRAW MAN WITHOUT SHIRT AND WITH BLUE PANTS
DRAW WOMAN WITHOUT SHIRT AND WITH RED SKIRT AND BLACK SHOES
DRAW BOY WITHOUT SHOES AND WITH GREEN SHIRT AND BROWN SHORTS
```

### Shirtless Color Specifications

When clothing is omitted, skin tone becomes visible and can be colored:

```sitl
// Skin tone becomes visible when shirtless
DRAW MAN WITH NO SHIRT AND LIGHT SKIN
DRAW WOMAN WITH BARE TORSO AND MEDIUM SKIN
DRAW MAN WITH NO SHIRT AND DARK SKIN AND BLUE PANTS

// Hex color support for skin tones
DRAW MAN WITH NO SHIRT AND SKIN COLOR #F4D9C7
DRAW WOMAN WITH BARE TORSO AND SKIN COLOR #D4A76A
```

## Color Combinations and Harmony

### Complementary Colors
```sitl
DRAW MAN WITH BLUE SHIRT AND ORANGE PANTS    // Blue-Orange complement
DRAW WOMAN WITH RED DRESS AND GREEN SHOES    // Red-Green complement
DRAW BOY WITH PURPLE SHIRT AND YELLOW SHORTS // Purple-Yellow complement
```

### Analogous Colors
```sitl
DRAW MAN WITH BLUE SHIRT AND TEAL PANTS      // Blue-Teal analogy
DRAW WOMAN WITH RED DRESS AND ORANGE SHOES   // Red-Orange analogy
DRAW GIRL WITH GREEN SHIRT AND LIME SKIRT    // Green-Lime analogy
```

### Triadic Colors
```sitl
DRAW GROUP "triadic_family":
  DRAW MAN WITH RED SHIRT
  DRAW WOMAN WITH BLUE DRESS
  DRAW BOY WITH YELLOW JACKET
```

## Color Validation and Error Handling

### Invalid Color Specifications
```sitl
// These will generate warnings or use defaults
DRAW MAN WITH SHIRT COLOR #INVALID    // Invalid hex format
DRAW WOMAN WITH PURPLE SHIRT AND PURPLE PANTS  // Potential monotony warning
DRAW BOY WITH NEON PINK FORMAL SUIT   // Style-color mismatch warning
```

### Color Accessibility
```sitl
// High contrast combinations for accessibility
DRAW MAN WITH BLACK SHIRT AND WHITE TEXT
DRAW WOMAN WITH DARK BLUE DRESS AND LIGHT YELLOW ACCESSORIES

// Color-blind friendly combinations
SET COLOR THEME COLORBLIND_FRIENDLY
DRAW FAMILY WITH THEME COLORBLIND_FRIENDLY
```

## Advanced Color Features

### Gradient Colors
```sitl
DRAW MAN WITH SHIRT GRADIENT FROM BLUE TO WHITE
DRAW WOMAN WITH DRESS GRADIENT FROM RED TO PINK
DRAW BOY WITH JACKET GRADIENT FROM GREEN TO YELLOW
```

### Transparency and Opacity
```sitl
DRAW MAN WITH SHIRT COLOR #FF5733 OPACITY 0.8
DRAW WOMAN WITH DRESS COLOR BLUE TRANSPARENCY 20%
DRAW BOY WITH JACKET COLOR RED ALPHA 0.9
```

### Color Animation
```sitl
DRAW MAN WITH SHIRT COLOR BLUE ANIMATE TO RED OVER 2 SECONDS
DRAW WOMAN WITH DRESS COLOR CYCLING THROUGH RAINBOW
```

## Advanced Color Management

### Color Spaces and Profiles

Define and work with different color spaces for professional workflows:

```sitl
SET COLOR_SPACE: sRGB           // Standard web/monitor color space
SET COLOR_SPACE: Adobe_RGB      // Extended gamut for print
SET COLOR_SPACE: P3             // Display P3 for modern displays
SET COLOR_SPACE: ProPhoto_RGB   // Ultra-wide gamut for photography
SET COLOR_SPACE: LAB            // Perceptually uniform color space
SET COLOR_SPACE: XYZ            // CIE XYZ color space

// Apply color space to specific elements
DRAW MAN WITH SHIRT COLOR #FF5733 IN COLOR_SPACE Adobe_RGB
DRAW WOMAN WITH DRESS COLOR LAB(50, 20, -30)
```

### Color Temperature and White Balance

Control color temperature for realistic lighting conditions:

```sitl
SET COLOR_TEMPERATURE: 2700K    // Warm incandescent
SET COLOR_TEMPERATURE: 3200K    // Tungsten lighting
SET COLOR_TEMPERATURE: 5500K    // Daylight
SET COLOR_TEMPERATURE: 6500K    // Cool daylight
SET COLOR_TEMPERATURE: 9000K    // Blue sky

// Apply to scene or specific elements
SET SCENE_COLOR_TEMPERATURE: 3200K
DRAW MAN WITH SHIRT WARM_WHITE AT TEMPERATURE 2700K
DRAW WOMAN WITH DRESS COOL_WHITE AT TEMPERATURE 6500K
```

### Professional Color Workflows

#### Color Calibration and Accuracy
```sitl
SET COLOR_CALIBRATION:
  MONITOR_PROFILE: "sRGB_IEC61966-2.1"
  PRINTER_PROFILE: "Adobe_RGB_1998"
  RENDERING_INTENT: PERCEPTUAL | RELATIVE_COLORIMETRIC | SATURATION | ABSOLUTE_COLORIMETRIC
  BLACK_POINT_COMPENSATION: true

// Color accuracy validation
VALIDATE_COLOR_ACCURACY:
  DELTA_E_THRESHOLD: 2.0        // Acceptable color difference
  REFERENCE_STANDARD: ISO_12647 | SWOP | GRACoL
```

#### Gamut Mapping and Conversion
```sitl
SET GAMUT_MAPPING:
  OUT_OF_GAMUT_HANDLING: CLIP | COMPRESS | DESATURATE
  GAMUT_WARNING: ENABLED
  SOFT_PROOFING: ENABLED
  
CONVERT_COLOR #FF5733 FROM sRGB TO Adobe_RGB
CONVERT_COLOR LAB(50, 20, -30) TO sRGB
```

### Scientific Color Specifications

#### CIE Color Spaces
```sitl
// CIE XYZ color space
DRAW MAN WITH SHIRT COLOR XYZ(0.412, 0.213, 0.019)

// CIE LAB color space (perceptually uniform)
DRAW WOMAN WITH DRESS COLOR LAB(50, 20, -30)  // L*a*b* values

// CIE LUV color space
DRAW BOY WITH PANTS COLOR LUV(50, 25, -15)

// CIE LCH color space (cylindrical LAB)
DRAW GIRL WITH SKIRT COLOR LCH(50, 35, 120)  // Lightness, Chroma, Hue
```

#### Spectral Color Data
```sitl
// Define colors using spectral power distribution
DEFINE_SPECTRAL_COLOR "custom_red":
  WAVELENGTHS: [380, 400, 420, ..., 700, 720, 740] nm
  POWER_DISTRIBUTION: [0.1, 0.2, 0.3, ..., 0.8, 0.6, 0.4]
  ILLUMINANT: D65 | A | F2 | CUSTOM

DRAW MAN WITH SHIRT COLOR SPECTRAL("custom_red")
```

#### Metamerism and Observer Angles
```sitl
SET COLOR_OBSERVER:
  STANDARD: CIE_1931_2_DEGREE | CIE_1964_10_DEGREE
  CUSTOM_OBSERVER: "observer_data.csv"

// Check for metamerism under different illuminants
CHECK_METAMERISM:
  COLOR1: #FF5733
  COLOR2: LAB(50, 20, -30)
  ILLUMINANTS: [D65, A, F2, F11]
  TOLERANCE: 2.0 DELTA_E
```

### Color Harmony and Theory

#### Advanced Color Relationships
```sitl
// Generate harmonious color schemes
GENERATE_COLOR_SCHEME:
  BASE_COLOR: #3498DB
  SCHEME_TYPE: COMPLEMENTARY | TRIADIC | TETRADIC | ANALOGOUS | SPLIT_COMPLEMENTARY
  VARIATION_RANGE: 15 degrees   // Hue variation tolerance

// Apply color theory rules
SET COLOR_HARMONY_RULES:
  ENFORCE_CONTRAST_RATIO: 4.5   // WCAG AA compliance
  MAXIMUM_COLORS_PER_SCENE: 5
  DOMINANT_COLOR_PERCENTAGE: 60
  ACCENT_COLOR_PERCENTAGE: 10
```

#### Color Psychology and Mood
```sitl
SET COLOR_PSYCHOLOGY:
  MOOD: ENERGETIC | CALMING | PROFESSIONAL | PLAYFUL | LUXURIOUS
  CULTURAL_CONTEXT: WESTERN | EASTERN | NEUTRAL
  AGE_GROUP: CHILDREN | ADULTS | ELDERLY
  
// Automatically adjust colors based on psychology
APPLY_PSYCHOLOGICAL_COLORS TO SCENE WITH MOOD CALMING
```

### Dynamic Color Systems

#### Adaptive Color Schemes
```sitl
SET ADAPTIVE_COLORS:
  TIME_OF_DAY: AUTO             // Adjust colors based on time
  SEASON: AUTO                  // Seasonal color adjustments
  WEATHER: AUTO                 // Weather-based color shifts
  
  WARM_SHIFT_EVENING: 200K      // Warmer colors in evening
  COOL_SHIFT_MORNING: -100K     // Cooler colors in morning
```

#### Color Animation and Transitions
```sitl
// Smooth color transitions
ANIMATE COLOR FROM #FF0000 TO #00FF00:
  DURATION: 3 seconds
  EASING: LINEAR | EASE_IN | EASE_OUT | EASE_IN_OUT
  COLOR_SPACE: sRGB | LAB | HSV  // Interpolation color space

// Cycling color effects
CYCLE_COLORS:
  COLORS: [#FF0000, #00FF00, #0000FF]
  DURATION: 5 seconds
  LOOP: INFINITE | COUNT(3)
  TRANSITION: SMOOTH | SNAP
```

### Color Accessibility and Inclusion

#### Color Blindness Support
```sitl
SET COLORBLIND_SIMULATION:
  TYPE: PROTANOPIA | DEUTERANOPIA | TRITANOPIA | ACHROMATOPSIA
  SEVERITY: MILD | MODERATE | SEVERE
  
// Test color combinations for accessibility
TEST_COLORBLIND_ACCESSIBILITY:
  FOREGROUND: #FF5733
  BACKGROUND: #FFFFFF
  TYPES: [PROTANOPIA, DEUTERANOPIA, TRITANOPIA]
```

#### High Contrast and Low Vision Support
```sitl
SET HIGH_CONTRAST_MODE:
  ENABLED: true
  CONTRAST_RATIO: 7.0           // WCAG AAA compliance
  EDGE_ENHANCEMENT: true
  
SET LOW_VISION_SUPPORT:
  LARGE_COLOR_AREAS: true
  AVOID_SUBTLE_DIFFERENCES: true
  TEXTURE_ALTERNATIVES: true
```

### Color Quality and Validation

#### Color Accuracy Metrics
```sitl
MEASURE_COLOR_ACCURACY:
  METRIC: DELTA_E_76 | DELTA_E_94 | DELTA_E_2000 | DELTA_E_CMC
  REFERENCE_COLOR: #FF5733
  TEST_COLOR: #FF5830
  ILLUMINANT: D65
  OBSERVER: CIE_1931_2_DEGREE
```

#### Color Consistency Checking
```sitl
CHECK_COLOR_CONSISTENCY:
  TOLERANCE: 2.0 DELTA_E
  SCOPE: SCENE | GROUP | GLOBAL
  AUTO_CORRECT: true | false
  
VALIDATE_COLOR_PALETTE:
  MINIMUM_CONTRAST: 4.5
  MAXIMUM_COLORS: 8
  HARMONY_CHECK: true
  ACCESSIBILITY_CHECK: true
```

### Integration with Rendering Pipeline

#### Color Management in Rendering
```sitl
SET_RENDERING_COLOR_MANAGEMENT:
  INPUT_COLOR_SPACE: sRGB
  WORKING_COLOR_SPACE: ACES_AP1  // Academy Color Encoding System
  OUTPUT_COLOR_SPACE: sRGB
  
  TONE_MAPPING: ACES | FILMIC | REINHARD
  GAMUT_COMPRESSION: ENABLED
  
  HDR_SUPPORT: true
  BIT_DEPTH: 8 | 10 | 12 | 16 | 32
```

#### Color Grading and Post-Processing
```sitl
APPLY_COLOR_GRADING:
  SHADOWS: {
    lift: (0.0, 0.0, 0.0),      // RGB lift values
    gamma: (1.0, 1.0, 1.0),     // RGB gamma values
    gain: (1.0, 1.0, 1.0)       // RGB gain values
  }
  
  MIDTONES: {
    lift: (0.0, 0.0, 0.0),
    gamma: (1.0, 1.0, 1.0),
    gain: (1.0, 1.0, 1.0)
  }
  
  HIGHLIGHTS: {
    lift: (0.0, 0.0, 0.0),
    gamma: (1.0, 1.0, 1.0),
    gain: (1.0, 1.0, 1.0)
  }
  
  GLOBAL: {
    exposure: 0.0,
    contrast: 1.0,
    saturation: 1.0,
    vibrance: 0.0,
    hue_shift: 0.0
  }
```

## Related Documentation

- **[Human Attributes](human-attributes.md)** - Color applications for human features
- **[Core Entities](entities.md)** - Basic entities that can be colored
- **[Nature Elements](nature.md)** - Color specifications for natural elements
- **[Composition](composition.md)** - Color coordination in scenes and groups
- **[Rendering System](../features/rendering.md)** - Color management in rendering pipeline
- **[Lighting System](../features/lighting.md)** - Color temperature and lighting effects