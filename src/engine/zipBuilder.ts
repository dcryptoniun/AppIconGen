import JSZip from 'jszip';
import type { PlatformId, ResizeOptions } from '../types';
import { canvasToBlob, renderIconToCanvas } from './resizerEngine';
import { canvasToPngBytes, encodeIco, type IcoImageFrame } from './icoEncoder';
import {
  ANDROID_FILE_SPECS,
  FAVICON_FILE_SPECS,
  generateAndroidAdaptiveXml,
  generateBrowserConfigXml,
  generateHtmlHeadSnippet,
  generateLinuxDesktopFile,
  generateMacIcnsScript,
  generateWebManifest,
  generateXcodeContentsJson,
  IOS_FILE_SPECS,
  LINUX_FILE_SPECS,
  MACOS_FILE_SPECS,
  WEB_FILE_SPECS,
  WINDOWS_FILE_SPECS,
} from './platformSpecs';

export interface BuildProgressCallback {
  (progressPercent: number, currentTask: string, completedFiles: number, totalFiles: number): void;
}

export interface BuildResult {
  blob: Blob;
  fileName: string;
  sizeBytes: number;
  totalFiles: number;
}

/**
 * Creates circular clipped canvas for round icon variants.
 */
function createRoundIconCanvas(
  img: HTMLImageElement,
  size: number,
  options: ResizeOptions
): HTMLCanvasElement {
  const sourceCanvas = renderIconToCanvas(img, size, size, options);
  const roundCanvas = document.createElement('canvas');
  roundCanvas.width = size;
  roundCanvas.height = size;
  const ctx = roundCanvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Clip to circle
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(sourceCanvas, 0, 0);
  return roundCanvas;
}

/**
 * Builds the complete zip archive with selected platforms.
 */
