import { 
  ParseResult, 
  SceneDefinition, 
  EntityDefinition, 
  SITLError 
} from '../core/types';

/**
 * Simple SITL Parser implementation
 * This is a basic parser that handles common SITL syntax patterns
 */
export class SITLParser {
  /**
   * Parse SITL source code into an AST
   */
  static parse(source: string): ParseResult {
    try {
      const lines = source.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('//'));
      const errors: SITLError[] = [];
      
      // Basic scene structure
      const scene: SceneDefinition = {
        type: 'scene',
        entities: [],
        environment: {
          type: 'default',
          background: { type: 'solid', color: '#ffffff' },
          lighting: { type: 'natural', intensity: 1.0 }
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

      let currentEntity: EntityDefinition | null = null;
      let inEntityBlock = false;
      let inEnvironmentBlock = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNumber = i + 1;

        try {
          // Skip empty lines and comments
          if (!line || line.startsWith('//')) continue;

          // Scene declaration
          if (line.startsWith('scene')) {
            continue;
          }

          // Entity declarations
          if (line.match(/^(human|object|prop)\s+\w+\s*\{/)) {
            const match = line.match(/^(human|object|prop)\s+(\w+)\s*\{/);
            if (match) {
              currentEntity = {
                type: 'entity',
                id: match[2],
                entityType: match[1] as 'human' | 'object' | 'prop',
                attributes: {},
                position: { x: 0, y: 0, z: 0 }
              };
              inEntityBlock = true;
            }
          }

          // Environment declarations
          else if (line.startsWith('environment') && line.includes('{')) {
            inEnvironmentBlock = true;
          }

          // Closing braces
          else if (line === '}') {
            if (inEntityBlock && currentEntity) {
              scene.entities.push(currentEntity);
              currentEntity = null;
              inEntityBlock = false;
            } else if (inEnvironmentBlock) {
              inEnvironmentBlock = false;
            }
          }

          // Attribute assignments within blocks
          else if (line.includes(':') && (inEntityBlock || inEnvironmentBlock)) {
            const [key, ...valueParts] = line.split(':');
            const value = valueParts.join(':').trim().replace(/;$/, '');
            
            if (inEntityBlock && currentEntity) {
              currentEntity.attributes[key.trim()] = this.parseValue(value);
            } else if (inEnvironmentBlock) {
              if (key.trim() === 'background') {
                scene.environment.background = { type: 'solid', color: this.parseValue(value) as string };
              } else if (key.trim() === 'lighting') {
                scene.environment.lighting = { type: this.parseValue(value) as string, intensity: 1.0 };
              }
            }
          }

          // Position statements
          else if (line.match(/^\w+\s+at\s+/)) {
            const match = line.match(/^(\w+)\s+at\s+\(([^)]+)\)/);
            if (match) {
              const entityId = match[1];
              const coords = match[2].split(',').map(c => parseFloat(c.trim()));
              
              // Find the entity and update its position
              const entity = scene.entities.find(e => e.id === entityId);
              if (entity) {
                entity.position = {
                  x: coords[0] || 0,
                  y: coords[1] || 0,
                  z: coords[2] || 0
                };
              }
            }
          }

        } catch (error) {
          errors.push({
            type: 'parse_error',
            message: error instanceof Error ? error.message : 'Unknown parse error',
            line: lineNumber,
            column: 0
          });
        }
      }

      if (errors.length > 0) {
        return {
          success: false,
          errors
        };
      }

      return {
        success: true,
        ast: scene,
        errors: []
      };

    } catch (error) {
      return {
        success: false,
        errors: [{
          type: 'parse_error',
          message: error instanceof Error ? error.message : 'Unknown parsing error',
          line: 0,
          column: 0
        }]
      };
    }
  }

  /**
   * Parse a value from string to appropriate type
   */
  private static parseValue(value: string): string | number | boolean {
    const trimmed = value.trim();
    
    // Remove quotes if present
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return trimmed.slice(1, -1);
    }
    
    // Try to parse as number
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return parseFloat(trimmed);
    }
    
    // Try to parse as boolean
    if (trimmed === 'true' || trimmed === 'false') {
      return trimmed === 'true';
    }
    
    // Return as string
    return trimmed;
  }

  /**
   * Validate SITL source code syntax
   */
  static validate(source: string): SITLError[] {
    const result = this.parse(source);
    return result.success ? [] : result.errors;
  }

  /**
   * Parse a single entity declaration
   */
  static parseEntity(source: string): ParseResult {
    const wrappedSource = `scene {\n${source}\n}`;
    const result = this.parse(wrappedSource);
    
    if (!result.success) {
      return result;
    }
    
    const scene = result.ast as SceneDefinition;
    if (scene.entities.length === 0) {
      return {
        success: false,
        errors: [{
          type: 'parse_error',
          message: 'No entity found in source',
          line: 0,
          column: 0
        }]
      };
    }
    
    return {
      success: true,
      ast: scene.entities[0],
      errors: []
    };
  }

  /**
   * Parse environment declaration
   */
  static parseEnvironment(source: string): ParseResult {
    const wrappedSource = `scene {\n${source}\n}`;
    const result = this.parse(wrappedSource);
    
    if (!result.success) {
      return result;
    }
    
    const scene = result.ast as SceneDefinition;
    return {
      success: true,
      ast: scene.environment,
      errors: []
    };
  }
}

export default SITLParser;