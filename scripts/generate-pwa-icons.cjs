const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../public');

// Base SVG with Python + C# aesthetics
const svgBase = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="50%" stop-color="#020617" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="pyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="csGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bgGrad)"/>
  <rect x="8" y="8" width="496" height="496" rx="90" fill="none" stroke="#38bdf8" stroke-width="4" stroke-opacity="0.25"/>
  <g transform="translate(256, 256) scale(2.4) translate(-96, -96)">
    <path d="M95.4 36c-26.1 0-24.6 11.4-24.6 11.4l.03 11.7h24.9v3.6H61.2s-16.2 1.8-16.2 27.3 14.1 26.4 14.1 26.4h8.4v-12.3s-.3-14.1 13.8-14.1h24c11.7 0 12.3-10.8 12.3-10.8V68.4s1.8-22.5-22.2-22.5zm-14.1 7.2c2.4 0 4.2 1.8 4.2 4.2 0 2.4-1.8 4.2-4.2 4.2-2.4 0-4.2-1.8-4.2-4.2 0-2.4 1.8-4.2 4.2-4.2z" fill="url(#pyGrad)"/>
    <path d="M96.6 156c26.1 0 24.6-11.4 24.6-11.4l-.03-11.7H96.3v-3.6h34.5s16.2-1.8 16.2-27.3-14.1-26.4-14.1-26.4h-8.4v12.3s.3 14.1-13.8 14.1h-24c-11.7 0-12.3 10.8-12.3 10.8v20.7s-1.8 22.5 22.2 22.5zm14.1-7.2c-2.4 0-4.2-1.8-4.2-4.2 0-2.4 1.8-4.2 4.2-4.2 2.4 0 4.2 1.8 4.2 4.2 0 2.4-1.8 4.2-4.2 4.2z" fill="url(#csGrad)"/>
  </g>
</svg>
`;

// Maskable icon with 15% inner safe zone padding
const svgMaskable = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="50%" stop-color="#020617" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="pyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="csGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="#020617"/>
  <g transform="translate(256, 256) scale(1.9) translate(-96, -96)">
    <path d="M95.4 36c-26.1 0-24.6 11.4-24.6 11.4l.03 11.7h24.9v3.6H61.2s-16.2 1.8-16.2 27.3 14.1 26.4 14.1 26.4h8.4v-12.3s-.3-14.1 13.8-14.1h24c11.7 0 12.3-10.8 12.3-10.8V68.4s1.8-22.5-22.2-22.5zm-14.1 7.2c2.4 0 4.2 1.8 4.2 4.2 0 2.4-1.8 4.2-4.2 4.2-2.4 0-4.2-1.8-4.2-4.2 0-2.4 1.8-4.2 4.2-4.2z" fill="url(#pyGrad)"/>
    <path d="M96.6 156c26.1 0 24.6-11.4 24.6-11.4l-.03-11.7H96.3v-3.6h34.5s16.2-1.8 16.2-27.3-14.1-26.4-14.1-26.4h-8.4v12.3s.3 14.1-13.8 14.1h-24c-11.7 0-12.3 10.8-12.3 10.8v20.7s-1.8 22.5 22.2 22.5zm14.1-7.2c-2.4 0-4.2-1.8-4.2-4.2 0-2.4 1.8-4.2 4.2-4.2 2.4 0 4.2 1.8 4.2 4.2 0 2.4-1.8 4.2-4.2 4.2z" fill="url(#csGrad)"/>
  </g>
</svg>
`;

async function generate() {
  const baseBuffer = Buffer.from(svgBase);
  const maskableBuffer = Buffer.from(svgMaskable);

  // 192x192
  await sharp(baseBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // 512x512
  await sharp(baseBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // maskable 512x512
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // apple-touch-icon 180x180
  await sharp(baseBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // Also create icon-192.png and icon-512.png as aliases
  fs.copyFileSync(
    path.join(publicDir, 'pwa-192x192.png'),
    path.join(publicDir, 'icon-192.png')
  );
  fs.copyFileSync(
    path.join(publicDir, 'pwa-512x512.png'),
    path.join(publicDir, 'icon-512.png')
  );
  console.log('Copied icon-192.png and icon-512.png aliases.');
}

generate().catch(console.error);
