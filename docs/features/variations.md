# Variation Handling System

The Variation Handling System provides a robust, generalized framework for managing variations in attributes, entities, and scenarios across all domains. This system treats variations as configurable parameters that can be defined globally, per-entity, or per-context, with intelligent fallbacks to defaults.

## Core Principles

1. **Parametric Attributes**: Allow attributes to accept parameters (key-value pairs) for fine-grained customization
2. **Presets and Definitions**: Named presets bundle variations for reuse and override
3. **Contextual Inference**: Use environments and scenes to infer variations when not explicitly specified
4. **Modularity**: Leverage the extension system for domain-specific variation types
5. **Validation and Defaults**: Always provide fallback defaults and warn on ambiguities
6. **Cross-Domain Compatibility**: Variations can combine across different extensions

## Benefits

- **Reduces Repetition**: Define once, reuse anywhere
- **Handles Diversity**: Supports cultural, regional, or stylistic differences
- **Maintains Simplicity**: Builds on existing `WITH`, `DEFINE`, and `SET` syntax
- **Extensible**: Works across all domains without core language changes

## Variation Syntax

### Parameterized Attributes
```sitl
DRAW <ENTITY> WITH <ATTRIBUTE>(<PARAM1>: <VALUE1>, <PARAM2>: <VALUE2>)

// Examples
DRAW SOLDIER WITH UNIFORM(COLOR: CAMOUFLAGE, STYLE: COMBAT, RANK: SERGEANT)
DRAW NURSE WITH SCRUBS(COLOR: BLUE, PATTERN: SOLID, ACCESSORIES: STETHOSCOPE)
DRAW TREE WITH FOLIAGE(SPECIES: OAK, SEASON: AUTUMN, DENSITY: THICK)
```

### Defining Variation Presets
```sitl
DEFINE VARIATION "<preset_name>":
  <ATTRIBUTE>(<PARAM1>: <VALUE1>, <PARAM2>: <VALUE2>)
  <ADDITIONAL_ATTRIBUTES>

// Examples
DEFINE VARIATION "US_Army_Combat":
  UNIFORM(COLOR: CAMOUFLAGE, STYLE: COMBAT, ACCESSORIES: HELMET, BADGE)
  EQUIPMENT(WEAPON: RIFLE, GEAR: TACTICAL_VEST)

DEFINE VARIATION "Catholic_Priest_Formal":
  ATTIRE(COLOR: BLACK, STYLE: ROBE, ACCESSORIES: COLLAR, CROSS)
  POSTURE(STANCE: REVERENT, HANDS: CLASPED)

DEFINE VARIATION "ER_Nurse_Standard":
  SCRUBS(COLOR: BLUE, PATTERN: SOLID, ACCESSORIES: NAME_TAG, STETHOSCOPE)
  EQUIPMENT(TOOLS: CLIPBOARD, BADGE: ID_CARD)
```

### Using Variation Presets
```sitl
DRAW <ENTITY> WITH VARIATION "<preset_name>"
DRAW <ENTITY> WITH VARIATION "<preset_name>" AND <OVERRIDE>

// Examples
DRAW SOLDIER WITH VARIATION "US_Army_Combat"
DRAW SOLDIER WITH VARIATION "US_Army_Combat" AND RANK: LIEUTENANT
DRAW PRIEST WITH VARIATION "Catholic_Priest_Formal" AND COLOR: WHITE
DRAW NURSE WITH VARIATION "ER_Nurse_Standard" AND COLOR: GREEN
```

### Global Defaults
```sitl
SET DEFAULT <ATTRIBUTE> FOR <ENTITY>: <PARAMETERS>

// Examples
SET DEFAULT UNIFORM FOR SOLDIER: COLOR(OLIVE), STYLE(STANDARD)
SET DEFAULT SCRUBS FOR NURSE: COLOR(BLUE), PATTERN(SOLID)
SET DEFAULT ATTIRE FOR PRIEST: COLOR(BLACK), STYLE(ROBE)
```

