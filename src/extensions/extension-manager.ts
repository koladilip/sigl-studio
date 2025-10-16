/**
 * Extension Manager - Manages SITL extensions and plugins
 */

import type {
  Extension,
  ExtensionConfig,
  EntityTypeDefinition,
  EnvironmentTypeDefinition,
  TemplateDefinition,
  Result,
  SITLError,
} from '../core/types';

export interface ExtensionRegistry {
  [extensionName: string]: Extension;
}

export interface ExtensionMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: string[];
  enabled: boolean;
  loaded: boolean;
}

export class ExtensionManager {
  private extensions: ExtensionRegistry = {};
  private metadata: Map<string, ExtensionMetadata> = new Map();
  private entityTypes: Map<string, EntityTypeDefinition> = new Map();
  private environmentTypes: Map<string, EnvironmentTypeDefinition> = new Map();
  private templates: Map<string, TemplateDefinition> = new Map();

  constructor() {
    this.initializeBuiltinExtensions();
  }

  /**
   * Register an extension
   */
  async registerExtension(extension: Extension, config?: ExtensionConfig): Promise<Result<void>> {
    try {
      // Validate extension
      const validation = this.validateExtension(extension);
      if (!validation.success) {
        return validation;
      }

      // Check if extension already exists
      if (this.extensions[extension.name]) {
        return {
          success: false,
          errors: [{
            code: 'EXTENSION_ALREADY_EXISTS',
            type: 'EXTENSION_ERROR',
            message: `Extension '${extension.name}' is already registered`,
          }],
        };
      }

      // Register extension
      this.extensions[extension.name] = extension;
      this.metadata.set(extension.name, {
        name: extension.name,
        version: extension.version,
        enabled: config?.enabled ?? true,
        loaded: false,
      });

      // Load extension if enabled
      if (config?.enabled !== false) {
        const loadResult = await this.loadExtension(extension.name);
        if (!loadResult.success) {
          return loadResult;
        }
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          code: 'EXTENSION_REGISTRATION_ERROR',
          type: 'EXTENSION_ERROR',
          message: `Failed to register extension: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }],
      };
    }
  }

  /**
   * Load an extension
   */
  async loadExtension(name: string): Promise<Result<void>> {
    try {
      const extension = this.extensions[name];
      const metadata = this.metadata.get(name);

      if (!extension || !metadata) {
        return {
          success: false,
          errors: [{
            code: 'EXTENSION_NOT_FOUND',
            type: 'EXTENSION_ERROR',
            message: `Extension '${name}' not found`,
          }],
        };
      }

      if (metadata.loaded) {
        return {
          success: true,
        };
      }

      // Initialize extension
      await extension.initialize();

      // Register extension components
      if (extension.entities) {
        for (const entityType of extension.entities) {
          this.entityTypes.set(entityType.name, entityType);
        }
      }

      if (extension.environments) {
        for (const envType of extension.environments) {
          this.environmentTypes.set(envType.name, envType);
        }
      }

      if (extension.templates) {
        for (const template of extension.templates) {
          this.templates.set(template.name, template);
        }
      }

      // Mark as loaded
      metadata.loaded = true;
      this.metadata.set(name, metadata);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          code: 'EXTENSION_LOAD_ERROR',
          type: 'EXTENSION_ERROR',
          message: `Failed to load extension '${name}': ${error instanceof Error ? error.message : 'Unknown error'}`,
        }],
      };
    }
  }

  /**
   * Unload an extension
   */
  async unloadExtension(name: string): Promise<Result<void>> {
    try {
      const extension = this.extensions[name];
      const metadata = this.metadata.get(name);

      if (!extension || !metadata) {
        return {
          success: false,
          errors: [{
            code: 'EXTENSION_NOT_FOUND',
            type: 'EXTENSION_ERROR',
            message: `Extension '${name}' not found`,
          }],
        };
      }

      if (!metadata.loaded) {
        return {
          success: true,
        };
      }

      // Cleanup extension
      await extension.cleanup();

      // Unregister extension components
      if (extension.entities) {
        for (const entityType of extension.entities) {
          this.entityTypes.delete(entityType.name);
        }
      }

      if (extension.environments) {
        for (const envType of extension.environments) {
          this.environmentTypes.delete(envType.name);
        }
      }

      if (extension.templates) {
        for (const template of extension.templates) {
          this.templates.delete(template.name);
        }
      }

      // Mark as unloaded
      metadata.loaded = false;
      this.metadata.set(name, metadata);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          code: 'EXTENSION_UNLOAD_ERROR',
          type: 'EXTENSION_ERROR',
          message: `Failed to unload extension '${name}': ${error instanceof Error ? error.message : 'Unknown error'}`,
        }],
      };
    }
  }

  /**
   * Enable an extension
   */
  async enableExtension(name: string): Promise<Result<void>> {
    const metadata = this.metadata.get(name);
    if (!metadata) {
      return {
        success: false,
        errors: [{
          code: 'EXTENSION_NOT_FOUND',
          type: 'EXTENSION_ERROR',
          message: `Extension '${name}' not found`,
        }],
      };
    }

    if (metadata.enabled) {
      return { success: true };
    }

    metadata.enabled = true;
    this.metadata.set(name, metadata);

    return await this.loadExtension(name);
  }

  /**
   * Disable an extension
   */
  async disableExtension(name: string): Promise<Result<void>> {
    const metadata = this.metadata.get(name);
    if (!metadata) {
      return {
        success: false,
        errors: [{
          code: 'EXTENSION_NOT_FOUND',
          type: 'EXTENSION_ERROR',
          message: `Extension '${name}' not found`,
        }],
      };
    }

    if (!metadata.enabled) {
      return { success: true };
    }

    metadata.enabled = false;
    this.metadata.set(name, metadata);

    return await this.unloadExtension(name);
  }

  /**
   * Get extension metadata
   */
  getExtensionMetadata(name: string): ExtensionMetadata | null {
    return this.metadata.get(name) || null;
  }

  /**
   * List all extensions
   */
  listExtensions(): ExtensionMetadata[] {
    return Array.from(this.metadata.values());
  }

  /**
   * Get entity type definition
   */
  getEntityType(name: string): EntityTypeDefinition | null {
    return this.entityTypes.get(name) || null;
  }

  /**
   * Get all entity types
   */
  getEntityTypes(): EntityTypeDefinition[] {
    return Array.from(this.entityTypes.values());
  }

  /**
   * Get environment type definition
   */
  getEnvironmentType(name: string): EnvironmentTypeDefinition | null {
    return this.environmentTypes.get(name) || null;
  }

  /**
   * Get all environment types
   */
  getEnvironmentTypes(): EnvironmentTypeDefinition[] {
    return Array.from(this.environmentTypes.values());
  }

  /**
   * Get template definition
   */
  getTemplate(name: string): TemplateDefinition | null {
    return this.templates.get(name) || null;
  }

  /**
   * Get all templates
   */
  getTemplates(): TemplateDefinition[] {
    return Array.from(this.templates.values());
  }

  /**
   * Validate extension
   */
  private validateExtension(extension: Extension): Result<void> {
    const errors: SITLError[] = [];

    if (!extension.name || typeof extension.name !== 'string') {
      errors.push({
        code: 'INVALID_EXTENSION_NAME',
        type: 'EXTENSION_ERROR',
        message: 'Extension must have a valid name',
      });
    }

    if (!extension.version || typeof extension.version !== 'string') {
      errors.push({
        code: 'INVALID_EXTENSION_VERSION',
        type: 'EXTENSION_ERROR',
        message: 'Extension must have a valid version',
      });
    }

    if (typeof extension.initialize !== 'function') {
      errors.push({
        code: 'INVALID_EXTENSION_INITIALIZE',
        type: 'EXTENSION_ERROR',
        message: 'Extension must have an initialize function',
      });
    }

    if (typeof extension.cleanup !== 'function') {
      errors.push({
        code: 'INVALID_EXTENSION_CLEANUP',
        type: 'EXTENSION_ERROR',
        message: 'Extension must have a cleanup function',
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
   * Initialize built-in extensions
   */
  private initializeBuiltinExtensions(): void {
    // Core extension with basic entity types
    const coreExtension: Extension = {
      name: 'core',
      version: '1.0.0',
      
      async initialize() {
        // Core initialization
      },
      
      async cleanup() {
        // Core cleanup
      },

      entities: [
        {
          name: 'person',
          category: 'human',
          attributes: [
            {
              name: 'age',
              type: 'number',
              required: false,
              defaultValue: 30,
            },
            {
              name: 'gender',
              type: 'enum',
              required: false,
              defaultValue: 'neutral',
              enumValues: ['male', 'female', 'neutral'],
            },
            {
              name: 'clothing',
              type: 'string',
              required: false,
              defaultValue: 'casual',
            },
          ],
          defaultValues: {
            age: 30,
            gender: 'neutral',
            clothing: 'casual',
          },
        },
      ],

      environments: [
        {
          name: 'indoor',
          category: 'basic',
          defaultBackground: {
            type: 'solid',
            value: '#f5f5f5',
          },
          defaultLighting: {
            ambient: 0.8,
          },
        },
        {
          name: 'outdoor',
          category: 'basic',
          defaultBackground: {
            type: 'gradient',
            value: {
              type: 'linear',
              colors: ['#87CEEB', '#98FB98'],
              angle: 180,
            },
          },
          defaultLighting: {
            ambient: 1.0,
            directional: [{
              direction: [0, -1, 0],
              intensity: 0.8,
              color: '#ffffff',
            }],
          },
        },
      ],
    };

    this.extensions['core'] = coreExtension;
    this.metadata.set('core', {
      name: 'core',
      version: '1.0.0',
      enabled: true,
      loaded: false,
    });
  }

  /**
   * Cleanup all extensions
   */
  async cleanup(): Promise<void> {
    const promises = Array.from(this.metadata.keys()).map(name => 
      this.unloadExtension(name)
    );
    
    await Promise.all(promises);
  }
}