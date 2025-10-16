# SITL Implementation Plan

## Executive Summary

This document outlines the comprehensive implementation plan for the SimpleImage Template Language (SITL) system - a sophisticated domain-specific language for generating scene illustrations. The plan includes MVP definition, technology stack selection, detailed task breakdown, architecture design, and implementation timeline.

## 1. CURRENT IMPLEMENTATION STATUS (Updated)

### 1.1 ✅ Completed Features
- Basic project structure with TypeScript & Vite
- Core type definitions and interfaces
- Basic entity factory for human/object/prop entities
- Simple canvas-based renderer with basic shapes
- Template engine with parameter interpolation (2 default templates)
- Extension manager architecture
- Basic export to PNG/JPEG/WEBP
- Simple ANTLR grammar (lowercase syntax only)

### 1.2 ❌ Critical Gaps Identified

#### HIGHEST PRIORITY - Parser & Syntax
- **Natural Language Parser**: Current grammar uses `human/object/prop {}` instead of documented `DRAW MAN WITH ...`
- **Command Support**: Missing DRAW, LOAD EXTENSION, CREATE, ANIMATE, UPDATE commands
- **Attribute Syntax**: No parameterized attributes like `HAIR(COLOR: BROWN, STYLE: SHORT)`
- **Gender/Age Entities**: No MAN, WOMAN, BOY, GIRL, BABY entity types

#### HIGH PRIORITY - Core Features
- **Extension Implementation**: Educational, Hospital, Military extensions are empty folders
- **Animation System**: Completely missing - no parser rules or renderer
- **Advanced Positioning**: No grid system, anchor system, or rotation syntax
- **Pattern System**: Clothing patterns not implemented
- **Validation Engine**: No context validation or suggestion system

#### MEDIUM PRIORITY - Advanced Features
- **Template Inheritance**: No EXTENDS or template composition
- **Advanced Rendering**: No quality presets, resolution presets, or color space management
- **Domain Entities**: No domain-specific entities (TEACHER, DOCTOR, SOLDIER)
- **Environment System**: Basic only, no environment presets

### 1.3 Revised MVP Definition

#### Phase 1: Fix Parser & Core Syntax (CRITICAL - Week 1-2)
- ✅ Rewrite ANTLR grammar for natural language syntax
- ✅ Implement DRAW command with entity types (MAN, WOMAN, BOY, GIRL)
- ✅ Add attribute parsing (WITH AGE 30 AND BLUE SHIRT)
- ✅ Support positioning syntax (AT LEFT, NEXT TO, etc.)

#### Phase 2: Essential Entity System (HIGH - Week 3-4)
- ✅ Implement gender/age-specific entity types
- ✅ Add parameterized attributes system
- ✅ Create clothing system with toggle support (WITHOUT SHIRT)
- ✅ Implement basic validation engine

#### Phase 3: Domain Extensions (HIGH - Week 5-6)
- ✅ Implement Educational extension with entities
- ✅ Implement Hospital extension with entities
- ✅ Add extension loading from SITL code (LOAD EXTENSION)
- ✅ Create template definition from SITL (DEFINE TEMPLATE)

### 1.2 MVP Success Criteria

1. **Functional Parser**: Successfully parse 90% of core SITL syntax
2. **Basic Scene Generation**: Create simple scenes with 2-5 entities
3. **Export Capability**: Generate PNG images at 1024x768 resolution
4. **Template System**: Create and reuse basic templates
5. **Extension Loading**: Load and use at least one domain extension
6. **Performance**: Generate scenes in under 5 seconds on standard hardware

### 1.3 MVP Exclusions (Future Phases)

- Advanced rendering (PBR, ray tracing, complex lighting)
- Animation systems
- Advanced camera controls
- Complex material systems
- Performance optimization features
- Advanced composition tools
- Real-time preview

## 2. Technology Stack & Tools

### 2.1 Core Technologies

