import { SIGLParser } from './src/parser/sigl-parser';

const line1 = 'DRAW MAN WITH BLUE SHIRT';
console.log('\n=== Regex Test for:', line1, '===');

// Test entity match
const entityMatch = line1.match(/^DRAW\s+(\w+)(?:\s+(\w+))?\s*/i);
console.log('Entity match:', entityMatch);
console.log('Remaining after entity:', line1.substring(entityMatch![0].length));

// Test WITH match
const remaining = line1.substring(entityMatch![0].length).trim();
console.log('Remaining trimmed:', remaining);
console.log('WITH match test:', remaining.match(/^\s*WITH\s+(.+)$/i));

const line2 = 'DRAW MAN AT LEFT';
console.log('\n=== Regex Test for:', line2, '===');
const entityMatch2 = line2.match(/^DRAW\s+(\w+)(?:\s+(\w+))?\s*/i);
const remaining2 = line2.substring(entityMatch2![0].length).trim();
console.log('Remaining:', remaining2);
console.log('AT match:', remaining2.match(/\s+(AT|NEXT\s+TO)\s+(.+)$/i));

// Now test actual parser
const parser = new SIGLParser();

console.log('\n\n=== PARSER Test 1: DRAW MAN WITH BLUE SHIRT ===');
const result1 = parser.parse('DRAW MAN WITH BLUE SHIRT');
console.log('Success:', result1.success);
console.log('Attributes:', JSON.stringify(result1.ast?.entities[0]?.attributes, null, 2));

