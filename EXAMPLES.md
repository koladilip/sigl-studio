# SIGL Examples

This directory contains examples demonstrating how to generate images from SIGL (Structured Image Generation Language) code.

## Quick Start

1. **Build the project first:**
   ```bash
   npm run build
   ```

2. **Run the simple test:**
   ```bash
   node test-example.js
   ```

3. **Run the TypeScript example (requires tsx):**
   ```bash
   npx tsx example-usage.ts
   ```

## Available Examples

### 1. `test-example.js` - Simple JavaScript Example
A straightforward JavaScript example that demonstrates:
- Engine initialization with configuration
- SIGL code parsing
- Scene rendering
- Image export to PNG

**Usage:**
```bash
node test-example.js
```

### 2. `example-usage.ts` - Comprehensive TypeScript Example
A full-featured TypeScript example with proper type safety that includes:
- Complete workflow with type checking
- Individual component usage
- Batch processing capabilities
- Error handling and validation

**Usage:**
```bash
# Run default example
npx tsx example-usage.ts

# Use individual components
npx tsx example-usage.ts components

# Batch process SIGL files
npx tsx example-usage.ts batch ./examples ./output
```

## SIGL Syntax Examples

### Basic Scene Structure
```sigl
scene "Scene Name" {
    environment {
        lighting: natural | bright_clinical | dim | dramatic
        background: "description"
        time: "morning" | "afternoon" | "evening" | "night"
        atmosphere: professional | casual | dramatic
    }

    human person_name {
        age: number
        gender: "male" | "female" | "non-binary"
        clothing: "description"
        emotion: "happy" | "sad" | "focused" | "concerned"
        pose: "standing" | "sitting" | "walking"
        accessories: ["item1", "item2"]
    }

    object object_name {
        type: "category"
        material: "material_type"
        color: "color_name"
        state: "description"
    }

    position entity_name at location
    position entity_name on other_entity
}
```

### Medical Scene Example
```sigl
scene "Medical Consultation" {
    environment {
        lighting: bright_clinical
        background: "hospital room"
        time: "morning"
        atmosphere: professional
    }

    human doctor {
        age: 45
        gender: "female"
        clothing: "white coat with stethoscope"
        emotion: "confident"
        pose: "standing"
        accessories: ["clipboard", "pen"]
    }

    human patient {
        age: 30
        gender: "male"
        clothing: "casual shirt"
        emotion: "concerned"
        pose: "sitting"
    }

    object examination_table {
        type: "medical furniture"
        material: "steel and vinyl"
        color: "white"
    }

    position doctor at center_left
    position patient on examination_table
    position examination_table at center
}
```

### Office Scene Example
```sigl
scene "Team Meeting" {
    environment {
        lighting: natural
        background: "modern conference room"
        time: "afternoon"
        atmosphere: professional
    }

    human manager {
        age: 40
        gender: "female"
        clothing: "business suit"
        emotion: "confident"
        pose: "standing"
        accessories: ["presentation remote"]
    }

    human developer {
        age: 28
        gender: "male"
        clothing: "casual shirt"
        emotion: "focused"
        pose: "sitting"
        accessories: ["laptop"]
    }

    object conference_table {
        type: "furniture"
        material: "glass and steel"
        color: "black"
    }

    object projector_screen {
        type: "electronics"
        state: "displaying presentation"
    }

    position manager at front
    position developer at conference_table
    position conference_table at center
    position projector_screen at background
}
```

## Export Options

### Image Formats
- **PNG**: Best for images with transparency, lossless compression
- **JPEG**: Best for photographs, smaller file sizes
- **WebP**: Modern format with excellent compression
- **SVG**: Vector format, scalable
- **PDF**: Document format, good for print

### Configuration Examples

#### High-Quality Print Export
```typescript
const config = {
  canvas: { width: 3000, height: 2000, dpi: 300 },
  rendering: { quality: 'ultra', antialiasing: true },
  export: { format: 'tiff', quality: 1.0, compression: 'lzw' }
};
```

#### Web-Optimized Export
```typescript
const config = {
  canvas: { width: 1200, height: 800 },
  rendering: { quality: 'high', antialiasing: true },
  export: { format: 'webp', quality: 0.85 }
};
```

#### Fast Preview Export
```typescript
const config = {
  canvas: { width: 400, height: 300 },
  rendering: { quality: 'low', antialiasing: false },
  export: { format: 'jpeg', quality: 0.70 }
};
```

## Programmatic Usage

### Basic Usage
```typescript
import { SIGLEngine } from './src/index.js';

const engine = new SIGLEngine(config);
await engine.initialize();

const parseResult = await engine.parse(siglCode);
const renderResult = await engine.render(parseResult.data);
const exportResult = await engine.export(renderResult.data, exportOptions);
```

### Using Individual Components
```typescript
import { SIGLParser, SceneRenderer, ExportManager } from './src/index.js';

// Parse SIGL code
const parseResult = SIGLParser.parse(siglCode);

// Render scene
const renderer = new SceneRenderer(config);
const renderResult = await renderer.render(parseResult.ast);

// Export image
const exportManager = new ExportManager(config);
const exportResult = await exportManager.export(renderResult.data, options);
```

## Error Handling

All operations return a `Result<T>` type with the following structure:
```typescript
interface Result<T> {
  success: boolean;
  data?: T;
  errors?: string[];
  warnings?: string[];
}
```

Always check the `success` property before using `data`:
```typescript
const result = await engine.parse(siglCode);
if (result.success && result.data) {
  // Use result.data safely
} else {
  console.error('Parse failed:', result.errors);
}
```

## Performance Tips

1. **Reuse engine instances** for multiple renders
2. **Use appropriate quality settings** for your use case
3. **Consider canvas size** vs. output requirements
4. **Enable caching** for repeated operations
5. **Use batch processing** for multiple files

## Troubleshooting

### Common Issues

1. **Engine initialization fails**
   - Check that all dependencies are installed
   - Verify configuration is valid

2. **Parse errors**
   - Validate SIGL syntax
   - Check for missing required properties

3. **Render failures**
   - Ensure canvas size is reasonable
   - Check memory constraints for large images

4. **Export issues**
   - Verify export format is supported
   - Check file permissions for output directory

### Debug Mode
Enable debug logging by setting the environment variable:
```bash
DEBUG=sigl:* node your-script.js
```

## Contributing

When adding new examples:
1. Include both TypeScript and JavaScript versions when possible
2. Add comprehensive error handling
3. Document the example purpose and usage
4. Test with different SIGL scene types
5. Update this README with new examples