# SIGL - Structured Image Generation Language

> A browser-based 3D scene generator powered by natural language

**🚀 [Try Live Demo](https://koladilip.github.io/sigl-studio/)** | [Documentation](docs/README.md) | [Examples](examples/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.160-000000.svg)](https://threejs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🎨 What is SIGL?

**SIGL** (Structured Image Generation Language) is a domain-specific language for creating 3D scenes using natural, human-readable syntax. Write simple text commands and generate beautiful 3D scenes rendered with Three.js!

```sigl
DRAW MAN WITH AGE 35 AND BLUE SHIRT AT LEFT
DRAW WOMAN WITH AGE 32 AND RED DRESS NEXT TO MAN
DRAW BOY WITH AGE 8 IN FRONT OF MAN
DRAW GIRL WITH AGE 6 IN FRONT OF WOMAN

ADD ENVIRONMENT PARK
```

↓ **Generates** ↓

Beautiful 3D scene with proper depth, lighting, and perspective! 🎭

## ✨ Features

- 🎮 **Three.js 3D Rendering** - Real WebGL-powered graphics
- 📝 **Natural Language Syntax** - Easy to learn and write
- 🎨 **Live Preview** - See your scenes instantly
- 💾 **PNG Export** - Download high-quality images
- 🌐 **Browser-Based** - No installation, runs 100% in browser
- 🚀 **TypeScript** - Fully type-safe
- 🔥 **Hot Reload** - Instant updates during development

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd game-template-engine

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# → http://localhost:3000
```

That's it! The React app will load with Three.js 3D rendering ready to go.

## 📚 Documentation

### Language Reference
- **[SIGL Syntax Guide](docs/system/grammar-specification.md)** - Complete language specification
- **[Implementation Status](IMPLEMENTATION_STATUS.md)** 🎯 - What's implemented vs planned (~45% complete)
- **[Getting Started](docs/GETTING_STARTED.md)** - Beginner's guide

### Core Concepts
- **[Entities](docs/core/entities.md)** - Characters and objects
- **[Positioning](docs/core/positioning.md)** - Spatial placement  
- **[Colors](docs/core/colors.md)** - Color system

### Extensions
- **[Educational](docs/extensions/educational.md)** - Classroom scenes
- **[Hospital](docs/extensions/hospital.md)** - Medical environments
- **[And more...](docs/extensions/)** - Transportation, military, religious, etc.

## 🎯 Example Scenes

### Family Portrait
```sigl
DRAW MAN WITH AGE 35 AND BLUE SHIRT AT LEFT
DRAW WOMAN WITH AGE 32 AND RED DRESS NEXT TO MAN
DRAW BOY WITH AGE 8 AND GREEN SHIRT IN FRONT OF MAN
DRAW GIRL WITH AGE 6 AND YELLOW DRESS IN FRONT OF WOMAN

ADD ENVIRONMENT PARK
EXPORT AS PNG WITH QUALITY: HIGH
```

### Classroom
```sigl
LOAD EXTENSION educational

ADD ENVIRONMENT CLASSROOM

DRAW TEACHER WITH AGE 35 AT LEFT
DRAW STUDENT WITH AGE 10 AT CENTER
DRAW STUDENT WITH AGE 11 NEXT TO STUDENT
DRAW BLACKBOARD AT RIGHT
```

### Hospital
```sigl
LOAD EXTENSION hospital

ADD ENVIRONMENT EXAMINATION_ROOM

DRAW DOCTOR WITH AGE 45 AND BEARD AT LEFT
DRAW PATIENT WITH AGE 50 NEXT TO DOCTOR
DRAW NURSE WITH AGE 35 AT RIGHT
```

See [examples/](examples/) for more scene files.

## 🏗️ Project Structure

```
game-template-engine/
├── src/                    # React App + SIGL Engine
│   ├── App.tsx             # Main React component
│   ├── main.tsx            # React entry point
│   ├── components/         # React UI components
│   ├── hooks/              # React hooks (engine integration)
│   ├── utils/              # Utilities & examples
│   └── engine/             # SIGL Engine
│       ├── parser/         # SIGL parser (browser-compatible)
│       ├── core/           # Engine core
│       ├── rendering/      # Three.js + Canvas renderers
│       ├── entities/       # Entity definitions
│       └── extensions/     # Domain extensions
│
├── index.html          # HTML entry point
├── vite.config.ts      # Vite configuration
├── package.json        # Dependencies & scripts
├── examples/           # Example .sigl files
├── docs/               # Documentation
└── tests/              # Tests
```

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Three.js** | 3D rendering engine |
| **Vite** | Build tool & dev server |
| **Vitest** | Testing framework |

## 🎨 Rendering

SIGL uses **Three.js** for real 3D WebGL rendering in the browser:

- ✅ **Perspective Camera** - Realistic depth
- ✅ **Dynamic Lighting** - Shadows and illumination  
- ✅ **3D Meshes** - Real geometry with realistic features
- ✅ **Materials** - PBR-ready rendering
- ✅ **Fallback** - 2D Canvas if WebGL unavailable

### 🧩 Extensible Entity System

SIGL features a powerful entity builder library with **39+ built-in entity types**:

- **11 Human Types** - Realistic humans with eyes, facial features, hands, proper anatomy
- **14 Object Types** - Furniture, buildings, vehicles, props
- **14 Animal Types** - Dogs, cats, birds, horses, and more

**See [Entity System Docs](docs/system/entity-system.md)** for full details on creating custom entities.

## 📝 Language Syntax

### Basic Commands

```sigl
// Draw entities
DRAW <entity> [WITH <attributes>] [AT/NEXT TO/BEHIND <position>]

// Environment
ADD ENVIRONMENT <type>

// Extensions
LOAD EXTENSION <name>

// Export
EXPORT AS <format> [WITH <options>]
```

### Entity Types
- `MAN`, `WOMAN`, `BOY`, `GIRL`, `BABY`
- `TEACHER`, `STUDENT`, `DOCTOR`, `NURSE`
- `TREE`, `HOUSE`, `CAR`, `BUILDING`

### Attributes
- `AGE <number>` - Character age
- `<color> SHIRT/DRESS/PANTS` - Clothing
- `BEARD`, `GLASSES` - Features
- `<skin> SKIN` - Skin tone

### Positioning
- `AT LEFT/CENTER/RIGHT` - Named positions
- `NEXT TO <entity>` - Relative to other entities
- `BEHIND/IN FRONT OF <entity>` - Depth positioning
- `AT POSITION <x>, <y>` - Absolute coordinates

## 🚀 Development

### Setup
```bash
npm install
```

### Run Development Server
```bash
npm run dev
# → http://localhost:3000
```

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
npm run test:coverage
npm run test:watch
```

## 📦 Deployment

The React app can be deployed to any static hosting:

### Netlify / Vercel
```bash
npm run build
# Deploy the 'dist' folder
```

### GitHub Pages
```bash
npm run build
# Deploy dist/ to gh-pages branch
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** - 3D rendering engine
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tooling

## 📧 Contact

- **GitHub**: [Issues](https://github.com/yourusername/game-template-engine/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/game-template-engine/discussions)

---

**Made with ❤️ using React + TypeScript + Three.js**
