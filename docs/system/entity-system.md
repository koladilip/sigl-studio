# SIGL Entity System Documentation

## Overview

A comprehensive, extensible entity library for creating 3D objects in SIGL scenes. The system uses a builder pattern with a central registry for managing different entity types.

## Architecture

### Core Components

1. **EntityBase.ts** - Base interfaces and abstract classes
   - `IEntityBuilder` - Interface for all entity builders
   - `EntityBuilder` - Abstract base class with common functionality
   - `EntityColors` - Centralized color management for skin tones, hair, eyes

2. **Entity Builders** - Specialized builders for different entity types
   - `HumanBuilder` - Creates realistic human figures with facial features
   - `ObjectBuilder` - Creates various objects (furniture, buildings, vehicles)
   - `AnimalBuilder` - Creates animals (dogs, cats, birds, horses, etc.)

3. **EntityRegistry** - Central registry managing all builders
   - Singleton pattern for global access
   - Automatic type and subtype mapping
   - Extensible - can register custom builders

## Features

### Human Builder
- **Realistic facial features:**
  - Eyes with pupils and iris colors
  - Nose, mouth (smile), ears
  - Scalable hair with different styles (short, long, curly, bald)
- **Detailed anatomy:**
  - Oval-shaped head with proper proportions
  - Neck, torso, arms with elbows, hands
  - Legs with knees, feet/shoes
  - Support for dresses vs pants/shirts
- **Age-based scaling:**
  - Infants (age < 3): 0.4x scale
  - Children (age < 12): 0.7x scale
  - Adults: 1.0x scale
- **Customizable attributes:**
  - Skin tones (light, medium, dark, olive, pale, tan)
  - Hair colors (black, brown, blonde, red, gray, white)
  - Eye colors (blue, brown, green, hazel, gray, amber)
  - Clothing colors and styles

### Object Builder
Supports 14+ object types:
- **Nature:** tree
- **Structures:** house, building
- **Vehicles:** car, boat
- **Furniture:** chair, desk, table
- **Educational:** blackboard
- **Generic:** box (fallback)

Each object has realistic geometry and materials.

### Animal Builder
Supports 14+ animal types:
- **Pets:** dog, cat
- **Birds:** bird (with wings and beak)
- **Farm animals:** horse, cow, sheep, pig
- **Wildlife:** rabbit, deer, bear, lion, tiger, elephant, giraffe

Animals feature:
- Realistic body proportions
- Species-specific features (tails, ears, snouts)
- Proper leg/limb positioning

## Usage

### Basic Usage

```typescript
import { buildEntity } from '@/engine/entities';

// Entity definition from parser
const entityDef = {
  type: 'entity',
  id: 'person1',
  entityType: 'human',
  attributes: {
    entitySubType: 'adult_male',
    age: 35,
    appearance: {
      skin: 'medium',
      hair: 'brown',
      eyes: 'blue'
    },
    clothing: {
      shirt: '#4a90e2',
      pants: '#2c3e50'
    }
  },
  position: { x: 400, y: 300, z: 0 }
};

// Build the 3D entity
const humanGroup = buildEntity(entityDef);
scene.add(humanGroup);
```

### Registering Custom Builders

```typescript
import { EntityBuilder, registerEntityBuilder } from '@/engine/entities';
import * as THREE from 'three';

class VehicleBuilder extends EntityBuilder {
  getType(): string {
    return 'vehicle';
  }
  
  getSubTypes(): string[] {
    return ['car', 'truck', 'motorcycle', 'airplane'];
  }
  
  build(definition: EntityDefinition): THREE.Group {
    const group = new THREE.Group();
    // ... build your custom vehicle
    this.positionEntity(group, definition);
    return group;
  }
}

// Register the builder
registerEntityBuilder(new VehicleBuilder());
```

### Querying Available Entities

```typescript
import { EntityRegistry } from '@/engine/entities';

const registry = EntityRegistry.getInstance();

// Get all registered types
const types = registry.getRegisteredTypes();
// ['human', 'object', 'animal']

// Get all entities organized by type
const allEntities = registry.listAllEntities();
// {
//   human: ['adult_male', 'adult_female', 'child_male', ...],
//   object: ['tree', 'car', 'house', ...],
//   animal: ['dog', 'cat', 'bird', ...]
// }

// Check if a type is supported
const hasHuman = registry.hasBuilder('human'); // true
```

## Built-in Entity Types

### Humans (11 subtypes)
- `adult_male`, `adult_female`, `adult_neutral`
- `child_male`, `child_female`, `child_neutral`
- `infant`, `toddler`, `teenager`
- `elderly_male`, `elderly_female`

### Objects (14 subtypes)
- `tree`, `house`, `car`, `building`, `boat`
- `chair`, `desk`, `table`, `blackboard`
- `bed`, `lamp`, `door`, `window`, `box`

### Animals (14 subtypes)
- `dog`, `cat`, `bird`
- `horse`, `cow`, `sheep`, `pig`
- `rabbit`, `deer`, `bear`
- `lion`, `tiger`, `elephant`, `giraffe`

## Extensibility

The entity system is designed to be highly extensible:

1. **Create custom builders** by extending `EntityBuilder`
2. **Register builders** at runtime using `registerEntityBuilder()`
3. **Override default behavior** by re-registering builders with the same type
4. **Add new entity categories** without modifying existing code

## Integration with SIGL Renderer

The Three.js renderer automatically uses the entity registry:

```typescript
// In threejs-renderer.ts
private createEntityMesh(entity: EntityDefinition): THREE.Object3D | null {
  const registry = EntityRegistry.getInstance();
  return registry.buildEntity(entity);
}
```

This ensures all entities are created through the extensible builder system.

## Color System

Centralized color management in `EntityColors`:

```typescript
// Skin tones
EntityColors.getSkinColor('medium'); // '#E1A95F'

// Hair colors  
EntityColors.getHairColor('blonde'); // '#FAD5A5'

// Eye colors
EntityColors.getEyeColor('blue'); // '#4A90E2'
```

Supports both named colors and hex codes.

## Testing

The system has been tested with:
- ✅ Family portrait scene (4 humans with different ages/clothing)
- ✅ Position resolution (relative positioning)
- ✅ Multiple entity types in same scene
- ✅ Custom attributes (clothing, colors, features)

## Benefits

1. **Maintainability** - Centralized entity creation logic
2. **Extensibility** - Easy to add new entity types
3. **Reusability** - Shared base classes and utilities
4. **Type Safety** - TypeScript interfaces and types
5. **Performance** - Optimized geometry creation and reuse
6. **Scalability** - Registry pattern supports unlimited entity types

## File Structure

```
src/engine/entities/
├── base/
│   └── EntityBase.ts          # Core interfaces and base classes
├── builders/
│   ├── HumanBuilder.ts        # Human entity builder
│   ├── ObjectBuilder.ts       # Object entity builder
│   └── AnimalBuilder.ts       # Animal entity builder
├── EntityRegistry.ts          # Central registry
└── index.ts                   # Main exports
```

## Next Steps

Potential enhancements:
- Add more animal types (insects, fish, reptiles)
- Vehicle builder (cars, planes, ships)
- Plant/nature builder (flowers, bushes, rocks)
- Architectural builder (detailed buildings)
- Fantasy/sci-fi builders (aliens, robots, creatures)
- Animation support (walking, gestures, expressions)
- LOD (Level of Detail) support for performance

