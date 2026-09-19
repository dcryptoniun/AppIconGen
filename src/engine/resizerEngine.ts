import type { ResizeOptions } from '../types';
import { injectPngBlobMetadata, type PngMetadata } from './pngMetadata';

/**
 * Loads an image from a Data URL or Blob URL into an HTMLImageElement.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`Failed to load image: ${err}`));
    img.src = src;
  });
}

/**
 * Performs high-quality stepped downsampling to avoid aliasing and pixelation.
 * Scales down in halving steps until within 2x of target, then final bicubic scale.
 */
export function steppedDownscale(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  // If target is same or larger, render directly
  if (targetWidth >= sourceWidth && targetHeight >= sourceHeight) {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
    return canvas;
  }

  let currentWidth = sourceWidth;
  let currentHeight = sourceHeight;
  let currentCanvas = document.createElement('canvas');
  currentCanvas.width = currentWidth;
  currentCanvas.height = currentHeight;
  let currentCtx = currentCanvas.getContext('2d');
  if (!currentCtx) throw new Error('Could not get 2D context');
  currentCtx.imageSmoothingEnabled = true;
  currentCtx.imageSmoothingQuality = 'high';
  currentCtx.drawImage(source, 0, 0, currentWidth, currentHeight);

  // Stepped halving
  while (currentWidth * 0.5 >= targetWidth && currentHeight * 0.5 >= targetHeight) {
    const nextWidth = Math.floor(currentWidth * 0.5);
    const nextHeight = Math.floor(currentHeight * 0.5);

    const nextCanvas = document.createElement('canvas');
    nextCanvas.width = nextWidth;
    nextCanvas.height = nextHeight;
    const nextCtx = nextCanvas.getContext('2d');
    if (!nextCtx) throw new Error('Could not get 2D context');

    nextCtx.imageSmoothingEnabled = true;
    nextCtx.imageSmoothingQuality = 'high';
    nextCtx.drawImage(currentCanvas, 0, 0, currentWidth, currentHeight, 0, 0, nextWidth, nextHeight);

    currentCanvas = nextCanvas;
    currentWidth = nextWidth;
    currentHeight = nextHeight;
  }

  // Final scale to exact target dimensions
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = targetWidth;
  finalCanvas.height = targetHeight;
  const finalCtx = finalCanvas.getContext('2d');
  if (!finalCtx) throw new Error('Could not get 2D context');

  finalCtx.imageSmoothingEnabled = true;
  finalCtx.imageSmoothingQuality = 'high';
  finalCtx.drawImage(currentCanvas, 0, 0, currentWidth, currentHeight, 0, 0, targetWidth, targetHeight);

  return finalCanvas;
}

export interface LayerInputImages {
  master?: HTMLImageElement | null;
  foreground?: HTMLImageElement | null;
  background?: HTMLImageElement | null;
  monochrome?: HTMLImageElement | null;
}

/**
 * Synthesizes a spec-compliant monochrome silhouette from any canvas or image source.
 * Preserves alpha anti-aliasing while replacing RGB with pure tint color (default pure white #FFF).
 */
