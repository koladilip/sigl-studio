grammar SITL;

// Parser Rules
scene: sceneHeader sceneBody EOF;

sceneHeader: 'scene' STRING '{';

sceneBody: (statement)* '}';

statement: 
    entityDeclaration
    | environmentDeclaration
    | actionDeclaration
    | positionStatement
    | attributeStatement
    ;

// Entity Declarations
entityDeclaration: entityType IDENTIFIER '{' (entityAttribute)* '}';

entityType: 'human' | 'object' | 'prop';

entityAttribute:
    'age' ':' NUMBER
    | 'gender' ':' STRING
    | 'height' ':' NUMBER
    | 'clothing' ':' STRING
    | 'emotion' ':' STRING
    | 'pose' ':' STRING
    | 'material' ':' STRING
    | 'color' ':' colorValue
    | 'size' ':' sizeValue
    | 'texture' ':' STRING
    | 'condition' ':' STRING
    | 'accessories' ':' '[' stringList? ']'
    ;

// Environment Declaration
environmentDeclaration: 'environment' '{' (environmentAttribute)* '}';

environmentAttribute:
    'lighting' ':' lightingValue
    | 'atmosphere' ':' STRING
    | 'background' ':' STRING
    | 'weather' ':' STRING
    | 'time' ':' STRING
    | 'props' ':' '[' stringList? ']'
    ;

// Actions
actionDeclaration: 'action' IDENTIFIER '{' (actionAttribute)* '}';

actionAttribute:
    'type' ':' STRING
    | 'target' ':' IDENTIFIER
    | 'duration' ':' NUMBER
    | 'intensity' ':' NUMBER
    | 'description' ':' STRING
    ;

// Positioning
positionStatement: 'position' IDENTIFIER 'at' positionValue;

positionValue:
    coordinatePosition
    | relativePosition
    | namedPosition
    ;

coordinatePosition: '(' NUMBER ',' NUMBER ')';

relativePosition: 
    'near' IDENTIFIER
    | 'behind' IDENTIFIER
    | 'in_front_of' IDENTIFIER
    | 'left_of' IDENTIFIER
    | 'right_of' IDENTIFIER
    | 'above' IDENTIFIER
    | 'below' IDENTIFIER
    ;

namedPosition:
    'center'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'foreground'
    | 'background'
    ;

// Attributes
attributeStatement: 'set' IDENTIFIER '.' attributeName 'to' attributeValue;

attributeName: IDENTIFIER;

attributeValue:
    STRING
    | NUMBER
    | colorValue
    | sizeValue
    | BOOLEAN
    ;

// Value Types
colorValue:
    hexColor
    | rgbColor
    | namedColor
    ;

hexColor: HEX_COLOR;

rgbColor: 'rgb' '(' NUMBER ',' NUMBER ',' NUMBER ')';

namedColor:
    'red' | 'green' | 'blue' | 'yellow' | 'orange' | 'purple'
    | 'pink' | 'brown' | 'black' | 'white' | 'gray' | 'grey'
    ;

sizeValue:
    'small' | 'medium' | 'large' | 'tiny' | 'huge'
    | NUMBER 'px'
    | NUMBER 'cm'
    | NUMBER '%'
    ;

lightingValue:
    'bright' | 'dim' | 'dark' | 'natural' | 'artificial'
    | 'warm' | 'cool' | 'harsh' | 'soft'
    ;

stringList: STRING (',' STRING)*;

// Lexer Rules
IDENTIFIER: [a-zA-Z_][a-zA-Z0-9_]*;

STRING: '"' (~["\r\n] | '\\"')* '"';

NUMBER: '-'? [0-9]+ ('.' [0-9]+)?;

BOOLEAN: 'true' | 'false';

HEX_COLOR: '#' [0-9a-fA-F]{3,6};

// Whitespace and Comments
WS: [ \t\r\n]+ -> skip;

BLOCK_COMMENT: '/*' .*? '*/' -> skip;

LINE_COMMENT: '//' ~[\r\n]* -> skip;

// Error handling for unknown characters
ERROR_CHAR: . ;