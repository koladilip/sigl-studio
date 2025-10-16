# SIGL Platform Support

SIGL works in **both browser and Node.js environments** seamlessly!

## 🌐 Browser Usage

### HTML + JavaScript

```html
<!DOCTYPE html>
<html>
<head>
    <title>SIGL Browser Example</title>
</head>
<body>
    <canvas id="output"></canvas>
    
    <script type="module">
        import { SIGLEngine } from './dist/index.js';
        
        const sigl = `
            DRAW MAN WITH AGE 30 AND BLUE SHIRT AT LEFT
            DRAW WOMAN WITH RED DRESS NEXT TO MAN
            ADD ENVIRONMENT PARK
        `;
        
        const config = {
            canvas: { width: 1024, height: 768, backgroundColor: '#ffffff' },
            rendering: { quality: 'high', antialiasing: true },
            export: { format: 'png', quality: 90 }
        };
        
        const engine = new SIGLEngine(config);
        await engine.initialize();
        
        const parseResult = await engine.parse(sigl);
        const renderResult = await engine.render(parseResult.data);
        
        // Display in page
        const canvas = renderResult.data;
        document.getElementById('output').replaceWith(canvas);
    </script>
</body>
</html>
```

### React/Vue/Svelte

```typescript
import { SIGLEngine } from 'sigl-engine';
import { useEffect, useRef } from 'react';

function SIGLScene({ siglCode }: { siglCode: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        const engine = new SIGLEngine({
            canvas: { width: 800, height: 600, backgroundColor: '#fff' },
            rendering: { quality: 'high', antialiasing: true },
            export: { format: 'png', quality: 90 }
        });
        
        engine.initialize()
            .then(() => engine.parse(siglCode))
            .then(result => engine.render(result.data))
            .then(result => {
                if (canvasRef.current && result.data) {
                    canvasRef.current.replaceWith(result.data);
                }
            });
    }, [siglCode]);
    
    return <canvas ref={canvasRef} />;
}
```

## 🖥️ Node.js / Terminal Usage

### CLI Tool

```bash
# Generate image from SIGL file
sigl examples/basic/family-portrait.sigl -o output.png

# With options
sigl input.sigl \
  --output my-scene.png \
  --width 1920 \
  --height 1080 \
  --quality 95 \
  --format png
```

### Node.js Script

```typescript
import { SIGLEngine } from 'sigl-engine';
import * as fs from 'fs';

// Read SIGL file
const sigl = fs.readFileSync('scene.sigl', 'utf-8');

// Create engine
const engine = new SIGLEngine({
    canvas: { width: 1024, height: 768, backgroundColor: '#ffffff' },
    rendering: { quality: 'high', antialiasing: true },
    export: { format: 'png', quality: 90 }
});

// Parse, render, export
await engine.initialize();
const parseResult = await engine.parse(sigl);
const renderResult = await engine.render(parseResult.data);
const exportResult = await engine.export(renderResult.data, { format: 'png', quality: 90 });

// Save to file
const buffer = Buffer.from(await exportResult.data.arrayBuffer());
fs.writeFileSync('output.png', buffer);

console.log('✅ Image generated successfully!');
```

### Batch Processing

```typescript
import { SIGLEngine } from 'sigl-engine';
import * as fs from 'fs';
import * as path from 'path';

const config = {
    canvas: { width: 1024, height: 768, backgroundColor: '#ffffff' },
    rendering: { quality: 'high', antialiasing: true },
    export: { format: 'png', quality: 90 }
};

const engine = new SIGLEngine(config);
await engine.initialize();

// Process all .sigl files in directory
const siglFiles = fs.readdirSync('scenes')
    .filter(f => f.endsWith('.sigl'));

for (const file of siglFiles) {
    const sigl = fs.readFileSync(path.join('scenes', file), 'utf-8');
    const parseResult = await engine.parse(sigl);
    const renderResult = await engine.render(parseResult.data);
    const exportResult = await engine.export(renderResult.data, config.export);
    
    const buffer = Buffer.from(await exportResult.data.arrayBuffer());
    const outputName = file.replace('.sigl', '.png');
    fs.writeFileSync(path.join('output', outputName), buffer);
    
    console.log(`✅ Generated: ${outputName}`);
}
```

## Platform Detection

SIGL automatically detects your environment:

```typescript
// In browser: Uses HTMLCanvasElement
// In Node.js: Uses node-canvas (install with: npm install canvas)

import { CanvasFactory } from 'sigl-engine/rendering/platform-canvas';

const factory = CanvasFactory.getInstance();
console.log('Running in browser:', factory.isBrowser());
```

## Dependencies

### Required (All Platforms)
- Node.js 22.0.0+ (for Node.js usage)
- Modern browser with Canvas support (for browser usage)

### Optional (Node.js Only)
```bash
# For Node.js image generation
npm install canvas
```

**Note:** `canvas` is an **optional dependency**. SIGL will work in browser without it.

## Installation

### For Browser Projects
```bash
npm install sigl-engine
```

### For Node.js CLI / Server
```bash
npm install sigl-engine canvas
```

### For Both
```bash
npm install sigl-engine
npm install --save-optional canvas  # Only needed for Node.js
```

## Platform Capabilities

| Feature | Browser | Node.js |
|---------|---------|---------|
| Parse SIGL | ✅ | ✅ |
| Render to Canvas | ✅ | ✅ |
| Export PNG | ✅ | ✅ |
| Export JPEG | ✅ | ✅ |
| Export WEBP | ✅ | ⚠️ (if node-canvas supports) |
| Export SVG | 📋 Planned | 📋 Planned |
| Export PDF | 📋 Planned | 📋 Planned |
| Interactive Preview | ✅ | ❌ |
| Batch Processing | ⚠️ | ✅ |
| CLI Tool | ❌ | ✅ |

## Examples

### Browser Example
See: `browser-example.html`

### Node.js Example
See: `src/cli/generate.ts`

### Universal Example
See: `example-usage.ts` (works in both!)

## Troubleshooting

### Node.js: "canvas module not found"

```bash
npm install canvas
```

### Node.js: Canvas build errors

Make sure you have build tools installed:

**macOS:**
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

**Ubuntu/Debian:**
```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

**Windows:**
- Use pre-built binaries (automatically downloaded by npm)

### Browser: CORS issues

Make sure SIGL files are served from the same origin or configure CORS headers.

## Best Practices

### For Browser Apps
- Use Web Workers for heavy rendering
- Implement progressive rendering for large scenes
- Cache parsed scenes when possible

### For Node.js Apps
- Reuse SIGLEngine instances (don't recreate for each scene)
- Use streams for batch processing
- Implement proper error handling and logging

### Universal Tips
- Validate SIGL syntax before rendering
- Use environment presets for consistent styling
- Leverage extensions for domain-specific needs
- Test in both environments if targeting both

---

**SIGL: Write once, render anywhere!** 🚀

