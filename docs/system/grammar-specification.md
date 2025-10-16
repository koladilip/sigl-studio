# SIGL Grammar Specification

**Version:** 1.0  
**Last Updated:** October 16, 2025  
**Status:** 🚧 Implementation in Progress

## Overview

This document provides the formal grammar specification for SIGL (Structured Image Generation Language). The grammar is defined using ANTLR4 notation and follows a top-down, hierarchical structure.

## Notation

- `UPPERCASE` - Terminal symbols (keywords, literals)
- `lowercase` - Non-terminal symbols (grammar rules)
- `'text'` - Literal text
- `|` - Alternatives (OR)
- `*` - Zero or more
- `+` - One or more
- `?` - Optional (zero or one)
- `[]` - Character class
- `()` - Grouping

## Grammar Structure

### Program Structure

```antlr
program: (statement | comment)* EOF;

statement:
    drawStatement
    | loadExtensionStatement
    | defineTemplateStatement
    | defineVariationStatement
    | createSceneStatement
    | addEnvironmentStatement
    | updateStatement
    | animateStatement
    | exportStatement
    ;
```

## Core Commands

### DRAW Statement

**Syntax:**
```antlr
drawStatement:
    'DRAW' entityType attributeList? positionClause? ';'?
    ;
```

**Purpose:** Create and render an entity in the scene

**Examples:**
```sigl
DRAW MAN
DRAW WOMAN WITH AGE 30
DRAW BOY WITH BLUE SHIRT AT LEFT
DRAW DOCTOR WITH WHITE COAT AND STETHOSCOPE NEXT TO PATIENT
```

### Entity Types

```antlr
entityType:
    // Basic humans
    'MAN' | 'WOMAN' | 'BOY' | 'GIRL' | 'BABY' | 'PERSON' | 'CHILD'
    
    // Animals
    | 'ANIMAL' animalType
    
    // Objects
    | 'TREE' | 'HOUSE' | 'CAR' | 'BUILDING' | 'BOAT'
    
    // Domain-specific (extension required)
    | 'TEACHER' | 'STUDENT' | 'PROFESSOR' | 'INSTRUCTOR'
    | 'DOCTOR' | 'NURSE' | 'PATIENT' | 'SURGEON'
    | 'SOLDIER' | 'OFFICER' | 'GENERAL' | 'MARINE'
    
    // Generic identifier
    | IDENTIFIER
    ;

animalType:
    'DOG' | 'CAT' | 'BIRD' | 'HORSE' | 'FISH'
    ;
```

**Implementation Status:**
- ✅ Basic humans (MAN, WOMAN, BOY, GIRL, BABY)
- ✅ Animals (ANIMAL DOG, ANIMAL CAT, etc.)
- 📋 Domain entities (require extensions)

## Attributes System

### Attribute List

```antlr
attributeList:
    'WITH' attribute ('AND' attribute)*
    ;

attribute:
    simpleAttribute
    | parameterizedAttribute
    | negatedAttribute
    ;
```

### Simple Attributes

```antlr
simpleAttribute:
    'AGE' NUMBER
    | 'SIZE' sizeValue
    | colorValue ('SHIRT' | 'DRESS' | 'PANTS' | 'SKIRT' | 'HAIR' | 'EYES')
    | emotionFace
    | bodyAttribute
    | clothingAttribute
    ;

emotionFace:
    ('HAPPY' | 'SAD' | 'ANGRY' | 'SURPRISED' | 'NEUTRAL' | 'EXCITED') 'FACE'
    ;

bodyAttribute:
    'TALL' 'HEIGHT'
    | 'SHORT' 'HEIGHT'
    | 'CURLY' 'HAIR'
    | 'LONG' 'HAIR'
    | 'BEARD'
    | 'GLASSES'
    | 'FRECKLES'
    | skinTone 'SKIN'
    ;

skinTone:
    'LIGHT' | 'MEDIUM' | 'DARK' | 'OLIVE' | 'PALE' | 'TAN'
    ;

clothingAttribute:
    colorValue ('SHIRT' | 'DRESS' | 'PANTS' | 'SKIRT')
    | 'BUSINESS_SUIT'
    | 'CASUAL_WEAR'
    | 'FORMAL_ATTIRE'
    | 'UNIFORM'
    | 'SPORTSWEAR'
    ;
```

**Examples:**
```sigl
WITH AGE 30
WITH SIZE LARGE
WITH BLUE SHIRT
WITH HAPPY FACE
WITH TALL HEIGHT
WITH LIGHT SKIN
WITH BUSINESS_SUIT
```

