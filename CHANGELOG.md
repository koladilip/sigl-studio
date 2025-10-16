# Changelog

All notable changes to SIGL (Structured Image Generation Language) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive ANTLR grammar for natural language syntax
- Formal grammar specification documentation
- Getting Started guide for new users
- Implementation status badges across all documentation
- Support for DRAW command with entity types (MAN, WOMAN, BOY, GIRL, BABY, ANIMAL)
- Attribute parsing system (WITH AGE 30 AND BLUE SHIRT syntax)
- Parameterized attributes (HAIR(COLOR: BROWN, STYLE: SHORT))
- Positioning syntax (AT LEFT, NEXT TO, BEHIND, etc.)
- LOAD EXTENSION command structure
- DEFINE TEMPLATE and DEFINE VARIATION commands
- CREATE SCENE and ADD ENVIRONMENT commands
- ANIMATE command structure
- EXPORT command with format options
- Negated attributes (WITHOUT SHIRT, NO PANTS, BARE TORSO)

### Documentation
- Created comprehensive grammar specification (docs/system/grammar-specification.md)
- Added Getting Started guide (docs/GETTING_STARTED.md)
- Added Documentation Review with improvement recommendations
- Updated README with implementation status indicators
- Added status legend: ✅ Implemented, 🚧 Partial, 📋 Planned, 💡 Future

## [0.1.0] - 2025-10-16 (Initial Release)

### Initial Features
- TypeScript project with Vite build system
- Core type definitions and interfaces
- Basic entity factory (human/object/prop)
- Simple canvas-based renderer
- Template engine with parameter interpolation
- Extension manager architecture
- Basic export to PNG/JPEG/WEBP
- ANTLR4-based grammar with natural language syntax

### Current Status
- **Overall Completion:** ~15-20%
- **Parser:** Grammar defined, needs TypeScript integration
- **Entity System:** Basic factory pattern implemented
- **Rendering:** Simple 2D canvas rendering
- **Extensions:** Architecture ready, implementations pending
- **Templates:** Basic interpolation working

### In Development
- Domain extension implementations (educational, hospital, military)
- Advanced positioning system (grid, anchors, relative)
- Animation system
- Pattern system for visual effects
- Comprehensive validation engine

## Roadmap

### v0.2.0 (Planned - Q4 2025)
- [ ] Parser integration with new grammar
- [ ] Educational extension implementation
- [ ] Hospital extension implementation
- [ ] Basic test suite

### v0.3.0 (Planned - Q1 2026)
- [ ] Military extension
- [ ] Transportation extension
- [ ] Advanced positioning system
- [ ] Template inheritance

### v0.4.0 (Planned - Q2 2026)
- [ ] Animation system implementation
- [ ] Pattern system
- [ ] Advanced rendering options

### v1.0.0 (Planned - Q3 2026)
- [ ] All core features implemented
- [ ] Comprehensive test coverage
- [ ] Production-ready performance
- [ ] Complete documentation
- [ ] CLI tools
- [ ] Web playground

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute to SIGL.

## License

MIT License - see [LICENSE](LICENSE) file for details.

