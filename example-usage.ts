#!/usr/bin/env tsx

/**
 * TypeScript Example: Generate images from SIGL
 * 
 * This demonstrates the complete workflow with proper type safety:
 * 1. Parse SIGL code with type checking
 * 2. Render the scene with typed configurations
 * 3. Export to image format with validated options
 */

import { 
  SIGLEngine, 
  SIGLParser, 
  SceneRenderer, 
  ExportManager,
  DEFAULT_CONFIG 
} from './src/index.js';

import type {
  SIGLConfig,
  SceneDefinition,
  RenderOptions,
  ExportOptions,
  ParseResult,
  Result
} from './src/core/types.js';

import type { ExportResult } from './src/rendering/export-manager.js';

import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Generate an image from SIGL code using the full engine
 */
async function generateImageFromSIGL(): Promise<void> {
  console.log('🚀 Starting SIGL image generation...');

  try {
    // 1. Configure the SIGL engine with proper typing
    const config: SIGLConfig = {
      canvas: {
        width: 1024,
        height: 768,
        backgroundColor: '#ffffff'
      },
      rendering: {
        quality: 'high',
        antialiasing: true
      },
      export: {
        format: 'png',
        quality: 0.90
      }
    };

    // 2. Initialize the engine
    console.log('⚙️ Initializing SIGL engine...');
    const engine = new SIGLEngine(config);
    const initResult = await engine.initialize();
    
    if (!initResult.success) {
      console.error('❌ Engine initialization failed:', initResult.errors);
      return;
    }

    // 3. Define your SIGL scene (using the actual SIGL syntax)
    const siglCode = `
scene "Medical Consultation" {
    // Environment setup
    environment {
        lighting: bright_clinical
        background: "hospital room"
        time: "morning"
        atmosphere: professional
    }

    // Define people
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

    // Define objects
    object examination_table {
        type: "medical furniture"
        material: "steel and vinyl"
        color: "white"
    }

    object medical_chart {
        type: "document"
        position: "on wall"
    }

    // Position entities
    position doctor at center_left
    position patient on examination_table
    position examination_table at center
    position medical_chart at background_wall
}`;

    // 4. Parse the SIGL code with type checking
    console.log('📝 Parsing SIGL code...');
    const parseResult: Result<SceneDefinition> = await engine.parse(siglCode);
    
    if (!parseResult.success || !parseResult.data) {
      console.error('❌ Parse failed:', parseResult.errors);
      return;
    }
    console.log('✅ SIGL code parsed successfully');
    console.log(`   - Scene: ${parseResult.data.name}`);
    console.log(`   - Entities: ${parseResult.data.entities?.length || 0}`);

    // 5. Render the scene with typed options
    console.log('🎨 Rendering scene...');
    const renderOptions: RenderOptions = {
      width: 1024,
      height: 768,
      quality: 'high'
    };
    
    const renderResult: Result<HTMLCanvasElement> = await engine.render(parseResult.data, renderOptions);

    if (!renderResult.success || !renderResult.data) {
      console.error('❌ Render failed:', renderResult.errors);
      return;
    }
    console.log('✅ Scene rendered successfully');
    console.log(`   - Canvas size: ${renderResult.data.width}x${renderResult.data.height}`);

    // 6. Export to image with typed export options
    console.log('💾 Exporting image...');
    const exportOptions: ExportOptions = {
      format: 'png',
      filename: 'medical_consultation.png',
      quality: 0.95,
      metadata: true
    };

    const exportResult: Result<Blob> = await engine.export(renderResult.data, exportOptions);

    if (exportResult.success && exportResult.data) {
      console.log('🎉 Image generated successfully!');
      console.log(`📁 File: ${exportOptions.filename}`);
      console.log(`📏 Size: ${exportResult.data.size} bytes`);
      
      // Save the blob to file
      const buffer = Buffer.from(await exportResult.data.arrayBuffer());
      await fs.writeFile(exportOptions.filename || 'output.png', buffer);
      console.log(`💾 Saved to: ${exportOptions.filename}`);
    } else {
      console.error('❌ Export failed:', exportResult.errors);
    }

  } catch (error) {
    console.error('💥 Error:', (error as Error).message);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
  }
}

/**
 * Generate image using individual components with full type safety
 */
