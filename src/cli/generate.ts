#!/usr/bin/env node
// src/cli/generate.ts
/**
 * CLI tool for generating images from SIGL files
 * Works in terminal/Node.js environment
 */

import * as fs from 'fs';
import * as path from 'path';
import { SIGLParser } from '../parser/sigl-parser';
import { SIGLEngine } from '../core/engine';
import type { SIGLConfig } from '../core/types';

interface CLIOptions {
  input: string;
  output?: string;
  format?: 'png' | 'jpeg' | 'webp';
  width?: number;
  height?: number;
  quality?: number;
}

/**
 * Parse command line arguments
 */
function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {
    input: '',
    format: 'png',
    width: 1024,
    height: 768,
    quality: 90
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-i' || arg === '--input') {
      options.input = args[++i];
    } else if (arg === '-o' || arg === '--output') {
      options.output = args[++i];
    } else if (arg === '-f' || arg === '--format') {
      options.format = args[++i] as 'png' | 'jpeg' | 'webp';
    } else if (arg === '-w' || arg === '--width') {
      options.width = parseInt(args[++i]);
    } else if (arg === '-h' || arg === '--height') {
      options.height = parseInt(args[++i]);
    } else if (arg === '-q' || arg === '--quality') {
      options.quality = parseInt(args[++i]);
    } else if (!arg.startsWith('-')) {
      // First non-flag argument is input file
      if (!options.input) {
        options.input = arg;
      }
    }
  }

  return options;
}

/**
 * Generate image from SIGL file
 */
async function generateImage(options: CLIOptions): Promise<void> {
  try {
    // Validate input
    if (!options.input) {
      console.error('Error: No input file specified');
      console.log('Usage: sigl-generate <input.sigl> [options]');
      console.log('Options:');
      console.log('  -o, --output <file>     Output file path (default: input name with .png)');
      console.log('  -f, --format <format>   Output format: png, jpeg, webp (default: png)');
      console.log('  -w, --width <pixels>    Image width (default: 1024)');
      console.log('  -h, --height <pixels>   Image height (default: 768)');
      console.log('  -q, --quality <0-100>   Image quality (default: 90)');
      process.exit(1);
    }

    if (!fs.existsSync(options.input)) {
      console.error(`Error: Input file not found: ${options.input}`);
      process.exit(1);
    }

    // Read SIGL source
    console.log(`📖 Reading SIGL file: ${options.input}`);
    const siglSource = fs.readFileSync(options.input, 'utf-8');

    // Parse SIGL
    console.log('🔍 Parsing SIGL source...');
    const parser = new SIGLParser();
    const parseResult = parser.parse(siglSource);

    if (!parseResult.success) {
      console.error('❌ Parse errors:');
      parseResult.errors.forEach(error => {
        console.error(`  Line ${error.line}: ${error.message}`);
      });
      process.exit(1);
    }

    console.log(`✅ Parsed successfully: ${parseResult.ast?.entities.length} entities`);

    // Create engine config
    const config: SIGLConfig = {
      canvas: {
        width: options.width!,
        height: options.height!,
        backgroundColor: '#ffffff'
      },
      rendering: {
        quality: 'high',
        antialiasing: true
      },
      export: {
        format: options.format!,
        quality: options.quality!
      }
    };

    // Initialize engine
    console.log('🎨 Initializing render engine...');
    const engine = new SIGLEngine(config);
    await engine.initialize();

    // Render scene
    console.log('🖼️  Rendering scene...');
    const renderResult = await engine.render(parseResult.ast!, {
      width: options.width,
      height: options.height
    });

    if (!renderResult.success || !renderResult.data) {
      console.error('❌ Render errors:');
      renderResult.errors?.forEach(error => {
        console.error(`  ${error.message}`);
      });
      process.exit(1);
    }

    // Export to file
    const outputPath = options.output || 
      path.join(
        path.dirname(options.input),
        path.basename(options.input, path.extname(options.input)) + '.' + options.format
      );

    console.log(`💾 Exporting to: ${outputPath}`);
    const exportResult = await engine.export(renderResult.data, {
      format: options.format!,
      quality: options.quality!
    });

    if (!exportResult.success || !exportResult.data) {
      console.error('❌ Export failed');
      process.exit(1);
    }

    // Write to file
    const buffer = Buffer.from(await exportResult.data.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);

    console.log(`✅ Image generated successfully: ${outputPath}`);
    console.log(`📊 Size: ${(buffer.length / 1024).toFixed(2)} KB`);
    console.log(`📐 Dimensions: ${options.width}x${options.height}`);
    console.log(`🎭 Entities: ${parseResult.ast?.entities.length}`);

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run CLI
if (require.main === module) {
  const options = parseArgs();
  generateImage(options).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { generateImage, parseArgs };

