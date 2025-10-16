/**
 * Parser type definitions for the SIGL system
 */

import { SIGLError } from '../core/types';

// AST Node types
export type NodeType =
  | 'Scene'
  | 'Entity'
  | 'Human'
  | 'Object'
  | 'Environment'
  | 'Position'
  | 'Attribute'
  | 'Color'
  | 'Template'
  | 'Extension'
  | 'Literal'
  | 'Identifier'
  | 'Expression'
  | 'Block'
  | 'Statement'
  | 'RelativePosition'
  | 'Parameter'
  | 'Clothing'
  | 'Hair'
  | 'Size'
  | 'Background'
  | 'Gradient'
  | 'Image'
  | 'Lighting'
  | 'DirectionalLight'
  | 'PointLight';

// Base AST Node interface
export interface ASTNode {
  type: NodeType;
  children: ASTNode[];
  metadata: NodeMetadata;
  parent?: ASTNode;
  
  // Methods
  validate(): ValidationResult;
  transform(): ProcessedNode;
  accept(_visitor: ASTVisitor): void;
}

// Node metadata
export interface NodeMetadata {
  line: number;
  column: number;
  length: number;
  source?: string;
  comments?: string[];
}

// Specific AST node types
export interface SceneNode extends ASTNode {
  type: 'Scene';
  name?: string;
  entities: EntityNode[];
  environment?: EnvironmentNode;
  templates?: TemplateNode[];
}

export interface EntityNode extends ASTNode {
  type: 'Entity' | 'Human' | 'Object';
  entityType: string;
  id: string;
  attributes: AttributeNode[];
  position: PositionNode;
}

export interface HumanNode extends EntityNode {
  type: 'Human';
  age?: number;
  gender?: string;
  emotion?: string;
  clothing?: ClothingNode[];
  hair?: HairNode;
}

export interface ObjectNode extends EntityNode {
  type: 'Object';
  objectType: string;
  material?: string;
  size?: SizeNode;
}

export interface EnvironmentNode extends ASTNode {
  type: 'Environment';
  environmentType: string;
  background?: BackgroundNode;
  lighting?: LightingNode;
}

export interface PositionNode extends ASTNode {
  type: 'Position';
  x: number;
  y: number;
  z?: number;
  rotation?: number;
  scale?: number;
  relative?: RelativePositionNode;
}

export interface RelativePositionNode extends ASTNode {
  target: string;
  relationship: 'near' | 'far' | 'behind' | 'in-front' | 'left' | 'right';
  distance?: number;
}

export interface AttributeNode extends ASTNode {
  type: 'Attribute';
  name: string;
  value: LiteralNode | ExpressionNode;
}

export interface ColorNode extends ASTNode {
  type: 'Color';
  value: string;
  format: 'hex' | 'rgb' | 'hsl' | 'named';
}

export interface TemplateNode extends ASTNode {
  type: 'Template';
  name: string;
  parameters: ParameterNode[];
  body: BlockNode;
}

export interface ParameterNode extends ASTNode {
  name: string;
  parameterType: string;
  defaultValue?: LiteralNode;
  required: boolean;
}

export interface BlockNode extends ASTNode {
  type: 'Block';
  statements: StatementNode[];
}

export interface StatementNode extends ASTNode {
  type: 'Statement';
}

export interface LiteralNode extends ASTNode {
  type: 'Literal';
  value: string | number | boolean;
  literalType: 'string' | 'number' | 'boolean';
}

export interface IdentifierNode extends ASTNode {
  type: 'Identifier';
  name: string;
}

export interface ExpressionNode extends ASTNode {
  type: 'Expression';
  operator?: string;
  operands: ASTNode[];
}

// Additional specific nodes
export interface ClothingNode extends ASTNode {
  type: 'Object';
  clothingType: string;
  color: ColorNode;
  style?: string;
}

export interface HairNode extends ASTNode {
  type: 'Object';
  color: ColorNode;
  style: string;
  length?: string;
}

export interface SizeNode extends ASTNode {
  width: number;
  height: number;
  depth?: number;
}

export interface BackgroundNode extends ASTNode {
  backgroundType: 'solid' | 'gradient' | 'image';
  value: ColorNode | GradientNode | ImageNode;
}

export interface GradientNode extends ASTNode {
  gradientType: 'linear' | 'radial';
  colors: ColorNode[];
  stops?: number[];
  angle?: number;
}

