/**
 * Entity type definitions for the SIGL system
 */

// Base entity attributes
export interface EntityAttributes {
  id: string;
  type: string;
  position: PositionAttributes;
  visible: boolean;
  opacity: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

// Position attributes
export interface PositionAttributes {
  x: number;
  y: number;
  z?: number;
  relative?: RelativePosition;
}

export interface RelativePosition {
  target: string;
  relationship: 'near' | 'far' | 'behind' | 'in-front' | 'left' | 'right' | 'above' | 'below';
  distance: number;
  angle?: number;
}

// Human-specific attributes
export interface HumanAttributes extends EntityAttributes {
  type: 'human';
  age: AgeAttributes;
  gender: GenderAttributes;
  appearance: AppearanceAttributes;
  clothing: ClothingAttributes;
  emotion: EmotionAttributes;
  pose: PoseAttributes;
  accessories?: AccessoryAttributes[];
}

// Age attributes
export interface AgeAttributes {
  value: number;
  category: 'infant' | 'child' | 'teenager' | 'young-adult' | 'adult' | 'middle-aged' | 'elderly';
  exact?: boolean;
}

// Gender attributes
export interface GenderAttributes {
  value: 'male' | 'female' | 'non-binary' | 'other';
  expression?: 'masculine' | 'feminine' | 'androgynous' | 'neutral';
}

// Appearance attributes
export interface AppearanceAttributes {
  skin: SkinAttributes;
  hair: HairAttributes;
  eyes: EyeAttributes;
  build: BuildAttributes;
  height: HeightAttributes;
}

export interface SkinAttributes {
  tone: string; // Color value
  texture?: 'smooth' | 'rough' | 'weathered' | 'scarred';
  condition?: 'healthy' | 'pale' | 'tanned' | 'flushed';
}

export interface HairAttributes {
  color: string; // Color value
  style: 'short' | 'medium' | 'long' | 'bald' | 'buzz-cut' | 'curly' | 'straight' | 'wavy';
  texture?: 'fine' | 'thick' | 'coarse' | 'silky';
  length?: number; // In relative units
}

export interface EyeAttributes {
  color: string; // Color value
  shape: 'round' | 'almond' | 'narrow' | 'wide' | 'hooded';
  size: 'small' | 'medium' | 'large';
}

export interface BuildAttributes {
  type: 'slim' | 'average' | 'athletic' | 'heavy' | 'muscular';
  proportions?: 'normal' | 'tall' | 'short' | 'broad' | 'narrow';
}

export interface HeightAttributes {
  value: number; // In relative units (1.0 = average)
  category: 'very-short' | 'short' | 'average' | 'tall' | 'very-tall';
}

// Clothing attributes
export interface ClothingAttributes {
  style: ClothingStyle;
  items: ClothingItem[];
  colors: string[]; // Color values
  condition?: 'new' | 'worn' | 'old' | 'damaged';
  formality?: 'casual' | 'business' | 'formal' | 'athletic' | 'work';
}

export interface ClothingStyle {
  category: 'casual' | 'business' | 'formal' | 'athletic' | 'uniform' | 'traditional' | 'alternative';
  era?: 'modern' | 'vintage' | 'retro' | 'futuristic';
  culture?: string;
}

export interface ClothingItem {
  type: 'shirt' | 'pants' | 'dress' | 'skirt' | 'jacket' | 'shoes' | 'hat' | 'accessories';
  subtype?: string;
  color: string;
  pattern?: PatternAttributes;
  material?: string;
  fit?: 'tight' | 'fitted' | 'loose' | 'oversized';
}

export interface PatternAttributes {
  type: 'solid' | 'stripes' | 'dots' | 'plaid' | 'floral' | 'geometric' | 'abstract';
  colors: string[];
  scale: 'small' | 'medium' | 'large';
  density?: number;
}

// Emotion attributes
export interface EmotionAttributes {
  primary: EmotionType;
  intensity: number; // 0-1 scale
  secondary?: EmotionType;
  expression: ExpressionAttributes;
}

export type EmotionType = 
  | 'happy' | 'sad' | 'angry' | 'surprised' | 'fearful' | 'disgusted' | 'contemptuous'
  | 'neutral' | 'excited' | 'calm' | 'anxious' | 'confident' | 'shy' | 'proud'
  | 'embarrassed' | 'curious' | 'bored' | 'frustrated' | 'relieved' | 'hopeful';

export interface ExpressionAttributes {
  facial: FacialExpression;
  body: BodyLanguage;
  gesture?: GestureType;
}

export interface FacialExpression {
  eyes: 'open' | 'closed' | 'squinting' | 'wide' | 'narrowed';
  eyebrows: 'neutral' | 'raised' | 'furrowed' | 'arched';
  mouth: 'neutral' | 'smile' | 'frown' | 'open' | 'pursed' | 'grin';
  overall: 'relaxed' | 'tense' | 'animated' | 'stoic';
}

export interface BodyLanguage {
  posture: 'upright' | 'slouched' | 'leaning' | 'rigid' | 'relaxed';
  arms: 'at-sides' | 'crossed' | 'on-hips' | 'raised' | 'gesturing';
  stance: 'balanced' | 'wide' | 'narrow' | 'shifting';
  orientation: 'forward' | 'turned' | 'angled';
}

export type GestureType = 
  | 'pointing' | 'waving' | 'thumbs-up' | 'thumbs-down' | 'peace-sign'
  | 'ok-sign' | 'stop' | 'come-here' | 'shrugging' | 'clapping'
  | 'saluting' | 'praying' | 'thinking' | 'covering-face';

// Pose attributes
export interface PoseAttributes {
  type: PoseType;
  variation?: string;
  stability: number; // 0-1 scale
  naturalness: number; // 0-1 scale
}

export type PoseType = 
  | 'standing' | 'sitting' | 'walking' | 'running' | 'lying'
  | 'kneeling' | 'crouching' | 'jumping' | 'dancing' | 'working'
  | 'reading' | 'writing' | 'talking' | 'listening' | 'thinking';

// Accessory attributes
export interface AccessoryAttributes {
  type: AccessoryType;
  position: string;
  color?: string;
  material?: string;
  size?: 'small' | 'medium' | 'large';
}

export type AccessoryType = 
  | 'glasses' | 'sunglasses' | 'watch' | 'jewelry' | 'bag' | 'backpack'
  | 'hat' | 'scarf' | 'gloves' | 'belt' | 'tie' | 'badge' | 'pin';

// Object attributes (for non-human entities)
export interface ObjectAttributes extends EntityAttributes {
  type: 'object';
  objectType: string;
  material: MaterialAttributes;
  size: SizeAttributes;
  color: string;
  texture?: TextureAttributes;
  condition?: ConditionAttributes;
}

export interface MaterialAttributes {
  type: 'wood' | 'metal' | 'plastic' | 'glass' | 'fabric' | 'stone' | 'ceramic' | 'paper';
  finish?: 'matte' | 'glossy' | 'rough' | 'smooth' | 'textured';
  quality?: 'poor' | 'average' | 'good' | 'excellent';
}

export interface SizeAttributes {
  width: number;
  height: number;
  depth?: number;
  scale: number; // Relative to standard size
  category: 'tiny' | 'small' | 'medium' | 'large' | 'huge';
}

export interface TextureAttributes {
  pattern: 'smooth' | 'rough' | 'bumpy' | 'ridged' | 'woven' | 'carved';
  detail: number; // 0-1 scale
  reflectivity: number; // 0-1 scale
}

export interface ConditionAttributes {
  wear: number; // 0-1 scale (0 = new, 1 = completely worn)
  damage?: DamageType[];
  cleanliness: number; // 0-1 scale
  age: number; // In relative units
}

export type DamageType = 
  | 'scratched' | 'dented' | 'cracked' | 'broken' | 'torn' | 'stained'
  | 'faded' | 'rusted' | 'chipped' | 'bent' | 'burned';

// Environment attributes
export interface EnvironmentAttributes {
  type: string;
  lighting: LightingAttributes;
  atmosphere: AtmosphereAttributes;
  background: BackgroundAttributes;
  props?: PropAttributes[];
}

export interface LightingAttributes {
  ambient: AmbientLight;
  directional?: DirectionalLight[];
  point?: PointLight[];
  spot?: SpotLight[];
  time?: TimeOfDay;
  weather?: WeatherCondition;
}

export interface AmbientLight {
  intensity: number; // 0-1 scale
  color: string;
  temperature?: number; // Color temperature in Kelvin
}

export interface DirectionalLight {
  direction: [number, number, number];
  intensity: number;
  color: string;
  shadows?: boolean;
  softness?: number;
}

export interface PointLight {
  position: [number, number, number];
  intensity: number;
  color: string;
  falloff: number;
  radius?: number;
}

export interface SpotLight {
  position: [number, number, number];
  direction: [number, number, number];
  intensity: number;
  color: string;
  angle: number;
  falloff: number;
}

export type TimeOfDay = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night';
export type WeatherCondition = 'clear' | 'cloudy' | 'overcast' | 'rainy' | 'stormy' | 'foggy' | 'snowy';

export interface AtmosphereAttributes {
  mood: 'bright' | 'dark' | 'mysterious' | 'cheerful' | 'somber' | 'energetic' | 'calm';
  fog?: FogAttributes;
  particles?: ParticleAttributes;
  temperature?: TemperatureAttributes;
}

export interface FogAttributes {
  density: number; // 0-1 scale
  color: string;
  height?: number;
  movement?: 'still' | 'drifting' | 'swirling';
}

export interface ParticleAttributes {
  type: 'dust' | 'snow' | 'rain' | 'leaves' | 'sparks' | 'bubbles';
  density: number;
  size: number;
  movement: 'falling' | 'floating' | 'swirling' | 'rising';
}

export interface TemperatureAttributes {
  value: 'cold' | 'cool' | 'mild' | 'warm' | 'hot';
  effects?: 'breath-visible' | 'heat-shimmer' | 'frost' | 'steam';
}

export interface BackgroundAttributes {
  type: 'solid' | 'gradient' | 'image' | 'pattern' | 'scene';
  value: string | GradientBackground | ImageBackground | PatternBackground;
  depth?: number; // For parallax effects
}

export interface GradientBackground {
  type: 'linear' | 'radial' | 'conic';
  colors: string[];
  stops?: number[];
  angle?: number;
  center?: [number, number];
}

export interface ImageBackground {
  url: string;
  repeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  position: string;
  size: 'cover' | 'contain' | 'auto' | string;
  opacity?: number;
}

export interface PatternBackground {
  type: 'dots' | 'stripes' | 'grid' | 'checkerboard' | 'waves' | 'noise';
  colors: string[];
  scale: number;
  rotation?: number;
  opacity?: number;
}

export interface PropAttributes {
  type: string;
  position: PositionAttributes;
  attributes: ObjectAttributes;
  interactive?: boolean;
  importance: 'background' | 'secondary' | 'primary';
}

// Validation and constraints
export interface AttributeConstraints {
  required: string[];
  optional: string[];
  mutuallyExclusive?: string[][];
  dependencies?: Record<string, string[]>;
  ranges?: Record<string, [number, number]>;
  enums?: Record<string, string[]>;
}

// Attribute validation result
export interface AttributeValidationResult {
  valid: boolean;
  errors: AttributeError[];
  warnings: AttributeWarning[];
  suggestions?: AttributeSuggestion[];
}

export interface AttributeError {
  attribute: string;
  code: string;
  message: string;
  value?: unknown;
}

export interface AttributeWarning {
  attribute: string;
  code: string;
  message: string;
  value?: unknown;
}

export interface AttributeSuggestion {
  attribute: string;
  suggestion: string;
  reason: string;
  confidence: number; // 0-1 scale
}