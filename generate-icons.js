import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const iconDir = 'public/icons';
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

const inputSvg = 'public/prism.svg';

async function generateIcons() {
  try {
    // 32x32
    await sharp(inputSvg)
      .resize(32, 32)
      .png()
      .toFile(path.join(iconDir, 'icon-32.png'));
    console.log('✓ icon-32.png generated');

    // 192x192
    await sharp(inputSvg)
      .resize(192, 192)
      .png()
      .toFile(path.join(iconDir, 'icon-192.png'));
    console.log('✓ icon-192.png generated');

    // 512x512
    await sharp(inputSvg)
      .resize(512, 512)
      .png()
      .toFile(path.join(iconDir, 'icon-512.png'));
    console.log('✓ icon-512.png generated');

    // 180x180 (Apple Touch Icon)
    await sharp(inputSvg)
      .resize(180, 180)
      .png()
      .toFile('public/apple-touch-icon.png');
    console.log('✓ apple-touch-icon.png generated');

    // Favicon.ico (using 32x32 png as source)
    await sharp(inputSvg)
      .resize(32, 32)
      .toFile('public/favicon.ico');
    console.log('✓ favicon.ico generated');

    // OG Image (1200x630, centered)
    const background = { r: 10, g: 10, b: 8, alpha: 1 }; // #0a0a08
    const svgResized = await sharp(inputSvg).resize(400, 400).toBuffer();
    await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background
      }
    })
    .composite([{ input: svgResized, gravity: 'center' }])
    .png()
    .toFile('public/og-image.png');
    console.log('✓ og-image.png generated (1200x630)');

    console.log('\nAll assets generated successfully!');

  } catch (err) {
    console.error('Error generating icons:', err);
  }
}

generateIcons();
