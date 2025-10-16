# Advanced Features and Implementation Guidelines

This document covers advanced SITL features, implementation guidelines, and best practices for developers and advanced users.

## Extension System Architecture

### Core-Extension Relationship

The SITL system is built on a modular architecture that separates core functionality from domain-specific features:

```
Core System (Always Loaded)
├── Basic Entities (humans, animals, objects)
├── Essential Attributes (age, emotion, colors)
├── Nature Elements (trees, water, terrain)
├── Basic Positioning and Layout
└── Core Composition Features

Domain Extensions (Loaded on Demand)
├── Hospital Extension
├── Space Extension
├── Court/Legal Extension
├── Military Extension
├── Religious Extension
├── Transportation Extension
└── Educational Extension
```

### Extension Loading Mechanism

#### Automatic Extension Detection
```sitl
// Automatic extension detection based on entity usage
DRAW DOCTOR → Loads Hospital Extension
DRAW ASTRONAUT → Loads Space Extension
DRAW JUDGE → Loads Court/Legal Extension
DRAW SOLDIER → Loads Military Extension
```

#### Explicit Extension Loading
```sitl
// Manual extension loading
LOAD EXTENSION hospital
LOAD EXTENSION space
LOAD EXTENSION court
LOAD EXTENSION military
```

### Extension Namespace

#### Core Entities (No Prefix)
```sitl
DRAW MAN
DRAW WOMAN
DRAW TREE
```

#### Extension Entities (With Domain Context)
```sitl
DRAW DOCTOR (hospital extension)
DRAW ASTRONAUT (space extension)
DRAW JUDGE (court extension)
DRAW SOLDIER (military extension)
```

### Extension Compatibility

#### Cross-Extension Usage
```sitl
// Extensions can work together
DRAW MILITARY DOCTOR (military + hospital)
DRAW SPACE ENGINEER (space + core)
DRAW COURT SECURITY (court + military)

// Cross-extension scenarios
DRAW MILITARY HOSPITAL SCENE:
  DRAW MILITARY DOCTOR
  DRAW WOUNDED SOLDIER
  DRAW FIELD HOSPITAL
```

### Extension Development Framework

#### Extension Definition Structure
```javascript
{
  "name": "hospital",
  "version": "1.0.0",
  "dependencies": ["core"],
  "entities": {
    "doctor": { /* entity definition */ },
    "nurse": { /* entity definition */ },
    "hospital_bed": { /* entity definition */ }
  },
  "scenarios": {
    "surgery_scene": { /* scenario definition */ },
    "checkup_scene": { /* scenario definition */ }
  },
  "attributes": {
    "medical_equipment": ["stethoscope", "syringe", "thermometer"],
    "medical_clothing": ["scrubs", "white_coat", "surgical_mask"]
  }
}
```

### Extension Benefits

1. **Modularity**: Load only needed functionality
2. **Maintainability**: Separate concerns by domain
3. **Extensibility**: Easy to add new domains
4. **Performance**: Smaller core system, faster loading
5. **Customization**: Users can create custom extensions
6. **Collaboration**: Different teams can work on different extensions

## Default Attributes and Context Handling

### Human Entity Defaults

When attributes are not specified, entities use predictable defaults:

#### Adult Defaults (Age 30)
```sitl
// MAN/WOMAN defaults
- Physical: Age 30, medium height (5'9"/5'6"), average build
- Face: Neutral expression, light skin tone
- Hair: Short black hair, no facial hair
- Clothing: White shirt, black pants, black shoes
- Position: Center of canvas if not specified
```

#### Child Defaults (Age 10)
```sitl
// BOY/GIRL defaults
- Physical: Age 10, child height (4'6"/4'4"), slim build
- Face: Neutral expression, light skin tone
- Hair: Short black hair
- Clothing: White t-shirt, blue shorts, white sneakers
- Position: Center of canvas if not specified
```

