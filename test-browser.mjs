// test-browser.mjs
import { chromium } from 'playwright';

async function testSIGLApp() {
  console.log('🚀 Starting Playwright browser test...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen to console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    
    if (type === 'error') {
      console.log('❌ Console Error:', text);
    } else if (type === 'warning') {
      console.log('⚠️  Console Warning:', text);
    } else if (text.includes('✅') || text.includes('🎨') || text.includes('🔍')) {
      console.log('📋', text);
    }
  });
  
  // Listen to page errors
  page.on('pageerror', error => {
    console.log('❌ Page Error:', error.message);
  });
  
  try {
    console.log('🌐 Navigating to http://localhost:3002...');
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    
    console.log('⏳ Waiting for app to load...\n');
    await page.waitForTimeout(2000);
    
    console.log('🔍 Checking page content...');
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if generate button exists
    const generateBtn = await page.$('#generateBtn');
    if (!generateBtn) {
      console.log('❌ Generate button not found!');
      await page.screenshot({ path: 'debug-screenshot.png' });
      return;
    }
    
    console.log('✅ Generate button found\n');
    console.log('🎨 Clicking Generate button...\n');
    
    await generateBtn.click();
    
    // Wait for rendering
    await page.waitForTimeout(3000);
    
    // Check canvas
    const canvas = await page.$('#output');
    if (canvas) {
      const canvasSize = await canvas.evaluate(el => ({
        width: el.width,
        height: el.height,
        hasContent: el.getContext('2d')?.getImageData(0, 0, 1, 1).data[3] !== 0
      }));
      console.log('\n📊 Canvas info:', canvasSize);
    }
    
    // Check for errors
    const errorDiv = await page.$('.error-message');
    if (errorDiv) {
      const errorText = await errorDiv.textContent();
      console.log('\n❌ Error displayed:', errorText);
    }
    
    // Take screenshot
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ path: 'test-output.png', fullPage: true });
    console.log('✅ Screenshot saved to test-output.png');
    
    console.log('\n✨ Test complete! Browser will stay open for inspection.');
    console.log('Press Ctrl+C to close.\n');
    
    // Keep browser open for manual inspection
    await page.waitForTimeout(300000); // 5 minutes
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testSIGLApp().catch(console.error);