#### Programming Language: **TypeScript/JavaScript**
- **Rationale**: 
  - Excellent ecosystem for parsing (ANTLR, PEG.js)
  - Rich graphics libraries (Canvas API, WebGL, Three.js)
  - Cross-platform deployment (Node.js, browsers)
  - Strong typing with TypeScript for maintainability

#### Parser Generator: **ANTLR 4**
- **Rationale**:
  - Industry-standard parser generator
  - Excellent TypeScript/JavaScript support
  - Powerful error handling and recovery
  - Supports complex grammar features needed for SITL
- **Alternative**: PEG.js (simpler but less powerful)

#### Rendering Engine: **Fabric.js + Canvas API**
- **Rationale**:
  - Mature 2D graphics library
  - Excellent object model for scene entities
  - Built-in export capabilities
  - Good performance for 2D rendering
- **Future Upgrade Path**: Three.js for 3D rendering

#### Build System: **Vite + TypeScript**
- **Rationale**:
  - Fast development builds
  - Excellent TypeScript support
  - Modern bundling with tree-shaking
  - Hot module replacement for development

### 2.2 Supporting Libraries

#### Core Dependencies
```json
{
  "antlr4": "^4.13.0",           // Parser generation
  "fabric": "^5.3.0",           // 2D rendering engine
  "canvas": "^2.11.2",          // Node.js canvas support
  "sharp": "^0.32.6",           // Image processing
  "lodash": "^4.17.21",         // Utility functions
  "uuid": "^9.0.1",             // Unique identifiers
  "ajv": "^8.12.0"              // JSON schema validation
}
```

#### Development Dependencies
```json
{
  "typescript": "^5.2.0",
  "vite": "^4.5.0",
  "@types/node": "^20.8.0",
  "vitest": "^0.34.0",          // Testing framework
  "eslint": "^8.52.0",
  "prettier": "^3.0.0",
  "@antlr4/cli": "^4.13.0"      // ANTLR CLI tools
}
```

#### Optional/Future Libraries
```json
{
  "three": "^0.157.0",          // 3D rendering (future)
  "gsap": "^3.12.0",            // Animation (future)
  "chroma-js": "^2.4.2",       // Advanced color manipulation
  "matter-js": "^0.19.0",      // Physics engine (future)
  "p5": "^1.7.0"               // Alternative rendering (evaluation)
}
```

### 2.3 Development Tools

#### Code Quality & Testing
- **ESLint + Prettier**: Code formatting and linting
- **Vitest**: Unit and integration testing
- **TypeScript**: Static type checking
- **Husky**: Git hooks for quality gates

#### Documentation & Collaboration
- **TypeDoc**: API documentation generation
- **Storybook**: Component documentation (future)
- **GitHub Actions**: CI/CD pipeline

#### Development Environment
- **VS Code**: Primary IDE with ANTLR extensions
- **Node.js 22+**: Runtime environment
- **pnpm**: Package manager (faster than npm)

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SITL System Architecture                 │
├─────────────────────────────────────────────────────────────┤
│  CLI Interface  │  Web Interface  │  API Server  │  Library │
├─────────────────────────────────────────────────────────────┤
│                     Core SITL Engine                       │
├─────────────────────────────────────────────────────────────┤
│ Parser Layer    │ AST Processing  │ Validation  │ Templates │
├─────────────────────────────────────────────────────────────┤
│ Entity System   │ Scene Manager   │ Extension   │ Export    │
│                 │                 │ System      │ System    │
├─────────────────────────────────────────────────────────────┤
│ Rendering Engine│ Asset Manager   │ Color       │ Position  │
│ (Fabric.js)     │                 │ System      │ System    │
├─────────────────────────────────────────────────────────────┤
│              Platform Abstraction Layer                    │
├─────────────────────────────────────────────────────────────┤
│    Node.js Canvas    │    Browser Canvas    │    WebGL     │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Core Components

#### 3.2.1 Parser Layer
```typescript
interface ParserLayer {
  lexer: SITLLexer;           // Tokenization
  parser: SITLParser;         // Syntax analysis
  visitor: SITLVisitor;       // AST traversal
  errorHandler: ErrorHandler; // Error reporting
}
```

