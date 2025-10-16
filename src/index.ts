/**
 * SITL Engine - SimpleImage Template Language
 * Main entry point for the SITL system
 */

// Core engine exports
export { SITLEngine } from './core/engine';
export { SITLParser } from './parser/sitl-parser';
export { SceneRenderer } from './rendering/scene-renderer';
export { ExportManager } from './rendering/export-manager';

// Import types for internal use
import type { SITLConfig } from './core/types';

// Entity system exports
export { EntityFactory } from './entities/entity-factory';
export { HumanEntity } from './entities/human-entity';

// Utility exports
export { ColorSystem } from './utils/colors/color-system';
export { PositionSystem } from './utils/positioning/position-system';
export { ValidationEngine } from './utils/validation/validation-engine';

// Template system exports
export { TemplateEngine } from './templates/template-engine';

// Extension system exports
export { ExtensionManager } from './extensions/extension-manager';

// Type exports
export type {
  SITLConfig,
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
export const ENGINE_NAME = 'SITL Engine';

// Default configuration
export const DEFAULT_CONFIG: Partial<SITLConfig> = {
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