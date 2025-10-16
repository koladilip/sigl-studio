grammar SIGL;

// ============================================================================
// PARSER RULES
// ============================================================================

// Top-level program
program: (statement | comment)* EOF;

// Statements
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
    | commentLine
    ;

// DRAW command - Main entity creation
drawStatement:
    'DRAW' entityType attributeList? positionClause? ';'?
    ;

// Entity types
entityType:
    // Basic humans
    'MAN' | 'WOMAN' | 'BOY' | 'GIRL' | 'BABY' | 'PERSON' | 'CHILD'
    // Animals
    | 'ANIMAL' animalType
    // Objects
    | 'TREE' | 'HOUSE' | 'CAR' | 'BUILDING' | 'BOAT'
    // Educational (when extension loaded)
    | 'TEACHER' | 'STUDENT' | 'PROFESSOR' | 'INSTRUCTOR'
    | 'PRINCIPAL' | 'LIBRARIAN' | 'CUSTODIAN'
    // Hospital (when extension loaded)
    | 'DOCTOR' | 'NURSE' | 'PATIENT' | 'SURGEON'
    // Military (when extension loaded)
    | 'SOLDIER' | 'OFFICER' | 'GENERAL' | 'MARINE'
    // Generic
    | IDENTIFIER
    ;

animalType:
    'DOG' | 'CAT' | 'BIRD' | 'HORSE' | 'FISH'
    ;

// Attribute list
attributeList:
    'WITH' attribute ('AND' attribute)*
    ;

// Attributes
attribute:
    simpleAttribute
    | parameterizedAttribute
    | negatedAttribute
    ;

// Simple attributes (WITH AGE 30, WITH BLUE SHIRT)
simpleAttribute:
    'AGE' NUMBER
    | 'SIZE' sizeValue
    | colorValue ('SHIRT' | 'DRESS' | 'PANTS' | 'SKIRT' | 'HAIR' | 'EYES')
    | 'HAPPY' 'FACE'
    | 'SAD' 'FACE'
    | 'ANGRY' 'FACE'
    | 'SURPRISED' 'FACE'
    | 'NEUTRAL' 'FACE'
    | 'EXCITED' 'FACE'
    | bodyAttribute
    | clothingAttribute
    ;

// Negated attributes (WITHOUT SHIRT, NO PANTS)
negatedAttribute:
    ('WITHOUT' | 'NO') ('SHIRT' | 'PANTS' | 'SHOES' | 'HAT' | 'GLASSES')
    | 'BARE' 'TORSO'
    ;

// Body attributes
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

// Skin tones
skinTone:
    'LIGHT' | 'MEDIUM' | 'DARK' | 'OLIVE' | 'PALE' | 'TAN'
    ;

// Clothing attributes
clothingAttribute:
    colorValue ('SHIRT' | 'DRESS' | 'PANTS' | 'SKIRT')
    | 'BUSINESS_SUIT'
    | 'CASUAL_WEAR'
    | 'FORMAL_ATTIRE'
    | 'UNIFORM'
    | 'SPORTSWEAR'
    ;

// Parameterized attributes (HAIR(COLOR: BROWN, STYLE: SHORT))
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

// Position clause
positionClause:
    'AT' position
    | relativePosition
    ;

// Position types
position:
    // Named positions
    'LEFT' | 'RIGHT' | 'CENTER' | 'TOP' | 'BOTTOM'
    | 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT'
    | 'FAR_LEFT' | 'FAR_RIGHT' | 'CENTER_LEFT' | 'CENTER_RIGHT'
    | 'UPPER' | 'MIDDLE' | 'LOWER'
    | 'FOREGROUND' | 'BACKGROUND'
    // Coordinates
    | 'POSITION' NUMBER ',' NUMBER
    | '(' NUMBER ',' NUMBER ')'
    // Grid positions
    | 'GRID' NUMBER ',' NUMBER
    ;

// Relative positioning
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

// LOAD EXTENSION command
loadExtensionStatement:
    'LOAD' 'EXTENSION' extensionName ';'?
    ;

extensionName:
    'educational' | 'hospital' | 'military' | 'religious'
    | 'transportation' | 'court' | 'space'
    | IDENTIFIER
    ;

// DEFINE TEMPLATE command
defineTemplateStatement:
    'DEFINE' 'TEMPLATE' STRING ':' templateBody
    ;

templateBody:
    '{' (statement)* '}'
    | statement
    ;

// DEFINE VARIATION command
defineVariationStatement:
    'DEFINE' 'VARIATION' STRING ':' variationBody
    ;

variationBody:
    '{' (attribute)+ '}'
    | attribute
    ;

// CREATE SCENE command
createSceneStatement:
    'CREATE' 'SCENE' STRING ':' sceneBody
    ;

sceneBody:
    '{' (statement)* '}'
    ;

// ADD ENVIRONMENT command
addEnvironmentStatement:
    'ADD' 'ENVIRONMENT' environmentType ';'?
    ;

environmentType:
    'PARK' | 'OFFICE' | 'HOSPITAL' | 'SCHOOL' | 'BEACH' | 'FOREST' | 'CITY'
    | 'CLASSROOM' | 'LABORATORY' | 'COURTROOM' | 'AIRPORT'
    | 'INDOOR' | 'OUTDOOR'
    | IDENTIFIER
    ;

// UPDATE command
updateStatement:
    'UPDATE' entityReference 'WITH' attributeList ';'?
    ;

// ANIMATE command
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

// EXPORT command
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

// ============================================================================
// VALUE TYPES
// ============================================================================

// Colors
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
    HEX_COLOR
    ;

rgbColor:
    'RGB' '(' NUMBER ',' NUMBER ',' NUMBER ')'
    ;

// Sizes
sizeValue:
    'SMALL' | 'MEDIUM' | 'LARGE' | 'TINY' | 'HUGE'
    | 'EXTRA_LARGE' | 'EXTRA_SMALL'
    | NUMBER ('PX' | 'CM' | '%')?
    ;

// Comments
comment:
    LINE_COMMENT | BLOCK_COMMENT
    ;

commentLine:
    LINE_COMMENT
    ;

// ============================================================================
// LEXER RULES
// ============================================================================

// Keywords (case-insensitive handled in parser)
DRAW: 'DRAW';
WITH: 'WITH';
AND: 'AND';
AT: 'AT';

// Identifiers and literals
IDENTIFIER: [a-zA-Z_][a-zA-Z0-9_]*;

STRING: '"' (~["\r\n] | '\\"')* '"' | '\'' (~['\r\n] | '\\\'')* '\'';

NUMBER: '-'? [0-9]+ ('.' [0-9]+)?;

HEX_COLOR: '#' [0-9a-fA-F]{3,8};

// Comments
LINE_COMMENT: '//' ~[\r\n]* -> channel(HIDDEN);

BLOCK_COMMENT: '/*' .*? '*/' -> channel(HIDDEN);

// Whitespace
WS: [ \t\r\n]+ -> skip;

// Error handling
ERROR_CHAR: .;
