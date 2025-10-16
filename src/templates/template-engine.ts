/**
 * Template Engine - Manages scene templates and parameterization
 */

import type {
  TemplateDefinition,
  ParameterDefinition,
  SceneDefinition,
  EntityDefinition,
  Result,
  SIGLError,
} from '../core/types';

export interface TemplateContext {
  parameters: Record<string, unknown>;
  variables: Record<string, unknown>;
}

export interface TemplateRegistry {
  [templateName: string]: TemplateDefinition;
}

export class TemplateEngine {
  private templates: TemplateRegistry = {};
  private defaultTemplates: TemplateRegistry = {};

  constructor() {
    this.initializeDefaultTemplates();
  }

  /**
   * Register a new template
   */
  registerTemplate(template: TemplateDefinition): Result<void> {
    try {
      // Validate template
      const validation = this.validateTemplate(template);
      if (!validation.success) {
        return validation;
      }

      this.templates[template.name] = template;

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          code: 'TEMPLATE_REGISTRATION_ERROR',
          type: 'TEMPLATE_ERROR',
          message: `Failed to register template: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }],
      };
    }
  }

  /**
   * Get a template by name
   */
  getTemplate(name: string): TemplateDefinition | null {
    return this.templates[name] || this.defaultTemplates[name] || null;
  }

  /**
   * List all available templates
   */
  listTemplates(): string[] {
    return [...Object.keys(this.defaultTemplates), ...Object.keys(this.templates)];
  }

  /**
   * Generate scene from template
   */
  generateScene(
    templateName: string,
    parameters: Record<string, unknown> = {}
  ): Result<SceneDefinition> {
    try {
      const template = this.getTemplate(templateName);
      if (!template) {
        return {
          success: false,
          errors: [{
            code: 'TEMPLATE_NOT_FOUND',
            type: 'TEMPLATE_ERROR',
            message: `Template '${templateName}' not found`,
          }],
        };
      }

      // Validate parameters
      const paramValidation = this.validateParameters(template.parameters, parameters);
      if (!paramValidation.success) {
        return {
          success: false,
          errors: paramValidation.errors,
        };
      }

      // Create context with parameters and default values
      const context: TemplateContext = {
        parameters: this.mergeWithDefaults(template.parameters, parameters),
        variables: {},
      };

      // Process template scene
      const scene = this.processTemplate(template.scene, context);

      return {
        success: true,
        data: scene,
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          code: 'TEMPLATE_GENERATION_ERROR',
           type: 'TEMPLATE_ERROR',
          message: `Failed to generate scene: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }],
      };
    }
  }

  /**
   * Validate template definition
   */
  private validateTemplate(template: TemplateDefinition): Result<void> {
    const errors: SIGLError[] = [];

    if (!template.name || typeof template.name !== 'string') {
      errors.push({
        code: 'INVALID_TEMPLATE_NAME',
         type: 'TEMPLATE_ERROR',
        message: 'Template must have a valid name',
      });
    }

    if (!template.description || typeof template.description !== 'string') {
      errors.push({
        code: 'INVALID_TEMPLATE_DESCRIPTION',
         type: 'TEMPLATE_ERROR',
        message: 'Template must have a description',
      });
    }

    if (!Array.isArray(template.parameters)) {
      errors.push({
        code: 'INVALID_TEMPLATE_PARAMETERS',
         type: 'TEMPLATE_ERROR',
        message: 'Template parameters must be an array',
      });
    }

    if (!template.scene || typeof template.scene !== 'object') {
      errors.push({
        code: 'INVALID_TEMPLATE_SCENE',
         type: 'TEMPLATE_ERROR',
        message: 'Template must have a valid scene definition',
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
    };
  }

  /**
   * Validate template parameters
   */
  private validateParameters(
    parameterDefs: ParameterDefinition[],
    parameters: Record<string, unknown>
  ): Result<void> {
    const errors: SIGLError[] = [];

    for (const paramDef of parameterDefs) {
      const value = parameters[paramDef.name];

      if (paramDef.required && (value === undefined || value === null)) {
        errors.push({
          code: 'MISSING_REQUIRED_PARAMETER',
           type: 'TEMPLATE_ERROR',
          message: `Required parameter '${paramDef.name}' is missing`,
        });
        continue;
      }

      if (value !== undefined && value !== null) {
        const typeValidation = this.validateParameterType(value, paramDef.type);
        if (!typeValidation) {
          errors.push({
            code: 'INVALID_PARAMETER_TYPE',
             type: 'TEMPLATE_ERROR',
            message: `Parameter '${paramDef.name}' must be of type ${paramDef.type}`,
          });
        }
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        errors,
      };
    }

    return {
      success: true,
    };
  }

  /**
   * Validate parameter type
   */
  private validateParameterType(value: unknown, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && value !== null;
      case 'array':
        return Array.isArray(value);
      default:
        return true; // Unknown types are allowed
    }
  }

  /**
   * Merge parameters with default values
   */
  private mergeWithDefaults(
    parameterDefs: ParameterDefinition[],
    parameters: Record<string, unknown>
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const paramDef of parameterDefs) {
      if (parameters[paramDef.name] !== undefined) {
        result[paramDef.name] = parameters[paramDef.name];
      } else if (paramDef.defaultValue !== undefined) {
        result[paramDef.name] = paramDef.defaultValue;
      }
    }

    return result;
  }

  /**
   * Process template with context
   */
  private processTemplate(scene: SceneDefinition, context: TemplateContext): SceneDefinition {
    return {
      ...scene,
      id: scene.id ? this.interpolateString(scene.id, context) : undefined,
      name: scene.name ? this.interpolateString(scene.name, context) : undefined,
      description: scene.description ? this.interpolateString(scene.description, context) : undefined,
      entities: scene.entities.map(entity => this.processEntity(entity, context)),
    };
  }

  /**
   * Process entity with context
   */
  private processEntity(entity: EntityDefinition, context: TemplateContext): EntityDefinition {
    // Handle entityType interpolation and validation
    let entityType: 'human' | 'object' | 'prop' = entity.entityType;
    if (typeof entity.entityType === 'string' && entity.entityType.includes('{{')) {
      const interpolated = this.interpolateString(entity.entityType, context);
      // Map common values to valid entityType
      switch (interpolated.toLowerCase()) {
        case 'person':
        case 'human':
        case 'character':
          entityType = 'human';
          break;
        case 'object':
        case 'item':
          entityType = 'object';
          break;
        case 'prop':
        case 'decoration':
          entityType = 'prop';
          break;
        default:
          entityType = 'human'; // Default fallback
      }
    }

    return {
      ...entity,
      id: this.interpolateString(entity.id, context),
      type: 'entity',
      entityType,
      attributes: this.processAttributes(entity.attributes, context),
      position: {
        ...entity.position,
        x: this.interpolateNumber(entity.position.x, context),
        y: this.interpolateNumber(entity.position.y, context),
        z: entity.position.z ? this.interpolateNumber(entity.position.z, context) : undefined,
        rotation: entity.position.rotation ? this.interpolateNumber(entity.position.rotation, context) : undefined,
        scale: entity.position.scale ? this.interpolateNumber(entity.position.scale, context) : undefined,
      },
    };
  }

  /**
   * Process attributes with context
   */
  private processAttributes(
    attributes: Record<string, unknown>,
    context: TemplateContext
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(attributes)) {
      if (typeof value === 'string') {
        result[key] = this.interpolateString(value, context);
      } else if (typeof value === 'number') {
        result[key] = this.interpolateNumber(value, context);
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.processAttributes(value as Record<string, unknown>, context);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Interpolate string with template variables
   */
  private interpolateString(template: string, context: TemplateContext): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      const value = context.parameters[varName] ?? context.variables[varName];
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Interpolate number with template variables
   */
  private interpolateNumber(value: number | string, context: TemplateContext): number {
    if (typeof value === 'string') {
      const interpolated = this.interpolateString(value, context);
      const parsed = parseFloat(interpolated);
      return isNaN(parsed) ? 0 : parsed;
    }
    return value;
  }

  /**
   * Initialize default templates
   */
  private initializeDefaultTemplates(): void {
    // Basic scene template
    this.defaultTemplates['basic-scene'] = {
      name: 'basic-scene',
      description: 'A basic scene with a single character',
      parameters: [
        {
          name: 'characterType',
          type: 'string',
          required: false,
          defaultValue: 'person',
          description: 'Type of character to include',
        },
        {
          name: 'backgroundColor',
          type: 'string',
          required: false,
          defaultValue: '#ffffff',
          description: 'Background color of the scene',
        },
      ],
      scene: {
        type: 'scene',
        id: 'basic-scene-{{characterType}}',
        name: 'Basic Scene with {{characterType}}',
        entities: [
          {
            id: 'main-character',
            type: 'entity',
            entityType: 'human',
            attributes: {
              appearance: 'default',
              characterType: '{{characterType}}',
            },
            position: {
              x: 512,
              y: 384,
            },
          },
        ],
        environment: {
          type: 'indoor',
          background: {
            type: 'solid',
            value: '{{backgroundColor}}',
          },
        },
        camera: {
          position: [0, 0, 10],
          target: [0, 0, 0],
          fov: 45,
        },
        metadata: {
          created: new Date(),
          modified: new Date(),
          author: 'Template Engine',
          version: '1.0.0',
          tags: ['basic', 'template'],
        },
      },
    };

    // Classroom template
    this.defaultTemplates['classroom'] = {
      name: 'classroom',
      description: 'A classroom scene with teacher and students',
      parameters: [
        {
          name: 'studentCount',
          type: 'number',
          required: false,
          defaultValue: 5,
          description: 'Number of students in the classroom',
        },
        {
          name: 'teacherName',
          type: 'string',
          required: false,
          defaultValue: 'Teacher',
          description: 'Name of the teacher',
        },
      ],
      scene: {
        type: 'scene',
        id: 'classroom-{{studentCount}}-students',
        name: 'Classroom with {{teacherName}}',
        entities: [
          {
            id: 'teacher',
            type: 'entity',
            entityType: 'human',
            attributes: {
              role: 'teacher',
              name: '{{teacherName}}',
            },
            position: {
              x: 200,
              y: 300,
            },
          },
        ],
        environment: {
          type: 'classroom',
          background: {
            type: 'solid',
            value: '#f0f8ff',
          },
        },
        camera: {
          position: [0, 0, 10],
          target: [0, 0, 0],
          fov: 45,
        },
        metadata: {
          created: new Date(),
          modified: new Date(),
          author: 'Template Engine',
          version: '1.0.0',
          tags: ['classroom', 'educational', 'template'],
        },
      },
    };
  }
}