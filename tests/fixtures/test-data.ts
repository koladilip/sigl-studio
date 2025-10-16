import { EntityDefinition, PositionDefinition } from '../../src/core/types';
import { HumanAttributes, HumanAppearance, HumanClothing } from '../../src/entities/human-entity';
import { ObjectAttributes, PropAttributes } from '../../src/entities/entity-factory';

/**
 * Test fixtures and mock data for consistent testing
 */

// Common positions
export const TEST_POSITIONS: Record<string, PositionDefinition> = {
  origin: { x: 0, y: 0, z: 0 },
  center: { x: 50, y: 50, z: 0 },
  corner: { x: 100, y: 100, z: 10 },
  negative: { x: -25, y: -25, z: -5 }
};

// Human appearance fixtures
export const TEST_APPEARANCES: Record<string, HumanAppearance> = {
  default: {
    hair: 'brown',
    eyes: 'brown',
    skin: 'medium',
    build: 'average',
    facialHair: 'none'
  },
  athletic: {
    hair: 'black',
    eyes: 'blue',
    skin: 'tan',
    build: 'athletic',
    facialHair: 'stubble'
  },
  elderly: {
    hair: 'gray',
    eyes: 'hazel',
    skin: 'light',
    build: 'slim',
    facialHair: 'beard'
  }
};

// Human clothing fixtures
export const TEST_CLOTHING: Record<string, HumanClothing> = {
  casual: {
    top: 't-shirt',
    bottom: 'jeans',
    shoes: 'sneakers',
    colors: { primary: '#4A90E2', secondary: '#2E5C8A' }
  },
  business: {
    top: 'shirt',
    bottom: 'pants',
    shoes: 'dress-shoes',
    colors: { primary: '#2C3E50', secondary: '#34495E' }
  },
  athletic: {
    top: 't-shirt',
    bottom: 'shorts',
    shoes: 'sneakers',
    colors: { primary: '#E74C3C', secondary: '#C0392B' }
  }
};

// Complete human attributes fixtures
export const TEST_HUMAN_ATTRIBUTES: Record<string, Partial<HumanAttributes>> = {
  adult: {
    name: 'John Doe',
    age: 30,
    height: 1.75,
    weight: 70,
    appearance: TEST_APPEARANCES.default,
    clothing: TEST_CLOTHING.casual,
    animation: 'idle',
    emotion: 'neutral',
    occupation: 'Developer'
  },
  child: {
    name: 'Emma Smith',
    age: 8,
    height: 1.2,
    weight: 25,
    appearance: { ...TEST_APPEARANCES.default, hair: 'blonde', build: 'slim' },
    clothing: { ...TEST_CLOTHING.casual, top: 't-shirt', bottom: 'shorts' },
    animation: 'walking',
    emotion: 'happy'
  },
  senior: {
    name: 'Robert Johnson',
    age: 75,
    height: 1.7,
    weight: 65,
    appearance: TEST_APPEARANCES.elderly,
    clothing: TEST_CLOTHING.business,
    animation: 'standing',
    emotion: 'calm',
    occupation: 'Retired'
  },
  teenager: {
    name: 'Alex Wilson',
    age: 16,
    height: 1.65,
    weight: 55,
    appearance: { ...TEST_APPEARANCES.default, hair: 'black', eyes: 'green' },
    clothing: TEST_CLOTHING.casual,
    animation: 'walking',
    emotion: 'excited'
  }
};