export interface ImageNode extends ASTNode {
  url: string;
  repeat?: string;
  position?: string;
  size?: string;
}

export interface LightingNode extends ASTNode {
  ambient: number;
  directional?: DirectionalLightNode[];
  point?: PointLightNode[];
}

export interface DirectionalLightNode extends ASTNode {
  direction: [number, number, number];
  intensity: number;
  color: ColorNode;
}

export interface PointLightNode extends ASTNode {
  position: [number, number, number];
  intensity: number;
  color: ColorNode;
  falloff?: number;
}

// Parse result
export interface ParseResult {
  success: boolean;
  ast?: ASTNode;
  errors: SIGLError[];
  warnings: string[];
  metadata: ParseMetadata;
}

// Parse metadata
export interface ParseMetadata {
  parseTime: number;
  nodeCount: number;
  source: string;
  version: string;
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  node: ASTNode;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  code: string;
  message: string;
  node: ASTNode;
}

// Processed node (after transformation)
export interface ProcessedNode {
  type: string;
  data: Record<string, unknown>;
  children: ProcessedNode[];
  metadata: ProcessMetadata;
}

export interface ProcessMetadata {
  originalNode: ASTNode;
  transformTime: number;
  version: string;
}

// Visitor pattern interface
export interface ASTVisitor {
  visitScene(_node: SceneNode): void;
  visitEntity(_node: EntityNode): void;
  visitHuman(_node: HumanNode): void;
  visitObject(_node: ObjectNode): void;
  visitEnvironment(_node: EnvironmentNode): void;
  visitPosition(_node: PositionNode): void;
  visitAttribute(_node: AttributeNode): void;
  visitColor(node: ColorNode): void;
  visitTemplate(node: TemplateNode): void;
  visitLiteral(node: LiteralNode): void;
  visitIdentifier(node: IdentifierNode): void;
  visitExpression(node: ExpressionNode): void;
  visitBlock(node: BlockNode): void;
  visitStatement(node: StatementNode): void;
}

// Token types for lexer
export enum TokenType {
  // Literals
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  COLOR = 'COLOR',
  
  // Identifiers
  IDENTIFIER = 'IDENTIFIER',
  
  // Keywords
  SCENE = 'SCENE',
  HUMAN = 'HUMAN',
  OBJECT = 'OBJECT',
  ENVIRONMENT = 'ENVIRONMENT',
  TEMPLATE = 'TEMPLATE',
  POSITION = 'POSITION',
  COLOR_KEYWORD = 'COLOR_KEYWORD',
  
  // Operators
  ASSIGN = 'ASSIGN',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  
  // Delimiters
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  LBRACE = 'LBRACE',
  RBRACE = 'RBRACE',
  LBRACKET = 'LBRACKET',
  RBRACKET = 'RBRACKET',
  COMMA = 'COMMA',
  SEMICOLON = 'SEMICOLON',
  DOT = 'DOT',
  COLON = 'COLON',
  
  // Special
  NEWLINE = 'NEWLINE',
  WHITESPACE = 'WHITESPACE',
  COMMENT = 'COMMENT',
  EOF = 'EOF',
  UNKNOWN = 'UNKNOWN'
}

// Token interface
export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  length: number;
}

// Lexer interface
export interface Lexer {
  tokenize(input: string): Token[];
  nextToken(): Token | null;
  peek(): Token | null;
  hasNext(): boolean;
}

// Parser interface
export interface Parser {
  parse(tokens: Token[]): ParseResult;
  parseScene(): SceneNode;
  parseEntity(): EntityNode;
  parseExpression(): ExpressionNode;
  parseStatement(): StatementNode;
}

// Error recovery strategies
export enum RecoveryStrategy {
  SKIP_TO_NEXT_STATEMENT = 'SKIP_TO_NEXT_STATEMENT',
  SKIP_TO_NEXT_BLOCK = 'SKIP_TO_NEXT_BLOCK',
  INSERT_MISSING_TOKEN = 'INSERT_MISSING_TOKEN',
  DELETE_UNEXPECTED_TOKEN = 'DELETE_UNEXPECTED_TOKEN'
}

// Parser configuration
export interface ParserConfig {
  errorRecovery: boolean;
  recoveryStrategy: RecoveryStrategy;
  maxErrors: number;
  strictMode: boolean;
}