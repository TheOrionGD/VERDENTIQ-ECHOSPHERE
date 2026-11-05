const sharp = require('sharp');
const path = require('path');

async function generateInstallerGraphics() {
  const iconPath = path.join(__dirname, '..', 'build', 'icon.png');

  // 1. Sidebar Bitmap: 164x314 (MUI standard size)
  const sidebarSvg = Buffer.from(`
    <svg width="164" height="314" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#08101f"/>
          <stop offset="50%" stop-color="#0d1a33"/>
          <stop offset="100%" stop-color="#052329"/>
        </linearGradient>
      </defs>
      <rect width="164" height="314" fill="url(#bgGrad)"/>
      <circle cx="82" cy="105" r="50" fill="#00f0a0" fill-opacity="0.12"/>
      <line x1="20" y1="215" x2="144" y2="215" stroke="#00f0a0" stroke-width="2" stroke-opacity="0.4"/>
      <text x="82" y="245" fill="#ffffff" font-size="14" font-family="Segoe UI, Arial, sans-serif" font-weight="bold" text-anchor="middle">VerdantIQ</text>
      <text x="82" y="265" fill="#00f0a0" font-size="10" font-family="Segoe UI, Arial, sans-serif" letter-spacing="1.5" text-anchor="middle">ECOSPHERE</text>
    </svg>
  `);

  const iconBuffer = await sharp(iconPath).resize(68, 68).toBuffer();

  await sharp(sidebarSvg)
    .composite([{ input: iconBuffer, top: 71, left: 48 }])
    .toFile(path.join(__dirname, '..', 'build', 'installerSidebar.bmp'));
  console.log('Created installerSidebar.bmp');

  // 2. Header Bitmap: 150x57 (MUI standard size)
  const headerSvg = Buffer.from(`
    <svg width="150" height="57" xmlns="http://www.w3.org/2000/svg">
      <rect width="150" height="57" fill="#091322"/>
      <text x="14" y="34" fill="#ffffff" font-size="13" font-family="Segoe UI, Arial, sans-serif" font-weight="bold">VerdantIQ</text>
      <circle cx="120" cy="28" r="18" fill="#00f0a0" fill-opacity="0.18"/>
    </svg>
  `);

  const smallIconBuffer = await sharp(iconPath).resize(26, 26).toBuffer();
  await sharp(headerSvg)
    .composite([{ input: smallIconBuffer, top: 15, left: 107 }])
    .toFile(path.join(__dirname, '..', 'build', 'installerHeader.bmp'));
  console.log('Created installerHeader.bmp');
}

generateInstallerGraphics().catch(err => {
  console.error(err);
  process.exit(1);
});