export function synthesizeMonochromeCanvas(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  tintColor: string = '#FFFFFF'
): HTMLCanvasElement {
  const downscaled = steppedDownscale(source, sourceWidth, sourceHeight, targetWidth, targetHeight);
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  ctx.drawImage(downscaled, 0, 0);

  const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const data = imgData.data;

  // Determine if image has meaningful transparency
  let hasAlpha = false;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 240) {
      hasAlpha = true;
      break;
    }
  }

  // Parse tintColor hex
  let r = 255, g = 255, b = 255;
  if (tintColor.startsWith('#') && tintColor.length >= 7) {
    r = parseInt(tintColor.slice(1, 3), 16) || 255;
    g = parseInt(tintColor.slice(3, 5), 16) || 255;
    b = parseInt(tintColor.slice(5, 7), 16) || 255;
  }

  for (let i = 0; i < data.length; i += 4) {
    if (hasAlpha) {
      // For transparent logos: preserve alpha, tint visible pixels
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    } else {
      // For opaque images: calculate luminance threshold
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = lum > 128 ? 255 : 0;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

/**
 * Creates a data URL of the synthesized monochrome icon for instant live preview.
 */
export async function createMonochromeDataUrl(sourceDataUrl: string, size: number = 128): Promise<string> {
  const img = await loadImage(sourceDataUrl);
  const canvas = synthesizeMonochromeCanvas(img, img.naturalWidth || img.width, img.naturalHeight || img.height, size, size);
  return canvas.toDataURL('image/png');
}

/**
 * Renders multi-layer or single icon to canvas with support for foreground, background, monochrome, and dark variants.
 */
export function renderLayeredIconToCanvas(
  layers: LayerInputImages,
  targetWidth: number,
  targetHeight: number,
  options: ResizeOptions,
  shape: 'default' | 'round' | 'foreground' | 'background' | 'monochrome' | 'dark' | 'tinted' | 'maskable' = 'default'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const fg = layers.foreground || layers.master;
  const bg = layers.background;
  const mono = layers.monochrome;

  // 1. Standalone background
  if (shape === 'background') {
    if (bg) {
      const scaledBg = steppedDownscale(bg, bg.naturalWidth || bg.width, bg.naturalHeight || bg.height, targetWidth, targetHeight);
      ctx.drawImage(scaledBg, 0, 0, targetWidth, targetHeight);
    } else {
      ctx.fillStyle = options.backgroundColor === 'transparent' ? '#0f172a' : options.backgroundColor;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }
    return canvas;
  }

  // 2. Standalone monochrome / tinted
  if (shape === 'monochrome' || shape === 'tinted') {
    if (mono) {
      const paddingRatio = Math.max(0, Math.min(40, options.padding)) / 100;
      const padX = targetWidth * paddingRatio;
      const padY = targetHeight * paddingRatio;
      const drawWidth = Math.max(1, Math.round(targetWidth - padX * 2));
      const drawHeight = Math.max(1, Math.round(targetHeight - padY * 2));
      const scaledMono = steppedDownscale(mono, mono.naturalWidth || mono.width, mono.naturalHeight || mono.height, drawWidth, drawHeight);
      ctx.drawImage(scaledMono, Math.round(padX), Math.round(padY), drawWidth, drawHeight);
    } else if (fg) {
      const paddingRatio = Math.max(0, Math.min(40, options.padding)) / 100;
      const padX = targetWidth * paddingRatio;
      const padY = targetHeight * paddingRatio;
      const drawWidth = Math.max(1, Math.round(targetWidth - padX * 2));
      const drawHeight = Math.max(1, Math.round(targetHeight - padY * 2));
      const synthCanvas = synthesizeMonochromeCanvas(fg, fg.naturalWidth || fg.width, fg.naturalHeight || fg.height, drawWidth, drawHeight);
      ctx.drawImage(synthCanvas, Math.round(padX), Math.round(padY), drawWidth, drawHeight);
    }
    return canvas;
  }

  // 3. Standalone foreground (Adaptive Icon foreground: transparent canvas with 18% - 30% safe zone inset)
  if (shape === 'foreground') {
    if (fg) {
      const safePaddingRatio = Math.max(0.18, Math.min(0.35, options.padding / 100));
      const padX = targetWidth * safePaddingRatio;
      const padY = targetHeight * safePaddingRatio;
      const drawWidth = Math.max(1, Math.round(targetWidth - padX * 2));
      const drawHeight = Math.max(1, Math.round(targetHeight - padY * 2));
      const scaledFg = steppedDownscale(fg, fg.naturalWidth || fg.width, fg.naturalHeight || fg.height, drawWidth, drawHeight);
      ctx.drawImage(scaledFg, Math.round(padX), Math.round(padY), drawWidth, drawHeight);
    }
    return canvas;
  }

  // 4. Standalone dark mode (iOS 18 Dark Mode)
  if (shape === 'dark') {
    ctx.fillStyle = '#12151d';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    if (fg) {
      const paddingRatio = Math.max(0, Math.min(40, options.padding)) / 100;
      const padX = targetWidth * paddingRatio;
      const padY = targetHeight * paddingRatio;
      const drawWidth = Math.max(1, Math.round(targetWidth - padX * 2));
      const drawHeight = Math.max(1, Math.round(targetHeight - padY * 2));
      const scaledFg = steppedDownscale(fg, fg.naturalWidth || fg.width, fg.naturalHeight || fg.height, drawWidth, drawHeight);
      ctx.drawImage(scaledFg, Math.round(padX), Math.round(padY), drawWidth, drawHeight);
    }
    return canvas;
  }

  // 5. Composite Background layer
  if (bg) {
    const scaledBg = steppedDownscale(bg, bg.naturalWidth || bg.width, bg.naturalHeight || bg.height, targetWidth, targetHeight);
    ctx.drawImage(scaledBg, 0, 0, targetWidth, targetHeight);
  } else if (options.backgroundColor !== 'transparent') {
    if (options.backgroundMode === 'gradient' && options.gradientStart && options.gradientEnd) {
      const angleRad = ((options.gradientAngle || 135) * Math.PI) / 180;
      const x1 = targetWidth / 2 - (Math.cos(angleRad) * targetWidth) / 2;
      const y1 = targetHeight / 2 - (Math.sin(angleRad) * targetHeight) / 2;
      const x2 = targetWidth / 2 + (Math.cos(angleRad) * targetWidth) / 2;
      const y2 = targetHeight / 2 + (Math.sin(angleRad) * targetHeight) / 2;

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, options.gradientStart);
      gradient.addColorStop(1, options.gradientEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    } else if (options.backgroundColor) {
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }
  }

  // 6. Composite Foreground layer
  if (fg) {
    const effectivePadding = shape === 'maskable' ? Math.max(options.padding, 20) : options.padding;
    const paddingRatio = Math.max(0, Math.min(40, effectivePadding)) / 100;
    const padX = targetWidth * paddingRatio;
    const padY = targetHeight * paddingRatio;
    const drawWidth = Math.max(1, Math.round(targetWidth - padX * 2));
    const drawHeight = Math.max(1, Math.round(targetHeight - padY * 2));
    const scaledFg = steppedDownscale(fg, fg.naturalWidth || fg.width, fg.naturalHeight || fg.height, drawWidth, drawHeight);
    ctx.drawImage(scaledFg, Math.round(padX), Math.round(padY), drawWidth, drawHeight);
  }

  // 7. Circular mask for round shape
  if (shape === 'round') {
    const roundCanvas = document.createElement('canvas');
    roundCanvas.width = targetWidth;
    roundCanvas.height = targetHeight;
    const roundCtx = roundCanvas.getContext('2d');
    if (roundCtx) {
      roundCtx.imageSmoothingEnabled = true;
      roundCtx.imageSmoothingQuality = 'high';
      roundCtx.beginPath();
      roundCtx.arc(targetWidth / 2, targetHeight / 2, targetWidth / 2, 0, Math.PI * 2);
      roundCtx.closePath();
      roundCtx.clip();
      roundCtx.drawImage(canvas, 0, 0);
      return roundCanvas;
    }
  }

  return canvas;
}

/**
 * Renders an image to an HTMLCanvasElement with options (padding, background, corner radius).
 */
export function renderIconToCanvas(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  options: ResizeOptions,
  forceTransparentBackground: boolean = false
): HTMLCanvasElement {
  const effectiveOptions: ResizeOptions = forceTransparentBackground
    ? { ...options, backgroundColor: 'transparent', backgroundMode: 'transparent' }
    : options;

  return renderLayeredIconToCanvas({ master: img }, targetWidth, targetHeight, effectiveOptions, 'default');
}

/**
 * Renders icon to Blob with automated PNG metadata injection.
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string = 'image/png',
  metadata?: Partial<PngMetadata>
): Promise<Blob> {
  const rawBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create blob from canvas'));
    }, mimeType);
  });

  if (mimeType === 'image/png') {
    return injectPngBlobMetadata(rawBlob, metadata);
  }

  return rawBlob;
}
