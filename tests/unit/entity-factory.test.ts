import { describe, it, expect, beforeEach } from 'vitest';
import { EntityFactory, ObjectAttributes, PropAttributes } from '../../src/engine/entities/entity-factory';
import { HumanAttributes } from '../../src/engine/entities/human-entity';
import { EntityDefinition, PositionDefinition } from '../../src/engine/core/types';

// Helper function to safely cast entity attributes
function getHumanAttributes(entity: EntityDefinition): HumanAttributes {
  return entity.attributes as unknown as HumanAttributes;
}

function getObjectAttributes(entity: EntityDefinition): ObjectAttributes {
  return entity.attributes as unknown as ObjectAttributes;
}

function getPropAttributes(entity: EntityDefinition): PropAttributes {
  return entity.attributes as unknown as PropAttributes;
}

describe('EntityFactory', () => {
  let position: PositionDefinition;
  let humanAttributes: Partial<HumanAttributes>;
  let objectAttributes: Partial<ObjectAttributes>;
  let propAttributes: Partial<PropAttributes>;

  beforeEach(() => {
    // Reset counter for consistent test results
    EntityFactory.resetCounter();
    
    position = { x: 10, y: 20, z: 5 };
    
    humanAttributes = {
      name: 'Test Human',
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

    objectAttributes = {
      name: 'Test Object',
      material: 'wood',
      color: '#8B4513',
      scale: { x: 2, y: 1, z: 0.5 },
      rotation: { x: 0, y: 45, z: 0 },
      physics: {
        enabled: true,
        mass: 10,
        friction: 0.8
      }
    };

    propAttributes = {
      name: 'Test Prop',
      model: 'chair_model',
      texture: 'wood_texture',
      scale: { x: 1, y: 1, z: 1 },
      rotation: { x: 0, y: 0, z: 0 },
      interactive: false
    };
  });

  describe('createEntity', () => {
    it('should create a generic entity with basic properties', () => {
      const entity = EntityFactory.createEntity('human', 'test1', humanAttributes, position);

      expect(entity).toMatchObject({
        type: 'entity',
        id: 'test1',
        entityType: 'human',
        position: position
      });
      
      const attrs = getHumanAttributes(entity);
      expect(attrs.name).toBe('Test Human');
      expect(attrs.age).toBe(30);
    });

    it('should create entity with auto-generated ID when not provided', () => {
      const entity = EntityFactory.createEntity('human', undefined, humanAttributes);

      expect(entity.id).toMatch(/^human_\d+$/);
      expect(entity.entityType).toBe('human');
    });

    it('should create entity with default position when not provided', () => {
      const entity = EntityFactory.createEntity('human', 'test2', humanAttributes);

      expect(entity.position).toEqual({ x: 0, y: 0, z: 0 });
    });

    it('should handle different entity types', () => {
      const humanEntity = EntityFactory.createEntity('human', 'human1', humanAttributes);
      const objectEntity = EntityFactory.createEntity('object', 'object1', objectAttributes);
      const propEntity = EntityFactory.createEntity('prop', 'prop1', propAttributes);

      expect(humanEntity.entityType).toBe('human');
      expect(objectEntity.entityType).toBe('object');
      expect(propEntity.entityType).toBe('prop');
    });

    it('should handle empty attributes', () => {
      const entity = EntityFactory.createEntity('human', 'empty1', {});

      expect(entity.type).toBe('entity');
      expect(entity.entityType).toBe('human');
      expect(entity.id).toBe('empty1');
    });
  });

  describe('createHuman', () => {
    it('should create human entity with default attributes when none provided', () => {
      const human = EntityFactory.createHuman();

      expect(human.entityType).toBe('human');
      expect(human.id).toMatch(/^human_\d+$/);
      
      const attrs = getHumanAttributes(human);
      expect(attrs.name).toBe('Human');
      expect(attrs.age).toBe(25);
      expect(attrs.height).toBe(1.75);
      expect(attrs.appearance?.hair).toBe('brown');
      expect(attrs.clothing?.top).toBe('shirt');
      expect(attrs.animation).toBe('idle');
      expect(attrs.emotion).toBe('neutral');
    });

    it('should create human entity with custom attributes', () => {
      const human = EntityFactory.createHuman('human1', humanAttributes, position);

      expect(human.entityType).toBe('human');
      expect(human.id).toBe('human1');
      expect(human.position).toEqual(position);
      
      const attrs = getHumanAttributes(human);
      expect(attrs.name).toBe('Test Human');
      expect(attrs.age).toBe(30);
      expect(attrs.height).toBe(1.75);
      expect(attrs.appearance?.hair).toBe('brown');
      expect(attrs.clothing?.top).toBe('shirt');
    });

    it('should merge custom attributes with defaults', () => {
      const partialAttrs = { name: 'Custom Name', age: 40 };
      const human = EntityFactory.createHuman('partial1', partialAttrs);

      const attrs = getHumanAttributes(human);
      expect(attrs.name).toBe('Custom Name');
      expect(attrs.age).toBe(40);
      expect(attrs.height).toBe(1.75); // Should use default
      expect(attrs.appearance?.hair).toBe('brown'); // Should use default
    });

    it('should handle complex human attributes', () => {
      const complexAttrs: Partial<HumanAttributes> = {
        ...humanAttributes,
        emotion: 'happy',
        clothing: {
          ...humanAttributes.clothing!,
          accessories: ['watch', 'hat'],
          colors: {
            primary: '#FF0000',
            secondary: '#00FF00',
            accent: '#0000FF'
          }
        },
        appearance: {
          ...humanAttributes.appearance!,
          facialHair: 'beard'
        }
      };

      const human = EntityFactory.createHuman('complex1', complexAttrs);
      const attrs = getHumanAttributes(human);
      
      expect(attrs.emotion).toBe('happy');
      expect(attrs.clothing?.accessories).toEqual(['watch', 'hat']);
      expect(attrs.clothing?.colors?.primary).toBe('#FF0000');
      expect(attrs.appearance?.facialHair).toBe('beard');
    });
  });

  describe('createObject', () => {
    it('should create object entity with default attributes when none provided', () => {
      const object = EntityFactory.createObject();

      expect(object.entityType).toBe('object');
      expect(object.id).toMatch(/^object_\d+$/);
      
      const attrs = getObjectAttributes(object);
      expect(attrs.name).toBe('Object');
      expect(attrs.material).toBe('default');
      expect(attrs.color).toBe('#888888');
      expect(attrs.scale).toEqual({ x: 1, y: 1, z: 1 });
      expect(attrs.rotation).toEqual({ x: 0, y: 0, z: 0 });
      expect(attrs.physics.enabled).toBe(false);
      expect(attrs.physics.mass).toBe(1.0);
      expect(attrs.physics.friction).toBe(0.5);
    });

    it('should create object entity with custom attributes', () => {
      const object = EntityFactory.createObject('object1', objectAttributes, position);

      expect(object.entityType).toBe('object');
      expect(object.id).toBe('object1');
      expect(object.position).toEqual(position);
      
      const attrs = getObjectAttributes(object);
      expect(attrs.name).toBe('Test Object');
      expect(attrs.material).toBe('wood');
      expect(attrs.color).toBe('#8B4513');
      expect(attrs.scale).toEqual({ x: 2, y: 1, z: 0.5 });
      expect(attrs.rotation).toEqual({ x: 0, y: 45, z: 0 });
      expect(attrs.physics.enabled).toBe(true);
      expect(attrs.physics.mass).toBe(10);
      expect(attrs.physics.friction).toBe(0.8);
    });

    it('should merge custom attributes with defaults', () => {
      const partialAttrs = { name: 'Custom Object', material: 'metal' };
      const object = EntityFactory.createObject('partial1', partialAttrs);

      const attrs = getObjectAttributes(object);
      expect(attrs.name).toBe('Custom Object');
      expect(attrs.material).toBe('metal');
      expect(attrs.color).toBe('#888888'); // Should use default
      expect(attrs.scale).toEqual({ x: 1, y: 1, z: 1 }); // Should use default
    });
  });

  describe('createProp', () => {
    it('should create prop entity with default attributes when none provided', () => {
      const prop = EntityFactory.createProp();

      expect(prop.entityType).toBe('prop');
      expect(prop.id).toMatch(/^prop_\d+$/);
      
      const attrs = getPropAttributes(prop);
      expect(attrs.name).toBe('Prop');
      expect(attrs.model).toBe('default');
      expect(attrs.texture).toBe('default');
      expect(attrs.scale).toEqual({ x: 1, y: 1, z: 1 });
      expect(attrs.rotation).toEqual({ x: 0, y: 0, z: 0 });
      expect(attrs.interactive).toBe(false);
    });

    it('should create prop entity with custom attributes', () => {
      const prop = EntityFactory.createProp('prop1', propAttributes, position);

      expect(prop.entityType).toBe('prop');
      expect(prop.id).toBe('prop1');
      expect(prop.position).toEqual(position);
      
      const attrs = getPropAttributes(prop);
      expect(attrs.name).toBe('Test Prop');
      expect(attrs.model).toBe('chair_model');
      expect(attrs.texture).toBe('wood_texture');
      expect(attrs.scale).toEqual({ x: 1, y: 1, z: 1 });
      expect(attrs.rotation).toEqual({ x: 0, y: 0, z: 0 });
      expect(attrs.interactive).toBe(false);
    });

    it('should merge custom attributes with defaults', () => {
      const partialAttrs = { name: 'Custom Prop', interactive: true };
      const prop = EntityFactory.createProp('partial1', partialAttrs);

      const attrs = getPropAttributes(prop);
      expect(attrs.name).toBe('Custom Prop');
      expect(attrs.interactive).toBe(true);
      expect(attrs.model).toBe('default'); // Should use default
      expect(attrs.texture).toBe('default'); // Should use default
    });
  });

  describe('cloneEntity', () => {
    let originalEntity: EntityDefinition;

    beforeEach(() => {
      originalEntity = EntityFactory.createHuman('original', humanAttributes, position);
    });

    it('should create exact copy with new ID', () => {
      const cloned = EntityFactory.cloneEntity(originalEntity, 'cloned1');

      expect(cloned.id).toBe('cloned1');
      expect(cloned.type).toBe(originalEntity.type);
      expect(cloned.entityType).toBe(originalEntity.entityType);
      expect(cloned.position).toEqual(originalEntity.position);
      expect(cloned.attributes).toEqual(originalEntity.attributes);
    });

    it('should create copy with auto-generated ID when not provided', () => {
      const cloned = EntityFactory.cloneEntity(originalEntity);

      expect(cloned.id).toMatch(/^original_clone_\d+$/);
      expect(cloned.entityType).toBe(originalEntity.entityType);
    });

    it('should create independent copy', () => {
      const cloned = EntityFactory.cloneEntity(originalEntity, 'cloned2');
      
      // Modify cloned entity's attributes
      const modifiedCloned = EntityFactory.updateAttributes(cloned, { name: 'Modified' });
      
      // Original should remain unchanged
      const originalAttrs = getHumanAttributes(originalEntity);
      const modifiedAttrs = getHumanAttributes(modifiedCloned);
      expect(originalAttrs.name).toBe('Test Human');
      expect(modifiedAttrs.name).toBe('Modified');
    });

    it('should clone different entity types', () => {
      const objectEntity = EntityFactory.createObject('obj1', objectAttributes);
      const propEntity = EntityFactory.createProp('prop1', propAttributes);

      const clonedObject = EntityFactory.cloneEntity(objectEntity, 'cloned_obj');
      const clonedProp = EntityFactory.cloneEntity(propEntity, 'cloned_prop');

      expect(clonedObject.entityType).toBe('object');
      expect(clonedProp.entityType).toBe('prop');
    });
  });

  describe('updatePosition', () => {
    let entity: EntityDefinition;

    beforeEach(() => {
      entity = EntityFactory.createHuman('update1', humanAttributes, position);
    });

    it('should update entity position', () => {
      const newPosition = { x: 100, y: 200 };
      const updated = EntityFactory.updatePosition(entity, newPosition);

      expect(updated.position.x).toBe(100);
      expect(updated.position.y).toBe(200);
      expect(updated.position.z).toBe(position.z); // Should preserve z
    });

    it('should update partial position', () => {
      const updated = EntityFactory.updatePosition(entity, { z: 50 });

      expect(updated.position.x).toBe(position.x); // Should preserve x
      expect(updated.position.y).toBe(position.y); // Should preserve y
      expect(updated.position.z).toBe(50);
    });

    it('should not modify original entity', () => {
      EntityFactory.updatePosition(entity, { x: 999 });

      expect(entity.position.x).toBe(position.x);
    });
  });

  describe('updateAttributes', () => {
    let entity: EntityDefinition;

    beforeEach(() => {
      entity = EntityFactory.createHuman('update1', humanAttributes);
    });

    it('should update entity attributes', () => {
      const updates = { name: 'Updated Name', age: 35 };
      const updated = EntityFactory.updateAttributes(entity, updates);

      const attrs = getHumanAttributes(updated);
      expect(attrs.name).toBe('Updated Name');
      expect(attrs.age).toBe(35);
      expect(attrs.height).toBe(humanAttributes.height); // Should preserve other attributes
    });

    it('should update nested attributes', () => {
      const updates = {
        appearance: {
          hair: 'blonde',
          eyes: 'green'
        }
      };
      const updated = EntityFactory.updateAttributes(entity, updates);

      const attrs = getHumanAttributes(updated);
      expect(attrs.appearance?.hair).toBe('blonde');
      expect(attrs.appearance?.eyes).toBe('green');
    });

    it('should not modify original entity', () => {
      const originalAttrs = getHumanAttributes(entity);
      const originalName = originalAttrs.name;
      
      EntityFactory.updateAttributes(entity, { name: 'New Name' });
      
      expect(originalAttrs.name).toBe(originalName);
    });

    it('should handle empty updates', () => {
      const updated = EntityFactory.updateAttributes(entity, {});

      expect(updated.attributes).toEqual(entity.attributes);
      expect(updated.id).toBe(entity.id);
    });
  });

  describe('findEntityById', () => {
    let entities: EntityDefinition[];

    beforeEach(() => {
      entities = [
        EntityFactory.createHuman('human1', { name: 'Alice', age: 25 }),
        EntityFactory.createHuman('human2', { name: 'Bob', age: 30 }),
        EntityFactory.createObject('object1', { name: 'Table', material: 'wood' }),
        EntityFactory.createProp('prop1', { name: 'Chair', model: 'chair_model' })
      ];
    });

    it('should find entity by ID', () => {
      const found = EntityFactory.findEntityById(entities, 'human2');

      expect(found).toBeDefined();
      expect(found?.id).toBe('human2');
      const attrs = getHumanAttributes(found!);
      expect(attrs.name).toBe('Bob');
    });

    it('should return undefined for non-existent ID', () => {
      const found = EntityFactory.findEntityById(entities, 'nonexistent');

      expect(found).toBeUndefined();
    });

    it('should handle empty entity array', () => {
      const found = EntityFactory.findEntityById([], 'any_id');

      expect(found).toBeUndefined();
    });
  });

  describe('findEntitiesByType', () => {
    let entities: EntityDefinition[];

    beforeEach(() => {
      entities = [
        EntityFactory.createHuman('human1', { name: 'Alice' }),
        EntityFactory.createHuman('human2', { name: 'Bob' }),
        EntityFactory.createObject('object1', { name: 'Table' }),
        EntityFactory.createProp('prop1', { name: 'Chair' })
      ];
    });

    it('should find all entities of specified type', () => {
      const humans = EntityFactory.findEntitiesByType(entities, 'human');
      const objects = EntityFactory.findEntitiesByType(entities, 'object');
      const props = EntityFactory.findEntitiesByType(entities, 'prop');

      expect(humans).toHaveLength(2);
      expect(objects).toHaveLength(1);
      expect(props).toHaveLength(1);

      expect(humans[0].id).toBe('human1');
      expect(humans[1].id).toBe('human2');
      expect(objects[0].id).toBe('object1');
      expect(props[0].id).toBe('prop1');
    });

    it('should return empty array for non-existent type', () => {
      const found = EntityFactory.findEntitiesByType([], 'human');

      expect(found).toEqual([]);
    });
  });

  describe('removeEntity', () => {
    let entities: EntityDefinition[];

    beforeEach(() => {
      entities = [
        EntityFactory.createHuman('human1', { name: 'Alice' }),
        EntityFactory.createHuman('human2', { name: 'Bob' }),
        EntityFactory.createObject('object1', { name: 'Table' })
      ];
    });

    it('should remove entity by ID', () => {
      const remaining = EntityFactory.removeEntity(entities, 'human1');

      expect(remaining).toHaveLength(2);
      expect(remaining.find(e => e.id === 'human1')).toBeUndefined();
      expect(remaining.find(e => e.id === 'human2')).toBeDefined();
      expect(remaining.find(e => e.id === 'object1')).toBeDefined();
    });

    it('should return same array if ID not found', () => {
      const remaining = EntityFactory.removeEntity(entities, 'nonexistent');

      expect(remaining).toHaveLength(3);
    });

    it('should not modify original array', () => {
      EntityFactory.removeEntity(entities, 'human1');

      expect(entities).toHaveLength(3);
    });
  });

  describe('findEntitiesNearPosition', () => {
    let entities: EntityDefinition[];

    beforeEach(() => {
      entities = [
        EntityFactory.createHuman('near1', {}, { x: 0, y: 0, z: 0 }),
        EntityFactory.createHuman('near2', {}, { x: 3, y: 4, z: 0 }), // Distance = 5
        EntityFactory.createHuman('far1', {}, { x: 10, y: 10, z: 0 }), // Distance ≈ 14.14
        EntityFactory.createObject('near3', {}, { x: 1, y: 1, z: 1 }) // Distance ≈ 1.73
      ];
    });

    it('should find entities within specified distance', () => {
      const center = { x: 0, y: 0, z: 0 };
      const nearEntities = EntityFactory.findEntitiesNearPosition(entities, center, 6);

      expect(nearEntities).toHaveLength(3);
      expect(nearEntities.map(e => e.id)).toContain('near1');
      expect(nearEntities.map(e => e.id)).toContain('near2');
      expect(nearEntities.map(e => e.id)).toContain('near3');
      expect(nearEntities.map(e => e.id)).not.toContain('far1');
    });

    it('should handle 2D positions (z defaults to 0)', () => {
      const center = { x: 0, y: 0 };
      const nearEntities = EntityFactory.findEntitiesNearPosition(entities, center, 2);

      expect(nearEntities).toHaveLength(2); // near1 and near3
    });

    it('should return empty array when no entities are near', () => {
      const center = { x: 100, y: 100, z: 100 };
      const nearEntities = EntityFactory.findEntitiesNearPosition(entities, center, 1);

      expect(nearEntities).toHaveLength(0);
    });
  });

  describe('resetCounter', () => {
    it('should reset entity counter', () => {
      // Create some entities to increment counter
      EntityFactory.createHuman();
      EntityFactory.createObject();
      
      // Reset counter
      EntityFactory.resetCounter();
      
      // Next entity should start from 1 again
      const entity = EntityFactory.createHuman();
      expect(entity.id).toBe('human_1');
    });
  });

  describe('Entity type validation', () => {
    it('should create entities with correct types', () => {
      const human = EntityFactory.createHuman('h1', humanAttributes);
      const object = EntityFactory.createObject('o1', objectAttributes);
      const prop = EntityFactory.createProp('p1', propAttributes);

      expect(human.type).toBe('entity');
      expect(object.type).toBe('entity');
      expect(prop.type).toBe('entity');

      expect(human.entityType).toBe('human');
      expect(object.entityType).toBe('object');
      expect(prop.entityType).toBe('prop');
    });

    it('should maintain type consistency after operations', () => {
      const human = EntityFactory.createHuman('h1', humanAttributes);
      const cloned = EntityFactory.cloneEntity(human, 'h2');
      const updated = EntityFactory.updateAttributes(human, { name: 'Updated' });

      expect(cloned.entityType).toBe('human');
      expect(updated.entityType).toBe('human');
    });
  });

  describe('Position handling', () => {
    it('should handle 2D positions', () => {
      const pos2D = { x: 10, y: 20 };
      const entity = EntityFactory.createHuman('pos2d', humanAttributes, pos2D);

      expect(entity.position).toEqual({ x: 10, y: 20 });
    });

    it('should handle 3D positions', () => {
      const pos3D = { x: 10, y: 20, z: 30 };
      const entity = EntityFactory.createHuman('pos3d', humanAttributes, pos3D);

      expect(entity.position).toEqual({ x: 10, y: 20, z: 30 });
    });

    it('should default to origin when no position provided', () => {
      const entity = EntityFactory.createHuman('origin', humanAttributes);

      expect(entity.position).toEqual({ x: 0, y: 0, z: 0 });
    });
  });

  describe('Edge Cases and Data Validation', () => {
    it('should handle string to number conversion for age', () => {
      const humanAttrsWithStringAge = {
        ...humanAttributes,
        age: '30' as any // String instead of number
      };

      const entity = EntityFactory.createHuman('string-age', humanAttrsWithStringAge);
      const attrs = getHumanAttributes(entity);
      
      expect(attrs.age).toBe(30);
      expect(typeof attrs.age).toBe('number');
    });

    it('should handle invalid string age with default fallback', () => {
      const humanAttrsWithInvalidAge = {
        ...humanAttributes,
        age: 'invalid-age' as any
      };

      const entity = EntityFactory.createHuman('invalid-age', humanAttrsWithInvalidAge);
      const attrs = getHumanAttributes(entity);
      
      expect(attrs.age).toBe(25); // Default fallback
    });

    it('should handle string to number conversion for height', () => {
      const humanAttrsWithStringHeight = {
        ...humanAttributes,
        height: '1.80' as any // String instead of number
      };

      const entity = EntityFactory.createHuman('string-height', humanAttrsWithStringHeight);
      const attrs = getHumanAttributes(entity);
      
      expect(attrs.height).toBe(1.80);
      expect(typeof attrs.height).toBe('number');
    });

    it('should handle invalid string height with default fallback', () => {
      const humanAttrsWithInvalidHeight = {
        ...humanAttributes,
        height: 'invalid-height' as any
      };

      const entity = EntityFactory.createHuman('invalid-height', humanAttrsWithInvalidHeight);
      const attrs = getHumanAttributes(entity);
      
      expect(attrs.height).toBe(1.75); // Default fallback
    });

    it('should assign default scale when missing for objects', () => {
      const objectAttrsWithoutScale = {
        name: 'Test Table',
        material: 'wood',
        color: 'brown',
        rotation: { x: 0, y: 0, z: 0 },
        physics: {
          enabled: true,
          mass: 10,
          friction: 0.5
        }
        // scale is missing
      };

      const entity = EntityFactory.createObject('no-scale', objectAttrsWithoutScale);
      const attrs = entity.attributes as unknown as ObjectAttributes;
      
      expect(attrs.scale).toEqual({ x: 1, y: 1, z: 1 });
    });

    it('should assign default rotation when missing for objects', () => {
      const objectAttrsWithoutRotation = {
        name: 'Test Table',
        material: 'wood',
        color: 'brown',
        scale: { x: 1, y: 1, z: 1 },
        physics: {
          enabled: true,
          mass: 10,
          friction: 0.5
        }
        // rotation is missing
      };

      const entity = EntityFactory.createObject('no-rotation', objectAttrsWithoutRotation);
      const attrs = entity.attributes as unknown as ObjectAttributes;
      
      expect(attrs.rotation).toEqual({ x: 0, y: 0, z: 0 });
    });

    it('should handle boolean conversion for interactive prop attribute', () => {
      const propAttrsWithStringInteractive = {
        name: 'Test Book',
        model: 'book',
        texture: 'paper',
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        interactive: 'true' as any // String instead of boolean
      };

      const entity = EntityFactory.createProp('string-interactive', propAttrsWithStringInteractive);
      const attrs = entity.attributes as unknown as PropAttributes;
      
      expect(attrs.interactive).toBe(true);
      expect(typeof attrs.interactive).toBe('boolean');
    });

    it('should handle falsy string for interactive prop attribute', () => {
      const propAttrsWithFalsyInteractive = {
        name: 'Test Book',
        model: 'book',
        texture: 'paper',
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        interactive: '' as any // Empty string
      };

      const entity = EntityFactory.createProp('falsy-interactive', propAttrsWithFalsyInteractive);
      const attrs = entity.attributes as unknown as PropAttributes;
      
      expect(attrs.interactive).toBe(false);
    });

    it('should handle mixed type attributes in validation', () => {
      const mixedAttributes = {
        name: 'Mixed Human',
        age: '35', // String
        height: 1.70, // Number
        appearance: humanAttributes.appearance,
        clothing: humanAttributes.clothing,
        animation: humanAttributes.animation,
        emotion: humanAttributes.emotion
      };

      const entity = EntityFactory.createHuman('mixed-types', mixedAttributes as any);
      const attrs = getHumanAttributes(entity);
      
      expect(attrs.name).toBe('Mixed Human');
      expect(attrs.age).toBe(35);
      expect(typeof attrs.age).toBe('number');
      expect(attrs.height).toBe(1.70);
    });

    it('should preserve valid attributes during validation', () => {
      const validAttributes = {
        ...humanAttributes,
        age: 40,
        height: 1.85
      };

      const entity = EntityFactory.createHuman('valid-attrs', validAttributes);
      const attrs = getHumanAttributes(entity);
      
      expect(attrs.age).toBe(40);
      expect(attrs.height).toBe(1.85);
      expect(attrs.name).toBe(humanAttributes.name);
    });
  });
});