#### Infant Defaults (Age 1)
```sitl
// BABY defaults
- Physical: Age 1, infant size, sitting/lying position
- Face: Happy expression, light skin tone
- Hair: Little to no hair
- Clothing: Light blue onesie, white socks
- Position: Center of canvas if not specified
```

### Context-Based Defaults

Environment and scene context can override base defaults:

#### Environment-Specific Defaults
```sitl
// OFFICE Environment
ADD ENVIRONMENT OFFICE
DRAW MAN  // Results in: Navy suit jacket, white dress shirt, black dress pants

// PARK Environment  
ADD ENVIRONMENT PARK
DRAW WOMAN  // Results in: Casual t-shirt, shorts or jeans, sneakers

// HOSPITAL Environment
ADD ENVIRONMENT HOSPITAL  
DRAW MAN  // Results in: Scrubs (if medical role implied) or casual clothes

// BEACH Environment
ADD ENVIRONMENT BEACH
DRAW WOMAN  // Results in: Swimwear, beach cover-up, sandals, sun hat
```

#### Seasonal Context Defaults
```sitl
// Winter Scene
SET SEASON WINTER
DRAW MAN  // Results in: Winter coat, warm clothing, boots, hat/gloves

// Summer Scene  
SET SEASON SUMMER
DRAW WOMAN  // Results in: Light clothing, sandals, sun protection
```

### Outfit Categories and Smart Inference

#### Complete Outfit Categories
```sitl
// CASUAL outfit - complete clothing set
DRAW MAN WITH OUTFIT CASUAL
// Results in: White t-shirt, blue jeans, white sneakers, casual belt

// FORMAL outfit - business/professional complete set
DRAW MAN WITH OUTFIT FORMAL
// Results in: White dress shirt, navy suit jacket, black dress pants, dress shoes

// ATHLETIC outfit - sports/exercise complete set  
DRAW PERSON WITH OUTFIT ATHLETIC
// Results in: Athletic shirt, shorts or track pants, athletic shoes
```

#### Outfit Customization
```sitl
// Customize specific parts of outfit categories
DRAW MAN WITH OUTFIT CASUAL(SHIRT:RED, PANTS:BLACK)
// Results in: Red t-shirt, black jeans, white sneakers, casual belt

// Mix outfit categories
DRAW MAN WITH OUTFIT CASUAL_FORMAL
// Results in: Business casual - dress shirt, khakis, loafers, no tie
```

## Error Handling and Validation

### Incomplete Attribute Handling

#### Missing Attributes with Defaults
```sitl
// Missing attributes - apply defaults with warnings
INPUT: DRAW MAN WITH BLUE SHIRT
WARNING: "Pants not specified for MAN, using default BLACK PANTS"
WARNING: "Shoes not specified for MAN, using default BLACK SHOES"  
RESULT: Man with blue shirt, black pants, black shoes, age 30
```

#### Context-Based Default Application
```sitl
// Context-based default application
INPUT: ADD ENVIRONMENT OFFICE; DRAW MAN WITH BLUE SHIRT
INFO: "Office environment detected, applying FORMAL context defaults"
RESULT: Man with blue dress shirt, navy pants, black dress shoes, tie
```

### Attribute Conflict Resolution

#### Style Conflicts
```sitl
// Conflicting attributes
INPUT: DRAW MAN WITH FORMAL_OUTFIT AND ATHLETIC_SHOES
WARNING: "Style conflict: FORMAL_OUTFIT with ATHLETIC_SHOES"
SUGGESTION: "Consider: FORMAL_OUTFIT with DRESS_SHOES or ATHLETIC_OUTFIT"
RESOLUTION: "Using FORMAL_OUTFIT, replacing ATHLETIC_SHOES with DRESS_SHOES"
```

#### Age-Inappropriate Attributes
```sitl
// Age-inappropriate attributes
INPUT: DRAW BOY WITH BUSINESS_SUIT  
WARNING: "Age conflict: BOY (default age 10) with BUSINESS_SUIT"
SUGGESTION: "Consider: MAN with BUSINESS_SUIT or BOY with SCHOOL_UNIFORM"
RESOLUTION: "Adjusting age to 18 for business attire appropriateness"
```