### Contextual Inference
```sitl
ADD ENVIRONMENT <context>
DRAW <ENTITY> WITH <ATTRIBUTE> // Automatically infers from environment

// Examples
ADD ENVIRONMENT BATTLEFIELD
DRAW SOLDIER WITH UNIFORM // Infers STYLE: COMBAT, ACCESSORIES: HELMET

ADD ENVIRONMENT OPERATING_ROOM
DRAW NURSE WITH SCRUBS // Infers PATTERN: STERILE, ACCESSORIES: SURGICAL_MASK

ADD ENVIRONMENT WEDDING_CEREMONY
DRAW PRIEST WITH ATTIRE // Infers COLOR: WHITE, STYLE: CEREMONIAL
```

## Cross-Domain Variation Examples

### Military Domain
```sitl
// Define military variation presets
DEFINE VARIATION "Navy_Officer":
  UNIFORM(COLOR: NAVY_BLUE, STYLE: DRESS, RANK: CAPTAIN, ACCESSORIES: MEDALS)

DEFINE VARIATION "Marine_Combat":
  UNIFORM(COLOR: DIGITAL_CAMO, STYLE: COMBAT, RANK: CORPORAL, ACCESSORIES: HELMET, VEST)

// Usage with overrides
DRAW SOLDIER WITH VARIATION "Navy_Officer" AND RANK: ADMIRAL
DRAW MARINE WITH VARIATION "Marine_Combat" AND EQUIPMENT: RADIO
```

### Religious Domain
```sitl
// Define religious variation presets
DEFINE VARIATION "Buddhist_Monk":
  ATTIRE(COLOR: ORANGE, STYLE: ROBE, ACCESSORIES: PRAYER_BEADS)

DEFINE VARIATION "Rabbi_Traditional":
  ATTIRE(COLOR: BLACK, STYLE: SUIT, ACCESSORIES: YARMULKE, PRAYER_SHAWL)

// Usage with contextual inference
ADD ENVIRONMENT TEMPLE
DRAW MONK WITH VARIATION "Buddhist_Monk" // Infers POSTURE: MEDITATIVE
```

### Hospital Domain
```sitl
// Define medical variation presets
DEFINE VARIATION "Surgeon_OR":
  SCRUBS(COLOR: GREEN, PATTERN: STERILE, ACCESSORIES: SURGICAL_MASK, GLOVES)

DEFINE VARIATION "Pediatric_Nurse":
  SCRUBS(COLOR: PINK, PATTERN: CARTOON_PRINT, ACCESSORIES: STETHOSCOPE, NAME_TAG)

// Usage with environment-specific inference
ADD ENVIRONMENT PEDIATRIC_WARD
DRAW NURSE WITH VARIATION "Pediatric_Nurse" // Infers friendly posture and colorful accessories
```

### Nature Domain
```sitl
// Define natural variation presets
DEFINE VARIATION "Tropical_Palm":
  TREE(SPECIES: PALM, LEAVES: GREEN, HEIGHT: TALL, FRUIT: COCONUT)

DEFINE VARIATION "Autumn_Oak":
  TREE(SPECIES: OAK, LEAVES: ORANGE, HEIGHT: MEDIUM, BRANCHES: BARE_SOME)

// Usage with seasonal context
CREATE BIOME "tropical_beach"
DRAW TREE WITH VARIATION "Tropical_Palm" // Automatically fits tropical environment
```

### Transportation Domain
```sitl
// Define vehicle variation presets
DEFINE VARIATION "European_High_Speed":
  TRAIN(MODEL: TGV, COLOR: SILVER, STYLE: MODERN, REGION: EU, SPEED: HIGH)

DEFINE VARIATION "American_Freight":
  TRAIN(MODEL: DIESEL, COLOR: YELLOW, STYLE: INDUSTRIAL, REGION: US, CARGO: CONTAINERS)

// Usage with regional context
ADD ENVIRONMENT EUROPEAN_STATION
DRAW TRAIN WITH VARIATION "European_High_Speed" // Fits European infrastructure
```

## Variation Inheritance and Chaining

