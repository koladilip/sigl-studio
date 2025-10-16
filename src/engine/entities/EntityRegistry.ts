// src/engine/entities/EntityRegistry.ts
/**
 * Entity Registry
 * Central registry for managing entity builders
 */

import * as THREE from 'three';
import type { IEntityBuilder } from './base/EntityBase';
import type { EntityDefinition } from '../core/types';
import { HumanBuilder } from './builders/HumanBuilder';
import { ObjectBuilder } from './builders/ObjectBuilder';
import { AnimalBuilder } from './builders/AnimalBuilder';

/**
 * Singleton registry for entity builders
 */
export class EntityRegistry {
  private static instance: EntityRegistry;
  private builders: Map<string, IEntityBuilder> = new Map();
  private subTypeMap: Map<string, string> = new Map(); // subtype -> type mapping
  
  private constructor() {
    this.registerDefaultBuilders();
  }
  
  /**
   * Get singleton instance
   */
  static getInstance(): EntityRegistry {
    if (!EntityRegistry.instance) {
      EntityRegistry.instance = new EntityRegistry();
    }
    return EntityRegistry.instance;
  }
  
  /**
   * Register default builders
   */
  private registerDefaultBuilders(): void {
    this.registerBuilder(new HumanBuilder());
    this.registerBuilder(new ObjectBuilder());
    this.registerBuilder(new AnimalBuilder());
  }
  
  /**
   * Register a custom entity builder
   */
  registerBuilder(builder: IEntityBuilder): void {
    const type = builder.getType();
    this.builders.set(type, builder);
    
    // Map subtypes to this builder
    builder.getSubTypes().forEach(subType => {
      this.subTypeMap.set(subType.toLowerCase(), type);
    });
    
    console.log(`✅ Registered entity builder: ${type} (${builder.getSubTypes().length} subtypes)`);
  }
  
  /**
   * Build entity using registered builders
   */
  buildEntity(definition: EntityDefinition): THREE.Group | null {
    const entityType = definition.entityType;
    const attrs = definition.attributes as any;
    const subType = attrs.entitySubType?.toLowerCase();
    
    // Try to find builder by entity type
    let builder = this.builders.get(entityType);
    
    // If not found, try to find by subtype
    if (!builder && subType) {
      const mappedType = this.subTypeMap.get(subType);
      if (mappedType) {
        builder = this.builders.get(mappedType);
      }
    }
    
    // If still not found, check if subType contains animal prefix
    if (!builder && subType?.includes('animal_')) {
      builder = this.builders.get('animal');
    }
    
    if (!builder) {
      console.warn(`⚠️  No builder found for entity type: ${entityType}, subType: ${subType}`);
      return this.buildFallback(definition);
    }
    
    try {
      return builder.build(definition);
    } catch (error) {
      console.error(`❌ Error building entity ${entityType}:`, error);
      return this.buildFallback(definition);
    }
  }
  
  /**
   * Build fallback entity (simple box)
   */
  private buildFallback(definition: EntityDefinition): THREE.Group {
    const group = new THREE.Group();
    const attrs = definition.attributes as any;
    
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({
      color: attrs.color || '#888888',
      roughness: 0.8
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0.25, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    
    // Position in world
    const pos = definition.position;
    group.position.set(
      (pos.x - 400) / 100,
      -(pos.y - 300) / 100,
      -(pos.z || 0) / 100
    );
    
    return group;
  }
  
  /**
   * Get all registered types
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.builders.keys());
  }
  
  /**
   * Get all registered subtypes
   */
  getRegisteredSubTypes(): string[] {
    return Array.from(this.subTypeMap.keys());
  }
  
  /**
   * Check if a type is registered
   */
  hasBuilder(type: string): boolean {
    return this.builders.has(type) || this.subTypeMap.has(type.toLowerCase());
  }
  
  /**
   * Get builder info
   */
  getBuilderInfo(type: string): { type: string; subtypes: string[] } | null {
    const builder = this.builders.get(type);
    if (!builder) return null;
    
    return {
      type: builder.getType(),
      subtypes: builder.getSubTypes()
    };
  }
  
  /**
   * List all available entities
   */
  listAllEntities(): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    
    this.builders.forEach((builder, type) => {
      result[type] = builder.getSubTypes();
    });
    
    return result;
  }
}

/**
 * Convenience function to build entity
 */
export function buildEntity(definition: EntityDefinition): THREE.Group | null {
  return EntityRegistry.getInstance().buildEntity(definition);
}

/**
 * Convenience function to register custom builder
 */
export function registerEntityBuilder(builder: IEntityBuilder): void {
  EntityRegistry.getInstance().registerBuilder(builder);
}

