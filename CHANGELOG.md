# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- ✨ **Extensible Entity System** - Comprehensive entity builder library with 39+ built-in types
  - HumanBuilder with realistic features (eyes, nose, mouth, ears, hands)
  - ObjectBuilder for 14+ object types (furniture, buildings, vehicles)
  - AnimalBuilder for 14+ animal types (pets, farm animals, wildlife)
  - EntityRegistry for centralized entity management
  - Builder pattern for easy extensibility
- 📊 **Implementation Status Document** - Comprehensive tracking of implemented vs planned features
- 🎨 **Realistic Human Rendering** - Improved 3D human models with:
  - Eyes with colored pupils and iris
  - Facial features (nose, mouth, ears)
  - Detailed hair with style variations
  - Proper body proportions (neck, elbows, knees, hands)
  - Age-based scaling
- 🔧 **Position Resolution System** - Resolves relative positions to absolute coordinates
- 📚 **Entity System Documentation** - Complete guide for the entity builder library

### Fixed
- 🐛 **WebGL Canvas Rendering** - Fixed canvas cloning issue that prevented 3D scene display
- 🐛 **Entity Positioning** - Fixed relative positioning (NEXT TO, IN FRONT OF, etc.)
- 🐛 **Parser Position Resolution** - All entities now properly positioned in 3D space

### Changed
- 📦 **Documentation Organization** - Moved all docs to `docs/` folder
- 🗑️ **Cleanup** - Removed temporary files and old coverage reports
- 📝 **Updated README** - Added entity system information

## [0.1.0] - 2024-10-16

### 🎉 Initial Release - React Migration

#### Added
- ✨ **React + TypeScript Web Application** - Modern browser-based UI
- 🎮 **Three.js 3D Rendering** - Real WebGL graphics in browser
- 📝 **Live SIGL Editor** - Write code, see results instantly
- 💾 **PNG Export** - Download high-quality images
- 🔥 **Hot Module Replacement** - Instant development updates
- 📚 **Example Scenes** - Pre-built templates (family, classroom, hospital)
- 🎨 **SIGL Parser** - Browser-compatible natural language parser
- 🌈 **Color System** - Comprehensive color palette
- 📐 **Position System** - Absolute and relative positioning
- 🎭 **Entity System** - Humans, objects, props with attributes
- 🔌 **Extension System** - Domain-specific extensions

#### Changed
- 🔄 **Architecture**: Migrated from CLI to React-only application
- 🌐 **Platform**: Now 100% browser-based (no Node.js runtime needed)
- 🎯 **Focus**: Browser rendering with Three.js (removed server-side)
- 📦 **Structure**: Cleaner project organization

#### Removed
- ❌ CLI tools (`sigl-cli.cjs`, `generate.ts`)
- ❌ Node.js server rendering
- ❌ Old HTML demos
- ❌ Backend dependencies

### Technical Stack
- React 18
- TypeScript 5.2
- Three.js 0.160
- Vite 7.1
- Vitest 3.2

---

## Versioning

We use [SemVer](http://semver.org/) for versioning.

### Version Format
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality (backwards-compatible)
- **PATCH** version for bug fixes (backwards-compatible)

### Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

---

[0.1.0]: https://github.com/yourusername/game-template-engine/releases/tag/v0.1.0
