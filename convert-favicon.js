const sharp = require('sharp');
const fs = require('fs');

async function convertPngToIco() {
  try {
    // Read the logo.png and convert to ICO format (using PNG as ICO with multiple sizes)
    const sizes = [16, 32, 48];
    
    // Create a 32x32 favicon (most common size)
    await sharp('public/logo.png')
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile('public/favicon-32.png');
    
    // Create a 16x16 favicon
    await sharp('public/logo.png')
      .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile('public/favicon.ico');
    
    console.log('Favicon created successfully!');
    console.log('Created: public/favicon.ico (16x16)');
    console.log('Created: public/favicon-32.png (32x32)');
  } catch (error) {
    console.error('Error creating favicon:', error);
  }
}

convertPngToIco();
