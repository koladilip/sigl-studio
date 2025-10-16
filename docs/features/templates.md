# Templates and Reusability

The SITL Template System provides powerful mechanisms for creating reusable, parameterized entity definitions that can be applied across different contexts and scenarios.

## Template Definition

Templates allow you to define reusable patterns for entities with customizable parameters:

```sitl
DEFINE TEMPLATE "Professional_Worker":
  PERSON WITH ATTIRE(STYLE: BUSINESS, COLOR: $color, FORMALITY: $formality)
  ACCESSORIES(BADGE: $badge_type, BRIEFCASE: $has_briefcase)
  POSTURE(STANCE: CONFIDENT, EXPRESSION: PROFESSIONAL)
```

### Template Parameters

Templates support various parameter types:

```sitl
DEFINE TEMPLATE "Uniformed_Personnel":
  PERSON WITH UNIFORM(
    TYPE: $uniform_type,           // String parameter
    COLOR: $color,                 // Color parameter
    RANK: $rank,                   // Optional parameter with default
    EXPERIENCE: $experience = "INTERMEDIATE"  // Default value
  )
  EQUIPMENT(RADIO: $has_radio = true)  // Boolean with default
```

## Template Usage

### Basic Template Application
```sitl
USE TEMPLATE "Professional_Worker" WITH:
  color: NAVY_BLUE
  formality: FORMAL
  badge_type: CORPORATE
  has_briefcase: true
```

### Multiple Template Instances
```sitl
USE TEMPLATE "Uniformed_Personnel" WITH:
  uniform_type: POLICE
  color: DARK_BLUE
  rank: SERGEANT
  has_radio: true

USE TEMPLATE "Uniformed_Personnel" WITH:
  uniform_type: SECURITY
  color: BLACK
  rank: OFFICER
  experience: SENIOR
```

## Template Modification

### Override Mechanisms
Templates can be modified at application time:

```sitl
USE TEMPLATE "Professional_Worker" WITH:
  color: CHARCOAL_GRAY
  formality: BUSINESS_CASUAL
OVERRIDE:
  ACCESSORIES(GLASSES: READING, WATCH: LUXURY)
  POSTURE(EXPRESSION: FRIENDLY)
```

### Partial Application
Apply templates with only some parameters specified:

```sitl
USE TEMPLATE "Uniformed_Personnel" WITH:
  uniform_type: FIREFIGHTER
  color: RED
  // rank and experience use defaults
```

## Template Inheritance

### Inheritance Chains
Templates can inherit from other templates:

```sitl
DEFINE TEMPLATE "Emergency_Responder" EXTENDS "Uniformed_Personnel":
  EQUIPMENT(RADIO: true, EMERGENCY_GEAR: $gear_type)
  TRAINING(CERTIFICATION: $certification)
  READINESS(STATUS: ON_DUTY)

DEFINE TEMPLATE "Paramedic" EXTENDS "Emergency_Responder":
  EQUIPMENT(MEDICAL_BAG: true, STETHOSCOPE: true)
  UNIFORM(COLOR: NAVY_BLUE, PATCHES: EMS)
  TRAINING(CERTIFICATION: EMT_PARAMEDIC)
```

### Complete Attribute Sets
Inherited templates maintain complete attribute definitions:

```sitl
USE TEMPLATE "Paramedic" WITH:
  gear_type: ADVANCED_LIFE_SUPPORT
  experience: VETERAN
  rank: LIEUTENANT
```

## Context-Aware Template Selection

### Automatic Template Selection
Templates can be selected based on context:

```sitl
DRAW PERSON IN HOSPITAL WITH ROLE: MEDICAL_STAFF
// Automatically selects appropriate medical template

DRAW PERSON IN COURTROOM WITH ROLE: LEGAL_PROFESSIONAL
// Automatically selects appropriate legal template
```

### Conditional Template Application
```sitl
DEFINE TEMPLATE "Weather_Appropriate_Clothing":
  IF WEATHER = RAIN:
    ATTIRE(OUTERWEAR: RAINCOAT, FOOTWEAR: WATERPROOF)
  ELSE IF WEATHER = SNOW:
    ATTIRE(OUTERWEAR: WINTER_COAT, ACCESSORIES: GLOVES_SCARF)
  ELSE:
    ATTIRE(OUTERWEAR: LIGHT_JACKET)
```

## Template Validation

### Parameter Validation
Templates include validation rules for parameters:

```sitl
DEFINE TEMPLATE "Military_Personnel" WITH VALIDATION:
  UNIFORM_TYPE: REQUIRED, VALUES: [ARMY, NAVY, AIR_FORCE, MARINES]
  RANK: REQUIRED, VALIDATE: MILITARY_RANK_STRUCTURE
  EXPERIENCE: OPTIONAL, VALUES: [RECRUIT, VETERAN, CAREER]
  
VALIDATE TEMPLATE "Military_Personnel":
  IF RANK = GENERAL AND EXPERIENCE = RECRUIT:
    ERROR "Invalid rank-experience combination"
```

