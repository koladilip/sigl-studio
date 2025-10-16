import { EntityDefinition, PositionDefinition } from '../core/types';
import { EntityFactory } from './entity-factory';

/**
 * Human-specific appearance configuration
 */
export interface HumanAppearance {
  hair: 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'white';
  eyes: 'brown' | 'blue' | 'green' | 'hazel' | 'gray';
  skin: 'light' | 'medium' | 'dark' | 'olive' | 'tan';
  build: 'slim' | 'average' | 'athletic' | 'heavy';
  facialHair?: 'none' | 'mustache' | 'beard' | 'goatee' | 'stubble';
}

/**
 * Human clothing configuration
 */
export interface HumanClothing {
  top: 'shirt' | 't-shirt' | 'blouse' | 'sweater' | 'jacket' | 'dress';
  bottom: 'pants' | 'jeans' | 'shorts' | 'skirt' | 'dress';
  shoes: 'sneakers' | 'boots' | 'sandals' | 'heels' | 'flats' | 'dress-shoes';
  accessories?: string[];
  colors?: {
    primary: string;
    secondary?: string;
    accent?: string;
  };
}

/**
 * Human animation states
 */
export type HumanAnimation = 
  | 'idle' 
  | 'walking' 
  | 'running' 
  | 'sitting' 
  | 'standing' 
  | 'waving' 
  | 'pointing' 
  | 'talking' 
  | 'thinking' 
  | 'sleeping' 
  | 'working' 
  | 'dancing' 
  | 'jumping';

/**
 * Human emotion states
 */
export type HumanEmotion = 
  | 'neutral' 
  | 'happy' 
  | 'sad' 
  | 'angry' 
  | 'surprised' 
  | 'confused' 
  | 'excited' 
  | 'worried' 
  | 'calm' 
  | 'focused';

/**
 * Human entity attributes interface
 */
export interface HumanAttributes {
  name: string;
  age: number;
  height: number; // in meters
  weight?: number; // in kg
  appearance: HumanAppearance;
  clothing: HumanClothing;
  animation: HumanAnimation;
  emotion?: HumanEmotion;
  personality?: string[];
  occupation?: string;
  description?: string;
}

/**
 * Specialized class for creating and managing human entities
 */
export class HumanEntity {
  /**
   * Create a new human entity with detailed configuration
   */
  static create(
    id: string,
    attributes: Partial<HumanAttributes>,
    position: PositionDefinition = { x: 0, y: 0, z: 0 }
  ): EntityDefinition {
    // Use EntityFactory for basic entity creation with enhanced attributes
    const enhancedAttributes: Partial<HumanAttributes> = {
      name: attributes.name || 'Human',
      age: attributes.age || 25,
      height: attributes.height || 1.75,
      appearance: {
        hair: 'brown',
        eyes: 'brown',
        skin: 'medium',
        build: 'average',
        ...attributes.appearance
      },
      clothing: {
        top: 'shirt',
        bottom: 'pants',
        shoes: 'sneakers',
        ...attributes.clothing
      },
      animation: attributes.animation || 'idle',
      emotion: attributes.emotion || 'neutral',
      ...attributes
    };

    return EntityFactory.createHuman(id, enhancedAttributes, position);
  }

  /**
   * Create a human with predefined appearance presets
   */
  static createWithPreset(
    id: string,
    preset: 'casual' | 'business' | 'formal' | 'athletic' | 'artistic',
    overrides: Partial<HumanAttributes> = {},
    position: PositionDefinition = { x: 0, y: 0, z: 0 }
  ): EntityDefinition {
    const presets: Record<string, Partial<HumanAttributes>> = {
      casual: {
        clothing: {
          top: 't-shirt',
          bottom: 'jeans',
          shoes: 'sneakers',
          colors: { primary: '#4A90E2', secondary: '#2E5C8A' }
        },
        animation: 'idle'
      },
      business: {
        clothing: {
          top: 'shirt',
          bottom: 'pants',
          shoes: 'dress-shoes',
          colors: { primary: '#2C3E50', secondary: '#34495E' }
        },
        animation: 'standing',
        emotion: 'focused'
      },
      formal: {
        clothing: {
          top: 'jacket',
          bottom: 'pants',
          shoes: 'dress-shoes',
          colors: { primary: '#1A1A1A', secondary: '#333333' }
        },
        animation: 'standing',
        emotion: 'calm'
      },
      athletic: {
        clothing: {
          top: 't-shirt',
          bottom: 'shorts',
          shoes: 'sneakers',
          colors: { primary: '#E74C3C', secondary: '#C0392B' }
        },
        appearance: { 
          hair: 'brown',
          eyes: 'brown', 
          skin: 'medium',
          build: 'athletic' 
        },
        animation: 'walking'
      },
      artistic: {
        clothing: {
          top: 'sweater',
          bottom: 'jeans',
          shoes: 'boots',
          colors: { primary: '#9B59B6', secondary: '#8E44AD' },
          accessories: ['hat', 'scarf']
        },
        emotion: 'excited',
        personality: ['creative', 'expressive']
      }
    };

    const presetAttributes = presets[preset] || {};
    const mergedAttributes = this.mergeAttributes(presetAttributes, overrides);
    
    return this.create(id, mergedAttributes, position);
  }

  /**
   * Update human animation
   */
  static setAnimation(entity: EntityDefinition, animation: HumanAnimation): EntityDefinition {
    if (entity.entityType !== 'human') {
      throw new Error('Entity is not a human');
    }

    return {
      ...entity,
      attributes: { ...entity.attributes, animation }
    };
  }

