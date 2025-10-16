# How to Generate Images from SIGL Files

## 🌐 **Method 1: Browser (Easiest!)**

### Quick Start
1. **Open the browser demo:**
   ```bash
   # Start development server
   npm run dev
   
   # Or open directly:
   open generate-in-browser.html
   ```

2. **That's it!** The browser will:
   - Load your SIGL code
   - Parse it
   - Render the scene
   - Display the image
   - Let you download as PNG

### Browser API Usage

```javascript
// In your web app
import { SIGLEngine } from './dist/index.js';

const siglCode = `
  DRAW MAN WITH AGE 30 AND BLUE SHIRT AT LEFT
  DRAW WOMAN WITH RED DRESS NEXT TO MAN
  ADD ENVIRONMENT PARK
`;

const config = {
  canvas: { width: 1024, height: 768, backgroundColor: '#fff' },
  rendering: { quality: 'high', antialiasing: true },
  export: { format: 'png', quality: 90 }
};

const engine = new SIGLEngine(config);
await engine.initialize();

const parseResult = await engine.parse(siglCode);
const renderResult = await engine.render(parseResult.data);

// renderResult.data is a HTMLCanvasElement - add to DOM!
document.body.appendChild(renderResult.data);

// Or export as blob
const exportResult = await engine.export(renderResult.data, config.export);
// exportResult.data is a Blob - download or upload
```

---

## 🖥️ **Method 2: Node.js / Terminal**

### Prerequisites
```bash
# Install node-canvas for server-side rendering
npm install canvas
```

### Quick Script

```typescript
// generate.ts
import * as fs from 'fs';
import { SIGLEngine } from './src/index';

const siglCode = fs.readFileSync('examples/basic/family-portrait.sigl', 'utf-8');

const config = {
  canvas: { width: 1920, height: 1080, backgroundColor: '#ffffff' },
  rendering: { quality: 'high', antialiasing: true },
  export: { format: 'png', quality: 95 }
};

const engine = new SIGLEngine(config);
await engine.initialize();

const parseResult = await engine.parse(siglCode);
const renderResult = await engine.render(parseResult.data);
const exportResult = await engine.export(renderResult.data, config.export);

// Save to file
const buffer = Buffer.from(await exportResult.data.arrayBuffer());
fs.writeFileSync('output.png', buffer);

console.log('✅ Generated: output.png');
```

### Run It

```bash
# Using vite-node (development)
npx vite-node generate.ts

# Or compile and run (production)
npm run build
node dist/generate.js
```

---

## 📝 **Method 3: Using the Example Script**

We created a ready-to-use generator:

```bash
# Generate from any .sigl file
npx vite-node generate-example.ts examples/basic/family-portrait.sigl output.png

# Different examples
npx vite-node generate-example.ts examples/educational/classroom-scene.sigl classroom.png
npx vite-node generate-example.ts examples/hospital/medical-checkup.sigl hospital.png
```

**Output:**
```
📖 Reading: examples/basic/family-portrait.sigl
🔍 Parsing SIGL code...
✅ Parsed: 4 entities found
🖼️  Rendering scene...
✅ Rendered successfully
💾 Exporting to: output.png
✅ Image generated successfully!

📊 Output:
  • File: output.png
  • Size: 45.23 KB
  • Dimensions: 1920x1080
  • Entities: 4
```

---

## 🔧 **Method 4: CLI Tool** (When Built)

After `npm run build`:

```bash
# Simple usage
sigl examples/basic/family-portrait.sigl

# With options
sigl examples/basic/family-portrait.sigl \
  --output my-family.png \
  --width 3840 \
  --height 2160 \
  --quality 100 \
  --format png
```

---

## 🎯 **Recommended Workflow**

### For Development / Testing
✅ **Use Browser** (`generate-in-browser.html`)
- Fastest iteration
- Instant visual feedback
- No setup needed
- Edit and see results immediately

### For Production / Automation
✅ **Use Node.js Script** (`generate-example.ts`)
- Batch processing
- Server-side rendering
- Automated pipelines
- Headless generation

---

## 🚀 **Quick Start (Right Now!)**

### Option A: Browser (0 setup)
```bash
# Just open in browser
open generate-in-browser.html
```

### Option B: Node.js (if you have canvas installed)
```bash
# Make sure canvas is installed
npm install canvas

# Generate image
npx vite-node generate-example.ts \
  examples/basic/family-portrait.sigl \
  family-portrait-output.png
```

### Option C: Development Server
```bash
# Start dev server
npm run dev

# Open browser to http://localhost:5173
# Import and use SIGLEngine directly
```

---

## 📚 **More Examples**

All these work right now:

### Basic Family Portrait
```sigl
DRAW MAN WITH AGE 35 AND BLUE SHIRT AT LEFT
DRAW WOMAN WITH AGE 32 AND RED DRESS NEXT TO MAN
DRAW BOY WITH AGE 8 IN FRONT OF MAN
DRAW GIRL WITH AGE 6 IN FRONT OF WOMAN
ADD ENVIRONMENT PARK
```

### Educational Scene
```sigl
LOAD EXTENSION educational
ADD ENVIRONMENT CLASSROOM
DRAW TEACHER AT LEFT
DRAW STUDENT AT GRID 1, 1
DRAW STUDENT AT GRID 2, 1
```

### Hospital Scene
```sigl
LOAD EXTENSION hospital
ADD ENVIRONMENT EXAMINATION_ROOM
DRAW DOCTOR AT LEFT
DRAW PATIENT NEXT TO DOCTOR
DRAW NURSE AT RIGHT
```

---

## 💡 **Troubleshooting**

### "Cannot find module 'canvas'"
```bash
npm install canvas
```

### "Canvas build errors" (Node.js)
**macOS:**
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
npm install canvas
```

**Ubuntu/Debian:**
```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev
npm install canvas
```

### "Module not found" errors
```bash
# Rebuild the project
npm run build
```

---

## 🎉 **The Easiest Way: Browser!**

Just open `generate-in-browser.html` - **no installation, no setup, just works!**

The browser example includes:
- Live SIGL code editor
- Instant rendering
- Multiple example templates
- PNG download button
- **No server required!**

Try it now! 🚀

