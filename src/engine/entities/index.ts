// src/engine/entities/index.ts
/**
 * Entity System - Main export file
 * 
 * A comprehensive entity library for creating 3D objects in SIGL scenes.
 * Provides extensible builders for humans, objects, animals, and more.
 */

// Core entity system
export { EntityBuilder, EntityColors } from './base/EntityBase';
export type { IEntityBuilder, MaterialConfig, EntityPart } from './base/EntityBase';

// Builders
export { HumanBuilder } from './builders/HumanBuilder';
export { ObjectBuilder } from './builders/ObjectBuilder';
export { AnimalBuilder } from './builders/AnimalBuilder';

// Registry
export { EntityRegistry, buildEntity, registerEntityBuilder } from './EntityRegistry';

/**
 * Usage Examples:
 * 
 * 1. Build an entity using the registry:
 * ```typescript
 * import { buildEntity } from '@/engine/entities';
 * 
 * const humanGroup = buildEntity(entityDefinition);
 * scene.add(humanGroup);
 * ```
 * 
 * 2. Register a custom entity builder:
 * ```typescript
 * import { registerEntityBuilder, EntityBuilder } from '@/engine/entities';
 * 
 * class VehicleBuilder extends EntityBuilder {
 *   getType() { return 'vehicle'; }
 *   getSubTypes() { return ['car', 'truck', 'motorcycle']; }
 *   build(definition) { ... }
 * }
 * 
 * registerEntityBuilder(new VehicleBuilder());
 * ```
 * 
 * 3. Get available entity types:
 * ```typescript
 * import { EntityRegistry } from '@/engine/entities';
 * 
 * const registry = EntityRegistry.getInstance();
 * const allTypes = registry.listAllEntities();
 * // { human: ['adult_male', 'adult_female', ...], object: ['tree', 'car', ...], ... }
 * ```
 */