### Hierarchical Variations
```sitl
// Base variation
DEFINE VARIATION "Base_Military":
  UNIFORM(COLOR: GREEN, STYLE: STANDARD)

// Specialized variations inheriting from base
DEFINE VARIATION "Army_Combat" EXTENDS "Base_Military":
  UNIFORM(STYLE: COMBAT, ACCESSORIES: HELMET)

DEFINE VARIATION "Army_Dress" EXTENDS "Base_Military":
  UNIFORM(STYLE: DRESS, ACCESSORIES: MEDALS)

// Usage
DRAW SOLDIER WITH VARIATION "Army_Combat" // Inherits green color, adds combat style
```

### Variation Chaining
```sitl
// Chain multiple variations
DRAW SOLDIER WITH VARIATION "Base_Military" AND VARIATION "Combat_Gear" AND RANK: SERGEANT

// Override specific parameters in chains
DRAW NURSE WITH VARIATION "ER_Standard" AND VARIATION "Night_Shift" AND COLOR: PURPLE
```

## Error Handling and Validation

### Variation Conflict Detection
```sitl
// Parameter conflicts between variations and explicit attributes
DRAW SOLDIER WITH UNIFORM(COLOR: BLUE) AND VARIATION "Army_Combat" 
// Warning: Color conflict detected
// Resolution: Army_Combat variation overrides explicit color (BLUE → CAMOUFLAGE)
// Message: "Variation 'Army_Combat' overrides explicit COLOR: BLUE with CAMOUFLAGE"

// Multiple variation conflicts
DRAW DOCTOR WITH VARIATION "Surgeon_Scrubs" AND VARIATION "Doctor_Formal"
// Error: Multiple clothing variations specified
// Resolution: Use last specified variation with warning
// Message: "Multiple clothing variations detected. Using 'Doctor_Formal', ignoring 'Surgeon_Scrubs'"

// Incompatible entity-variation combinations
DRAW PRIEST WITH VARIATION "Military_Combat" 
// Error: Entity-variation mismatch
// Suggestion: "Consider using 'Military_Chaplain' or 'Religious_Formal' variation instead"
```

### Variation Inheritance Conflicts
```sitl
// Conflicting inherited attributes
DEFINE VARIATION "Formal_Military" EXTENDS "Base_Military":
  UNIFORM(STYLE: DRESS) // Conflicts with Base_Military STYLE: COMBAT

// Resolution strategies:
// 1. Override inheritance (child wins)
// 2. Merge compatible attributes
// 3. Warn about conflicts

// Circular inheritance detection
DEFINE VARIATION "A" EXTENDS "B"
DEFINE VARIATION "B" EXTENDS "A"
// Error: "Circular inheritance detected between variations 'A' and 'B'"
```

### Parameter Validation
```sitl
// Invalid parameter values
DRAW SOLDIER WITH UNIFORM(COLOR: INVALID_COLOR, RANK: UNKNOWN_RANK)
// Error: "Invalid COLOR 'INVALID_COLOR'. Valid options: [CAMOUFLAGE, OLIVE, NAVY, etc.]"
// Error: "Invalid RANK 'UNKNOWN_RANK'. Valid options: [PRIVATE, SERGEANT, LIEUTENANT, etc.]"

// Parameter type mismatches
DRAW DOCTOR WITH SCRUBS(COLOR: 123, SIZE: "INVALID")
// Error: "COLOR expects string value, got number: 123"
// Error: "SIZE 'INVALID' not recognized. Valid options: [SMALL, MEDIUM, LARGE, XL]"

// Required parameter validation
DRAW SOLDIER WITH UNIFORM(STYLE: COMBAT) // Missing required RANK for combat style
// Warning: "RANK not specified for COMBAT style. Using default: PRIVATE"
```

### Fallback Behavior
```sitl
// Unspecified variations use entity defaults
DRAW SOLDIER WITH UNIFORM // Uses default: COLOR(OLIVE), STYLE(STANDARD)

// Invalid parameters fall back to defaults with warnings
DRAW NURSE WITH SCRUBS(COLOR: NEON_PINK) // Warning: unusual color, using default BLUE

// Missing required parameters prompt for completion
DRAW SOLDIER WITH UNIFORM(STYLE: COMBAT) // Prompts: "Specify rank for combat uniform?"
```

## Context Validation