### Parameterized Attributes

```antlr
parameterizedAttribute:
    paramName '(' parameterList ')'
    ;

paramName:
    'HAIR' | 'EYES' | 'SKIN' | 'BUILD' | 'HEIGHT' | 'FACE'
    | 'SHIRT' | 'DRESS' | 'PANTS' | 'OUTFIT' | 'ATTIRE'
    | 'UNIFORM' | 'VARIATION'
    ;

parameterList:
    parameter (',' parameter)*
    ;

parameter:
    IDENTIFIER ':' (IDENTIFIER | NUMBER | STRING | colorValue)
    ;
```

**Examples:**
```sigl
HAIR(COLOR: BROWN, STYLE: SHORT, TEXTURE: WAVY)
EYES(COLOR: BLUE, SHADE: DEEP, EXPRESSION: INTENSE)
OUTFIT(SHIRT: BLUE, PANTS: BLACK, SHOES: BROWN, STYLE: BUSINESS)
BUILD(TYPE: MUSCULAR, FITNESS: ATHLETIC, POSTURE: CONFIDENT)
```

### Negated Attributes

```antlr
negatedAttribute:
    ('WITHOUT' | 'NO') ('SHIRT' | 'PANTS' | 'SHOES' | 'HAT' | 'GLASSES')
    | 'BARE' 'TORSO'
    ;
```

**Examples:**
```sigl
WITHOUT SHIRT
NO PANTS
BARE TORSO
```

**Use Cases:**
- Beach scenes
- Athletic/gym environments
- Medical examinations
- Artistic/figure studies

## Positioning System

### Position Clause

```antlr
positionClause:
    'AT' position
    | relativePosition
    ;
```

### Named Positions

```antlr
position:
    // Basic directional
    'LEFT' | 'RIGHT' | 'CENTER' | 'TOP' | 'BOTTOM'
    
    // Combined positions
    | 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT'
    
    // Extended positions
    | 'FAR_LEFT' | 'FAR_RIGHT' | 'CENTER_LEFT' | 'CENTER_RIGHT'
    | 'UPPER' | 'MIDDLE' | 'LOWER'
    | 'FOREGROUND' | 'BACKGROUND'
    
    // Coordinate-based
    | 'POSITION' NUMBER ',' NUMBER
    | '(' NUMBER ',' NUMBER ')'
    
    // Grid-based
    | 'GRID' NUMBER ',' NUMBER
    ;
```

**Examples:**
```sigl
AT LEFT
AT TOP_RIGHT
AT CENTER
AT POSITION 100, 200
AT (512, 384)
AT GRID 2, 3
```

**Coordinate System:**
- **Origin:** Top-left (0, 0) by default
- **Units:** Pixels for 2D rendering
- **X-axis:** Left to right (0 to width)
- **Y-axis:** Top to bottom (0 to height)
- **Z-index:** -1000 to 1000 (default: 0)

### Relative Positioning

```antlr
relativePosition:
    'NEXT' 'TO' entityReference
    | 'BEHIND' entityReference
    | 'IN' 'FRONT' 'OF' entityReference
    | 'LEFT' 'OF' entityReference
    | 'RIGHT' 'OF' entityReference
    | 'ABOVE' entityReference
    | 'BELOW' entityReference
    | 'NEAR' entityReference
    | positionDistance
    ;

positionDistance:
    relativePosition 'WITH' 'DISTANCE' NUMBER
    ;

entityReference:
    IDENTIFIER | 'MAN' | 'WOMAN' | 'PERSON'
    ;
```

**Examples:**
```sigl
NEXT TO MAN
BEHIND WOMAN
IN FRONT OF DOCTOR
LEFT OF TABLE
ABOVE HORIZON
NEAR TREE WITH DISTANCE 50
```

## Extension System

### LOAD EXTENSION Command

```antlr
loadExtensionStatement:
    'LOAD' 'EXTENSION' extensionName ';'?
    ;

extensionName:
    'educational' | 'hospital' | 'military' | 'religious'
    | 'transportation' | 'court' | 'space'
    | IDENTIFIER
    ;
```

**Examples:**
```sigl
LOAD EXTENSION educational
LOAD EXTENSION hospital
LOAD EXTENSION military
```

**Effect:** Makes domain-specific entities and attributes available