async function generateImageWithComponents(): Promise<void> {
  console.log('🔧 Using individual components with TypeScript...');

  try {
    // Read SIGL file with proper error handling
    const siglFilePath = path.join(process.cwd(), 'examples', 'basic', 'simple-scene.sigl');
    
    let siglContent: string;
    try {
      siglContent = await fs.readFile(siglFilePath, 'utf8');
      console.log(`📖 Read SIGL file: ${siglFilePath}`);
    } catch (fileError) {
      console.log('📝 Using inline SIGL code (file not found)');
      siglContent = `
scene "Simple Demo" {
    environment {
        lighting: natural
        background: "outdoor park"
    }
    
    human person {
        age: 25
        pose: "standing"
        emotion: "happy"
    }
    
    position person at center
}`;
    }
    
    // Parse with typed result
    console.log('🔍 Parsing with SIGLParser...');
    const parseResult: ParseResult = SIGLParser.parse(siglContent);
    if (!parseResult.success || !parseResult.ast) {
      console.error('Parse failed:', parseResult.errors);
      return;
    }

    // Create proper config
    const config: SIGLConfig = {
      canvas: {
        width: 800,
        height: 600,
        backgroundColor: '#f0f0f0'
      },
      rendering: {
        quality: 'medium',
        antialiasing: true
      },
      export: {
         format: 'png',
         quality: 0.85
       }
    };
    
    // Export using ExportManager (which handles both rendering and exporting)
    console.log('🎨 Rendering and exporting with ExportManager...');
    const exportManager = new ExportManager(config);
    const exportOptions: ExportOptions = {
       format: 'png',
       filename: 'scene_from_components.png',
       quality: 0.85
     };
    
    const exportResult: ExportResult = await exportManager.export(parseResult.ast as SceneDefinition, exportOptions);

    if (exportResult.success && exportResult.data) {
      console.log('✅ Image from components generated successfully!');
      console.log(`📁 Output: ${exportResult.filename}`);
      console.log(`📏 Size: ${exportResult.size} bytes`);
      console.log(`⏱️ Export time: ${exportResult.exportTime}ms`);
      
      // Save to file system if it's a Blob
      if (exportResult.data instanceof Blob) {
        const buffer = Buffer.from(await exportResult.data.arrayBuffer());
        await fs.writeFile(exportResult.filename, buffer);
        console.log(`💾 Saved to: ${exportResult.filename}`);
      }
    } else {
      console.error('❌ Export failed:', exportResult.errors);
    }

  } catch (error) {
    console.error('Error:', (error as Error).message);
  }
}

/**
 * Batch process multiple SIGL files
 */
async function batchProcessSIGLFiles(inputDir: string, outputDir: string): Promise<void> {
  console.log(`📁 Batch processing SIGL files from ${inputDir}`);
  
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Find all .sigl files
    const files = await fs.readdir(inputDir);
    const siglFiles = files.filter(file => file.endsWith('.sigl'));
    
    console.log(`Found ${siglFiles.length} SIGL files`);
    
    const config: SIGLConfig = {
      canvas: {
        width: 1024,
        height: 768,
        backgroundColor: '#ffffff'
      },
      rendering: {
        quality: 'high',
        antialiasing: true
      },
      export: {
         format: 'png',
         quality: 0.90
       }
    };
    
    const engine = new SIGLEngine(config);
    const initResult = await engine.initialize();
    
    if (!initResult.success) {
      console.error('Failed to initialize engine:', initResult.errors);
      return;
    }
    
    for (const file of siglFiles) {
      console.log(`\n🔄 Processing: ${file}`);
      
      const siglContent = await fs.readFile(path.join(inputDir, file), 'utf8');
      const parseResult = await engine.parse(siglContent);
      
      if (!parseResult.success || !parseResult.data) {
        console.error(`❌ Failed to parse ${file}:`, parseResult.errors);
        continue;
      }
      
      const renderResult = await engine.render(parseResult.data);
      if (!renderResult.success || !renderResult.data) {
        console.error(`❌ Failed to render ${file}:`, renderResult.errors);
        continue;
      }
      
      const outputFilename = file.replace('.sigl', '.png');
      const exportResult = await engine.export(renderResult.data, {
         format: 'png',
         filename: outputFilename,
         quality: 0.90
       });
      
      if (exportResult.success && exportResult.data) {
        const buffer = Buffer.from(await exportResult.data.arrayBuffer());
        await fs.writeFile(path.join(outputDir, outputFilename), buffer);
        console.log(`✅ Generated: ${outputFilename}`);
      } else {
        console.error(`❌ Failed to export ${file}:`, exportResult.errors);
      }
    }
    
  } catch (error) {
    console.error('Batch processing error:', (error as Error).message);
  }
}

// Main execution with proper TypeScript patterns
async function main(): Promise<void> {
  console.log('🎯 SIGL TypeScript Image Generation');
  console.log('===================================');
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'batch':
      const inputDir = args[1] || './examples';
      const outputDir = args[2] || './output';
      await batchProcessSIGLFiles(inputDir, outputDir);
      break;
      
    case 'components':
      await generateImageWithComponents();
      break;
      
    default:
      // Run both examples
      await generateImageFromSIGL();
      console.log('\n' + '='.repeat(50) + '\n');
      await generateImageWithComponents();
  }
}

// Export functions for use as a module
export { 
  generateImageFromSIGL, 
  generateImageWithComponents, 
  batchProcessSIGLFiles 
};

// Run if called directly
// Check if this file is being executed directly (not imported)
const isMainModule = process.argv[1] && process.argv[1].endsWith('example-usage.ts');
if (isMainModule) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}