  /**
   * Update human emotion
   */
  static setEmotion(entity: EntityDefinition, emotion: HumanEmotion): EntityDefinition {
    if (entity.entityType !== 'human') {
      throw new Error('Entity is not a human');
    }

    return {
      ...entity,
      attributes: { ...entity.attributes, emotion }
    };
  }

  /**
   * Update human clothing
   */
  static setClothing(entity: EntityDefinition, clothing: Partial<HumanClothing>): EntityDefinition {
    if (entity.entityType !== 'human') {
      throw new Error('Entity is not a human');
    }

    const currentClothing = (entity.attributes as unknown as HumanAttributes).clothing || {};
    const updatedClothing = { ...currentClothing, ...clothing };

    return {
      ...entity,
      attributes: { ...entity.attributes, clothing: updatedClothing }
    };
  }

  /**
   * Update human appearance
   */
  static setAppearance(entity: EntityDefinition, appearance: Partial<HumanAppearance>): EntityDefinition {
    if (entity.entityType !== 'human') {
      throw new Error('Entity is not a human');
    }

    const currentAppearance = (entity.attributes as unknown as HumanAttributes).appearance || {};
    const updatedAppearance = { ...currentAppearance, ...appearance };

    return {
      ...entity,
      attributes: { ...entity.attributes, appearance: updatedAppearance }
    };
  }

  /**
   * Make human perform an action (combines animation and emotion)
   */
  static performAction(
    entity: EntityDefinition, 
    action: 'greet' | 'work' | 'relax' | 'exercise' | 'think' | 'celebrate'
  ): EntityDefinition {
    if (entity.entityType !== 'human') {
      throw new Error('Entity is not a human');
    }

    const actions: Record<string, { animation: HumanAnimation; emotion: HumanEmotion }> = {
      greet: { animation: 'waving', emotion: 'happy' },
      work: { animation: 'working', emotion: 'focused' },
      relax: { animation: 'sitting', emotion: 'calm' },
      exercise: { animation: 'running', emotion: 'excited' },
      think: { animation: 'thinking', emotion: 'focused' },
      celebrate: { animation: 'dancing', emotion: 'excited' }
    };

    const actionConfig = actions[action];
    if (!actionConfig) {
      throw new Error(`Unknown action: ${action}`);
    }

    return {
      ...entity,
      attributes: { ...entity.attributes, ...actionConfig }
    };
  }

  /**
   * Get human age category
   */
  static getAgeCategory(entity: EntityDefinition): string {
    if (entity.entityType !== 'human') {
      return 'unknown';
    }

    const age = (entity.attributes as unknown as HumanAttributes).age;
    if (age < 3) return 'infant';
    if (age < 13) return 'child';
    if (age < 20) return 'teenager';
    if (age < 65) return 'adult';
    return 'senior';
  }

  /**
   * Check if human can perform certain actions based on age and attributes
   */
  static canPerformAction(entity: EntityDefinition, action: string): boolean {
    if (entity.entityType !== 'human') {
      return false;
    }

    const ageCategory = this.getAgeCategory(entity);

    // Age-based restrictions
    const ageRestrictedActions: Record<string, string[]> = {
      'driving': ['adult', 'senior'],
      'working': ['teenager', 'adult', 'senior'],
      'running': ['child', 'teenager', 'adult']
    };

    if (ageRestrictedActions[action]) {
      return ageRestrictedActions[action].includes(ageCategory);
    }

    return true;
  }

  /**
   * Generate a random human with realistic attributes
   */
  static createRandom(id?: string): EntityDefinition {
    const names = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Sage'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    const hairColors: HumanAppearance['hair'][] = ['black', 'brown', 'blonde', 'red'];
    const eyeColors: HumanAppearance['eyes'][] = ['brown', 'blue', 'green', 'hazel'];
    const skinTones: HumanAppearance['skin'][] = ['light', 'medium', 'dark', 'olive'];
    const builds: HumanAppearance['build'][] = ['slim', 'average', 'athletic'];

    const randomAttributes: Partial<HumanAttributes> = {
      name: randomName,
      age: Math.floor(Math.random() * 60) + 18, // 18-78 years old
      height: Math.random() * 0.4 + 1.5, // 1.5-1.9 meters
      appearance: {
        hair: hairColors[Math.floor(Math.random() * hairColors.length)],
        eyes: eyeColors[Math.floor(Math.random() * eyeColors.length)],
        skin: skinTones[Math.floor(Math.random() * skinTones.length)],
        build: builds[Math.floor(Math.random() * builds.length)]
      }
    };

    const entityId = id || `human_${randomName.toLowerCase()}_${Date.now()}`;
    return EntityFactory.createHuman(entityId, randomAttributes);
  }

  /**
   * Helper method to merge nested attributes
   */
  /**
   * Deep merge attributes for preset creation
   */
  private static mergeAttributes(
    base: Partial<HumanAttributes>, 
    overrides: Partial<HumanAttributes>
  ): Partial<HumanAttributes> {
    const result: Partial<HumanAttributes> = { ...base };

    for (const [key, value] of Object.entries(overrides)) {
      if (value !== undefined) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          (result as Record<string, unknown>)[key] = {
            ...((result as Record<string, unknown>)[key] as Record<string, unknown> || {}),
            ...value
          };
        } else {
          (result as Record<string, unknown>)[key] = value;
        }
      }
    }

    return result;
  }
}

export default HumanEntity;