import type { ResizeOptions } from '../types';

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
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Draw Background
  if (!forceTransparentBackground && options.backgroundColor !== 'transparent') {
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

  // 2. Calculate content area with padding
  // padding is 0 to 40 (percentage)
  const paddingRatio = Math.max(0, Math.min(40, options.padding)) / 100;
  const padX = targetWidth * paddingRatio;
  const padY = targetHeight * paddingRatio;
  const drawWidth = Math.max(1, Math.round(targetWidth - padX * 2));
  const drawHeight = Math.max(1, Math.round(targetHeight - padY * 2));
  const drawX = Math.round(padX);
  const drawY = Math.round(padY);

  // 3. Render downscaled image into content area
  const scaledImageCanvas = steppedDownscale(img, img.naturalWidth || img.width, img.naturalHeight || img.height, drawWidth, drawHeight);

  ctx.drawImage(scaledImageCanvas, drawX, drawY, drawWidth, drawHeight);

  return canvas;
}

/**
 * Renders icon to PNG Blob.
 */
export function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string = 'image/png'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create blob from canvas'));
    }, mimeType);
  });
}
