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

### Changed
- **BREAKING:** Renamed project from SITL to SIGL (Structured Image Generation Language)
- **BREAKING:** Grammar now uses uppercase natural language syntax
- Updated all documentation to use SIGL naming
- Renamed file extensions: .sitl → .sigl
- Package name: sitl-engine → sigl-engine
- Full language name: Scene Illustration Template Language → Structured Image Generation Language

### Documentation
- Created comprehensive grammar specification (docs/system/grammar-specification.md)
- Added Getting Started guide (docs/GETTING_STARTED.md)
- Added Documentation Review with improvement recommendations
- Updated README with implementation status indicators
- Added status legend: ✅ Implemented, 🚧 Partial, 📋 Planned, 💡 Future

## [0.1.0] - 2025-10-16 (Initial State)

### Project Structure
- Basic TypeScript project with Vite
- Core type definitions
- Basic entity factory (human/object/prop)
- Simple canvas-based renderer
- Template engine with parameter interpolation
- Extension manager architecture
- Basic export to PNG/JPEG/WEBP
- Simple ANTLR grammar (lowercase syntax only)

### Implementation Status
- **Overall Completion:** ~15-20%
- **Parser:** Basic structure, needs rewrite for natural language
- **Entity System:** Basic factory pattern implemented
- **Rendering:** Simple 2D canvas rendering
- **Extensions:** Architecture only, no implementations
- **Templates:** Basic interpolation only

### Known Limitations
- No domain extensions implemented
- Animation system not implemented
- Advanced positioning not available
- Pattern system not implemented
- Validation engine incomplete
- Natural language parser not integrated

---

## Version History

- **v0.1.0** (Oct 16, 2025) - Initial project state and assessment
- **Unreleased** - Grammar rewrite, rename to SIGL, documentation improvements

## Migration Guide

### Migrating from SITL to SIGL

If you have existing SITL files or code:

1. **Rename file extensions:**
   ```bash
   # Rename all .sitl files to .sigl
   find . -name "*.sitl" -exec rename 's/\.sitl$/.sigl/' {} +
   ```

2. **Update import statements:**
   ```typescript
   // Old
   import { SITLEngine } from 'sitl-engine';
   
   // New
   import { SIGLEngine } from 'sigl-engine';
   ```

3. **Update package.json:**
   ```json
   {
     "dependencies": {
       "sigl-engine": "^0.1.0"  // Updated package name
     }
   }
   ```

4. **No syntax changes required** - The SIGL syntax is backward compatible with the documented SITL syntax

### Breaking Changes in Unreleased

- Grammar now requires UPPERCASE keywords (`DRAW` not `draw`)
- Entity types are case-sensitive (`MAN` not `man`)
- File extension changed from `.sitl` to `.sigl`
- Package renamed from `sitl-engine` to `sigl-engine`

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

