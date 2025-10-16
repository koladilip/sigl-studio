import { describe, it, expect, beforeEach } from 'vitest';
import { HumanEntity, HumanAttributes, HumanAnimation, HumanEmotion } from '../../src/engine/entities/human-entity';
import { EntityDefinition, PositionDefinition } from '../../src/engine/core/types';

// Helper function to safely cast entity attributes
function getHumanAttributes(entity: EntityDefinition): HumanAttributes {
  return entity.attributes as unknown as HumanAttributes;
}

describe('HumanEntity', () => {
  let basicAttributes: Partial<HumanAttributes>;
  let position: PositionDefinition;

  beforeEach(() => {
    basicAttributes = {
      name: 'John Doe',
      age: 30,
      height: 1.75,
      appearance: {
        hair: 'brown',
        eyes: 'blue',
        skin: 'medium',
        build: 'average'
      },
      clothing: {
        top: 'shirt',
        bottom: 'pants',
        shoes: 'sneakers'
      },
      animation: 'idle'
    };

    position = { x: 10, y: 20, z: 0 };
  });

  describe('create', () => {
    it('should create a human entity with basic attributes', () => {
      const entity = HumanEntity.create('human1', basicAttributes, position);

      expect(entity).toMatchObject({
        type: 'entity',
        id: 'human1',
        entityType: 'human',
        position: position,
        attributes: expect.objectContaining({
          name: 'John Doe',
          age: 30,
          height: 1.75
        })
      });
    });

    it('should create entity with default position when not provided', () => {
      const entity = HumanEntity.create('human2', basicAttributes);

      expect(entity.position).toEqual({ x: 0, y: 0, z: 0 });
    });

    it('should handle partial attributes', () => {
      const minimalAttributes = {
        name: 'Jane',
        age: 25,
        height: 1.65
      };

      const entity = HumanEntity.create('human3', minimalAttributes);
      const attrs = getHumanAttributes(entity);

      expect(attrs.name).toBe('Jane');
      expect(attrs.age).toBe(25);
      expect(attrs.height).toBe(1.65);
    });

    it('should handle empty attributes object', () => {
      const entity = HumanEntity.create('human4', {});

      expect(entity.type).toBe('entity');
      expect(entity.entityType).toBe('human');
      expect(entity.id).toBe('human4');
    });
  });

  describe('createWithPreset', () => {
    it('should create casual preset correctly', () => {
      const entity = HumanEntity.createWithPreset('casual1', 'casual');
      const attrs = getHumanAttributes(entity);

      expect(attrs.clothing?.top).toBe('t-shirt');
      expect(attrs.clothing?.bottom).toBe('jeans');
      expect(attrs.clothing?.shoes).toBe('sneakers');
      expect(attrs.animation).toBe('idle');
    });

    it('should create business preset correctly', () => {
      const entity = HumanEntity.createWithPreset('business1', 'business');
      const attrs = getHumanAttributes(entity);

      expect(attrs.clothing?.top).toBe('shirt');
      expect(attrs.clothing?.bottom).toBe('pants');
      expect(attrs.clothing?.shoes).toBe('dress-shoes');
      expect(attrs.animation).toBe('standing');
    });

    it('should create formal preset correctly', () => {
      const entity = HumanEntity.createWithPreset('formal1', 'formal');
      const attrs = getHumanAttributes(entity);

      expect(attrs.clothing?.top).toBe('jacket');
      expect(attrs.clothing?.bottom).toBe('pants');
      expect(attrs.clothing?.shoes).toBe('dress-shoes');
      expect(attrs.animation).toBe('standing');
    });

    it('should create athletic preset correctly', () => {
      const entity = HumanEntity.createWithPreset('athletic1', 'athletic');
      const attrs = getHumanAttributes(entity);

      expect(attrs.clothing?.top).toBe('t-shirt');
      expect(attrs.clothing?.bottom).toBe('shorts');
      expect(attrs.clothing?.shoes).toBe('sneakers');
      expect(attrs.animation).toBe('walking');
    });

    it('should create artistic preset correctly', () => {
      const entity = HumanEntity.createWithPreset('artistic1', 'artistic');
      const attrs = getHumanAttributes(entity);

      expect(attrs.clothing?.top).toBe('sweater');
      expect(attrs.clothing?.bottom).toBe('jeans');
      expect(attrs.clothing?.shoes).toBe('boots');
      expect(attrs.animation).toBe('idle');
    });

    it('should apply overrides to preset', () => {
      const overrides = {
        name: 'Custom Name',
        age: 40,
        clothing: {
          top: 'sweater' as const,
          bottom: 'skirt' as const,
          shoes: 'heels' as const
        }
      };

      const entity = HumanEntity.createWithPreset('override1', 'casual', overrides);
      const attrs = getHumanAttributes(entity);

      expect(attrs.name).toBe('Custom Name');
      expect(attrs.age).toBe(40);
      expect(attrs.clothing?.top).toBe('sweater');
      expect(attrs.clothing?.bottom).toBe('skirt');
      expect(attrs.clothing?.shoes).toBe('heels');
    });

    it('should use custom position', () => {
      const customPosition = { x: 100, y: 200, z: 50 };
      const entity = HumanEntity.createWithPreset('positioned1', 'casual', {}, customPosition);

      expect(entity.position).toEqual(customPosition);
    });
  });

  describe('setAnimation', () => {
    let entity: EntityDefinition;

    beforeEach(() => {
      entity = HumanEntity.create('anim1', basicAttributes);
    });

    it('should update animation state', () => {
      const updatedEntity = HumanEntity.setAnimation(entity, 'walking');
      const attrs = getHumanAttributes(updatedEntity);

      expect(attrs.animation).toBe('walking');
      expect(updatedEntity.id).toBe(entity.id); // Should maintain same ID
    });

    it('should handle all animation types', () => {
      const animations: HumanAnimation[] = [
        'idle', 'walking', 'running', 'sitting', 'standing', 
        'waving', 'pointing', 'talking', 'thinking', 'sleeping', 
        'working', 'dancing', 'jumping'
      ];

      animations.forEach(animation => {
        const updatedEntity = HumanEntity.setAnimation(entity, animation);
        const attrs = getHumanAttributes(updatedEntity);
        expect(attrs.animation).toBe(animation);
      });
    });

    it('should not modify original entity', () => {
      const originalAttrs = getHumanAttributes(entity);
      const originalAnimation = originalAttrs.animation;
      HumanEntity.setAnimation(entity, 'dancing');

      expect(originalAttrs.animation).toBe(originalAnimation);
    });
  });

  describe('setEmotion', () => {
    let entity: EntityDefinition;

    beforeEach(() => {
      entity = HumanEntity.create('emotion1', basicAttributes);
    });

    it('should update emotion state', () => {
      const updatedEntity = HumanEntity.setEmotion(entity, 'happy');
      const attrs = getHumanAttributes(updatedEntity);

      expect(attrs.emotion).toBe('happy');
    });

    it('should handle all emotion types', () => {
      const emotions: HumanEmotion[] = [
        'neutral', 'happy', 'sad', 'angry', 'surprised', 
        'confused', 'excited', 'worried', 'calm', 'focused'
      ];

      emotions.forEach(emotion => {
        const updatedEntity = HumanEntity.setEmotion(entity, emotion);
        const attrs = getHumanAttributes(updatedEntity);
        expect(attrs.emotion).toBe(emotion);
      });
    });

    it('should not modify original entity', () => {
      const originalAttrs = getHumanAttributes(entity);
      const originalEmotion = originalAttrs.emotion;
      HumanEntity.setEmotion(entity, 'excited');

      expect(originalAttrs.emotion).toBe(originalEmotion);
    });
  });

  describe('setClothing', () => {
    let entity: EntityDefinition;

    beforeEach(() => {
      entity = HumanEntity.create('clothing1', basicAttributes);
    });

    it('should update clothing partially', () => {
      const newClothing = { top: 'sweater' as const };
      const updatedEntity = HumanEntity.setClothing(entity, newClothing);
      const attrs = getHumanAttributes(updatedEntity);

      expect(attrs.clothing?.top).toBe('sweater');
      expect(attrs.clothing?.bottom).toBe(basicAttributes.clothing?.bottom);
      expect(attrs.clothing?.shoes).toBe(basicAttributes.clothing?.shoes);
    });

    it('should update multiple clothing items', () => {
      const newClothing = {
        top: 'jacket' as const,
        bottom: 'skirt' as const,
        shoes: 'heels' as const
      };
      const updatedEntity = HumanEntity.setClothing(entity, newClothing);
      const attrs = getHumanAttributes(updatedEntity);

      expect(attrs.clothing?.top).toBe('jacket');
      expect(attrs.clothing?.bottom).toBe('skirt');
      expect(attrs.clothing?.shoes).toBe('heels');
    });

    it('should handle accessories and colors', () => {
      const newClothing = {
        accessories: ['watch', 'necklace'],
        colors: {
          primary: '#FF0000',
          secondary: '#00FF00',
          accent: '#0000FF'
        }
      };
      const updatedEntity = HumanEntity.setClothing(entity, newClothing);
      const attrs = getHumanAttributes(updatedEntity);

      expect(attrs.clothing?.accessories).toEqual(['watch', 'necklace']);
      expect(attrs.clothing?.colors).toEqual({
        primary: '#FF0000',
        secondary: '#00FF00',
        accent: '#0000FF'
      });
    });
  });

  describe('setAppearance', () => {
    let entity: EntityDefinition;

    beforeEach(() => {
      entity = HumanEntity.create('appearance1', basicAttributes);
    });

    it('should update appearance partially', () => {
      const newAppearance = { hair: 'blonde' as const };
      const updatedEntity = HumanEntity.setAppearance(entity, newAppearance);
      const attrs = getHumanAttributes(updatedEntity);

      expect(attrs.appearance?.hair).toBe('blonde');
      expect(attrs.appearance?.eyes).toBe(basicAttributes.appearance?.eyes);
    });

    it('should update multiple appearance attributes', () => {
      const newAppearance = {
        hair: 'red' as const,
        eyes: 'green' as const,
        skin: 'dark' as const,
        build: 'athletic' as const,
        facialHair: 'beard' as const
      };
      const updatedEntity = HumanEntity.setAppearance(entity, newAppearance);
      const attrs = getHumanAttributes(updatedEntity);

      expect(attrs.appearance?.hair).toBe('red');
      expect(attrs.appearance?.eyes).toBe('green');
      expect(attrs.appearance?.skin).toBe('dark');
      expect(attrs.appearance?.build).toBe('athletic');
      expect(attrs.appearance?.facialHair).toBe('beard');
    });
  });

  describe('performAction', () => {
    let entity: EntityDefinition;

    beforeEach(() => {
      entity = HumanEntity.create('action1', basicAttributes);
    });

    it('should perform greet action', () => {
      const updatedEntity = HumanEntity.performAction(entity, 'greet');
      const attrs = getHumanAttributes(updatedEntity);

      expect(attrs.animation).toBe('waving');
      expect(attrs.emotion).toBe('happy');
    });

    it('should perform work action', () => {
      const updatedEntity = HumanEntity.performAction(entity, 'work');
      const attrs = getHumanAttributes(updatedEntity);

      expect(attrs.animation).toBe('working');
      expect(attrs.emotion).toBe('focused');
    });

    it('should perform relax action', () => {
      const updatedEntity = HumanEntity.performAction(entity, 'relax');
      const attrs = getHumanAttributes(updatedEntity);

      expect(attrs.animation).toBe('sitting');
      expect(attrs.emotion).toBe('calm');
    });

    it('should perform exercise action', () => {
      const updatedEntity = HumanEntity.performAction(entity, 'exercise');
      const attrs = getHumanAttributes(updatedEntity);

      expect(attrs.animation).toBe('running');
      expect(attrs.emotion).toBe('excited');
    });

    it('should perform think action', () => {
      const updatedEntity = HumanEntity.performAction(entity, 'think');
      const attrs = getHumanAttributes(updatedEntity);

      expect(attrs.animation).toBe('thinking');
      expect(attrs.emotion).toBe('focused');
    });

    it('should perform celebrate action', () => {
      const updatedEntity = HumanEntity.performAction(entity, 'celebrate');
      const attrs = getHumanAttributes(updatedEntity);

      expect(attrs.animation).toBe('dancing');
      expect(attrs.emotion).toBe('excited');
    });
  });

  describe('getAgeCategory', () => {
    it('should categorize child correctly', () => {
      const child = HumanEntity.create('child1', { ...basicAttributes, age: 8 });
      expect(HumanEntity.getAgeCategory(child)).toBe('child');
    });

    it('should categorize teenager correctly', () => {
      const teenager = HumanEntity.create('teen1', { ...basicAttributes, age: 16 });
      expect(HumanEntity.getAgeCategory(teenager)).toBe('teenager');
    });

    it('should categorize young adult correctly', () => {
      const youngAdult = HumanEntity.create('young1', { ...basicAttributes, age: 25 });
      expect(HumanEntity.getAgeCategory(youngAdult)).toBe('adult');
    });

    it('should categorize adult correctly', () => {
      const adult = HumanEntity.create('adult1', { ...basicAttributes, age: 45 });
      expect(HumanEntity.getAgeCategory(adult)).toBe('adult');
    });

    it('should categorize senior correctly', () => {
      const senior = HumanEntity.create('senior1', { ...basicAttributes, age: 70 });
      expect(HumanEntity.getAgeCategory(senior)).toBe('senior');
    });

    it('should handle edge cases', () => {
      const exactlyTwelve = HumanEntity.create('edge1', { ...basicAttributes, age: 12 });
      expect(HumanEntity.getAgeCategory(exactlyTwelve)).toBe('child');

      const exactlyEighteen = HumanEntity.create('edge2', { ...basicAttributes, age: 18 });
      expect(HumanEntity.getAgeCategory(exactlyEighteen)).toBe('teenager');
    });
  });

  describe('canPerformAction', () => {
    it('should allow basic actions for adults', () => {
      const adult = HumanEntity.create('adult1', { ...basicAttributes, age: 30 });

      expect(HumanEntity.canPerformAction(adult, 'walk')).toBe(true);
      expect(HumanEntity.canPerformAction(adult, 'run')).toBe(true);
      expect(HumanEntity.canPerformAction(adult, 'work')).toBe(true);
      expect(HumanEntity.canPerformAction(adult, 'drive')).toBe(true);
    });

    it('should restrict certain actions for children', () => {
      const child = HumanEntity.create('child1', { ...basicAttributes, age: 8 });

      expect(HumanEntity.canPerformAction(child, 'walking')).toBe(true);
      expect(HumanEntity.canPerformAction(child, 'running')).toBe(true);
      expect(HumanEntity.canPerformAction(child, 'working')).toBe(false);
      expect(HumanEntity.canPerformAction(child, 'driving')).toBe(false);
    });

    it('should allow most actions for seniors', () => {
      const senior = HumanEntity.create('senior1', { ...basicAttributes, age: 80 });

      expect(HumanEntity.canPerformAction(senior, 'walking')).toBe(true);
      expect(HumanEntity.canPerformAction(senior, 'running')).toBe(false);
      expect(HumanEntity.canPerformAction(senior, 'working')).toBe(true);
      expect(HumanEntity.canPerformAction(senior, 'driving')).toBe(true);
    });

    it('should handle unknown actions', () => {
      const adult = HumanEntity.create('adult1', basicAttributes);
      expect(HumanEntity.canPerformAction(adult, 'fly')).toBe(true);
    });
  });

  describe('createRandom', () => {
    it('should create random entity with valid attributes', () => {
      const randomEntity = HumanEntity.createRandom();
      const attrs = getHumanAttributes(randomEntity);

      expect(randomEntity.type).toBe('entity');
      expect(randomEntity.entityType).toBe('human');
      expect(randomEntity.id).toMatch(/^human_\w+_\d+$/);
      expect(attrs.name).toBeDefined();
      expect(attrs.age).toBeGreaterThan(0);
      expect(attrs.height).toBeGreaterThan(0);
      expect(attrs.appearance).toBeDefined();
      expect(attrs.appearance?.hair).toBeDefined();
      expect(attrs.appearance?.eyes).toBeDefined();
      expect(attrs.appearance?.skin).toBeDefined();
      expect(attrs.appearance?.build).toBeDefined();
    });

    it('should create entity with custom ID', () => {
      const customEntity = HumanEntity.createRandom('custom_id');

      expect(customEntity.id).toBe('custom_id');
    });

    it('should create different entities on multiple calls', async () => {
      const entity1 = HumanEntity.createRandom();
      // Add small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 1));
      const entity2 = HumanEntity.createRandom();

      expect(entity1.id).not.toBe(entity2.id);
      // Note: Due to randomness, other attributes might be the same, but IDs should differ
    });

    it('should have valid appearance values', () => {
      const randomEntity = HumanEntity.createRandom();
      const attrs = getHumanAttributes(randomEntity);
      const appearance = attrs.appearance;

      expect(['black', 'brown', 'blonde', 'red', 'gray', 'white']).toContain(appearance?.hair);
      expect(['brown', 'blue', 'green', 'hazel', 'gray']).toContain(appearance?.eyes);
      expect(['light', 'medium', 'dark', 'olive', 'tan']).toContain(appearance?.skin);
      expect(['slim', 'average', 'athletic', 'heavy']).toContain(appearance?.build);
    });

    it('should have valid clothing values', () => {
      const randomEntity = HumanEntity.createRandom();
      const attrs = getHumanAttributes(randomEntity);
      const clothing = attrs.clothing;

      expect(['shirt', 't-shirt', 'blouse', 'sweater', 'jacket', 'dress']).toContain(clothing?.top);
      expect(['pants', 'jeans', 'shorts', 'skirt', 'dress']).toContain(clothing?.bottom);
      expect(['sneakers', 'boots', 'sandals', 'heels', 'flats', 'dress-shoes']).toContain(clothing?.shoes);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should return "unknown" for age category of non-human entity', () => {
      const objectEntity: EntityDefinition = {
        id: 'test-object',
        type: 'entity',
        entityType: 'object',
        position: { x: 0, y: 0, z: 0 },
        attributes: {
          model: 'chair',
          texture: 'wood',
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 },
          physics: true,
          interactive: true
        }
      };

      const category = HumanEntity.getAgeCategory(objectEntity);
      expect(category).toBe('unknown');
    });

    it('should throw error when trying to set emotion on non-human entity', () => {
      const objectEntity: EntityDefinition = {
        id: 'test-object',
        type: 'entity',
        entityType: 'object',
        position: { x: 0, y: 0, z: 0 },
        attributes: {
          model: 'chair',
          texture: 'wood',
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 },
          physics: true,
          interactive: true
        }
      };

      expect(() => {
        HumanEntity.setEmotion(objectEntity, 'happy');
      }).toThrow('Entity is not a human');
    });

    it('should throw error when trying to perform action on non-human entity', () => {
      const objectEntity: EntityDefinition = {
        id: 'test-object',
        type: 'entity',
        entityType: 'object',
        position: { x: 0, y: 0, z: 0 },
        attributes: {
          model: 'chair',
          texture: 'wood',
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 },
          physics: true,
          interactive: true
        }
      };

      expect(() => {
        HumanEntity.performAction(objectEntity, 'greet');
      }).toThrow('Entity is not a human');
    });

    it('should return false when checking if non-human entity can perform action', () => {
      const objectEntity: EntityDefinition = {
        id: 'test-object',
        type: 'entity',
        entityType: 'object',
        position: { x: 0, y: 0, z: 0 },
        attributes: {
          model: 'chair',
          texture: 'wood',
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 },
          physics: true,
          interactive: true
        }
      };

      const canPerform = HumanEntity.canPerformAction(objectEntity, 'walking');
      expect(canPerform).toBe(false);
    });

    it('should throw error for unknown action in performAction', () => {
      const human = HumanEntity.create('test-human', {
        name: 'Test Human',
        age: 25,
        height: 1.75,
        appearance: {
          hair: 'brown',
          eyes: 'blue',
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
      });

      expect(() => {
        HumanEntity.performAction(human, 'unknown-action' as any);
      }).toThrow('Unknown action: unknown-action');
    });

    it('should return "infant" for very young age in getAgeCategory', () => {
      const human = HumanEntity.create('test-human', {
        name: 'Test Human',
        age: 1, // Very young age
        height: 1.75,
        appearance: {
          hair: 'brown',
          eyes: 'blue',
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
      });

      const category = HumanEntity.getAgeCategory(human);
      expect(category).toBe('infant');
    });

    it('should return false for invalid entity type in canPerformAction', () => {
      // Create a human with invalid entityType to test the edge case
      const invalidEntity: EntityDefinition = {
        id: 'invalid-entity',
        type: 'entity',
        entityType: 'invalid' as any,
        position: { x: 0, y: 0, z: 0 },
        attributes: {}
      };

      const result = HumanEntity.canPerformAction(invalidEntity, 'walking');
      expect(result).toBe(false);
    });
  });
});