### Cross-Domain Compatibility
Templates ensure compatibility across different domains:

```sitl
DEFINE TEMPLATE "Authority_Figure":
  COMPATIBLE_DOMAINS: [MILITARY, POLICE, SECURITY, CORPORATE]
  ATTRIBUTES(AUTHORITY_LEVEL: $level, COMMAND_PRESENCE: true)
  VALIDATION(CONTEXT_APPROPRIATE: true)
```

## Template Libraries

### Professional Domain Templates
```sitl
TEMPLATE_LIBRARY "Professional":
  "Business_Executive": PERSON WITH ATTIRE(STYLE: EXECUTIVE_SUIT)
  "Office_Worker": PERSON WITH ATTIRE(STYLE: BUSINESS_CASUAL)
  "Consultant": PERSON WITH ATTIRE(STYLE: PROFESSIONAL_MOBILE)
  "Entrepreneur": PERSON WITH ATTIRE(STYLE: SMART_CASUAL)
```

### Family Domain Templates
```sitl
TEMPLATE_LIBRARY "Family":
  "Parent": PERSON WITH ATTIRE(STYLE: CASUAL_RESPONSIBLE)
  "Child": PERSON WITH ATTIRE(STYLE: PLAYFUL_APPROPRIATE)
  "Teenager": PERSON WITH ATTIRE(STYLE: TRENDY_CASUAL)
  "Grandparent": PERSON WITH ATTIRE(STYLE: COMFORTABLE_CLASSIC)
```

### Athletic Domain Templates
```sitl
TEMPLATE_LIBRARY "Athletic":
  "Runner": PERSON WITH ATTIRE(STYLE: RUNNING_GEAR, FOOTWEAR: RUNNING_SHOES)
  "Swimmer": PERSON WITH ATTIRE(STYLE: SWIMWEAR, ACCESSORIES: GOGGLES)
  "Cyclist": PERSON WITH ATTIRE(STYLE: CYCLING_GEAR, EQUIPMENT: HELMET)
  "Team_Player": PERSON WITH ATTIRE(STYLE: TEAM_UNIFORM, EQUIPMENT: SPORT_SPECIFIC)
```

### Seasonal Templates
```sitl
TEMPLATE_LIBRARY "Seasonal":
  "Summer_Casual": PERSON WITH ATTIRE(STYLE: LIGHT_CASUAL, SEASON: SUMMER)
  "Winter_Outdoor": PERSON WITH ATTIRE(STYLE: WINTER_GEAR, ACCESSORIES: WARM)
  "Spring_Professional": PERSON WITH ATTIRE(STYLE: LIGHT_BUSINESS, SEASON: SPRING)
  "Fall_Layered": PERSON WITH ATTIRE(STYLE: LAYERED_CASUAL, SEASON: AUTUMN)
```

## Advanced Template Features

### Dynamic Template Generation
```sitl
GENERATE TEMPLATE "Event_Attendee" FROM CONTEXT:
  EVENT_TYPE: $event_type
  FORMALITY_LEVEL: $formality
  WEATHER_CONDITIONS: $weather
  
APPLY RULES:
  IF EVENT_TYPE = WEDDING: FORMALITY = FORMAL
  IF EVENT_TYPE = PICNIC: FORMALITY = CASUAL
  IF WEATHER = RAIN: ADD RAIN_PROTECTION
```

### Template Composition
```sitl
COMPOSE TEMPLATE "Conference_Speaker" FROM:
  BASE: "Professional_Worker"
  ADDITIONS: "Public_Speaker_Traits"
  MODIFICATIONS: "Conference_Specific_Attire"
  
RESULT:
  PERSON WITH PROFESSIONAL_ATTIRE AND PRESENTATION_SKILLS AND CONFERENCE_BADGE
```

### Template Versioning
```sitl
DEFINE TEMPLATE "Modern_Office_Worker" VERSION 2.0:
  INHERITS: "Office_Worker" VERSION 1.0
  UPDATES:
    TECHNOLOGY(DEVICES: LAPTOP_AND_PHONE, CONNECTIVITY: WIRELESS)
    WORKSPACE(TYPE: FLEXIBLE, LOCATION: HYBRID)
    ATTIRE(STYLE: SMART_CASUAL, FLEXIBILITY: HIGH)
```

## Template Performance Optimization

### Template Caching
```sitl
CACHE TEMPLATE "Frequently_Used_Professional":
  CACHE_DURATION: 1_HOUR
  CACHE_VARIANTS: 10
  PRELOAD_COMMON_PARAMETERS: true
```