#### 3.2.2 AST Processing
```typescript
interface ASTNode {
  type: NodeType;
  children: ASTNode[];
  metadata: NodeMetadata;
  validate(): ValidationResult;
  transform(): ProcessedNode;
}
```

#### 3.2.3 Entity System
```typescript
interface EntitySystem {
  entityFactory: EntityFactory;
  entityRegistry: EntityRegistry;
  attributeSystem: AttributeSystem;
  relationshipManager: RelationshipManager;
}
```

#### 3.2.4 Rendering Pipeline
```typescript
interface RenderingPipeline {
  sceneBuilder: SceneBuilder;
  renderer: Renderer;
  exportManager: ExportManager;
  qualityController: QualityController;
}
```

### 3.3 Extension Architecture

```typescript
interface Extension {
  name: string;
  version: string;
  dependencies: string[];
  entities: EntityDefinition[];
  attributes: AttributeDefinition[];
  environments: EnvironmentDefinition[];
  
  load(): Promise<void>;
  unload(): Promise<void>;
  validate(): ValidationResult;
}
```

## 4. Detailed Task Breakdown

### 4.1 Phase 1: Foundation (Weeks 1-4)

#### Week 1: Project Setup & Parser Foundation
- [ ] **Project Initialization** (2 days)
  - Set up TypeScript project with Vite
  - Configure ESLint, Prettier, and testing
  - Set up CI/CD pipeline
  - Create project structure

- [ ] **ANTLR Grammar Definition** (3 days)
  - Define core SITL grammar in ANTLR
  - Implement lexer rules for tokens
  - Create parser rules for basic syntax
  - Generate TypeScript parser code

#### Week 2: Core Parser Implementation
- [ ] **Parser Integration** (2 days)
  - Integrate ANTLR-generated parser
  - Create AST node definitions
  - Implement visitor pattern for AST traversal

- [ ] **Basic Entity System** (3 days)
  - Define entity interfaces and base classes
  - Implement human entity with basic attributes
  - Create entity factory and registry

#### Week 3: Rendering Foundation
- [ ] **Fabric.js Integration** (2 days)
  - Set up Fabric.js canvas
  - Create basic shape rendering
  - Implement coordinate system

- [ ] **Basic Human Rendering** (3 days)
  - Create human figure representation
  - Implement basic attribute rendering (age, color)
  - Add simple positioning system

#### Week 4: Scene System & Export
- [ ] **Scene Management** (2 days)
  - Implement scene container
  - Add entity positioning and layout
  - Create scene validation

- [ ] **Export System** (3 days)
  - Implement PNG export functionality
  - Add basic quality settings
  - Create export pipeline

### 4.2 Phase 2: Core Features (Weeks 5-8)

#### Week 5: Advanced Attributes
- [ ] **Human Attributes Expansion** (3 days)
  - Implement emotion system
  - Add clothing and hair attributes
  - Create attribute validation

- [ ] **Color System** (2 days)
  - Implement comprehensive color system
  - Add color themes and patterns
  - Create color validation

#### Week 6: Positioning & Layout
- [ ] **Advanced Positioning** (3 days)
  - Implement grid-based positioning
  - Add relative positioning system
  - Create layout algorithms

- [ ] **Scene Composition** (2 days)
  - Add multi-entity scenes
  - Implement entity relationships
  - Create composition validation

#### Week 7: Template System
- [ ] **Template Engine** (3 days)
  - Design template system architecture
  - Implement template parsing and storage
  - Add parameter substitution

- [ ] **Template Library** (2 days)
  - Create basic template library
  - Implement template validation
  - Add template reuse functionality

#### Week 8: Error Handling & Validation
- [ ] **Comprehensive Error Handling** (3 days)
  - Implement detailed error reporting
  - Add syntax error recovery
  - Create validation framework

- [ ] **Testing & Documentation** (2 days)
  - Write comprehensive unit tests
  - Create API documentation
  - Add usage examples

### 4.3 Phase 3: Extensions & Polish (Weeks 9-12)

