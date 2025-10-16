#!/usr/bin/env node

/**
 * Simple test script to demonstrate SITL image generation
 * This uses the built JavaScript files to avoid TypeScript compilation issues
 */

import { SITLEngine } from './dist/sitl-engine.js';

async function testSITLGeneration() {
  console.log('🧪 Testing SITL Image Generation');
  console.log('================================');

  try {
    // Configure the engine
    const config = {
      canvas: {
        width: 800,
        height: 600,
        backgroundColor: '#f8f9fa'
      },
      rendering: {
        quality: 'medium',
        antialiasing: true
      },
      export: {
        format: 'png',
        quality: 85
      }
    };

    console.log('⚙️ Initializing SITL engine...');
    const engine = new SITLEngine(config);
    const initResult = await engine.initialize();
    
    if (!initResult.success) {
      console.error('❌ Engine initialization failed:', initResult.errors);
      return;
    }
    console.log('✅ Engine initialized successfully');

    // Define a simple SITL scene
    const sitlCode = `
scene "Test Scene" {
    environment {
        lighting: natural
        background: "modern office"
        time: "afternoon"
        atmosphere: professional
    }

    human developer {
        age: 28
        gender: "non-binary"
        clothing: "casual hoodie"
        emotion: "focused"
        pose: "sitting at desk"
        accessories: ["laptop", "coffee mug"]
    }

    object desk {
        type: "furniture"
        material: "wood"
        color: "oak"
    }

    object laptop {
        type: "electronics"
        brand: "modern"
        state: "open"
    }

    position developer at center
    position desk at center
    position laptop on desk
}`;

    console.log('📝 Parsing SITL code...');
    const parseResult = await engine.parse(sitlCode);
    
    if (!parseResult.success || !parseResult.data) {
      console.error('❌ Parse failed:', parseResult.errors);
      return;
    }
    console.log('✅ SITL code parsed successfully');
    console.log(`   - Scene: "${parseResult.data.name}"`);

    console.log('🎨 Rendering scene...');
    const renderResult = await engine.render(parseResult.data, {
      width: 800,
      height: 600,
      quality: 'medium'
    });

    if (!renderResult.success || !renderResult.data) {
      console.error('❌ Render failed:', renderResult.errors);
      return;
    }
    console.log('✅ Scene rendered successfully');
    console.log(`   - Canvas: ${renderResult.data.width}x${renderResult.data.height}`);

    console.log('💾 Exporting image...');
    const exportResult = await engine.export(renderResult.data, {
      format: 'png',
      filename: 'test_scene.png',
      quality: 85,
      metadata: true
    });

    if (exportResult.success && exportResult.data) {
      console.log('🎉 Image generated successfully!');
      console.log(`📁 File: test_scene.png`);
      console.log(`📏 Size: ${exportResult.data.size} bytes`);
      
      // In a real implementation, you would save the blob to file
      console.log('💡 Note: In a real implementation, the blob would be saved to the filesystem');
    } else {
      console.error('❌ Export failed:', exportResult.errors);
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testSITLGeneration().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});