### Environment-Appropriate Variations
```sitl
// Environment-inappropriate variations trigger warnings
ADD ENVIRONMENT HOSPITAL
DRAW SOLDIER WITH VARIATION "Combat_Full" 
// Warning: "Combat gear inappropriate in hospital environment"
// Suggestion: "Consider 'Military_Medical', 'Security_Hospital', or 'Visitor_Formal' variation"
// Auto-resolution: Adapts to "Security_Hospital" if available

// Formal context validation
ADD ENVIRONMENT OFFICE
DRAW PERSON WITH VARIATION "Beach_Casual"
// Warning: "Casual beach attire inappropriate for office environment"
// Suggestion: "Use 'Business_Formal' or 'Business_Casual' variation instead"
```

### Cultural Context Validation
```sitl
// Cultural appropriateness checks
ADD ENVIRONMENT MOSQUE
DRAW PERSON WITH VARIATION "Revealing_Summer"
// Error: "Revealing attire inappropriate for religious environment"
// Requirement: "Modest attire required. Consider 'Religious_Respectful' variation"
```

### Time-Based Context Validation
```sitl
// Time appropriateness validation
SET TIME "NIGHT"
DRAW PERSON WITH VARIATION "Bright_Neon"
// Warning: "Bright colors unusual for nighttime. Consider 'Evening_Appropriate' variation"
```

### Weather Context Validation
```sitl
// Weather appropriateness checks
SET WEATHER "RAIN"
DRAW PERSON WITH VARIATION "Light_Summer"
// Warning: "Light summer clothing inappropriate for rainy weather"
// Auto-suggestion: "Adding weather protection accessories"
```

## Domain-Specific Validation

### Medical Domain Validation
```sitl
// Medical environment requirements
DRAW SURGEON WITH VARIATION "Casual_Street"
// Error: "Casual attire not permitted in surgical environment"
// Requirement: "Sterile surgical attire required. Use 'Surgeon_Scrubs' variation"
```

### Military Domain Validation
```sitl
// Military hierarchy validation
DRAW SOLDIER WITH UNIFORM(RANK: GENERAL, EXPERIENCE: RECRUIT)
// Warning: "Rank-experience mismatch: GENERAL rank with RECRUIT experience"
// Suggestion: "Consider LIEUTENANT rank for recruit experience level"
```

### Religious Domain Validation
```sitl
// Religious appropriateness validation
DRAW PRIEST WITH VARIATION "Party_Casual"
// Warning: "Casual party attire inappropriate for religious role"
// Suggestion: "Use 'Religious_Formal' or 'Clergy_Traditional' variation"
```

### Educational Domain Validation
```sitl
// Educational environment validation
DRAW TEACHER WITH VARIATION "Club_Night"
// Warning: "Nightclub attire inappropriate for educational environment"
// Suggestion: "Consider 'Professional_Educator' or 'Casual_Teacher' variation"
```

## Cross-Domain Compatibility

### Compatible Cross-Domain Usage
```sitl
// Successful cross-domain combinations
DRAW MILITARY_CHAPLAIN WITH VARIATION "Religious_Formal"
// Success: Military chaplain can use religious variations

DRAW DOCTOR_SOLDIER WITH VARIATION "Medical_Military"
// Success: Military medic can combine medical and military elements
```

### Incompatible Cross-Domain Usage
```sitl
// Incompatible combinations
DRAW PRIEST WITH VARIATION "Combat_Assault"
// Error: "Combat variations incompatible with religious entities"
// Exception: "Unless entity is 'Military_Chaplain' or similar hybrid role"

DRAW CHILD WITH VARIATION "Adult_Professional"
// Warning: "Professional adult attire may not fit child entity"
// Auto-adjustment: "Scaling professional attire to child proportions"
```

## Error Recovery Strategies

### Graceful Degradation
```sitl
// Missing variation fallback
DRAW SOLDIER WITH VARIATION "Future_Combat_2050"
// Error: "Variation 'Future_Combat_2050' not found"
// Recovery: "Falling back to closest match: 'Modern_Combat'"
// Alternative: "Using base SOLDIER entity with default attributes"
```

### Automatic Conflict Resolution
```sitl
// Conflicting variation resolution
DRAW PERSON WITH VARIATION "Formal_Business" AND VARIATION "Beach_Casual"
// Conflict: "Formal and casual variations are incompatible"
// Resolution: "Prioritizing first variation: 'Formal_Business'"
// User prompt: "Would you like to blend variations or choose one?"
```

