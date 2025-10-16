/**
 * SIGL Engine - Structured Image Generation Language
 * Main entry point for the SIGL system
 */

// Core engine exports
export { SIGLEngine } from './core/engine';
export { SIGLParser } from './parser/sigl-parser';
export { SceneRenderer } from './rendering/scene-renderer';

// Import types for internal use
import type { SIGLConfig } from './core/types';

// Entity system exports
export { EntityFactory } from './entities/entity-factory';
export { HumanEntity } from './entities/human-entity';

// Utility exports
export { ColorSystem } from './utils/colors/color-system';
export { PositionSystem } from './utils/positioning/position-system';

// Extension system exports
export { ExtensionManager } from './extensions/extension-manager';

// Type exports
export type {
  SIGLConfig,
  SceneDefinition,
  EntityDefinition,
  RenderOptions,
  ExportOptions,
} from './core/types';

export type {
  ASTNode,
  ParseResult,
  ValidationResult,
} from './parser/types';

export type {
  HumanAttributes,
  EntityAttributes,
  PositionAttributes,
} from './entities/types';

// Version information
export const VERSION = '0.1.0';
export const ENGINE_NAME = 'SIGL Engine';

// Default configuration
export const DEFAULT_CONFIG: Partial<SIGLConfig> = {
  canvas: {
    width: 1024,
    height: 768,
    backgroundColor: '#ffffff',
  },
  rendering: {
    quality: 'high',
    antialiasing: true,
  },
  export: {
    format: 'png',
    quality: 90,
  },
};