// Object attributes fixtures
export const TEST_OBJECT_ATTRIBUTES: Record<string, Partial<ObjectAttributes>> = {
  chair: {
    name: 'Office Chair',
    material: 'leather',
    color: '#8B4513',
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0 },
    physics: {
      enabled: true,
      mass: 15,
      friction: 0.5
    }
  },
  table: {
    name: 'Wooden Table',
    material: 'wood',
    color: '#D2691E',
    scale: { x: 1.5, y: 0.75, z: 0.8 },
    rotation: { x: 0, y: 0, z: 0 },
    physics: {
      enabled: true,
      mass: 25,
      friction: 0.7
    }
  },
  computer: {
    name: 'Laptop Computer',
    material: 'plastic',
    color: '#2F2F2F',
    scale: { x: 0.35, y: 0.02, z: 0.25 },
    rotation: { x: 0, y: 0, z: 0 },
    physics: {
      enabled: false,
      mass: 2,
      friction: 0.3
    }
  }
};

// Prop attributes fixtures
export const TEST_PROP_ATTRIBUTES: Record<string, Partial<PropAttributes>> = {
  book: {
    name: 'Programming Guide',
    model: 'book_model',
    texture: 'book_texture',
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0 },
    interactive: true
  },
  ball: {
    name: 'Soccer Ball',
    model: 'ball_model',
    texture: 'ball_texture',
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0 },
    interactive: true
  },
  pen: {
    name: 'Blue Pen',
    model: 'pen_model',
    texture: 'pen_texture',
    scale: { x: 0.5, y: 0.5, z: 0.5 },
    rotation: { x: 0, y: 0, z: 0 },
    interactive: false
  }
};

// Complete entity fixtures
export const TEST_ENTITIES: Record<string, EntityDefinition> = {
  human_adult: {
    type: 'entity',
    id: 'test_human_1',
    entityType: 'human',
    position: TEST_POSITIONS.origin,
    attributes: TEST_HUMAN_ATTRIBUTES.adult as Record<string, unknown>
  },
  human_child: {
    type: 'entity',
    id: 'test_human_2',
    entityType: 'human',
    position: TEST_POSITIONS.center,
    attributes: TEST_HUMAN_ATTRIBUTES.child as Record<string, unknown>
  },
  object_chair: {
    type: 'entity',
    id: 'test_object_1',
    entityType: 'object',
    position: TEST_POSITIONS.corner,
    attributes: TEST_OBJECT_ATTRIBUTES.chair as Record<string, unknown>
  },
  prop_book: {
    type: 'entity',
    id: 'test_prop_1',
    entityType: 'prop',
    position: TEST_POSITIONS.negative,
    attributes: TEST_PROP_ATTRIBUTES.book as Record<string, unknown>
  }
};

// Helper functions for creating test data
export class TestDataHelper {
  /**
   * Create a human entity with default test data
   */
  static createTestHuman(overrides: Partial<HumanAttributes> = {}): Partial<HumanAttributes> {
    return { ...TEST_HUMAN_ATTRIBUTES.adult, ...overrides };
  }

  /**
   * Create an object entity with default test data
   */
  static createTestObject(overrides: Partial<ObjectAttributes> = {}): Partial<ObjectAttributes> {
    return { ...TEST_OBJECT_ATTRIBUTES.chair, ...overrides };
  }

  /**
   * Create a prop entity with default test data
   */
  static createTestProp(overrides: Partial<PropAttributes> = {}): Partial<PropAttributes> {
    return { ...TEST_PROP_ATTRIBUTES.book, ...overrides };
  }

  /**
   * Generate a unique test ID
   */
  static generateTestId(prefix: string = 'test'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a random position within bounds
   */
  static createRandomPosition(bounds: { x: number; y: number; z?: number } = { x: 100, y: 100, z: 10 }): PositionDefinition {
    return {
      x: Math.random() * bounds.x,
      y: Math.random() * bounds.y,
      z: Math.random() * (bounds.z || 10)
    };
  }
}

export default {
  TEST_POSITIONS,
  TEST_APPEARANCES,
  TEST_CLOTHING,
  TEST_HUMAN_ATTRIBUTES,
  TEST_OBJECT_ATTRIBUTES,
  TEST_PROP_ATTRIBUTES,
  TEST_ENTITIES,
  TestDataHelper
};