### Lazy Template Loading
```sitl
LAZY_LOAD TEMPLATE "Specialized_Professional":
  LOAD_TRIGGER: ON_FIRST_USE
  DEPENDENCIES: ["Base_Professional", "Industry_Specific"]
  FALLBACK: "Generic_Professional"
```

### Template Batching
```sitl
BATCH_APPLY TEMPLATES:
  "Office_Team": ["Manager", "Developer", "Designer", "Analyst"]
  SHARED_PARAMETERS:
    company_colors: CORPORATE_BLUE
    dress_code: BUSINESS_CASUAL
    office_environment: MODERN
```

## Template Error Handling

### Missing Parameter Handling
```sitl
DEFINE TEMPLATE "Robust_Professional" WITH ERROR_HANDLING:
  REQUIRED_PARAMETERS: [role, department]
  OPTIONAL_PARAMETERS: [experience_level, specialization]
  
  ON_MISSING_REQUIRED:
    ACTION: PROMPT_USER
    FALLBACK: USE_DEFAULTS
    
  ON_INVALID_VALUE:
    ACTION: SUGGEST_ALTERNATIVES
    FALLBACK: USE_CLOSEST_MATCH
```

### Template Conflict Resolution
```sitl
RESOLVE TEMPLATE_CONFLICTS:
  PRIORITY_ORDER: [USER_SPECIFIED, CONTEXT_INFERRED, TEMPLATE_DEFAULT]
  CONFLICT_STRATEGY: MERGE_COMPATIBLE, OVERRIDE_INCOMPATIBLE
  VALIDATION: ENSURE_CONSISTENCY
```

## Template Documentation and Metadata

### Template Documentation
```sitl
DOCUMENT TEMPLATE "Professional_Worker":
  DESCRIPTION: "Generic professional worker suitable for office environments"
  AUTHOR: "SITL_Team"
  VERSION: "1.2"
  CREATED: "2024-01-15"
  LAST_MODIFIED: "2024-03-20"
  
  PARAMETERS:
    color: "Primary color for professional attire"
    formality: "Level of formality (CASUAL, BUSINESS_CASUAL, FORMAL)"
    badge_type: "Type of identification badge"
    has_briefcase: "Whether person carries a briefcase"
  
  USAGE_EXAMPLES:
    - "Corporate office worker"
    - "Business meeting attendee"
    - "Professional consultant"
  
  COMPATIBLE_CONTEXTS: [OFFICE, MEETING_ROOM, BUSINESS_CONFERENCE]
  INCOMPATIBLE_CONTEXTS: [BEACH, SPORTS_FIELD, CONSTRUCTION_SITE]
```

### Template Analytics
```sitl
TRACK TEMPLATE_USAGE:
  TEMPLATE: "Professional_Worker"
  METRICS:
    usage_count: 1247
    success_rate: 98.5%
    common_parameters: {color: NAVY_BLUE, formality: BUSINESS_CASUAL}
    error_patterns: ["missing_badge_type: 12%", "invalid_color: 3%"]
```

## Related Documentation

- [Variation Handling System](variations.md) - Advanced variation management
- [Background and Environment](backgrounds.md) - Environmental context for templates
- [Human Attributes](../core/human-attributes.md) - Available attributes for templates
- [Core Entities](../core/entities.md) - Basic entity types for templates

## Usage Examples

### Basic Template Usage
```sitl
DEFINE TEMPLATE "Office_Worker":
  PERSON WITH ATTIRE(STYLE: BUSINESS_CASUAL, COLOR: $color)

USE TEMPLATE "Office_Worker" WITH color: NAVY_BLUE
```

### Complex Template with Multiple Parameters
```sitl
DEFINE TEMPLATE "Emergency_Responder":
  PERSON WITH UNIFORM(TYPE: $service, COLOR: $color, RANK: $rank)
  EQUIPMENT(RADIO: true, VEHICLE: $vehicle_type)
  TRAINING(CERTIFICATION: $cert_level)

USE TEMPLATE "Emergency_Responder" WITH:
  service: FIRE_DEPARTMENT
  color: RED
  rank: LIEUTENANT
  vehicle_type: FIRE_TRUCK
  cert_level: ADVANCED
```

### Template Inheritance Example
```sitl
DEFINE TEMPLATE "Medical_Professional" EXTENDS "Professional_Worker":
  UNIFORM(TYPE: MEDICAL, COLOR: WHITE)
  EQUIPMENT(STETHOSCOPE: true, ID_BADGE: MEDICAL)

DEFINE TEMPLATE "Surgeon" EXTENDS "Medical_Professional":
  ATTIRE(SCRUBS: true, SURGICAL_CAP: true)
  EQUIPMENT(SURGICAL_TOOLS: $specialty)
  ENVIRONMENT(LOCATION: OPERATING_ROOM)

USE TEMPLATE "Surgeon" WITH specialty: CARDIAC
```