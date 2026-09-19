/**
 * Pure client-side PNG metadata injector.
 * Embeds standard PNG textual chunks (tEXt) into PNG byte streams.
 * Compliant with ISO/IEC 15948:2004 and RFC 2083 specifications.
 */

// Precomputed CRC-32 lookup table for IEEE 802.3
const CRC_TABLE: Uint32Array = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[i] = c >>> 0;
}

/**
 * Calculates CRC-32 checksum for a byte array slice.
 */
export function crc32(buf: Uint8Array, offset: number, length: number): number {
  let c = 0xffffffff;
  const end = offset + length;
  for (let i = offset; i < end; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

export interface PngMetadata {
  Software?: string;
  Author?: string;
  Website?: string;
  Source?: string;
  Title?: string;
  Comment?: string;
  CreationTime?: string;
  [key: string]: string | undefined;
}

export const DEFAULT_ICONFORGE_METADATA: PngMetadata = {
  Software: 'IconForge by Ger Studio (https://appicon.gerstudio.com/)',
  Author: 'Ger Studio',
  Website: 'https://appicon.gerstudio.com/',
  Source: 'https://appicon.gerstudio.com/',
  Comment: 'Generated with IconForge (https://appicon.gerstudio.com/) - 100% Client-Side Universal App Icon Engine',
};

/**
 * Injects standard tEXt metadata chunks into a PNG binary buffer directly after the IHDR chunk.
 * If the input buffer is not a valid PNG, the original buffer is returned safely.
 */
export function injectPngMetadata(
  pngBytes: Uint8Array,
  customMetadata?: Partial<PngMetadata>
): Uint8Array {
  // Validate PNG signature: \x89PNG\r\n\x1a\n (8 bytes)
  if (
    pngBytes.length < 33 ||
    pngBytes[0] !== 0x89 ||
    pngBytes[1] !== 0x50 ||
    pngBytes[2] !== 0x4e ||
    pngBytes[3] !== 0x47 ||
    pngBytes[4] !== 0x0d ||
    pngBytes[5] !== 0x0a ||
    pngBytes[6] !== 0x1a ||
    pngBytes[7] !== 0x0a
  ) {
    return pngBytes;
  }

  // Read IHDR length (bytes 8..11, big endian)
  const ihdrDataLen =
    ((pngBytes[8] << 24) |
      (pngBytes[9] << 16) |
      (pngBytes[10] << 8) |
      pngBytes[11]) >>> 0;

  // Total IHDR chunk size = 4 (length) + 4 ("IHDR") + ihdrDataLen + 4 (CRC)
  const ihdrTotalLen = 12 + ihdrDataLen;
  const insertOffset = 8 + ihdrTotalLen;

  if (insertOffset > pngBytes.length) {
    return pngBytes;
  }

  const mergedMeta: Record<string, string> = {
    ...DEFAULT_ICONFORGE_METADATA,
    CreationTime: new Date().toISOString(),
    ...(customMetadata as Record<string, string> | undefined),
  };

  const chunks: Uint8Array[] = [];
  const encoder = new TextEncoder();

  for (const [key, value] of Object.entries(mergedMeta)) {
    if (!key || !value) continue;

    // PNG tEXt keyword must be 1-79 characters in latin-1 range
    const cleanKey = key.trim().slice(0, 79);
    const keyBytes = encoder.encode(cleanKey);
    const valBytes = encoder.encode(value.trim());

    // Chunk data length = key length + 1 (null separator) + value length
    const dataLen = keyBytes.length + 1 + valBytes.length;
    const chunk = new Uint8Array(12 + dataLen);
    const view = new DataView(chunk.buffer);

    // 1. Length (4 bytes, big endian)
    view.setUint32(0, dataLen, false);

    // 2. Chunk Type "tEXt"
    chunk[4] = 0x74; // 't'
    chunk[5] = 0x45; // 'E'
    chunk[6] = 0x58; // 'X'
    chunk[7] = 0x74; // 't'

    // 3. Chunk Data: [keyword, 0x00, value]
    chunk.set(keyBytes, 8);
    chunk[8 + keyBytes.length] = 0x00;
    chunk.set(valBytes, 8 + keyBytes.length + 1);

    // 4. CRC-32 (calculated over type and data, offset 4, length 4 + dataLen)
    const chunkCrc = crc32(chunk, 4, 4 + dataLen);
    view.setUint32(8 + dataLen, chunkCrc, false);

    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return pngBytes;
  }

  const extraBytes = chunks.reduce((acc, c) => acc + c.length, 0);
  const result = new Uint8Array(pngBytes.length + extraBytes);

  // Copy PNG Header + IHDR
  result.set(pngBytes.subarray(0, insertOffset), 0);

  // Insert tEXt chunks
  let cursor = insertOffset;
  for (const chunk of chunks) {
    result.set(chunk, cursor);
    cursor += chunk.length;
  }

  // Copy remaining original chunks (IDAT, IEND, etc.)
  result.set(pngBytes.subarray(insertOffset), cursor);

  return result;
}

/**
 * Injects metadata into a PNG Blob and returns an enriched Blob.
 */
export async function injectPngBlobMetadata(
  blob: Blob,
  customMetadata?: Partial<PngMetadata>
): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const withMeta = injectPngMetadata(bytes, customMetadata);
  return new Blob([withMeta as any], { type: 'image/png' });
}
