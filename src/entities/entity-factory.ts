import { EntityDefinition, PositionDefinition } from '../core/types';
import { HumanAttributes } from './human-entity';

// Define specific attribute types for each entity type
export interface ObjectAttributes {
  name: string;
  material: string;
  color: string;
  scale: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  physics: {
    enabled: boolean;
    mass: number;
    friction: number;
  };
}

export interface PropAttributes {
  name: string;
  model: string;
  texture: string;
  scale: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  interactive: boolean;
}

// Union type for all entity attributes
export type EntityAttributes = HumanAttributes | ObjectAttributes | PropAttributes;

/**
 * Factory class for creating and managing entities
 */
export class EntityFactory {
  private static entityCounter = 0;

  /**
   * Create a new entity with the specified type and attributes
   */
  static createEntity(
    entityType: 'human' | 'object' | 'prop',
    id?: string,
    attributes: Record<string, unknown> = {},
    position: PositionDefinition = { x: 0, y: 0, z: 0 }
  ): EntityDefinition {
    const entityId = id || `${entityType}_${++this.entityCounter}`;

    return {
      type: 'entity',
      id: entityId,
      entityType,
      attributes: this.validateAttributes(entityType, attributes),
      position
    };
  }

  /**
   * Create a human entity with default attributes
   */
  static createHuman(
    id?: string,
    attributes: Partial<HumanAttributes> = {},
    position: PositionDefinition = { x: 0, y: 0, z: 0 }
  ): EntityDefinition {
    const defaultAttributes: HumanAttributes = {
      name: 'Human',
      age: 25,
      height: 1.75,
      appearance: {
        hair: 'brown',
        eyes: 'brown',
        skin: 'medium',
        build: 'average'
      },
      clothing: {
        top: 'shirt',
        bottom: 'pants',
        shoes: 'sneakers'
      },
      animation: 'idle',
      emotion: 'neutral'
    };

    return this.createEntity('human', id, { ...defaultAttributes, ...attributes }, position);
  }

  /**
   * Create an object entity with default attributes
   */
  static createObject(
    id?: string,
    attributes: Partial<ObjectAttributes> = {},
    position: PositionDefinition = { x: 0, y: 0, z: 0 }
  ): EntityDefinition {
    const defaultAttributes: ObjectAttributes = {
      name: 'Object',
      material: 'default',
      color: '#888888',
      scale: { x: 1, y: 1, z: 1 },
      rotation: { x: 0, y: 0, z: 0 },
      physics: {
        enabled: false,
        mass: 1.0,
        friction: 0.5
      }
    };

    return this.createEntity('object', id, { ...defaultAttributes, ...attributes }, position);
  }

  /**
   * Create a prop entity with default attributes
   */
  static createProp(
    id?: string,
    attributes: Partial<PropAttributes> = {},
    position: PositionDefinition = { x: 0, y: 0, z: 0 }
  ): EntityDefinition {
    const defaultAttributes: PropAttributes = {
      name: 'Prop',
      model: 'default',
      texture: 'default',
      scale: { x: 1, y: 1, z: 1 },
      rotation: { x: 0, y: 0, z: 0 },
      interactive: false
    };

    return this.createEntity('prop', id, { ...defaultAttributes, ...attributes }, position);
  }

  /**
   * Clone an existing entity with a new ID
   */
  static cloneEntity(entity: EntityDefinition, newId?: string): EntityDefinition {
    const clonedId = newId || `${entity.id}_clone_${++this.entityCounter}`;
    
    return {
      ...entity,
      id: clonedId,
      attributes: { ...entity.attributes }
    };
  }

  /**
   * Update entity position
   */
  static updatePosition(entity: EntityDefinition, position: Partial<PositionDefinition>): EntityDefinition {
    return {
      ...entity,
      position: { ...entity.position, ...position }
    };
  }

  /**
   * Update entity attributes
   */
  static updateAttributes(entity: EntityDefinition, attributes: Record<string, unknown>): EntityDefinition {
    return {
      ...entity,
      attributes: { ...entity.attributes, ...attributes }
    };
  }

  /**
   * Validate attributes based on entity type
   */
  private static validateAttributes(entityType: string, attributes: Record<string, unknown>): Record<string, unknown> {
    const validated = { ...attributes };

    switch (entityType) {
      case 'human': {
        // Ensure required human attributes
        if (validated.age && typeof validated.age !== 'number') {
          validated.age = parseInt(validated.age as string) || 25;
        }
        if (validated.height && typeof validated.height !== 'number') {
          validated.height = parseFloat(validated.height as string) || 1.75;
        }
        break;
      }
      case 'object': {
        // Ensure scale and rotation are objects
        if (validated.scale && typeof validated.scale !== 'object') {
          validated.scale = { x: 1, y: 1, z: 1 };
        }
        if (validated.rotation && typeof validated.rotation !== 'object') {
          validated.rotation = { x: 0, y: 0, z: 0 };
        }
        break;
      }
      case 'prop': {
        // Ensure interactive is boolean
        if (validated.interactive !== undefined && typeof validated.interactive !== 'boolean') {
          validated.interactive = Boolean(validated.interactive);
        }
        break;
      }
    }

    return validated;
  }

  /**
   * Get entity by ID from a list of entities
   */
  static findEntityById(entities: EntityDefinition[], id: string): EntityDefinition | undefined {
    return entities.find(entity => entity.id === id);
  }

  /**
   * Get entities by type from a list of entities
   */
  static findEntitiesByType(entities: EntityDefinition[], entityType: 'human' | 'object' | 'prop'): EntityDefinition[] {
    return entities.filter(entity => entity.entityType === entityType);
  }

  /**
   * Remove entity by ID from a list of entities
   */
  static removeEntity(entities: EntityDefinition[], id: string): EntityDefinition[] {
    return entities.filter(entity => entity.id !== id);
  }

  /**
   * Get entities within a certain distance from a position
   */
  static findEntitiesNearPosition(
    entities: EntityDefinition[], 
    position: PositionDefinition, 
    maxDistance: number
  ): EntityDefinition[] {
    return entities.filter(entity => {
      const distance = Math.sqrt(
        Math.pow(entity.position.x - position.x, 2) +
        Math.pow(entity.position.y - position.y, 2) +
        Math.pow((entity.position.z || 0) - (position.z || 0), 2)
      );
      return distance <= maxDistance;
    });
  }

  /**
   * Reset the entity counter (useful for testing)
   */
  static resetCounter(): void {
    this.entityCounter = 0;
  }
}

export default EntityFactory;