export async function buildPlatformBundle(
  img: HTMLImageElement,
  selectedPlatforms: PlatformId[],
  options: ResizeOptions,
  appName: string = 'AppIcon',
  onProgress?: BuildProgressCallback
): Promise<BuildResult> {
  const zip = new JSZip();

  // Estimate total tasks
  let totalTasks = 0;
  if (selectedPlatforms.includes('ios')) totalTasks += IOS_FILE_SPECS.length + 1; // + Contents.json
  if (selectedPlatforms.includes('android')) totalTasks += ANDROID_FILE_SPECS.length + 2; // + 2 XML files
  if (selectedPlatforms.includes('macos')) totalTasks += MACOS_FILE_SPECS.length + 1; // + script
  if (selectedPlatforms.includes('web')) totalTasks += WEB_FILE_SPECS.length + 5; // + favicon.ico, manifest, browserconfig, html
  if (selectedPlatforms.includes('windows')) totalTasks += WINDOWS_FILE_SPECS.length + 1; // + app.ico
  if (selectedPlatforms.includes('linux')) totalTasks += LINUX_FILE_SPECS.length + 1; // + .desktop
  if (selectedPlatforms.includes('favicon')) totalTasks += FAVICON_FILE_SPECS.length + 1; // + favicon.ico

  let completedTasks = 0;

  const notify = (taskName: string) => {
    completedTasks++;
    const pct = Math.min(95, Math.round((completedTasks / Math.max(1, totalTasks)) * 95));
    if (onProgress) {
      onProgress(pct, taskName, completedTasks, totalTasks);
    }
  };

  // 1. iOS AppIcon.appiconset
  if (selectedPlatforms.includes('ios')) {
    for (const spec of IOS_FILE_SPECS) {
      notify(`Rendering iOS ${spec.width}×${spec.height} (${spec.purpose || 'icon'})`);
      const canvas = renderIconToCanvas(img, spec.width, spec.height, options);
      const blob = await canvasToBlob(canvas);
      zip.file(spec.path, blob);
    }
    notify('Writing iOS Contents.json');
    zip.file('ios/AppIcon.appiconset/Contents.json', generateXcodeContentsJson());
  }

  // 2. Android
  if (selectedPlatforms.includes('android')) {
    for (const spec of ANDROID_FILE_SPECS) {
      notify(`Rendering Android ${spec.path.split('/').pop()}`);
      let canvas: HTMLCanvasElement;
      if (spec.shape === 'round') {
        canvas = createRoundIconCanvas(img, spec.width, options);
      } else if (spec.shape === 'foreground') {
        // Adaptive foreground must have transparent background and safe inset
        canvas = renderIconToCanvas(img, spec.width, spec.height, {
          ...options,
          padding: Math.max(options.padding, 16), // safe zone for foreground
        }, true);
      } else if (spec.shape === 'background') {
        // Adaptive background
        canvas = document.createElement('canvas');
        canvas.width = spec.width;
        canvas.height = spec.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = options.backgroundColor === 'transparent' ? '#0a0d14' : options.backgroundColor;
          ctx.fillRect(0, 0, spec.width, spec.height);
        }
      } else {
        canvas = renderIconToCanvas(img, spec.width, spec.height, options);
      }
      const blob = await canvasToBlob(canvas);
      zip.file(spec.path, blob);
    }

    notify('Generating Android Adaptive XML definitions');
    zip.file('android/res/mipmap-anydpi-v26/ic_launcher.xml', generateAndroidAdaptiveXml());
    zip.file('android/res/mipmap-anydpi-v26/ic_launcher_round.xml', generateAndroidAdaptiveXml());
  }

  // 3. macOS
  if (selectedPlatforms.includes('macos')) {
    for (const spec of MACOS_FILE_SPECS) {
      notify(`Rendering macOS ${spec.width}×${spec.height}`);
      const canvas = renderIconToCanvas(img, spec.width, spec.height, options);
      const blob = await canvasToBlob(canvas);
      zip.file(spec.path, blob);
    }
    notify('Writing macOS convert_to_icns.sh');
    zip.file('macos/convert_to_icns.sh', generateMacIcnsScript());
  }

  // 4. Web & PWA
  if (selectedPlatforms.includes('web')) {
    for (const spec of WEB_FILE_SPECS) {
      notify(`Rendering Web ${spec.width}×${spec.height}`);
      const canvas = renderIconToCanvas(img, spec.width, spec.height, options);
      const blob = await canvasToBlob(canvas);
      zip.file(spec.path, blob);
    }

    // Generate multi-resolution favicon.ico (16, 32, 48)
    notify('Encoding multi-resolution Web favicon.ico');
    const icoSizes = [16, 32, 48];
    const frames: IcoImageFrame[] = [];
    for (const size of icoSizes) {
      const c = renderIconToCanvas(img, size, size, options);
      const pngData = await canvasToPngBytes(c);
      frames.push({ width: size, height: size, pngData });
    }
    const icoBytes = encodeIco(frames);
    zip.file('web/favicon.ico', icoBytes);

    notify('Writing Web Manifest & HTML tags');
    zip.file('web/site.webmanifest', generateWebManifest(appName));
    zip.file('web/browserconfig.xml', generateBrowserConfigXml());
    zip.file('web/html_snippet.html', generateHtmlHeadSnippet());
  }

  // 5. Windows
  if (selectedPlatforms.includes('windows')) {
    for (const spec of WINDOWS_FILE_SPECS) {
      notify(`Rendering Windows Tile ${spec.width}×${spec.height}`);
      const canvas = renderIconToCanvas(img, spec.width, spec.height, options);
      const blob = await canvasToBlob(canvas);
      zip.file(spec.path, blob);
    }

    // Multi-res app.ico (16, 24, 32, 48, 64, 128, 256)
    notify('Encoding Windows multi-resolution app.ico');
    const winIcoSizes = [16, 24, 32, 48, 64, 128, 256];
    const winFrames: IcoImageFrame[] = [];
    for (const size of winIcoSizes) {
      const c = renderIconToCanvas(img, size, size, options);
      const pngData = await canvasToPngBytes(c);
      winFrames.push({ width: size, height: size, pngData });
    }
    const winIcoBytes = encodeIco(winFrames);
    zip.file('windows/app.ico', winIcoBytes);
  }

  // 6. Linux
  if (selectedPlatforms.includes('linux')) {
    for (const spec of LINUX_FILE_SPECS) {
      notify(`Rendering Linux hicolor ${spec.width}×${spec.height}`);
      const canvas = renderIconToCanvas(img, spec.width, spec.height, options);
      const blob = await canvasToBlob(canvas);
      zip.file(spec.path, blob);
    }
    notify('Writing Linux .desktop launcher');
    zip.file('linux/app-icon.desktop', generateLinuxDesktopFile(appName));
  }

  // 7. Standalone Favicon package
  if (selectedPlatforms.includes('favicon')) {
    for (const spec of FAVICON_FILE_SPECS) {
      notify(`Rendering Favicon ${spec.width}×${spec.height} PNG`);
      const canvas = renderIconToCanvas(img, spec.width, spec.height, options);
      const blob = await canvasToBlob(canvas);
      zip.file(spec.path, blob);
    }

    notify('Encoding Favicon multi-res favicon.ico');
    const favSizes = [16, 32, 48];
    const favFrames: IcoImageFrame[] = [];
    for (const size of favSizes) {
      const c = renderIconToCanvas(img, size, size, options);
      const pngData = await canvasToPngBytes(c);
      favFrames.push({ width: size, height: size, pngData });
    }
    const favIcoBytes = encodeIco(favFrames);
    zip.file('favicon/favicon.ico', favIcoBytes);
  }

  if (onProgress) {
    onProgress(96, 'Compressing ZIP archive...', completedTasks, totalTasks);
  }

  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress) {
        const pct = 96 + Math.round(metadata.percent * 0.04);
        onProgress(pct, `Compressing ${metadata.currentFile || 'bundle'}...`, completedTasks, totalTasks);
      }
    }
  );

  const cleanName = appName.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'AppIcons';
  const fileName = `${cleanName}-icons-bundle.zip`;

  if (onProgress) {
    onProgress(100, 'Complete! Ready to download.', completedTasks, totalTasks);
  }

  return {
    blob: zipBlob,
    fileName,
    sizeBytes: zipBlob.size,
    totalFiles: completedTasks,
  };
}

/**
 * Generates an individual asset for quick single-file download.
 */
export async function exportSingleAsset(
  img: HTMLImageElement,
  width: number,
  height: number,
  extension: 'png' | 'ico',
  options: ResizeOptions
): Promise<{ blob: Blob; mimeType: string }> {
  if (extension === 'ico') {
    const icoSizes = width >= 256 ? [16, 24, 32, 48, 64, 128, 256] : [16, 32, 48];
    const frames: IcoImageFrame[] = [];
    for (const size of icoSizes) {
      const c = renderIconToCanvas(img, size, size, options);
      const pngData = await canvasToPngBytes(c);
      frames.push({ width: size, height: size, pngData });
    }
    const bytes = encodeIco(frames);
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'image/x-icon' });
    return { blob, mimeType: 'image/x-icon' };
  } else {
    const canvas = renderIconToCanvas(img, width, height, options);
    const blob = await canvasToBlob(canvas);
    return { blob, mimeType: 'image/png' };
  }
}