### Progressive Fallback Chain
```sitl
// Hierarchical fallback system
DRAW DOCTOR WITH VARIATION "Specialized_Neurosurgeon"
// Fallback chain: "Specialized_Neurosurgeon" → "General_Surgeon" → "Medical_Professional" → "DOCTOR"
// Success: "Using 'General_Surgeon' variation (closest available match)"
```

### Context-Aware Error Correction
```sitl
// Environment-based correction
ADD ENVIRONMENT BEACH
DRAW PERSON WITH VARIATION "Winter_Heavy_Coat"
// Warning: "Heavy winter clothing inappropriate for beach environment"
// Auto-correction: "Suggesting 'Beach_Casual' or 'Summer_Light' variation"
// User choice: "Apply suggestion automatically? [Y/N]"
```

### Missing Parameter Interpolation
```sitl
// Parameter inference and defaults
DRAW SOLDIER WITH UNIFORM(RANK: MISSING, BRANCH: ARMY)
// Error: "Required parameter RANK is missing"
// Recovery: "Inferring RANK based on context and other parameters"
// Result: "Defaulting to RANK: PRIVATE (entry-level for ARMY branch)"
```

### Asset Loading Failure Recovery
```sitl
// Asset fallback handling
LOAD ASSET "military_insignia.svg" FOR VARIATION "Officer_Formal"
// Error: "Asset 'military_insignia.svg' not found"
// Recovery: "Using placeholder asset or simplified rendering"
// Notification: "Variation rendered with reduced detail due to missing assets"
```

## Validation Error Messages

### Clear, Actionable Error Messages
```sitl
// Comprehensive error reporting
DRAW PRIEST WITH VARIATION "Combat_Gear"
// Error Message:
// "Incompatible Variation Assignment"
// "Entity: PRIEST (Religious domain)"
// "Variation: Combat_Gear (Military domain)"
// "Conflict: Religious entities cannot use combat variations"
// "Suggestions:"
// "  1. Use 'Religious_Formal' or 'Clergy_Traditional' variation"
// "  2. Change entity to 'MILITARY_CHAPLAIN' for hybrid role"
// "  3. Create custom variation combining religious and protective elements"
```

### Parameter Validation with Suggestions
```sitl
// Detailed parameter guidance
DRAW PERSON WITH AGE(-5)
// Error Message:
// "Invalid Parameter Value"
// "Parameter: AGE"
// "Value: -5"
// "Issue: Age cannot be negative"
// "Valid range: 0-120"
// "Suggestions: Use AGE(5) for child, AGE(25) for adult, AGE(65) for elderly"
```

### Context Mismatch with Environment Guidance
```sitl
// Environment-specific recommendations
ADD ENVIRONMENT FORMAL_DINNER
DRAW PERSON WITH VARIATION "Gym_Workout"
// Warning Message:
// "Context Appropriateness Warning"
// "Environment: FORMAL_DINNER"
// "Variation: Gym_Workout"
// "Issue: Athletic wear inappropriate for formal dining"
// "Recommendations:"
// "  - 'Formal_Evening' for elegant dinner attire"
// "  - 'Business_Formal' for professional dinner setting"
// "  - 'Smart_Casual' for semi-formal occasions"
```

## Debug and Diagnostic Features

### Variation Conflict Analysis
```sitl
// Scene-wide conflict detection
DEBUG VARIATION CONFLICTS FOR SCENE
// Output:
// "Variation Conflict Analysis:"
// "Entity: SOLDIER_1"
// "  - Variation 'Dress_Uniform' conflicts with Environment 'COMBAT_ZONE'"
// "  - Suggestion: Use 'Combat_Ready' variation"
// "Entity: DOCTOR_2"
// "  - Parameter AGE(15) incompatible with DOCTOR role"
// "  - Suggestion: Increase age to minimum 25 or change to STUDENT"
```

### Variation Usage Statistics
```sitl
// Usage analytics and reporting
SHOW VARIATION USAGE STATS
// Output:
// "Variation Usage Report:"
// "Most used: 'Casual_Modern' (45% of entities)"
// "Least used: 'Historical_Medieval' (2% of entities)"
// "Conflicts detected: 3"
// "Auto-resolved: 2"
// "User intervention required: 1"
```

