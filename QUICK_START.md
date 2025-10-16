# 🚀 Quick Start: Generate Images from SIGL Files

## ✅ **EASIEST METHOD: Browser** (Works Right Now!)

### Step 1: Open the Browser Generator

```bash
open generate-in-browser.html
```

Or double-click `generate-in-browser.html` in Finder

### Step 2: Done! 🎉

The browser will automatically:
- ✅ Load the example SIGL code
- ✅ Parse it
- ✅ Render the scene
- ✅ Display the image

### Step 3: Try Your File

1. Click "📚 Classroom Example" or "🏥 Hospital Example" buttons
2. Or paste code from `examples/basic/family-portrait.sigl` 
3. Click "🎨 Generate Image"
4. Click "💾 Download PNG" to save

**No installation, no setup, just works!** ✨

---

## 🖥️ **Node.js / CLI Method** (For Automation)

### Prerequisites

You need node-canvas for Node.js rendering:

**macOS (if you have Homebrew):**
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
npm install canvas
```

**Ubuntu/Linux:**
```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
npm install canvas
```

**Windows:**
```bash
npm install canvas
# Pre-built binaries will download automatically
```

### Usage

Once canvas is installed:

```bash
# Generate from your SIGL file
npm run sigl examples/basic/family-portrait.sigl

# With custom output name
npm run sigl examples/basic/family-portrait.sigl my-output.png

# Other examples
npm run sigl examples/educational/classroom-scene.sigl
npm run sigl examples/hospital/medical-checkup.sigl
```

---

## 🎯 **Recommended: Use Browser for Now**

Since this is a **brand new project** and canvas installation can be tricky, **use the browser method**:

1. **Open:** `generate-in-browser.html`
2. **Edit:** SIGL code in the textarea
3. **Click:** "Generate Image" button  
4. **Download:** Click "Download PNG"

**Advantages:**
- ✅ No dependencies needed
- ✅ Instant visual feedback
- ✅ Edit and regenerate easily
- ✅ Works on any OS
- ✅ No installation issues

---

## 📝 **Your SIGL File**

File: `examples/basic/family-portrait.sigl`

```sigl
// Family portrait example

DRAW MAN WITH AGE 35 AND BLUE SHIRT AT LEFT
DRAW WOMAN WITH AGE 32 AND RED DRESS NEXT TO MAN
DRAW BOY WITH AGE 8 AND GREEN SHIRT IN FRONT OF MAN
DRAW GIRL WITH AGE 6 AND YELLOW DRESS IN FRONT OF WOMAN

ADD ENVIRONMENT PARK

EXPORT AS PNG WITH RESOLUTION: 1920x1080 AND QUALITY: HIGH
```

**This code works perfectly in the browser generator!**

---

## 🎨 **What You'll Get**

The generated image will show:
- 👨 Man (age 35, blue shirt) on the left
- 👩 Woman (age 32, red dress) next to the man
- 👦 Boy (age 8, green shirt) in front of man
- 👧 Girl (age 6, yellow dress) in front of woman
- 🌳 Park environment (green/blue background)

---

## 💡 **Next Steps**

### Try More Features:

**Parameterized Attributes:**
```sigl
DRAW WOMAN WITH HAIR(COLOR: BLONDE, STYLE: LONG, TEXTURE: WAVY)
```

**Load Extensions:**
```sigl
LOAD EXTENSION hospital
DRAW DOCTOR WITH WHITE_COAT
DRAW NURSE NEXT TO DOCTOR
```

**Grid Positioning:**
```sigl
DRAW STUDENT AT GRID 1, 1
DRAW STUDENT AT GRID 2, 1
DRAW STUDENT AT GRID 3, 1
```

---

## 🔧 **Troubleshooting**

### Canvas Installation Issues (Node.js)
If `npm install canvas` fails, **just use the browser method!**

The browser method is:
- Faster to start
- Easier to debug
- Better for development
- No dependencies

### Module Errors
Make sure you're using Node.js 22+:
```bash
node --version  # Should be v22.0.0 or higher
```

---

## 📖 **Full Documentation**

- **Usage Guide:** [HOW_TO_USE.md](HOW_TO_USE.md)
- **Platform Support:** [PLATFORM_SUPPORT.md](PLATFORM_SUPPORT.md)
- **Getting Started:** [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)

---

## ✨ **Summary**

**To generate an image from your SIGL file:**

```bash
# Easiest (works immediately):
open generate-in-browser.html

# Advanced (after canvas setup):
npm run sigl examples/basic/family-portrait.sigl output.png
```

**Start with the browser - it just works!** 🎉

