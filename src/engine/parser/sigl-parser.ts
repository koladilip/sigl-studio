// src/parser/sigl-parser-new.ts
/**
 * SIGL Parser - Hand-written TypeScript parser for natural language syntax
 * No ANTLR needed - simpler, faster, better error messages!
 */

import type { 
  SceneDefinition, 
  EntityDefinition, 
  SIGLError,
  PositionDefinition 
} from '../core/types';

export interface ParseResult {
  success: boolean;
  ast?: SceneDefinition;
  errors: SIGLError[];
}

export interface ParsedAttribute {
  name: string;
  value: any;
  parameters?: Record<string, any>;
}

export class SIGLParser {
  private entityCounter = 0;
  private loadedExtensions = new Set<string>();
  private scene: SceneDefinition | null = null;

  /**
   * Parse SIGL source code into AST
   */
  parse(source: string): ParseResult {
    try {
      // Initialize scene
      this.scene = this.createEmptyScene();
      const errors: SIGLError[] = [];

      // Split into lines and remove comments
      const lines = source
        .split('\n')
        .map(line => {
          // Remove inline comments
          const commentIndex = line.indexOf('//');
          if (commentIndex >= 0) {
            return line.substring(0, commentIndex);
          }
          return line;
        })
        .map(line => line.trim())
        .filter(line => line.length > 0);

      // Parse each statement
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNumber = i + 1;

        try {
          this.parseStatement(line);
        } catch (error) {
          errors.push({
            type: 'parse_error',
            code: 'PARSE_ERROR',
            message: error instanceof Error ? error.message : 'Unknown parse error',
            line: lineNumber,
            column: 0
          });
        }
      }

      // Resolve relative positions after all entities are parsed
      if (this.scene && errors.length === 0) {
        this.resolveRelativePositions();
      }

      return {
        success: errors.length === 0,
        ast: this.scene,
        errors
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          type: 'parse_error',
          code: 'FATAL_PARSE_ERROR',
          message: error instanceof Error ? error.message : 'Fatal parsing error',
          line: 0,
          column: 0
        }]
      };
    } finally {
      this.reset();
    }
  }

  /**
   * Parse a single statement
   */
  private parseStatement(line: string): void {
    if (!this.scene) return;

    // LOAD EXTENSION
    if (line.match(/^LOAD\s+EXTENSION\s+/i)) {
      this.parseLoadExtension(line);
      return;
    }

    // ADD ENVIRONMENT
    if (line.match(/^ADD\s+ENVIRONMENT\s+/i)) {
      this.parseAddEnvironment(line);
      return;
    }

    // DRAW command
    if (line.match(/^DRAW\s+/i)) {
      const entity = this.parseDraw(line);
      this.scene.entities.push(entity);
      return;
    }

    // UPDATE command
    if (line.match(/^UPDATE\s+/i)) {
      this.parseUpdate(line);
      return;
    }

    // EXPORT command
    if (line.match(/^EXPORT\s+/i)) {
      this.parseExport(line);
      return;
    }

    // Unknown statement
    throw new Error(`Unknown statement: ${line.substring(0, 50)}`);
  }

  /**
   * Parse DRAW statement
   * Syntax: DRAW <entity> [WITH <attributes>] [AT/NEXT TO/BEHIND <position>]
   */
  private parseDraw(line: string): EntityDefinition {
    // Extract entity type (don't consume WITH/AT keywords)
    let entityType: string;
    let remainingLine: string;
    
    // Check for ANIMAL <type> first
    const animalMatch = line.match(/^DRAW\s+ANIMAL\s+(\w+)\s*/i);
    if (animalMatch) {
      entityType = `ANIMAL_${animalMatch[1].toUpperCase()}`;
      remainingLine = line.substring(animalMatch[0].length).trim();
    } else {
      // Regular entity
      const entityMatch = line.match(/^DRAW\s+(\w+)\s*/i);
      if (!entityMatch) {
        throw new Error('Invalid DRAW statement');
      }
      entityType = entityMatch[1].toUpperCase();
      remainingLine = line.substring(entityMatch[0].length).trim();
    }

    // Parse attributes (WITH ... AND ...) and position
    const attributes = new Map<string, any>();
    let position: PositionDefinition = { x: 400, y: 300 }; // Default center

    // Check for position clause
    const positionMatch = remainingLine.match(/\s+(AT|NEXT\s+TO|BEHIND|IN\s+FRONT\s+OF|LEFT\s+OF|RIGHT\s+OF|ABOVE|BELOW|NEAR)\s+(.+?)(?:\s+WITH\s+DISTANCE\s+(\d+))?$/i);
    
    let attributeString = remainingLine;
    if (positionMatch) {
      // Extract attributes before position
      const posIndex = positionMatch.index || 0;
      attributeString = remainingLine.substring(0, posIndex).trim();
      
      // Parse position
      const posType = positionMatch[1].replace(/\s+/g, '_').toUpperCase();
      const posValue = positionMatch[2].trim();
      const distance = positionMatch[3] ? parseInt(positionMatch[3]) : undefined;
      position = this.parsePosition(posType, posValue, distance);
    }

    // Parse attributes if WITH clause exists
    const withMatch = attributeString.match(/^\s*WITH\s+(.+)$/i);
    if (withMatch) {
      this.parseAttributes(withMatch[1].trim(), attributes);
    }

    // Create entity
    return this.createEntity(entityType, attributes, position);
  }

  /**
   * Parse attributes from WITH clause
   */
  private parseAttributes(attrString: string, attributes: Map<string, any>): void {
    // Split by AND
    const parts = attrString.split(/\s+AND\s+/i);

    for (const part of parts) {
      const trimmed = part.trim();

      // AGE <number>
      if (trimmed.match(/^AGE\s+\d+/i)) {
        const match = trimmed.match(/^AGE\s+(\d+)/i);
        if (match) {
          attributes.set('age', parseInt(match[1]));
        }
        continue;
      }

      // SIZE <value>
      if (trimmed.match(/^SIZE\s+/i)) {
        const match = trimmed.match(/^SIZE\s+(\w+)/i);
        if (match) {
          attributes.set('size', match[1].toLowerCase());
        }
        continue;
      }

      // <color> SHIRT/DRESS/PANTS/SKIRT/HAIR/EYES
      const clothingMatch = trimmed.match(/^(\w+)\s+(SHIRT|DRESS|PANTS|SKIRT|HAIR|EYES)/i);
      if (clothingMatch) {
        const color = this.normalizeColor(clothingMatch[1]);
        const item = clothingMatch[2].toLowerCase();
        
        if (item === 'shirt' || item === 'dress' || item === 'pants' || item === 'skirt') {
          let clothing = attributes.get('clothing');
          if (!clothing) {
            clothing = {};
            attributes.set('clothing', clothing);
          }
          clothing[item] = color;
        } else if (item === 'hair') {
          let appearance = attributes.get('appearance');
          if (!appearance) {
            appearance = {};
            attributes.set('appearance', appearance);
          }
          appearance.hair = color;
        } else if (item === 'eyes') {
          let appearance = attributes.get('appearance');
          if (!appearance) {
            appearance = {};
            attributes.set('appearance', appearance);
          }
          appearance.eyes = color;
        }
        continue;
      }

      // Emotion: HAPPY FACE, SAD FACE, etc.
      const emotionMatch = trimmed.match(/^(HAPPY|SAD|ANGRY|SURPRISED|NEUTRAL|EXCITED)\s+FACE/i);
      if (emotionMatch) {
        attributes.set('emotion', emotionMatch[1].toLowerCase());
        continue;
      }

      // Parameterized attributes: HAIR(COLOR: BROWN, STYLE: SHORT)
      const paramMatch = trimmed.match(/^(\w+)\((.+)\)/i);
      if (paramMatch) {
        const name = paramMatch[1].toLowerCase();
        const params = this.parseParameters(paramMatch[2]);
        attributes.set(name, params);
        continue;
      }

      // Predefined outfits
      if (trimmed.match(/^(BUSINESS_SUIT|CASUAL_WEAR|FORMAL_ATTIRE|UNIFORM|SPORTSWEAR|PROFESSIONAL_ATTIRE)/i)) {
        attributes.set('outfit', trimmed.toLowerCase().replace(/_/g, ' '));
        continue;
      }

      // Body attributes
      if (trimmed.match(/^(TALL|SHORT)\s+HEIGHT/i)) {
        const match = trimmed.match(/^(\w+)\s+HEIGHT/i);
        if (match) {
          attributes.set('height', match[1].toLowerCase());
        }
        continue;
      }

      // Hair styles
      if (trimmed.match(/^(CURLY|LONG|SHORT|STRAIGHT)\s+HAIR/i)) {
        const match = trimmed.match(/^(\w+)\s+HAIR/i);
        if (match) {
          let appearance = attributes.get('appearance');
          if (!appearance) {
            appearance = {};
            attributes.set('appearance', appearance);
          }
          appearance.hairstyle = match[1].toLowerCase();
        }
        continue;
      }

      // Simple boolean attributes
      if (trimmed.match(/^(BEARD|GLASSES|FRECKLES)/i)) {
        attributes.set(trimmed.toLowerCase(), true);
        continue;
      }

      // Skin tone
      const skinMatch = trimmed.match(/^(LIGHT|MEDIUM|DARK|OLIVE|PALE|TAN)\s+SKIN/i);
      if (skinMatch) {
        let appearance = attributes.get('appearance');
        if (!appearance) {
          appearance = {};
          attributes.set('appearance', appearance);
        }
        appearance.skin = skinMatch[1].toLowerCase();
        continue;
      }

      // WITHOUT/NO attributes (clothing toggle)
      const negatedMatch = trimmed.match(/^(WITHOUT|NO)\s+(\w+)/i);
      if (negatedMatch) {
        const item = negatedMatch[2].toLowerCase();
        attributes.set(`no_${item}`, true);
        continue;
      }

      // BARE TORSO
      if (trimmed.match(/^BARE\s+TORSO/i)) {
        attributes.set('no_shirt', true);
        continue;
      }
    }
  }

  /**
   * Parse parameters from parameterized attributes
   */
  private parseParameters(paramString: string): Record<string, any> {
    const params: Record<string, any> = {};
    const parts = paramString.split(',').map(p => p.trim());

    for (const part of parts) {
      const match = part.match(/^(\w+)\s*:\s*(.+)/);
      if (match) {
        const key = match[1].toLowerCase();
        let value: any = match[2].trim();

        // Parse numbers
        if (/^\d+(\.\d+)?$/.test(value)) {
          value = parseFloat(value);
        }
        // Remove quotes
        else if ((value.startsWith('"') && value.endsWith('"')) ||
                 (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        // Normalize colors
        else if (this.isColor(value)) {
          value = this.normalizeColor(value);
        }

        params[key] = value;
      }
    }

    return params;
  }

  /**
   * Parse position clause
   */
  private parsePosition(posType: string, posValue: string, distance?: number): PositionDefinition {
    // Named positions
    const namedPositions: Record<string, PositionDefinition> = {
      'LEFT': { x: 150, y: 300 },
      'RIGHT': { x: 650, y: 300 },
      'CENTER': { x: 400, y: 300 },
      'TOP': { x: 400, y: 100 },
      'BOTTOM': { x: 400, y: 500 },
      'TOP_LEFT': { x: 150, y: 100 },
      'TOP_RIGHT': { x: 650, y: 100 },
      'BOTTOM_LEFT': { x: 150, y: 500 },
      'BOTTOM_RIGHT': { x: 650, y: 500 },
      'FAR_LEFT': { x: 50, y: 300 },
      'FAR_RIGHT': { x: 750, y: 300 },
      'CENTER_LEFT': { x: 200, y: 300 },
      'CENTER_RIGHT': { x: 600, y: 300 },
      'UPPER': { x: 400, y: 150 },
      'MIDDLE': { x: 400, y: 300 },
      'LOWER': { x: 400, y: 450 },
      'FOREGROUND': { x: 400, y: 300, z: 100 },
      'BACKGROUND': { x: 400, y: 300, z: -100 }
    };

    // AT <named position>
    if (posType === 'AT') {
      const upperPos = posValue.toUpperCase();
      
      // Check named positions
      if (namedPositions[upperPos]) {
        return { ...namedPositions[upperPos] };
      }

      // POSITION x, y or (x, y)
      const coordMatch = posValue.match(/(?:POSITION\s+)?(?:\()?(\d+)\s*,\s*(\d+)(?:\))?/i);
      if (coordMatch) {
        return {
          x: parseInt(coordMatch[1]),
          y: parseInt(coordMatch[2])
        };
      }

      // GRID row, col
      const gridMatch = posValue.match(/GRID\s+(\d+)\s*,\s*(\d+)/i);
      if (gridMatch) {
        const row = parseInt(gridMatch[1]);
        const col = parseInt(gridMatch[2]);
        return {
          x: col * 150 + 100,
          y: row * 150 + 100
        };
      }
    }

    // Relative positions
    const relativeOffsets: Record<string, PositionDefinition> = {
      'NEXT_TO': { x: distance || 80, y: 0 },
      'BEHIND': { x: 0, y: 50, z: -30 },
      'IN_FRONT_OF': { x: 0, y: -50, z: 30 },
      'LEFT_OF': { x: -(distance || 80), y: 0 },
      'RIGHT_OF': { x: distance || 80, y: 0 },
      'ABOVE': { x: 0, y: -(distance || 80) },
      'BELOW': { x: 0, y: distance || 80 },
      'NEAR': { x: distance || 50, y: distance || 50 }
    };

    if (relativeOffsets[posType]) {
      return {
        ...relativeOffsets[posType],
        relative: posType.toLowerCase(),
        relativeTo: posValue
      };
    }

    // Default center position
    return { x: 400, y: 300 };
  }

  /**
   * Parse LOAD EXTENSION command
   */
  private parseLoadExtension(line: string): void {
    const match = line.match(/^LOAD\s+EXTENSION\s+(\w+)/i);
    if (!match) {
      throw new Error('Invalid LOAD EXTENSION command');
    }
    this.loadedExtensions.add(match[1].toLowerCase());
  }

  /**
   * Parse ADD ENVIRONMENT command
   */
  private parseAddEnvironment(line: string): void {
    if (!this.scene) return;

    const match = line.match(/^ADD\s+ENVIRONMENT\s+(\w+)/i);
    if (!match) {
      throw new Error('Invalid ADD ENVIRONMENT command');
    }

    const envType = match[1].toLowerCase();
    this.scene.environment.type = envType;

    // Set environment-specific defaults
    const envBackgrounds: Record<string, any> = {
      'park': { type: 'gradient', value: { type: 'linear', colors: ['#87CEEB', '#90EE90'], angle: 180 } },
      'office': { type: 'solid', color: '#F5F5F5' },
      'hospital': { type: 'solid', color: '#E8F4F8' },
      'classroom': { type: 'solid', color: '#FFF8DC' },
      'beach': { type: 'gradient', value: { type: 'linear', colors: ['#87CEEB', '#F4A460'], angle: 180 } },
      'forest': { type: 'gradient', value: { type: 'linear', colors: ['#228B22', '#006400'], angle: 180 } }
    };

    if (envBackgrounds[envType]) {
      this.scene.environment.background = envBackgrounds[envType];
    }
  }

  /**
   * Parse UPDATE command
   */
  private parseUpdate(line: string): void {
    if (!this.scene) return;

    const match = line.match(/^UPDATE\s+(\w+)\s+WITH\s+(.+)/i);
    if (!match) {
      throw new Error('Invalid UPDATE command');
    }

    const entityRef = match[1];
    const attrString = match[2];

    // Find entity by reference or last created
    const entity = this.scene.entities.find(e => 
      e.id === entityRef || 
      e.attributes.entitySubType === entityRef.toLowerCase()
    );

    if (entity) {
      const newAttributes = new Map<string, any>();
      this.parseAttributes(attrString, newAttributes);
      
      // Merge new attributes
      for (const [key, value] of newAttributes) {
        entity.attributes[key] = value;
      }
    }
  }

  /**
   * Parse EXPORT command
   */
  private parseExport(line: string): void {
    if (!this.scene) return;

    const formatMatch = line.match(/AS\s+(PNG|JPEG|WEBP|SVG|PDF|GIF)/i);
    const resolutionMatch = line.match(/RESOLUTION:\s*(\d+)x(\d+)|RESOLUTION:\s*(HD|FULL_HD|4K|THUMBNAIL)/i);
    const qualityMatch = line.match(/QUALITY:\s*(LOW|MEDIUM|HIGH|ULTRA|\d+)/i);
    const dpiMatch = line.match(/DPI:\s*(\d+)/i);

    const exportOptions: any = {
      format: formatMatch ? formatMatch[1].toLowerCase() : 'png',
      quality: qualityMatch ? qualityMatch[1].toLowerCase() : 'medium'
    };

    if (resolutionMatch) {
      if (resolutionMatch[1] && resolutionMatch[2]) {
        exportOptions.resolution = {
          width: parseInt(resolutionMatch[1]),
          height: parseInt(resolutionMatch[2])
        };
      } else if (resolutionMatch[3]) {
        const presets: Record<string, any> = {
          'THUMBNAIL': { width: 150, height: 150 },
          'HD': { width: 1920, height: 1080 },
          'FULL_HD': { width: 1920, height: 1080 },
          '4K': { width: 3840, height: 2160 }
        };
        exportOptions.resolution = presets[resolutionMatch[3].toUpperCase()];
      }
    }

    if (dpiMatch) {
      exportOptions.dpi = parseInt(dpiMatch[1]);
    }

    this.scene.metadata.exportOptions = exportOptions;
  }

  /**
   * Create entity from parsed data
   */
  private createEntity(
    entityType: string,
    attributes: Map<string, any>,
    position: PositionDefinition
  ): EntityDefinition {
    const entityId = `entity_${++this.entityCounter}`;
    const mappedType = this.mapEntityType(entityType);
    const defaults = this.getDefaultAttributesForType(mappedType.subType);
    const parsedAttrs = Object.fromEntries(attributes);

    return {
      type: 'entity',
      id: entityId,
      entityType: mappedType.category,
      attributes: {
        ...defaults,
        ...parsedAttrs,
        entitySubType: mappedType.subType
      },
      position
    };
  }

  /**
   * Map SIGL entity types to internal representation
   */
  private mapEntityType(siglType: string): { category: 'human' | 'object' | 'prop'; subType: string } {
    const type = siglType.toUpperCase();

    // Human types
    const humanTypes: Record<string, string> = {
      'MAN': 'adult_male',
      'WOMAN': 'adult_female',
      'BOY': 'child_male',
      'GIRL': 'child_female',
      'BABY': 'infant',
      'PERSON': 'adult_neutral',
      'CHILD': 'child_neutral',
      // Educational extension
      'TEACHER': 'teacher',
      'STUDENT': 'student',
      'PROFESSOR': 'professor',
      'INSTRUCTOR': 'instructor',
      'PRINCIPAL': 'principal',
      'LIBRARIAN': 'librarian',
      'CUSTODIAN': 'custodian',
      // Hospital extension
      'DOCTOR': 'doctor',
      'NURSE': 'nurse',
      'PATIENT': 'patient',
      'SURGEON': 'surgeon',
      // Military extension
      'SOLDIER': 'soldier',
      'OFFICER': 'officer',
      'GENERAL': 'general',
      'MARINE': 'marine'
    };

    if (humanTypes[type]) {
      return { category: 'human', subType: humanTypes[type] };
    }

    // Animal types
    if (type.startsWith('ANIMAL_')) {
      const animalType = type.slice(7).toLowerCase();
      return { category: 'object', subType: `animal_${animalType}` };
    }

    // Object types
    const objectTypes: Record<string, string> = {
      'TREE': 'tree',
      'HOUSE': 'house',
      'CAR': 'car',
      'BUILDING': 'building',
      'BOAT': 'boat',
      'BLACKBOARD': 'blackboard',
      'DESK': 'desk',
      'CHAIR': 'chair'
    };

    if (objectTypes[type]) {
      return { category: 'object', subType: objectTypes[type] };
    }

    // Default to human
    return { category: 'human', subType: 'person' };
  }

  /**
   * Get default attributes for entity sub-type
   */
  private getDefaultAttributesForType(subType: string): Record<string, any> {
    const defaults: Record<string, any> = {
      // Adults
      'adult_male': { age: 30, gender: 'male' },
      'adult_female': { age: 30, gender: 'female' },
      'adult_neutral': { age: 30, gender: 'neutral' },
      // Children
      'child_male': { age: 10, gender: 'male' },
      'child_female': { age: 10, gender: 'female' },
      'child_neutral': { age: 10, gender: 'neutral' },
      // Infant
      'infant': { age: 1, gender: 'neutral' },
      // Educational
      'teacher': { age: 35, gender: 'neutral', role: 'teacher' },
      'student': { age: 15, gender: 'neutral', role: 'student' },
      'professor': { age: 45, gender: 'neutral', role: 'professor' },
      'principal': { age: 50, gender: 'neutral', role: 'principal' },
      // Hospital
      'doctor': { age: 40, gender: 'neutral', role: 'doctor' },
      'nurse': { age: 35, gender: 'neutral', role: 'nurse' },
      'patient': { age: 40, gender: 'neutral', role: 'patient' },
      'surgeon': { age: 45, gender: 'neutral', role: 'surgeon' },
      // Military
      'soldier': { age: 25, gender: 'neutral', role: 'soldier' },
      'officer': { age: 35, gender: 'neutral', role: 'officer' }
    };

    return defaults[subType] || { age: 25 };
  }

  /**
   * Normalize color names
   */
  private normalizeColor(color: string): string {
    const colorMap: Record<string, string> = {
      'RED': '#FF0000',
      'GREEN': '#00FF00',
      'BLUE': '#0000FF',
      'YELLOW': '#FFFF00',
      'ORANGE': '#FFA500',
      'PURPLE': '#800080',
      'PINK': '#FFC0CB',
      'BROWN': '#8B4513',
      'BLACK': '#000000',
      'WHITE': '#FFFFFF',
      'GRAY': '#808080',
      'GREY': '#808080',
      'NAVY': '#000080',
      'NAVY_BLUE': '#000080',
      'CHARCOAL': '#36454F',
      'BLONDE': '#FAD5A5',
      'BRUNETTE': '#8B4513'
    };

    const upper = color.toUpperCase();
    return colorMap[upper] || color;
  }

  /**
   * Check if string is a color
   */
  private isColor(value: string): boolean {
    const colors = ['RED', 'GREEN', 'BLUE', 'YELLOW', 'ORANGE', 'PURPLE', 'PINK', 'BROWN', 
                    'BLACK', 'WHITE', 'GRAY', 'GREY', 'NAVY', 'CHARCOAL', 'BLONDE', 'BRUNETTE'];
    return colors.includes(value.toUpperCase()) || value.startsWith('#');
  }

  /**
   * Create empty scene
   */
  private createEmptyScene(): SceneDefinition {
    return {
      type: 'scene',
      entities: [],
      environment: {
        type: 'default',
        background: { type: 'solid', color: '#ffffff' },
        lighting: { ambient: 0.8 }
      },
      camera: {
        position: [0, 0, 5],
        target: [0, 0, 0],
        fov: 45
      },
      metadata: {
        created: new Date(),
        modified: new Date(),
        author: '',
        version: '1.0.0'
      }
    };
  }

  /**
   * Reset parser state
   */
  private reset(): void {
    this.entityCounter = 0;
    this.scene = null;
  }

  /**
   * Get loaded extensions
   */
  getLoadedExtensions(): Set<string> {
    return new Set(this.loadedExtensions);
  }

  /**
   * Resolve relative positions to absolute coordinates
   */
  private resolveRelativePositions(): void {
    if (!this.scene) return;

    // Build entity lookup map
    const entityMap = new Map<string, EntityDefinition>();
    for (const entity of this.scene.entities) {
      // Store by both ID and type (e.g., 'MAN', 'WOMAN')
      entityMap.set(entity.id, entity);
      if (entity.attributes.entitySubType) {
        const subType = entity.attributes.entitySubType.toString().toUpperCase();
        if (subType.includes('MALE') && !entityMap.has('MAN')) {
          entityMap.set('MAN', entity);
        } else if (subType.includes('FEMALE') && !entityMap.has('WOMAN')) {
          entityMap.set('WOMAN', entity);
        } else if (subType === 'CHILD_MALE' && !entityMap.has('BOY')) {
          entityMap.set('BOY', entity);
        } else if (subType === 'CHILD_FEMALE' && !entityMap.has('GIRL')) {
          entityMap.set('GIRL', entity);
        }
      }
    }

    // Resolve each entity's position
    for (const entity of this.scene.entities) {
      if (entity.position.relative && entity.position.relativeTo) {
        const targetName = entity.position.relativeTo.toUpperCase();
        const targetEntity = entityMap.get(targetName);
        
        if (targetEntity) {
          const relativeType = entity.position.relative.toUpperCase();
          const offsetMap: Record<string, { x: number; y: number; z?: number }> = {
            'NEXT_TO': { x: 150, y: 0 },
            'BEHIND': { x: 0, y: 50, z: -30 },
            'IN_FRONT_OF': { x: 0, y: 100, z: 30 },
            'LEFT_OF': { x: -150, y: 0 },
            'RIGHT_OF': { x: 150, y: 0 },
            'ABOVE': { x: 0, y: -150 },
            'BELOW': { x: 0, y: 150 },
            'NEAR': { x: 80, y: 80 }
          };

          const offset = offsetMap[relativeType] || { x: 100, y: 0 };
          
          // Calculate absolute position
          entity.position.x = targetEntity.position.x + (offset.x || 0);
          entity.position.y = targetEntity.position.y + (offset.y || 0);
          entity.position.z = (targetEntity.position.z || 0) + (offset.z || 0);
          
          // Clear relative data
          delete entity.position.relative;
          delete entity.position.relativeTo;
          
          console.log(`✅ Resolved position for ${entity.id} relative to ${targetName}: (${entity.position.x}, ${entity.position.y}, ${entity.position.z})`);
        } else {
          console.warn(`⚠️  Could not find target entity '${targetName}' for relative positioning of ${entity.id}`);
          // Fall back to default position
          entity.position.x = entity.position.x || 400;
          entity.position.y = entity.position.y || 300;
          entity.position.z = entity.position.z || 0;
        }
      } else {
        // Ensure absolute positions have all coordinates
        entity.position.x = entity.position.x || 400;
        entity.position.y = entity.position.y || 300;
        entity.position.z = entity.position.z || 0;
      }
    }
  }
}

export default SIGLParser;