### Validation Rule Testing
```sitl
// Variation testing framework
TEST VARIATION "Custom_Pilot" WITH ENTITY PILOT IN ENVIRONMENT COCKPIT
// Output:
// "Validation Test Results:"
// "✓ Entity compatibility: PASS"
// "✓ Environment appropriateness: PASS"
// "✓ Required parameters: PASS"
// "⚠ Optional parameter EXPERIENCE not specified (defaulting to INTERMEDIATE)"
// "✓ Asset availability: PASS"
// "Overall: VALID with 1 warning"
```

## Advanced Variation Features

### Dynamic Asset Loading
```sitl
// Custom asset integration
LOAD ASSET "army_insignia.svg" FOR VARIATION "US_Army_Combat" ACCESSORIES: BADGE
LOAD ASSET "hospital_logo.png" FOR VARIATION "ER_Nurse" ACCESSORIES: NAME_TAG

// Custom patterns and textures
DEFINE VARIATION "Camo_Desert":
  UNIFORM(PATTERN: LOAD("desert_camo.svg"), COLOR: TAN)
```

### Conditional Variations
```sitl
// Environment-responsive variations
DEFINE VARIATION "Weather_Appropriate":
  IF ENVIRONMENT.WEATHER = "RAIN" THEN ACCESSORIES: RAINCOAT
  IF ENVIRONMENT.WEATHER = "SNOW" THEN ACCESSORIES: WINTER_COAT
  IF ENVIRONMENT.WEATHER = "HOT" THEN STYLE: LIGHTWEIGHT

// Time-based variations
DEFINE VARIATION "Shift_Based":
  IF TIME = "NIGHT" THEN COLOR: DARK_BLUE
  IF TIME = "DAY" THEN COLOR: LIGHT_BLUE
```

### User-Defined Variations
```sitl
// Custom variation creation
DEFINE VARIATION "Sci_Fi_Military":
  UNIFORM(COLOR: METALLIC_SILVER, STYLE: FUTURISTIC, ACCESSORIES: ENERGY_WEAPON, HELMET: VISOR)

DEFINE VARIATION "Fantasy_Healer":
  ATTIRE(COLOR: WHITE, STYLE: ROBES, ACCESSORIES: STAFF, POUCH: HERBS)
```

## Related Documentation

- [Templates and Reusability](templates.md) - Template system integration
- [Background and Environment](backgrounds.md) - Environmental context for variations
- [Human Attributes](../core/human-attributes.md) - Available attributes for variations
- [Core Entities](../core/entities.md) - Basic entity types for variations

## Usage Examples

### Basic Variation Usage
```sitl
DEFINE VARIATION "Office_Professional":
  ATTIRE(STYLE: BUSINESS_CASUAL, COLOR: NAVY_BLUE)
  ACCESSORIES(BADGE: ID_CARD, BRIEFCASE: LEATHER)

DRAW PERSON WITH VARIATION "Office_Professional"
```

### Complex Variation with Inheritance
```sitl
DEFINE VARIATION "Base_Medical":
  ATTIRE(COLOR: WHITE, STYLE: PROFESSIONAL)
  ACCESSORIES(BADGE: MEDICAL_ID)

DEFINE VARIATION "Emergency_Doctor" EXTENDS "Base_Medical":
  ATTIRE(STYLE: SCRUBS, COLOR: BLUE)
  EQUIPMENT(STETHOSCOPE: TRUE, PAGER: EMERGENCY)

DRAW DOCTOR WITH VARIATION "Emergency_Doctor" AND SPECIALIZATION: CARDIOLOGY
```

### Context-Aware Variation Application
```sitl
ADD ENVIRONMENT OPERATING_ROOM
DRAW SURGEON WITH VARIATION "Surgical_Team_Lead"
// Automatically applies sterile surgical attire and equipment

ADD ENVIRONMENT PATIENT_ROOM
DRAW NURSE WITH VARIATION "Patient_Care_Nurse"
// Automatically applies patient-friendly attire and bedside manner
```