#### Shirtless Context Validation
```sitl
// Appropriate shirtless contexts
INPUT: ADD ENVIRONMENT BEACH; DRAW MAN WITH NO SHIRT
INFO: "Beach environment detected, applying swimwear defaults"
RESULT: "Man with no shirt, swim trunks, sandals"

// Inappropriate shirtless contexts
INPUT: ADD ENVIRONMENT OFFICE; DRAW MAN WITH NO SHIRT
WARNING: "Shirtless attire inappropriate for OFFICE environment"
SUGGESTION: "Consider: formal shirt for office or change environment to BEACH/GYM"
RESOLUTION: "Applying office-appropriate defaults: white dress shirt, navy pants"
```

### Smart Suggestions and Auto-Correction

#### Typo Detection and Correction
```sitl
// Typo detection and correction
INPUT: DRAW MAN WITH BLU SHIRT
SUGGESTION: "Did you mean 'BLUE SHIRT'? (y/n)"
AUTO-CORRECT: "Correcting 'BLU' to 'BLUE'"

// Invalid entity names with suggestions
INPUT: DRAW MANN WITH RED SHIRT
ERROR: "Unknown entity 'MANN'"
SUGGESTION: "Did you mean: MAN, WOMAN, or HUMAN?"
```

#### Template and Outfit Suggestions
```sitl
// Suggest templates for incomplete specifications
INPUT: DRAW DOCTOR
WARNING: "DOCTOR entity requires hospital extension"
SUGGESTION: "Load hospital extension or use template:"
OPTIONS: "1. LOAD EXTENSION hospital; DRAW DOCTOR
          2. USE TEMPLATE 'medical_professional'
          3. DRAW MAN WITH WHITE_COAT AND STETHOSCOPE"
```

## Advanced Language Features

### Expressions and Actions
```sitl
DRAW MAN TALKING
DRAW WOMAN LAUGHING
DRAW BOY RUNNING
DRAW GIRL DANCING
DRAW MAN SITTING
DRAW WOMAN STANDING
```

### Interactions
```sitl
DRAW MAN HOLDING WOMAN HAND
DRAW WOMAN HUGGING BOY
DRAW BOY PLAYING WITH ANIMAL DOG
DRAW GIRL FEEDING ANIMAL CAT
```

### Dynamic Elements (Future)
```sitl
ANIMATE MAN WALK FROM LEFT TO RIGHT
ANIMATE WOMAN WAVE HAND
ANIMATE BOY JUMP
ANIMATE LEAVES FALLING
```

## Implementation Guidelines

### Parser Enhancements

The parser should handle parameterized attributes as structured objects:

```javascript
function parseVariation(command) {
  // Extract UNIFORM(COLOR: NAVY, STYLE: FORMAL) → { uniform: { color: 'navy', style: 'formal' } }
  let params = extractParams(command);
  return merge(defaults[entity], presets[variationName], params);
}
```

### Data Structure

Store variations as JSON in extensions:

```json
{
  "variations": {
    "US_Army_Combat": {
      "uniform": { "color": "camouflage", "style": "combat", "rank": "private" },
      "equipment": { "weapon": "rifle", "gear": "tactical_vest" }
    }
  }
}
```

### Rendering Strategy

- Use modular assets (SVG layers) with dynamic swaps based on parameters
- Implement color replacement for `COLOR` parameters
- Add/remove elements for `ACCESSORIES` parameters
- Cache parsed variations for performance in complex scenes

### Performance Optimization

- Cache frequently used variation combinations
- Lazy-load variation assets only when needed
- Optimize rendering pipeline for parametric changes
- Batch similar variations for efficient processing

## Language Rules and Conventions

### Syntax Rules

1. Commands start with action verbs (DRAW, CREATE, SET, etc.)
2. Entities are specified after the action verb
3. Attributes follow the WITH keyword
4. Multiple attributes are connected with AND
5. Positioning uses AT, NEXT TO, BEHIND, etc.
6. Colors can be specified as names or hex values

