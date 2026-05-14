const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImage = 'public/logo.png';

// Android icon sizes
const androidSizes = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 }
];

// iOS icon sizes (for AppIcon.appiconset)
const iosSizes = [
  { name: 'Icon-20@2x.png', size: 40 },
  { name: 'Icon-20@3x.png', size: 60 },
  { name: 'Icon-29@2x.png', size: 58 },
  { name: 'Icon-29@3x.png', size: 87 },
  { name: 'Icon-40@2x.png', size: 80 },
  { name: 'Icon-40@3x.png', size: 120 },
  { name: 'Icon-60@2x.png', size: 120 },
  { name: 'Icon-60@3x.png', size: 180 },
  { name: 'Icon-76.png', size: 76 },
  { name: 'Icon-76@2x.png', size: 152 },
  { name: 'Icon-83.5@2x.png', size: 167 },
  { name: 'Icon-1024.png', size: 1024 }
];

async function generateIcons() {
  console.log('Generating app icons...\n');

  // Generate Android icons
  console.log('Generating Android icons...');
  for (const { folder, size } of androidSizes) {
    const outputDir = path.join('android', 'app', 'src', 'main', 'res', folder);
    const outputPath = path.join(outputDir, 'ic_launcher.png');
    const outputPathRound = path.join(outputDir, 'ic_launcher_round.png');
    
    await sharp(inputImage)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    await sharp(inputImage)
      .resize(size, size)
      .png()
      .toFile(outputPathRound);
    
    console.log(`  ✓ ${folder}: ${size}x${size}px`);
  }

  // Generate iOS icons
  console.log('\nGenerating iOS icons...');
  const iosOutputDir = path.join('ios', 'MyApp', 'Images.xcassets', 'AppIcon.appiconset');
  
  for (const { name, size } of iosSizes) {
    const outputPath = path.join(iosOutputDir, name);
    
    await sharp(inputImage)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`  ✓ ${name}: ${size}x${size}px`);
  }

  // Update iOS Contents.json
  const contentsJson = {
    images: [
      { size: '20x20', idiom: 'iphone', filename: 'Icon-20@2x.png', scale: '2x' },
      { size: '20x20', idiom: 'iphone', filename: 'Icon-20@3x.png', scale: '3x' },
      { size: '29x29', idiom: 'iphone', filename: 'Icon-29@2x.png', scale: '2x' },
      { size: '29x29', idiom: 'iphone', filename: 'Icon-29@3x.png', scale: '3x' },
      { size: '40x40', idiom: 'iphone', filename: 'Icon-40@2x.png', scale: '2x' },
      { size: '40x40', idiom: 'iphone', filename: 'Icon-40@3x.png', scale: '3x' },
      { size: '60x60', idiom: 'iphone', filename: 'Icon-60@2x.png', scale: '2x' },
      { size: '60x60', idiom: 'iphone', filename: 'Icon-60@3x.png', scale: '3x' },
      { size: '76x76', idiom: 'ipad', filename: 'Icon-76.png', scale: '1x' },
      { size: '76x76', idiom: 'ipad', filename: 'Icon-76@2x.png', scale: '2x' },
      { size: '83.5x83.5', idiom: 'ipad', filename: 'Icon-83.5@2x.png', scale: '2x' },
      { size: '1024x1024', idiom: 'ios-marketing', filename: 'Icon-1024.png', scale: '1x' }
    ],
    info: {
      version: 1,
      author: 'xcode'
    }
  };

  fs.writeFileSync(
    path.join(iosOutputDir, 'Contents.json'),
    JSON.stringify(contentsJson, null, 2)
  );

  console.log('\n✅ All icons generated successfully!');
  console.log('\nNext steps:');
  console.log('1. Clean build: cd android & gradlew clean & cd ..');
  console.log('2. Rebuild: npm run android');
  console.log('3. For iOS: cd ios & pod install & cd .. & npm run ios');
}

generateIcons().catch(console.error);
