#!/usr/bin/env node
// sigl-cli.js
// Simple CLI wrapper for SIGL image generation

const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║              SIGL Image Generator CLI                      ║
╚════════════════════════════════════════════════════════════╝

Usage:
  npm run sigl <input.sigl> [output.png]
  npm run sigl examples/basic/family-portrait.sigl output.png

Options:
  input.sigl    SIGL source file (required)
  output.png    Output image file (optional, defaults to input name)

Examples:
  npm run sigl examples/basic/family-portrait.sigl
  npm run sigl examples/educational/classroom-scene.sigl classroom.png
  npm run sigl examples/hospital/medical-checkup.sigl hospital.png

Quick Test:
  npm run sigl examples/basic/family-portrait.sigl

Note: Requires 'canvas' package for Node.js
      Install with: npm install canvas
  `);
  process.exit(0);
}

const inputFile = args[0];
const outputFile = args[1] || inputFile.replace(/\.sigl$/, '.png');

console.log('🚀 SIGL Image Generator');
console.log('═'.repeat(60));

try {
  const cmd = `npx vite-node generate-example.ts "${inputFile}" "${outputFile}"`;
  execSync(cmd, { stdio: 'inherit', cwd: __dirname });
} catch (error) {
  process.exit(1);
}

