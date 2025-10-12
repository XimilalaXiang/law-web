import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PNG } from 'pngjs';

// Simple dynamic PNG (1200x630) for social sharing (WeChat/OG)
// Solid brand green background. This ensures a valid PNG even if SVG is unsupported.
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const width = 1200;
    const height = 630;
    const png = new PNG({ width, height });

    // Brand color #16a34a (22, 163, 74)
    const r = 0x16;
    const g = 0xa3;
    const b = 0x4a;
    const a = 0xff;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2;
        png.data[idx] = r;
        png.data[idx + 1] = g;
        png.data[idx + 2] = b;
        png.data[idx + 3] = a;
      }
    }

    // Output PNG buffer
    // @ts-ignore - PNG.sync exists at runtime
    const buffer: Buffer = (PNG as any).sync.write(png);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    return res.status(200).send(buffer);
  } catch (e) {
    console.error('OG image generation failed:', e);
    return res.status(500).send('OG image error');
  }
}

