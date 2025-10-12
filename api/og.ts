import type { VercelRequest, VercelResponse } from '@vercel/node';
import { deflateSync } from 'node:zlib';

// Minimal PNG generator (RGBA, no deps). Produces a solid #16a34a image 1200x630.
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const width = 1200;
    const height = 630;

    // Build raw RGBA scanlines with filter byte 0 per row
    const bytesPerPixel = 4;
    const rowLength = width * bytesPerPixel;
    const raw = Buffer.alloc((rowLength + 1) * height);
    const r = 0x16, g = 0xa3, b = 0x4a, a = 0xff; // #16a34a
    for (let y = 0; y < height; y++) {
      const rowStart = y * (rowLength + 1);
      raw[rowStart] = 0; // filter type 0
      let p = rowStart + 1;
      for (let x = 0; x < width; x++) {
        raw[p++] = r; raw[p++] = g; raw[p++] = b; raw[p++] = a;
      }
    }

    const idatData = deflateSync(raw);

    const png = Buffer.concat([
      // Signature
      Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]),
      // IHDR
      makeChunk('IHDR', buildIHDR(width, height)),
      // IDAT
      makeChunk('IDAT', idatData),
      // IEND
      makeChunk('IEND', Buffer.alloc(0)),
    ]);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    return res.status(200).send(png);
  } catch (e) {
    console.error('OG image generation failed:', e);
    return res.status(500).send('OG image error');
  }
}

function buildIHDR(width: number, height: number): Buffer {
  const b = Buffer.alloc(13);
  b.writeUInt32BE(width, 0);
  b.writeUInt32BE(height, 4);
  b[8] = 8;   // bit depth
  b[9] = 6;   // color type RGBA
  b[10] = 0;  // compression method
  b[11] = 0;  // filter method
  b[12] = 0;  // interlace
  return b;
}

function makeChunk(type: 'IHDR'|'IDAT'|'IEND', data: Buffer): Buffer {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = crc32(Buffer.concat([typeBytes, data]));
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([len, typeBytes, data, crcBuf]);
}

function crc32(buf: Buffer): number {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c = (c ^ buf[i]) >>> 0;
    for (let k = 0; k < 8; k++) {
      const mask = -(c & 1);
      c = (c >>> 1) ^ (0xEDB88320 & mask);
    }
  }
  return ~c >>> 0;
}