#### Week 9: Extension System
- [ ] **Extension Architecture** (3 days)
  - Design extension loading system
  - Implement extension registry
  - Add namespace resolution

- [ ] **Hospital Extension** (2 days)
  - Create hospital domain extension
  - Implement medical entities
  - Add hospital environments

#### Week 10: Advanced Features
- [ ] **Environment System** (3 days)
  - Implement background environments
  - Add environment-entity integration
  - Create environment library

- [ ] **Performance Optimization** (2 days)
  - Optimize rendering pipeline
  - Add caching mechanisms
  - Implement lazy loading

#### Week 11: Quality & Polish
- [ ] **Quality Improvements** (3 days)
  - Enhance rendering quality
  - Add anti-aliasing and smoothing
  - Optimize export formats

- [ ] **User Experience** (2 days)
  - Improve error messages
  - Add progress indicators
  - Create usage guides

#### Week 12: Final Integration & Testing
- [ ] **Integration Testing** (3 days)
  - End-to-end testing
  - Performance testing
  - Cross-platform testing

- [ ] **Documentation & Release** (2 days)
  - Complete documentation
  - Prepare release package
  - Create deployment scripts

## 5. Implementation Priorities

### 5.1 Critical Path Items
1. **ANTLR Grammar** - Foundation for everything else
2. **Basic Entity System** - Core functionality
3. **Rendering Pipeline** - Visual output capability
4. **Export System** - Deliverable results
5. **Extension System** - Scalability and modularity

### 5.2 Risk Mitigation
- **Parser Complexity**: Start with simplified grammar, iterate
- **Rendering Performance**: Use proven libraries (Fabric.js)
- **Extension Conflicts**: Design clear namespace system
- **Memory Usage**: Implement proper cleanup and optimization
- **Cross-platform Issues**: Use platform abstraction layer

### 5.3 Success Metrics
- **Functionality**: 95% of MVP features working
- **Performance**: <5 second scene generation
- **Quality**: Clean, maintainable codebase
- **Documentation**: Complete API and user documentation
- **Testing**: >80% code coverage

## 6. Resource Requirements

### 6.1 Development Team
- **1 Senior Developer**: Architecture, core systems, complex features
- **1 Mid-level Developer**: Extensions, testing, documentation
- **1 Junior Developer**: Basic features, bug fixes, testing support

### 6.2 Hardware Requirements
- **Development**: Modern laptop with 16GB+ RAM
- **Testing**: Multiple OS environments (Windows, macOS, Linux)
- **CI/CD**: Cloud-based build servers

### 6.3 External Dependencies
- **ANTLR**: Parser generation
- **Fabric.js**: Rendering engine
- **Node.js**: Runtime environment
- **GitHub**: Version control and CI/CD

## 7. Future Roadmap (Post-MVP)

### 7.1 Advanced Rendering (Phase 4)
- Three.js integration for 3D rendering
- Advanced lighting and shadows
- PBR materials and textures
- Real-time preview capabilities

### 7.2 Animation System (Phase 5)
- Entity animations and movements
- Timeline-based animation
- Physics integration
- Interactive animations

### 7.3 Advanced Features (Phase 6)
- AI-powered scene suggestions
- Advanced composition tools
- Collaborative editing
- Cloud-based rendering

### 7.4 Platform Expansion (Phase 7)
- Mobile applications
- Web-based editor
- Desktop applications
- API services

## 8. Conclusion

This implementation plan provides a structured approach to building the SITL system, starting with a focused MVP and expanding to a comprehensive scene generation platform. The modular architecture and phased approach ensure manageable development while maintaining flexibility for future enhancements.

The success of this project depends on:
1. **Strong foundation**: Robust parser and core systems
2. **Iterative development**: Regular testing and feedback
3. **Quality focus**: Clean code and comprehensive testing
4. **User-centric design**: Intuitive syntax and clear documentation
5. **Performance optimization**: Efficient rendering and export

With proper execution of this plan, the SITL system will provide a powerful, flexible platform for scene illustration generation that can serve both technical and creative users effectively.