/**
 * Core type definitions for the SITL system
 */

// Main configuration interface
export interface SITLConfig {
  canvas: CanvasConfig;
  rendering: RenderingConfig;
  export: ExportConfig;
  extensions?: ExtensionConfig[];
}

// Canvas configuration
export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor: string;
  dpi?: number;
}

// Rendering configuration
export interface RenderingConfig {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  antialiasing: boolean;
  smoothing?: boolean;
  engine?: 'canvas' | 'webgl' | 'svg';
}

// Export configuration
export interface ExportConfig {
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  quality: number;
  compression?: boolean;
  metadata?: boolean;
}

// Extension configuration
export interface ExtensionConfig {
  name: string;
  version: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

// Scene definition
export interface SceneDefinition {
  type: 'scene';
  id?: string;
  name?: string;
  description?: string;
  entities: EntityDefinition[];
  environment: EnvironmentDefinition;
  camera: CameraDefinition;
  metadata: SceneMetadata;
}

// Entity definition
export interface EntityDefinition {
  type: 'entity';
  id: string;
  entityType: 'human' | 'object' | 'prop';
  attributes: Record<string, unknown>;
  position: PositionDefinition;
  relationships?: RelationshipDefinition[];
}

// Environment definition
export interface EnvironmentDefinition {
  type: string;
  background?: BackgroundDefinition;
  lighting?: LightingDefinition;
  atmosphere?: AtmosphereDefinition;
}

// Position definition
export interface PositionDefinition {
  type?: 'position';
  entityId?: string;
  x: number;
  y: number;
  z?: number;
  rotation?: number;
  scale?: number;
}

// Relationship definition
export interface RelationshipDefinition {
  type: 'near' | 'far' | 'behind' | 'in-front' | 'left' | 'right';
  target: string;
  distance?: number;
}

// Background definition
export interface BackgroundDefinition {
  type: 'solid' | 'gradient' | 'image' | 'pattern';
  color?: string;
  value?: string | GradientDefinition | ImageDefinition;
}

// Gradient definition
export interface GradientDefinition {
  type: 'linear' | 'radial';
  colors: string[];
  stops?: number[];
  angle?: number;
}

// Image definition
export interface ImageDefinition {
  url: string;
  repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  position?: string;
  size?: string;
}

// Lighting definition
export interface LightingDefinition {
  type?: string;
  intensity?: number;
  ambient?: number;
  directional?: DirectionalLight[];
  point?: PointLight[];
}

// Light definitions
export interface DirectionalLight {
  direction: [number, number, number];
  intensity: number;
  color: string;
}

export interface PointLight {
  position: [number, number, number];
  intensity: number;
  color: string;
  falloff?: number;
}

// Atmosphere definition
export interface AtmosphereDefinition {
  fog?: FogDefinition;
  weather?: WeatherDefinition;
}

export interface FogDefinition {
  density: number;
  color: string;
  near?: number;
  far?: number;
}

export interface WeatherDefinition {
  type: 'clear' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
  intensity: number;
}

// Camera definition
export interface CameraDefinition {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
  near?: number;
  far?: number;
}

// Scene metadata
export interface SceneMetadata {
  created: Date;
  modified: Date;
  author?: string;
  version: string;
  tags?: string[];
}

// Render options
export interface RenderOptions {
  width?: number;
  height?: number;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  antialiasing?: boolean;
  background?: string;
  debug?: boolean;
}

// Export options
export interface ExportOptions {
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  quality?: number;
  width?: number;
  height?: number;
  filename?: string;
  metadata?: boolean;
}

// Error interface
export interface SITLError {
  type: string;
  code?: string;
  message: string;
  line?: number;
  column?: number;
  context?: string;
}

// Result types
export interface Result<T> {
  success: boolean;
  data?: T;
  errors?: SITLError[];
  warnings?: string[];
}

// Event types
export interface SITLEvent {
  type: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}

// Plugin interface
export interface SITLPlugin {
  name: string;
  version: string;
  initialize(): Promise<void>;
  cleanup(): Promise<void>;
}

// Extension interface
export interface Extension extends SITLPlugin {
  entities?: EntityTypeDefinition[];
  attributes?: AttributeDefinition[];
  environments?: EnvironmentTypeDefinition[];
  templates?: TemplateDefinition[];
}

// Entity type definition
export interface EntityTypeDefinition {
  name: string;
  category: string;
  attributes: AttributeDefinition[];
  defaultValues: Record<string, unknown>;
  validation?: ValidationRule[];
}

// Attribute definition
export interface AttributeDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'enum' | 'object';
  required: boolean;
  defaultValue?: unknown;
  validation?: ValidationRule[];
  enumValues?: string[];
}

// Validation rule
export interface ValidationRule {
  type: 'range' | 'pattern' | 'custom';
  value: unknown;
  message: string;
}

// Environment type definition
export interface EnvironmentTypeDefinition {
  name: string;
  category: string;
  defaultBackground: BackgroundDefinition;
  defaultLighting: LightingDefinition;
  availableProps?: string[];
}

// Template definition
export interface TemplateDefinition {
  name: string;
  description: string;
  parameters: ParameterDefinition[];
  scene: SceneDefinition;
}

// Parameter definition
export interface ParameterDefinition {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: unknown;
  description?: string;
}

// AST Node types for parser
export type ASTNode = SceneDefinition | EntityDefinition | EnvironmentDefinition | PositionDefinition;

// Parse result interface
export interface ParseResult {
  success: boolean;
  ast?: ASTNode;
  errors: SITLError[];
}