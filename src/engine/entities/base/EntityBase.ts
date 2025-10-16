// src/engine/entities/base/EntityBase.ts
/**
 * Base Entity System
 * Core interfaces and types for the entity library
 */

import * as THREE from 'three';
import type { EntityDefinition } from '../../core/types';

/**
 * Material configuration for entity parts
 */
export interface MaterialConfig {
  color: string;
  roughness?: number;
  metalness?: number;
  transparent?: boolean;
  opacity?: number;
}

/**
 * Entity part configuration
 */
export interface EntityPart {
  name: string;
  mesh: THREE.Mesh | THREE.Group;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
}

/**
 * Base builder interface for all entities
 */
export interface IEntityBuilder {
  /**
   * Build the 3D representation of the entity
   */
  build(definition: EntityDefinition): THREE.Group;
  
  /**
   * Get entity type this builder handles
   */
  getType(): string;
  
  /**
   * Get supported subtypes
   */
  getSubTypes(): string[];
}

/**
 * Base abstract class for entity builders
 */
export abstract class EntityBuilder implements IEntityBuilder {
  protected scale: number = 1.0;
  
  abstract build(definition: EntityDefinition): THREE.Group;
  abstract getType(): string;
  abstract getSubTypes(): string[];
  
  /**
   * Calculate scale based on entity attributes
   */
  protected calculateScale(definition: EntityDefinition): number {
    const attrs = definition.attributes as any;
    
    // Age-based scaling for humans
    if (attrs.age !== undefined) {
      if (attrs.age < 3) return 0.4;
      if (attrs.age < 12) return 0.7;
      return 1.0;
    }
    
    // Size attribute
    if (attrs.size) {
      const sizeMap: Record<string, number> = {
        'tiny': 0.3,
        'small': 0.6,
        'medium': 1.0,
        'large': 1.5,
        'huge': 2.0
      };
      return sizeMap[attrs.size.toLowerCase()] || 1.0;
    }
    
    return 1.0;
  }
  
  /**
   * Create material with common settings
   */
  protected createMaterial(config: MaterialConfig): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: config.color,
      roughness: config.roughness ?? 0.8,
      metalness: config.metalness ?? 0.1,
      transparent: config.transparent ?? false,
      opacity: config.opacity ?? 1.0
    });
  }
  
  /**
   * Apply common mesh properties
   */
  protected setupMesh(mesh: THREE.Mesh, castShadow: boolean = true, receiveShadow: boolean = true): void {
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;
  }
  
  /**
   * Position entity in world space
   */
  protected positionEntity(group: THREE.Group, definition: EntityDefinition): void {
    const pos = definition.position;
    group.position.set(
      (pos.x - 400) / 100,
      -(pos.y - 300) / 100,
      -(pos.z || 0) / 100
    );
  }
}

/**
 * Color utilities for entities
 */
export class EntityColors {
  static readonly SKIN_TONES: Record<string, string> = {
    'light': '#FDBCB4',
    'medium': '#E1A95F',
    'dark': '#8D5524',
    'olive': '#C68642',
    'pale': '#FFE4C4',
    'tan': '#D2B48C',
    'brown': '#8B4513'
  };
  
  static readonly HAIR_COLORS: Record<string, string> = {
    'black': '#2C1B18',
    'brown': '#8B4513',
    'blonde': '#FAD5A5',
    'red': '#CC4125',
    'auburn': '#A52A2A',
    'gray': '#808080',
    'grey': '#808080',
    'white': '#F5F5F5',
    'silver': '#C0C0C0'
  };
  
  static readonly EYE_COLORS: Record<string, string> = {
    'blue': '#4A90E2',
    'brown': '#8B4513',
    'green': '#228B22',
    'hazel': '#8E7618',
    'gray': '#708090',
    'grey': '#708090',
    'amber': '#FFBF00'
  };
  
  static getSkinColor(tone?: string): string {
    if (!tone) return this.SKIN_TONES['medium'];
    if (tone.startsWith('#')) return tone;
    return this.SKIN_TONES[tone.toLowerCase()] || this.SKIN_TONES['medium'];
  }
  
  static getHairColor(color?: string): string {
    if (!color) return this.HAIR_COLORS['brown'];
    if (color.startsWith('#')) return color;
    return this.HAIR_COLORS[color.toLowerCase()] || this.HAIR_COLORS['brown'];
  }
  
  static getEyeColor(color?: string): string {
    if (!color) return this.EYE_COLORS['blue'];
    if (color.startsWith('#')) return color;
    return this.EYE_COLORS[color.toLowerCase()] || this.EYE_COLORS['blue'];
  }
}