**Available Extensions:**
- `educational` - Teachers, students, classrooms
- `hospital` - Doctors, nurses, medical equipment
- `military` - Soldiers, officers, military vehicles
- `religious` - Religious figures, buildings
- `transportation` - Vehicles, pilots, drivers
- `court` - Judges, lawyers, courtrooms
- `space` - Astronauts, spacecraft

## Template System

### DEFINE TEMPLATE Command

```antlr
defineTemplateStatement:
    'DEFINE' 'TEMPLATE' STRING ':' templateBody
    ;

templateBody:
    '{' (statement)* '}'
    | statement
    ;
```

**Examples:**
```sigl
DEFINE TEMPLATE "office_worker":
    PERSON WITH ATTIRE(STYLE: BUSINESS, COLOR: NAVY)
    ACCESSORIES(BADGE: CORPORATE, BRIEFCASE: LEATHER)

DEFINE TEMPLATE "family_portrait": {
    DRAW MAN WITH AGE 35 AND BLUE SHIRT AT LEFT
    DRAW WOMAN WITH AGE 32 AND RED DRESS NEXT TO MAN
    DRAW CHILD WITH AGE 8 IN FRONT
}
```

### DEFINE VARIATION Command

```antlr
defineVariationStatement:
    'DEFINE' 'VARIATION' STRING ':' variationBody
    ;

variationBody:
    '{' (attribute)+ '}'
    | attribute
    ;
```

**Examples:**
```sigl
DEFINE VARIATION "professional_attire":
    OUTFIT(SHIRT: WHITE, PANTS: CHARCOAL, SHOES: BLACK)
    ACCESSORIES(TIE: NAVY, WATCH: LUXURY)

DEFINE VARIATION "casual_summer":
    OUTFIT(TOP: T_SHIRT, BOTTOM: SHORTS, SHOES: SNEAKERS)
    COLOR_SCHEME: BRIGHT
```

## Scene Management

### CREATE SCENE Command

```antlr
createSceneStatement:
    'CREATE' 'SCENE' STRING ':' sceneBody
    ;

sceneBody:
    '{' (statement)* '}'
    ;
```

**Example:**
```sigl
CREATE SCENE "hospital_checkup": {
    LOAD EXTENSION hospital
    ADD ENVIRONMENT EXAMINATION_ROOM
    DRAW DOCTOR WITH WHITE_COAT AT LEFT
    DRAW PATIENT WITH AGE 45 NEXT TO DOCTOR
    DRAW EXAMINATION_TABLE AT CENTER
}
```

### ADD ENVIRONMENT Command

```antlr
addEnvironmentStatement:
    'ADD' 'ENVIRONMENT' environmentType ';'?
    ;

environmentType:
    'PARK' | 'OFFICE' | 'HOSPITAL' | 'SCHOOL' | 'BEACH' | 'FOREST' | 'CITY'
    | 'CLASSROOM' | 'LABORATORY' | 'COURTROOM' | 'AIRPORT'
    | 'INDOOR' | 'OUTDOOR'
    | IDENTIFIER
    ;
```

**Examples:**
```sigl
ADD ENVIRONMENT PARK
ADD ENVIRONMENT CLASSROOM
ADD ENVIRONMENT HOSPITAL
```

## Animation System

### ANIMATE Command

```antlr
animateStatement:
    'ANIMATE' entityReference action animationParams? ';'?
    ;

action:
    'WALK' | 'RUN' | 'JUMP' | 'WAVE' | 'SIT' | 'STAND'
    | 'MOVE' | 'ROTATE' | 'SCALE' | 'FADE'
    | IDENTIFIER
    ;

animationParams:
    'FROM' position 'TO' position
    | 'WITH' animationAttribute ('AND' animationAttribute)*
    ;

animationAttribute:
    'DURATION' NUMBER ('S' | 'MS')?
    | 'SPEED' ('SLOW' | 'MEDIUM' | 'FAST')
    | 'REPEAT' (NUMBER | 'INFINITE')
    ;
```

**Examples:**
```sigl
ANIMATE MAN WALK FROM LEFT TO RIGHT
ANIMATE WOMAN WAVE WITH DURATION 2S
ANIMATE CAR MOVE WITH SPEED FAST AND REPEAT 3
```

## UPDATE Command

```antlr
updateStatement:
    'UPDATE' entityReference 'WITH' attributeList ';'?
    ;
```

**Examples:**
```sigl
UPDATE MAN WITH HAPPY FACE
UPDATE DOCTOR WITH SURGICAL_MASK
```

## Export System

### EXPORT Command

