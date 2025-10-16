/**
 * Validation Engine - Utilities for validating SIGL data structures
 */

import Ajv, { JSONSchemaType, ErrorObject } from 'ajv';
import type {
  SIGLConfig,
  SceneDefinition,
  EntityDefinition,
  ValidationRule,
  SIGLError,
  Result,
} from '../../core/types';

export interface ValidationContext {
  path: string;
  value: unknown;
  schema?: unknown;
}

export class ValidationEngine {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv({ allErrors: true });
  }

  /**
   * Validate SIGL configuration
   */
  validateConfig(config: unknown): Result<SIGLConfig> {
    const schema: JSONSchemaType<SIGLConfig> = {
      type: 'object',
      properties: {
        canvas: {
          type: 'object',
          properties: {
            width: { type: 'number', minimum: 1 },
            height: { type: 'number', minimum: 1 },
            backgroundColor: { type: 'string' },
            dpi: { type: 'number', minimum: 72, nullable: true },
          },
          required: ['width', 'height', 'backgroundColor'],
          additionalProperties: false,
        },
        rendering: {
          type: 'object',
          properties: {
            quality: { type: 'string', enum: ['low', 'medium', 'high', 'ultra'] },
            antialiasing: { type: 'boolean' },
            smoothing: { type: 'boolean', nullable: true },
            engine: { type: 'string', enum: ['canvas', 'webgl', 'svg'], nullable: true },
          },
          required: ['quality', 'antialiasing'],
          additionalProperties: false,
        },
        export: {
          type: 'object',
          properties: {
            format: { type: 'string', enum: ['png', 'jpg', 'svg', 'pdf'] },
            quality: { type: 'number', minimum: 1, maximum: 100 },
            compression: { type: 'boolean', nullable: true },
            metadata: { type: 'boolean', nullable: true },
          },
          required: ['format', 'quality'],
          additionalProperties: false,
        },
        extensions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              version: { type: 'string' },
              enabled: { type: 'boolean' },
              config: { type: 'object', nullable: true },
            },
            required: ['name', 'version', 'enabled'],
            additionalProperties: false,
          },
          nullable: true,
        },
      },
      required: ['canvas', 'rendering', 'export'],
      additionalProperties: false,
    };

    const validate = this.ajv.compile(schema);
    const valid = validate(config);

    if (valid) {
      return {
        success: true,
        data: config as SIGLConfig,
      };
    }

    return {
      success: false,
      errors: this.formatAjvErrors(validate.errors || []),
    };
  }

  /**
   * Validate scene definition
   */
  validateScene(scene: unknown): Result<SceneDefinition> {
    const errors: SIGLError[] = [];

    if (!scene || typeof scene !== 'object') {
      return {
        success: false,
        errors: [{
          code: 'INVALID_SCENE',
          type: 'validation',
          message: 'Scene must be an object',
        }],
      };
    }

    const sceneObj = scene as Record<string, unknown>;

    // Validate required fields
    if (!sceneObj.id || typeof sceneObj.id !== 'string') {
      errors.push({
        code: 'MISSING_SCENE_ID',
        type: 'validation',
        message: 'Scene must have a valid id',
      });
    }

    if (!Array.isArray(sceneObj.entities)) {
      errors.push({
        code: 'INVALID_ENTITIES',
        type: 'validation',
        message: 'Scene entities must be an array',
      });
    } else {
      // Validate each entity
      sceneObj.entities.forEach((entity, index) => {
        const entityResult = this.validateEntity(entity);
        if (!entityResult.success) {
          entityResult.errors?.forEach(error => {
            errors.push({
              ...error,
              context: `Entity ${index}: ${error.context || ''}`,
            });
          });
        }
      });
    }

    if (errors.length > 0) {
      return {
        success: false,
        errors,
      };
    }

    return {
      success: true,
      data: scene as SceneDefinition,
    };
  }

  /**
   * Validate entity definition
   */
  validateEntity(entity: unknown): Result<EntityDefinition> {
    const errors: SIGLError[] = [];

    if (!entity || typeof entity !== 'object') {
      return {
        success: false,
        errors: [{
          code: 'INVALID_ENTITY',
          type: 'validation',
          message: 'Entity must be an object',
        }],
      };
    }

    const entityObj = entity as Record<string, unknown>;

    // Validate required fields
    if (!entityObj.id || typeof entityObj.id !== 'string') {
      errors.push({
        code: 'MISSING_ENTITY_ID',
        type: 'validation',
        message: 'Entity must have a valid id',
      });
    }

    if (!entityObj.type || typeof entityObj.type !== 'string') {
      errors.push({
        code: 'MISSING_ENTITY_TYPE',
        type: 'validation',
        message: 'Entity must have a valid type',
      });
    }

    if (!entityObj.position || typeof entityObj.position !== 'object') {
      errors.push({
        code: 'MISSING_ENTITY_POSITION',
        type: 'validation',
        message: 'Entity must have a valid position',
      });
    } else {
      const positionResult = this.validatePosition(entityObj.position);
      if (!positionResult.success) {
        positionResult.errors?.forEach(error => {
          errors.push({
            ...error,
            context: `Position: ${error.context || ''}`,
          });
        });
      }
    }

    if (!entityObj.attributes || typeof entityObj.attributes !== 'object') {
      errors.push({
        code: 'MISSING_ENTITY_ATTRIBUTES',
        type: 'validation',
        message: 'Entity must have attributes object',
      });
    }

    if (errors.length > 0) {
      return {
        success: false,
        errors,
      };
    }

    return {
      success: true,
      data: entity as EntityDefinition,
    };
  }

  /**
   * Validate position definition
   */
  validatePosition(position: unknown): Result<{ x: number; y: number }> {
    const errors: SIGLError[] = [];

    if (!position || typeof position !== 'object') {
      return {
        success: false,
        errors: [{
          code: 'INVALID_POSITION',
          type: 'validation',
          message: 'Position must be an object',
        }],
      };
    }

    const posObj = position as Record<string, unknown>;

    if (typeof posObj.x !== 'number') {
      errors.push({
        code: 'INVALID_POSITION_X',
        type: 'validation',
        message: 'Position x must be a number',
      });
    }

    if (typeof posObj.y !== 'number') {
      errors.push({
        code: 'INVALID_POSITION_Y',
        type: 'validation',
        message: 'Position y must be a number',
      });
    }

    if (posObj.z !== undefined && typeof posObj.z !== 'number') {
      errors.push({
        code: 'INVALID_POSITION_Z',
        type: 'validation',
        message: 'Position z must be a number',
      });
    }

    if (posObj.rotation !== undefined && typeof posObj.rotation !== 'number') {
      errors.push({
        code: 'INVALID_POSITION_ROTATION',
        type: 'validation',
        message: 'Position rotation must be a number',
      });
    }

    if (posObj.scale !== undefined && typeof posObj.scale !== 'number') {
      errors.push({
        code: 'INVALID_POSITION_SCALE',
        type: 'validation',
        message: 'Position scale must be a number',
      });
    }

    if (errors.length > 0) {
      return {
        success: false,
        errors,
      };
    }

    return {
      success: true,
      data: position as { x: number; y: number },
    };
  }

  /**
   * Apply custom validation rules
   */
  applyValidationRules(value: unknown, rules: ValidationRule[]): SIGLError[] {
    const errors: SIGLError[] = [];

    for (const rule of rules) {
      switch (rule.type) {
        case 'range':
          if (typeof value === 'number' && Array.isArray(rule.value)) {
            const [min, max] = rule.value as [number, number];
            if (value < min || value > max) {
              errors.push({
                code: 'VALIDATION_RANGE_ERROR',
                type: 'validation',
                message: rule.message,
              });
            }
          }
          break;

        case 'pattern':
          if (typeof value === 'string' && typeof rule.value === 'string') {
            const regex = new RegExp(rule.value);
            if (!regex.test(value)) {
              errors.push({
                code: 'VALIDATION_PATTERN_ERROR',
                type: 'validation',
                message: rule.message,
              });
            }
          }
          break;

        case 'custom':
          if (typeof rule.value === 'function') {
            try {
              const isValid = (rule.value as (val: unknown) => boolean)(value);
              if (!isValid) {
                errors.push({
                  code: 'VALIDATION_CUSTOM_ERROR',
                  type: 'validation',
                  message: rule.message,
                });
              }
            } catch (error) {
              errors.push({
                code: 'VALIDATION_CUSTOM_ERROR',
                type: 'validation',
                message: `Custom validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
              });
            }
          }
          break;
      }
    }

    return errors;
  }

  /**
   * Format AJV validation errors
   */
  private formatAjvErrors(ajvErrors: ErrorObject[]): SIGLError[] {
    return ajvErrors.map(error => ({
      type: 'VALIDATION_ERROR',
      code: 'SCHEMA_VALIDATION_ERROR',
      message: `${error.instancePath || 'root'}: ${error.message}`,
      context: JSON.stringify(error.data),
    }));
  }

  /**
   * Validate color string
   */
  validateColor(color: string): boolean {
    // Basic color validation - can be enhanced
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(|^rgba\(|^hsl\(|^hsla\(/;
    return colorRegex.test(color) || this.isNamedColor(color);
  }

  /**
   * Check if string is a named color
   */
  private isNamedColor(color: string): boolean {
    const namedColors = [
      'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'brown',
      'black', 'white', 'gray', 'grey', 'cyan', 'magenta', 'lime', 'maroon',
      'navy', 'olive', 'silver', 'teal', 'aqua', 'fuchsia'
    ];
    return namedColors.includes(color.toLowerCase());
  }

  /**
   * Validate URL
   */
  validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate email
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}