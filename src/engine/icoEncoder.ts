/**
 * Pure client-side binary ICO encoder.
 * Encodes multiple PNG image buffers into a valid multi-resolution Windows .ico container file.
 * Compatible with all modern browsers, Windows Explorer, and standard favicon specs.
 */

export interface IcoImageFrame {
  width: number;
  height: number;
  pngData: Uint8Array;
}

/**
 * Creates an ICO binary file from an array of PNG byte buffers.
 * @param frames Array of image frames with width, height, and PNG byte array.
 * @returns Uint8Array containing the complete binary ICO file.
 */
export function encodeIco(frames: IcoImageFrame[]): Uint8Array {
  if (frames.length === 0) {
    throw new Error('At least one image frame is required to encode an ICO file.');
  }

  const numImages = frames.length;
  const headerSize = 6;
  const directoryEntrySize = 16;
  const directorySize = numImages * directoryEntrySize;
  const dataOffsetStart = headerSize + directorySize;

  // Calculate total file size
  let totalDataSize = 0;
  for (const frame of frames) {
    totalDataSize += frame.pngData.length;
  }

  const totalFileSize = dataOffsetStart + totalDataSize;
  const buffer = new Uint8Array(totalFileSize);
  const view = new DataView(buffer.buffer);

  // 1. ICONDIR Header (6 bytes)
  view.setUint16(0, 0, true); // Reserved, must be 0
  view.setUint16(2, 1, true); // Resource type: 1 for icon (.ICO)
  view.setUint16(4, numImages, true); // Number of images

  // 2. ICONDIRENTRY array (16 bytes per image)
  let currentOffset = dataOffsetStart;
  for (let i = 0; i < numImages; i++) {
    const frame = frames[i];
    const entryOffset = headerSize + i * directoryEntrySize;

    // Width (1 byte): 256 is represented as 0
    const w = frame.width >= 256 ? 0 : frame.width;
    buffer[entryOffset + 0] = w;

    // Height (1 byte): 256 is represented as 0
    const h = frame.height >= 256 ? 0 : frame.height;
    buffer[entryOffset + 1] = h;

    // Color count (1 byte): 0 for 256+ colors / 32-bit
    buffer[entryOffset + 2] = 0;

    // Reserved (1 byte): must be 0
    buffer[entryOffset + 3] = 0;

    // Color planes (2 bytes): 1
    view.setUint16(entryOffset + 4, 1, true);

    // Bits per pixel (2 bytes): 32 for RGBA
    view.setUint16(entryOffset + 6, 32, true);

    // Size of image data in bytes (4 bytes)
    view.setUint32(entryOffset + 8, frame.pngData.length, true);

    // Offset of image data from beginning of file (4 bytes)
    view.setUint32(entryOffset + 12, currentOffset, true);

    // 3. Copy PNG data into the buffer at currentOffset
    buffer.set(frame.pngData, currentOffset);
    currentOffset += frame.pngData.length;
  }

  return buffer;
}

/**
 * Converts a Canvas element to PNG Uint8Array.
 */
export async function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to convert canvas to blob'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(new Uint8Array(reader.result));
        } else {
          reject(new Error('Unexpected FileReader result format'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(blob);
    }, 'image/png');
  });
}
