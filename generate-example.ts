// generate-example.ts
// Generate image from SIGL file in Node.js

import * as fs from 'fs';
import { SIGLEngine } from './src/index';
import type { SIGLConfig } from './src/core/types';

async function generateFromFile(inputFile: string, outputFile: string) {
  try {
    // Read SIGL file
    console.log(`📖 Reading: ${inputFile}`);
    const siglCode = fs.readFileSync(inputFile, 'utf-8');
    console.log('\n📝 SIGL Code:');
    console.log('─'.repeat(60));
    console.log(siglCode);
    console.log('─'.repeat(60));

    // Create engine configuration
    const config: SIGLConfig = {
      canvas: {
        width: 1920,
        height: 1080,
        backgroundColor: '#ffffff'
      },
      rendering: {
        quality: 'high',
        antialiasing: true
      },
      export: {
        format: 'png',
        quality: 95
      }
    };

    // Initialize engine
    console.log('\n🎨 Initializing SIGL engine...');
    const engine = new SIGLEngine(config);
    await engine.initialize();

    // Parse SIGL code
    console.log('🔍 Parsing SIGL code...');
    const parseResult = await engine.parse(siglCode);

    if (!parseResult.success) {
      console.error('\n❌ Parse errors:');
      parseResult.errors?.forEach(error => {
        console.error(`  Line ${error.line}: ${error.message}`);
      });
      process.exit(1);
    }

    console.log(`✅ Parsed: ${parseResult.data?.entities.length} entities found`);
    
    // Print entity details
    parseResult.data?.entities.forEach((entity, i) => {
      console.log(`  ${i + 1}. ${entity.attributes.entitySubType} at (${entity.position.x}, ${entity.position.y})`);
    });

    // Render scene
    console.log('\n🖼️  Rendering scene...');
    const renderResult = await engine.render(parseResult.data!);

    if (!renderResult.success || !renderResult.data) {
      console.error('\n❌ Render errors:');
      renderResult.errors?.forEach(error => {
        console.error(`  ${error.message}`);
      });
      process.exit(1);
    }

    console.log('✅ Rendered successfully');

    // Export to file
    console.log(`\n💾 Exporting to: ${outputFile}`);
    const exportResult = await engine.export(renderResult.data, {
      format: 'png',
      quality: 95
    });

    if (!exportResult.success || !exportResult.data) {
      console.error('❌ Export failed');
      process.exit(1);
    }

    // Save to file
    const buffer = Buffer.from(await exportResult.data.arrayBuffer());
    fs.writeFileSync(outputFile, buffer);

    // Success!
    console.log('✅ Image generated successfully!');
    console.log(`\n📊 Output:
  • File: ${outputFile}
  • Size: ${(buffer.length / 1024).toFixed(2)} KB
  • Dimensions: ${config.canvas.width}x${config.canvas.height}
  • Format: PNG
  • Entities: ${parseResult.data?.entities.length}
`);

  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    if (error instanceof Error && error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Usage
const inputFile = process.argv[2] || 'examples/basic/family-portrait.sigl';
const outputFile = process.argv[3] || 'output.png';

generateFromFile(inputFile, outputFile);

