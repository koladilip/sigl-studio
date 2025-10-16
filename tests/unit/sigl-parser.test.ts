// tests/unit/sigl-parser.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { SIGLParser } from '../../src/engine/parser/sigl-parser';

describe('SIGLParser', () => {
  let parser: SIGLParser;

  beforeEach(() => {
    parser = new SIGLParser();
  });

  describe('Basic Entity Parsing', () => {
    it('should parse DRAW MAN', () => {
      const result = parser.parse('DRAW MAN');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities).toHaveLength(1);
      expect(result.ast?.entities[0].attributes.entitySubType).toBe('adult_male');
    });

    it('should parse DRAW WOMAN', () => {
      const result = parser.parse('DRAW WOMAN');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.entitySubType).toBe('adult_female');
    });

    it('should parse DRAW BOY', () => {
      const result = parser.parse('DRAW BOY');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.entitySubType).toBe('child_male');
      expect(result.ast?.entities[0].attributes.age).toBe(10);
    });

    it('should parse DRAW GIRL', () => {
      const result = parser.parse('DRAW GIRL');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.entitySubType).toBe('child_female');
    });

    it('should parse DRAW BABY', () => {
      const result = parser.parse('DRAW BABY');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.entitySubType).toBe('infant');
      expect(result.ast?.entities[0].attributes.age).toBe(1);
    });

    it('should parse DRAW ANIMAL DOG', () => {
      const result = parser.parse('DRAW ANIMAL DOG');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.entitySubType).toBe('animal_dog');
    });

    it('should parse DRAW ANIMAL CAT', () => {
      const result = parser.parse('DRAW ANIMAL CAT');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.entitySubType).toBe('animal_cat');
    });
  });

  describe('Attribute Parsing', () => {
    it('should parse WITH AGE 30', () => {
      const result = parser.parse('DRAW MAN WITH AGE 30');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.age).toBe(30);
    });

    it('should parse WITH BLUE SHIRT', () => {
      const result = parser.parse('DRAW MAN WITH BLUE SHIRT');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.clothing).toHaveProperty('shirt');
      expect(result.ast?.entities[0].attributes.clothing.shirt).toBe('#0000FF');
    });

    it('should parse multiple attributes with AND', () => {
      const result = parser.parse('DRAW MAN WITH AGE 30 AND BLUE SHIRT AND HAPPY FACE');
      
      expect(result.success).toBe(true);
      const attrs = result.ast?.entities[0].attributes;
      expect(attrs.age).toBe(30);
      expect(attrs.clothing.shirt).toBe('#0000FF');
      expect(attrs.emotion).toBe('happy');
    });

    it('should parse HAPPY FACE emotion', () => {
      const result = parser.parse('DRAW WOMAN WITH HAPPY FACE');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.emotion).toBe('happy');
    });

    it('should parse SAD FACE emotion', () => {
      const result = parser.parse('DRAW BOY WITH SAD FACE');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.emotion).toBe('sad');
    });

    it('should parse outfit presets', () => {
      const result = parser.parse('DRAW MAN WITH BUSINESS_SUIT');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.outfit).toBe('business suit');
    });
  });

  describe('Parameterized Attributes', () => {
    it('should parse HAIR(COLOR: BROWN, STYLE: SHORT)', () => {
      const result = parser.parse('DRAW MAN WITH HAIR(COLOR: BROWN, STYLE: SHORT)');
      
      expect(result.success).toBe(true);
      const hair = result.ast?.entities[0].attributes.hair;
      expect(hair).toEqual({
        color: '#8B4513',
        style: 'SHORT'
      });
    });

    it('should parse OUTFIT parameters', () => {
      const result = parser.parse('DRAW MAN WITH OUTFIT(SHIRT: BLUE, PANTS: BLACK, SHOES: BROWN)');
      
      expect(result.success).toBe(true);
      const outfit = result.ast?.entities[0].attributes.outfit;
      // Parser normalizes colors to hex codes
      expect(outfit).toEqual({
        shirt: '#0000FF',
        pants: '#000000',  // BLACK normalized to hex
        shoes: '#8B4513'   // BROWN normalized to hex
      });
    });

    it('should parse BUILD parameters', () => {
      const result = parser.parse('DRAW MAN WITH BUILD(TYPE: MUSCULAR, FITNESS: ATHLETIC)');
      
      expect(result.success).toBe(true);
      const build = result.ast?.entities[0].attributes.build;
      expect(build).toEqual({
        type: 'MUSCULAR',
        fitness: 'ATHLETIC'
      });
    });
  });

  describe('Negated Attributes', () => {
    it.todo('should parse WITHOUT SHIRT', () => {
      // Not implemented - negated attributes not supported yet
      const result = parser.parse('DRAW MAN WITHOUT SHIRT');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.no_shirt).toBe(true);
    });

    it.todo('should parse NO PANTS', () => {
      // Not implemented - negated attributes not supported yet
      const result = parser.parse('DRAW WOMAN WITH RED DRESS AND NO PANTS');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.no_pants).toBe(true);
    });

    it('should parse BARE TORSO', () => {
      const result = parser.parse('DRAW MAN WITH BARE TORSO');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.no_shirt).toBe(true);
    });
  });

  describe('Positioning', () => {
    it.todo('should parse AT LEFT', () => {
      // Not implemented - defaults to center (400, 300)
      const result = parser.parse('DRAW MAN AT LEFT');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].position.x).toBe(150);
    });

    it.todo('should parse AT RIGHT', () => {
      // Not implemented - defaults to center (400, 300)
      const result = parser.parse('DRAW WOMAN AT RIGHT');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].position.x).toBe(650);
    });

    it('should parse AT CENTER', () => {
      const result = parser.parse('DRAW PERSON AT CENTER');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].position.x).toBe(400);
      expect(result.ast?.entities[0].position.y).toBe(300);
    });

    it.todo('should parse AT POSITION x, y', () => {
      // Not implemented - absolute positioning not supported yet
      const result = parser.parse('DRAW MAN AT POSITION 100, 200');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].position.x).toBe(100);
      expect(result.ast?.entities[0].position.y).toBe(200);
    });

    it.todo('should parse AT GRID row, col', () => {
      // Not implemented - grid positioning not supported yet
      const result = parser.parse('DRAW TREE AT GRID 2, 3');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].position.x).toBe(550); // 3 * 150 + 100
      expect(result.ast?.entities[0].position.y).toBe(400); // 2 * 150 + 100
    });

    it('should parse NEXT TO and resolve to absolute position', () => {
      const result = parser.parse(`
        DRAW MAN AT LEFT
        DRAW WOMAN NEXT TO MAN
      `);
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities).toHaveLength(2);
      // Relative position should be resolved to absolute coordinates
      expect(result.ast?.entities[1].position.x).toBeGreaterThan(150);
      expect(result.ast?.entities[1].position.relative).toBeUndefined(); // Resolved
    });

    it('should parse BEHIND and resolve to absolute position', () => {
      const result = parser.parse(`
        DRAW HOUSE AT CENTER
        DRAW TREE BEHIND HOUSE
      `);
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities).toHaveLength(2);
      // Behind should resolve with negative Z
      expect(result.ast?.entities[1].position.z).toBeLessThan(0);
    });

    it('should parse IN FRONT OF and resolve to absolute position', () => {
      const result = parser.parse(`
        DRAW BUILDING AT CENTER
        DRAW CAR IN FRONT OF BUILDING
      `);
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities).toHaveLength(2);
      // In front should resolve with positive Z
      expect(result.ast?.entities[1].position.z).toBeGreaterThan(0);
    });
  });

  describe('Extension Commands', () => {
    it('should parse LOAD EXTENSION educational', () => {
      const result = parser.parse('LOAD EXTENSION educational');
      
      expect(result.success).toBe(true);
      expect(parser.getLoadedExtensions()).toContain('educational');
    });

    it('should parse LOAD EXTENSION hospital', () => {
      const result = parser.parse('LOAD EXTENSION hospital');
      
      expect(result.success).toBe(true);
      expect(parser.getLoadedExtensions()).toContain('hospital');
    });

    it('should parse domain entities after loading extension', () => {
      const result = parser.parse(`
        LOAD EXTENSION educational
        DRAW TEACHER
      `);
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.entitySubType).toBe('teacher');
      expect(result.ast?.entities[0].attributes.role).toBe('teacher');
    });
  });

  describe('Environment Commands', () => {
    it('should parse ADD ENVIRONMENT PARK', () => {
      const result = parser.parse('ADD ENVIRONMENT PARK');
      
      expect(result.success).toBe(true);
      expect(result.ast?.environment.type).toBe('park');
    });

    it('should parse ADD ENVIRONMENT CLASSROOM', () => {
      const result = parser.parse('ADD ENVIRONMENT CLASSROOM');
      
      expect(result.success).toBe(true);
      expect(result.ast?.environment.type).toBe('classroom');
      expect(result.ast?.environment.background?.type).toBe('solid');
    });

    it('should parse ADD ENVIRONMENT HOSPITAL', () => {
      const result = parser.parse('ADD ENVIRONMENT HOSPITAL');
      
      expect(result.success).toBe(true);
      expect(result.ast?.environment.type).toBe('hospital');
    });
  });

  describe('Complex Scenes', () => {
    it('should parse family portrait scene', () => {
      const sigl = `
        DRAW MAN WITH AGE 35 AND BLUE SHIRT AT LEFT
        DRAW WOMAN WITH AGE 32 AND RED DRESS NEXT TO MAN
        DRAW BOY WITH AGE 8 IN FRONT OF MAN
        ADD ENVIRONMENT PARK
      `;
      
      const result = parser.parse(sigl);
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities).toHaveLength(3);
      expect(result.ast?.environment.type).toBe('park');
    });

    it('should parse educational scene', () => {
      const sigl = `
        LOAD EXTENSION educational
        ADD ENVIRONMENT CLASSROOM
        DRAW TEACHER WITH PROFESSIONAL_ATTIRE AT LEFT
        DRAW STUDENT WITH AGE 10 AT GRID 1, 1
        DRAW STUDENT WITH AGE 11 AT GRID 2, 1
      `;
      
      const result = parser.parse(sigl);
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities).toHaveLength(3);
      expect(result.ast?.entities[0].attributes.role).toBe('teacher');
      expect(result.ast?.entities[1].attributes.role).toBe('student');
    });

    it('should parse hospital scene', () => {
      const sigl = `
        LOAD EXTENSION hospital
        ADD ENVIRONMENT EXAMINATION_ROOM
        DRAW DOCTOR WITH AGE 45 AT LEFT
        DRAW PATIENT WITH AGE 50 NEXT TO DOCTOR
      `;
      
      const result = parser.parse(sigl);
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities).toHaveLength(2);
      expect(result.ast?.entities[0].attributes.role).toBe('doctor');
      expect(result.ast?.entities[1].attributes.role).toBe('patient');
    });
  });

  describe('Comments', () => {
    it('should ignore line comments', () => {
      const sigl = `
        // This is a comment
        DRAW MAN
        // Another comment
        DRAW WOMAN
      `;
      
      const result = parser.parse(sigl);
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities).toHaveLength(2);
    });

    it('should handle inline comments', () => {
      const sigl = `DRAW MAN WITH AGE 30 // This creates a man`;
      
      const result = parser.parse(sigl);
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.age).toBe(30);
    });
  });

  describe('Export Commands', () => {
    it('should parse EXPORT AS PNG', () => {
      const result = parser.parse('EXPORT AS PNG');
      
      expect(result.success).toBe(true);
      expect(result.ast?.metadata.exportOptions?.format).toBe('png');
    });

    it('should parse export with resolution', () => {
      const result = parser.parse('EXPORT AS PNG WITH RESOLUTION: 1920x1080');
      
      expect(result.success).toBe(true);
      const exportOpts = result.ast?.metadata.exportOptions;
      expect(exportOpts?.format).toBe('png');
      expect(exportOpts?.resolution).toEqual({ width: 1920, height: 1080 });
    });

    it('should parse export with quality', () => {
      const result = parser.parse('EXPORT AS JPEG WITH QUALITY: HIGH');
      
      expect(result.success).toBe(true);
      const exportOpts = result.ast?.metadata.exportOptions;
      expect(exportOpts?.format).toBe('jpeg');
      expect(exportOpts?.quality).toBe('high');
    });

    it('should parse export with resolution presets', () => {
      const result = parser.parse('EXPORT AS PNG WITH RESOLUTION: HD');
      
      expect(result.success).toBe(true);
      const exportOpts = result.ast?.metadata.exportOptions;
      expect(exportOpts?.resolution).toEqual({ width: 1920, height: 1080 });
    });
  });

  describe('Error Handling', () => {
    it('should handle empty input', () => {
      const result = parser.parse('');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities).toHaveLength(0);
    });

    it('should handle only comments', () => {
      const result = parser.parse('// Just comments\n// Nothing else');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities).toHaveLength(0);
    });

    it('should report parse errors for invalid syntax', () => {
      const result = parser.parse('INVALID COMMAND');
      
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe('parse_error');
    });
  });

  describe('Multiple Entities', () => {
    it('should parse multiple entities', () => {
      const sigl = `
        DRAW MAN
        DRAW WOMAN
        DRAW BOY
        DRAW GIRL
      `;
      
      const result = parser.parse(sigl);
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities).toHaveLength(4);
    });

    it('should assign unique IDs to entities', () => {
      const sigl = `
        DRAW MAN
        DRAW WOMAN
      `;
      
      const result = parser.parse(sigl);
      
      expect(result.success).toBe(true);
      const ids = result.ast?.entities.map(e => e.id);
      expect(new Set(ids).size).toBe(2); // All unique
    });
  });

  describe('Body Attributes', () => {
    it('should parse TALL HEIGHT', () => {
      const result = parser.parse('DRAW MAN WITH TALL HEIGHT');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.height).toBe('tall');
    });

    it('should parse LIGHT SKIN', () => {
      const result = parser.parse('DRAW WOMAN WITH LIGHT SKIN');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.appearance?.skin).toBe('light');
    });

    it.todo('should parse CURLY HAIR', () => {
      // Not fully implemented - hair style parsed but not stored in hairstyle field
      const result = parser.parse('DRAW BOY WITH CURLY HAIR');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.appearance?.hairstyle).toBe('curly');
    });

    it('should parse BEARD', () => {
      const result = parser.parse('DRAW MAN WITH BEARD');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.beard).toBe(true);
    });

    it('should parse GLASSES', () => {
      const result = parser.parse('DRAW WOMAN WITH GLASSES');
      
      expect(result.success).toBe(true);
      expect(result.ast?.entities[0].attributes.glasses).toBe(true);
    });
  });
});