```antlr
exportStatement:
    'EXPORT' (STRING | 'SCENE')? 'AS' formatType exportOptions? ';'?
    ;

formatType:
    'PNG' | 'JPEG' | 'WEBP' | 'SVG' | 'PDF' | 'GIF'
    ;

exportOptions:
    'WITH' exportOption ('AND' exportOption)*
    ;

exportOption:
    'RESOLUTION' ':' resolution
    | 'QUALITY' ':' quality
    | 'DPI' ':' NUMBER
    ;

resolution:
    NUMBER 'x' NUMBER
    | 'HD' | 'FULL_HD' | '4K' | 'THUMBNAIL'
    ;

quality:
    'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA'
    | NUMBER
    ;
```

**Examples:**
```sigl
EXPORT AS PNG
EXPORT SCENE AS JPEG WITH RESOLUTION: 1920x1080 AND QUALITY: HIGH
EXPORT "family_portrait" AS PDF WITH DPI: 300
```

## Value Types

### Colors

```antlr
colorValue:
    namedColor
    | hexColor
    | rgbColor
    ;

namedColor:
    'RED' | 'GREEN' | 'BLUE' | 'YELLOW' | 'ORANGE' | 'PURPLE'
    | 'PINK' | 'BROWN' | 'BLACK' | 'WHITE' | 'GRAY' | 'GREY'
    | 'NAVY' | 'NAVY_BLUE' | 'CHARCOAL' | 'CHARCOAL_GRAY'
    | 'BLONDE' | 'BRUNETTE'
    ;

hexColor:
    HEX_COLOR  // '#' [0-9a-fA-F]{3,8}
    ;

rgbColor:
    'RGB' '(' NUMBER ',' NUMBER ',' NUMBER ')'
    ;
```

**Examples:**
```sigl
RED
#FF5733
RGB(255, 87, 51)
NAVY_BLUE
```

### Sizes

```antlr
sizeValue:
    'SMALL' | 'MEDIUM' | 'LARGE' | 'TINY' | 'HUGE'
    | 'EXTRA_LARGE' | 'EXTRA_SMALL'
    | NUMBER ('PX' | 'CM' | '%')?
    ;
```

**Examples:**
```sigl
MEDIUM
150PX
2.5CM
80%
```

## Lexical Rules

### Keywords

**Reserved Words:**
```
DRAW, WITH, AND, AT, LOAD, EXTENSION, DEFINE, TEMPLATE, VARIATION
CREATE, SCENE, ADD, ENVIRONMENT, UPDATE, ANIMATE, EXPORT, AS
FROM, TO, WITHOUT, NO, BARE
MAN, WOMAN, BOY, GIRL, BABY, PERSON, CHILD, ANIMAL
LEFT, RIGHT, CENTER, TOP, BOTTOM, NEXT, BEHIND, FRONT, OF
POSITION, GRID
```

**Case Sensitivity:** Keywords are case-sensitive (UPPERCASE required)

### Identifiers

```antlr
IDENTIFIER: [a-zA-Z_][a-zA-Z0-9_]*
```

**Rules:**
- Must start with letter or underscore
- Can contain letters, numbers, underscores
- Case-sensitive
- Cannot be a reserved keyword

**Valid:**
- `myEntity`
- `entity_1`
- `_private`

**Invalid:**
- `123entity` (starts with number)
- `my-entity` (contains hyphen)
- `DRAW` (reserved keyword)

### Literals

```antlr
STRING: '"' (~["\r\n] | '\\"')* '"' 
      | '\'' (~['\r\n] | '\\\'')* '\''

NUMBER: '-'? [0-9]+ ('.' [0-9]+)?

HEX_COLOR: '#' [0-9a-fA-F]{3,8}
```

**Examples:**
```sigl
"Hello World"      // Double-quoted string
'Single quotes'    // Single-quoted string
42                 // Integer
3.14159           // Decimal
-10               // Negative number
#FF5733           // Hex color (6 digits)
#F53              // Hex color (3 digits)
```

### Comments

```antlr
LINE_COMMENT: '//' ~[\r\n]*
BLOCK_COMMENT: '/*' .*? '*/'
```

**Examples:**
```sigl
// This is a line comment

/* This is a
   block comment */

DRAW MAN  // Inline comment
```

### Whitespace

```antlr
WS: [ \t\r\n]+ -> skip
```

Whitespace (spaces, tabs, newlines) is ignored between tokens.

## Type System

### Primitive Types

