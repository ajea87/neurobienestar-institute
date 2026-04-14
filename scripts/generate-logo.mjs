import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// SVG del logo IEN — El Nodo Vago — sobre fondo #1C3D50
// Viewbox original: 80x108. Lo centramos en un canvas cuadrado 512x512.
const SIZE = 512;
// Reservamos 80px arriba, 100px abajo (para el texto IEN), 80px laterales
const PADDING_H = 80;  // horizontal
const PADDING_TOP = 60;
const PADDING_BOT = 100; // espacio para el texto IEN
const LOGO_W = SIZE - PADDING_H * 2;          // 352px
const MAX_LOGO_H = SIZE - PADDING_TOP - PADDING_BOT; // 352px

// Escala limitada para que el logo quepa verticalmente
const scaleByW = LOGO_W / 80;
const scaleByH = MAX_LOGO_H / 108;
const scale = Math.min(scaleByW, scaleByH);   // ~3.26
const logoH = Math.round(108 * scale);
const offsetX = Math.round((SIZE - 80 * scale) / 2);
const offsetY = PADDING_TOP;

const svg = `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo institucional -->
  <rect width="${SIZE}" height="${SIZE}" fill="#1C3D50" rx="0"/>

  <!-- Logo "El Nodo Vago" centrado -->
  <g transform="translate(${offsetX}, ${offsetY}) scale(${scale})">
    <!-- Tronco vertical -->
    <path d="M40,6 C39.4,28 40.6,62 40,102"
      stroke="#F4EFE6" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <!-- Ramificaciones superiores -->
    <path d="M40,24 C36.5,23 31,21 25,18.5"
      stroke="#F4EFE6" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M40,24 C43.5,23 49,21 55,18.5"
      stroke="#F4EFE6" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <!-- Ramificación media -->
    <path d="M40,52 C44.5,51 51,53 57.5,56.5"
      stroke="#F4EFE6" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <!-- Ramificaciones inferiores -->
    <path d="M40,76 C36,77 30,80 23.5,83"
      stroke="#F4EFE6" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M40,76 C44,77 50,80 56.5,83"
      stroke="#F4EFE6" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <!-- Nodos -->
    <circle cx="40" cy="24" r="3" fill="#F4EFE6"/>
    <circle cx="40" cy="52" r="3" fill="#F4EFE6"/>
    <circle cx="40" cy="76" r="3" fill="#F4EFE6"/>
  </g>

  <!-- Texto IEN debajo del logo -->
  <text
    x="${SIZE / 2}"
    y="${offsetY + logoH + 36}"
    text-anchor="middle"
    font-family="Georgia, serif"
    font-size="48"
    letter-spacing="14"
    fill="#F4EFE6"
    opacity="0.9"
  >IEN</text>
</svg>`;

const outputPath = join(__dirname, "../public/ien-logo-512.png");

await sharp(Buffer.from(svg))
  .png()
  .toFile(outputPath);

console.log(`✓ Logo generado: public/ien-logo-512.png (${SIZE}x${SIZE}px)`);

// También generar versión 128x128 como mínimo para Stripe
const output128 = join(__dirname, "../public/ien-logo-128.png");
await sharp(Buffer.from(svg))
  .resize(128, 128)
  .png()
  .toFile(output128);

console.log(`✓ Logo generado: public/ien-logo-128.png (128x128px)`);