### Naming Conventions

- Entity names use uppercase (MAN, WOMAN, TREE)
- Attribute names use uppercase (AGE, FACE, HAIR)
- Template names use lowercase with quotes ("template_name")
- Color names use uppercase (RED, BLUE, GREEN)

### Context Priority Rules

1. **Role-specific attributes** (DOCTOR, TEACHER) override environment defaults
2. **Environment defaults** (OFFICE, PARK) override base entity defaults  
3. **Seasonal/time context** modifies clothing appropriateness
4. **Explicitly specified attributes** always take highest priority

## Export and Output

### Export Formats
```sitl
EXPORT AS PNG WITH SIZE 800x600
EXPORT AS SVG WITH QUALITY HIGH
EXPORT AS JSON TEMPLATE
SAVE AS "my_image.png"
```

### Quality Settings
```sitl
EXPORT AS PNG WITH QUALITY HIGH
EXPORT AS JPG WITH COMPRESSION 80
EXPORT AS SVG WITH PRECISION 2
```

## Error Recovery Strategies

### Graceful Degradation
```sitl
// Graceful degradation
INPUT: DRAW INVALID_ENTITY WITH BLUE SHIRT
ERROR: "Unknown entity 'INVALID_ENTITY'"
RECOVERY: "Falling back to generic PERSON entity"
RESULT: Person with blue shirt and default attributes
```

### Partial Command Execution
```sitl
// Partial command execution
INPUT: DRAW MAN WITH INVALID_ATTRIBUTE AND BLUE SHIRT
ERROR: "Unknown attribute 'INVALID_ATTRIBUTE'"
RECOVERY: "Ignoring invalid attribute, processing valid attributes"
RESULT: Man with blue shirt and default other attributes
```

### Extension Dependency Resolution
```sitl
// Extension dependency resolution
INPUT: DRAW SPACESHIP
ERROR: "SPACESHIP requires space extension"
RECOVERY: "Loading space extension automatically"
ALTERNATIVE: "Use generic VEHICLE if space extension unavailable"
```

## Validation Warnings and Limits

### Performance Warnings
```sitl
// Performance warnings
INPUT: CREATE SCENE WITH 200 PEOPLE
WARNING: "High entity count (200) may impact performance"
SUGGESTION: "Consider using groups or background elements for crowds"
LIMIT: "Maximum 100 detailed entities recommended"
```

### Attribute Range Validation
```sitl
// Attribute range validation
INPUT: DRAW MAN WITH AGE 150
ERROR: "Invalid age 150 (valid range: 0-120)"
CORRECTION: "Using maximum valid age: 120"

// Position boundary warnings
INPUT: DRAW MAN AT POSITION 2000,2000
WARNING: "Position (2000,2000) outside canvas bounds (800x600)"
CORRECTION: "Adjusting to nearest valid position: (800,600)"
```

## Related Documentation

- [Templates and Reusability](templates.md) - Template system for reusable components
- [Background and Environment](backgrounds.md) - Environmental context and scenes
- [Variation Handling](variations.md) - Advanced variation and parameter system
- [Core Entities](../core/entities.md) - Basic entity types and definitions
- [Human Attributes](../core/human-attributes.md) - Available human attributes

## Best Practices

### For Developers

1. **Always provide fallback defaults** for incomplete specifications
2. **Validate context appropriateness** before applying attributes
3. **Use extension system** for domain-specific functionality
4. **Implement graceful error recovery** for invalid inputs
5. **Cache frequently used combinations** for performance

### For Users

1. **Use outfit categories** for complete, consistent styling
2. **Specify environment context** for appropriate defaults
3. **Load relevant extensions** for specialized domains
4. **Use templates** for reusable scene components
5. **Test complex scenes** incrementally for best results

### For Extension Developers

1. **Follow naming conventions** consistently
2. **Provide comprehensive defaults** for all entities
3. **Document cross-extension compatibility**
4. **Include validation rules** for domain-specific constraints
5. **Test with core system** and other extensions