| Type | Description | Examples |
|------|-------------|----------|
| `NUMBER` | Integer or floating point | `42`, `3.14`, `-10` |
| `STRING` | Text in quotes | `"hello"`, `'world'` |
| `BOOLEAN` | True/false (future) | `true`, `false` |
| `COLOR` | Color value | `RED`, `#FF5733`, `RGB(255,0,0)` |

### Complex Types

| Type | Description | Syntax |
|------|-------------|--------|
| `POSITION` | 2D/3D coordinates | `(x, y)`, `(x, y, z)`, `LEFT`, `GRID 2,3` |
| `ATTRIBUTE_MAP` | Key-value pairs | `HAIR(COLOR: BROWN, STYLE: SHORT)` |
| `ENTITY_REFERENCE` | Reference to entity | `@identifier`, `MAN`, `WOMAN` |

### Type Coercion Rules

1. **NUMBER to STRING:** Automatic conversion when needed
   ```sigl
   AGE 30  // NUMBER
   NAME "John"  // STRING
   ```

2. **COLOR normalization:**
   ```sigl
   RED → #FF0000
   RGB(255,0,0) → #FF0000
   ```

3. **POSITION resolution:**
   ```sigl
   LEFT → (calculated based on scene width)
   GRID 2,3 → (calculated based on grid size)
   ```

## Operator Precedence

| Precedence | Operator | Associativity |
|------------|----------|---------------|
| 1 (highest) | `()` (grouping) | N/A |
| 2 | `:` (parameter assignment) | Right-to-left |
| 3 | `,` (parameter separator) | Left-to-right |
| 4 | `AND` (attribute conjunction) | Left-to-right |
| 5 (lowest) | Statement separator | Left-to-right |

## Error Handling

### Syntax Errors

**Undefined Entity:**
```sigl
DRAW UNICORN  // Error: Unknown entity 'UNICORN'
              // Suggestion: Did you mean: ANIMAL HORSE, PERSON?
```

**Missing Required Parameter:**
```sigl
HAIR(COLOR: BROWN)  // Valid
HAIR()              // Error: Missing required parameters
```

**Invalid Position:**
```sigl
AT MIDDLE_BOTTOM    // Error: Invalid position
                    // Suggestion: Did you mean: BOTTOM, MIDDLE?
```

### Semantic Errors

**Context Validation:**
```sigl
ADD ENVIRONMENT OFFICE
DRAW MAN WITH SWIMWEAR  // Warning: Swimwear inappropriate for office
                        // Suggestion: Consider BUSINESS_SUIT, CASUAL_WEAR
```

**Extension Required:**
```sigl
DRAW DOCTOR  // Error: DOCTOR entity requires hospital extension
             // Suggestion: Add 'LOAD EXTENSION hospital' before this line
```

## Grammar Evolution

### Version History

- **v1.0** (Oct 2025) - Initial grammar specification
  - Basic entity system
  - Attribute system with parameterization
  - Positioning and layout
  - Extension system foundation

### Planned Extensions

- **v1.1** - Animation enhancements
- **v1.2** - Advanced templating
- **v1.3** - Conditional logic
- **v1.4** - Variables and expressions

## Implementation Notes

### Parser Generation

```bash
# Generate TypeScript parser from grammar
npx antlr4 -Dlanguage=TypeScript -visitor -no-listener \
  src/parser/grammar/SIGL.g4 -o src/parser/generated
```

### Integration Points

1. **Lexer:** Tokenization of SIGL source
2. **Parser:** Syntax tree construction
3. **Visitor:** AST traversal and processing
4. **Validator:** Semantic validation
5. **Executor:** Scene generation

## Best Practices

### Grammar Guidelines

1. **Use semantic names** for rules (not generic `statement1`, `statement2`)
2. **Group related alternatives** in same rule
3. **Prefer left-recursion** for better error recovery
4. **Include optional semicolons** for flexibility
5. **Support both quoted string types** (" and ')

### Syntax Design Principles

1. **Natural language style** - Readable by non-programmers
2. **Consistent patterns** - Similar concepts use similar syntax
3. **Progressive disclosure** - Simple cases are simple, complex cases possible
4. **Error-friendly** - Easy to understand and fix errors
5. **Extension-ready** - New features don't break existing code

## References

- [ANTLR4 Documentation](https://github.com/antlr/antlr4/blob/master/doc/index.md)
- [SIGL Language Specification](../README.md)
- [Extension Development Guide](../features/advanced.md)

---

**Maintained by:** SIGL Team  
**Last Grammar Update:** SIGL.g4 v1.0

