import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Palette,
  Contrast,
  X,
} from 'lucide-react';
import type { IconPreset, MultiLayerState, SourceImageMeta, LayerAsset } from '../types';
import { SAMPLE_PRESETS } from '../sampleIcons/presets';
import { createMonochromeDataUrl } from '../engine/resizerEngine';

interface DropzoneProps {
  sourceImage: SourceImageMeta | null;
  multiLayerState: MultiLayerState;
  onMultiLayerChange: (state: MultiLayerState) => void;
  onImageSelected: (meta: SourceImageMeta) => void;
  onClear: () => void;
  backgroundColor: string;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  sourceImage,
  multiLayerState,
  onMultiLayerChange,
  onImageSelected,
  onClear,
  backgroundColor,
}) => {
  const [isDragOverMaster, setIsDragOverMaster] = useState(false);
  const [isDragOverFg, setIsDragOverFg] = useState(false);
  const [isDragOverBg, setIsDragOverBg] = useState(false);
  const [isDragOverMono, setIsDragOverMono] = useState(false);

  const [synthMonoPreview, setSynthMonoPreview] = useState<string | null>(null);

  const masterInputRef = useRef<HTMLInputElement>(null);
  const fgInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const monoInputRef = useRef<HTMLInputElement>(null);

  // Auto-synthesize monochrome preview whenever foreground changes
  useEffect(() => {
    const activeFg = multiLayerState.foreground?.dataUrl || sourceImage?.dataUrl;
    if (activeFg && !multiLayerState.monochrome) {
      let isCancelled = false;
      createMonochromeDataUrl(activeFg, 128)
        .then((dataUrl) => {
          if (!isCancelled) setSynthMonoPreview(dataUrl);
        })
        .catch((err) => {
          console.warn('Could not synthesize monochrome preview:', err);
        });
      return () => {
        isCancelled = true;
      };
    } else {
      setSynthMonoPreview(null);
    }
  }, [multiLayerState.foreground, multiLayerState.monochrome, sourceImage]);

  // File to LayerAsset parser
  const readFileAsAsset = (file: File): Promise<LayerAsset> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please upload a valid image file (PNG, JPG, WEBP, or SVG).'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          resolve({
            file,
            name: file.name,
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
            dataUrl,
            sizeBytes: file.size,
            format: file.type.split('/')[1]?.toUpperCase() || 'IMAGE',
          });
        };
        img.onerror = () => reject(new Error('Failed to load image element.'));
        img.src = dataUrl;
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsDataURL(file);
    });
  };

  const handleMasterFile = useCallback(
    async (file: File) => {
      try {
        const asset = await readFileAsAsset(file);
        onImageSelected(asset);
        // Also sync multi-layer foreground
        onMultiLayerChange({
          ...multiLayerState,
          foreground: asset,
        });
      } catch (err: any) {
        alert(err.message);
      }
    },
    [multiLayerState, onImageSelected, onMultiLayerChange]
  );

  const handleFgFile = async (file: File) => {
    try {
      const asset = await readFileAsAsset(file);
      onImageSelected(asset);
      onMultiLayerChange({
        ...multiLayerState,
        foreground: asset,
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleBgFile = async (file: File) => {
    try {
      const asset = await readFileAsAsset(file);
      onMultiLayerChange({
        ...multiLayerState,
        background: asset,
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMonoFile = async (file: File) => {
    try {
      const asset = await readFileAsAsset(file);
      onMultiLayerChange({
        ...multiLayerState,
        monochrome: asset,
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Support Ctrl+V paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData?.items) return;
      for (const item of e.clipboardData.items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            if (multiLayerState.mode === 'single') {
              handleMasterFile(file);
            } else {
              handleFgFile(file);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleMasterFile, multiLayerState.mode]);

  const handlePresetSelect = (preset: IconPreset) => {
    const img = new Image();
    img.onload = () => {
      const asset: LayerAsset = {
        file: null,
        name: `${preset.name}.svg`,
        width: 512,
        height: 512,
        dataUrl: preset.svgDataUri,
        sizeBytes: preset.svgDataUri.length,
        format: 'SVG',
      };
      onImageSelected(asset);
      onMultiLayerChange({
        ...multiLayerState,
        foreground: asset,
      });
    };
    img.src = preset.svgDataUri;
  };

  const isSquare = sourceImage ? sourceImage.width === sourceImage.height : true;
  const formattedSize = sourceImage
    ? sourceImage.sizeBytes > 1024 * 1024
      ? `${(sourceImage.sizeBytes / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(sourceImage.sizeBytes / 1024)} KB`
    : '';

  return (
    <div className="w-full space-y-4">
      {/* Hidden File Inputs */}
      <input
        ref={masterInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) handleMasterFile(e.target.files[0]);
        }}
      />
      <input
        ref={fgInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) handleFgFile(e.target.files[0]);
        }}
      />
      <input
        ref={bgInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) handleBgFile(e.target.files[0]);
        }}
      />
      <input
        ref={monoInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) handleMonoFile(e.target.files[0]);
        }}
      />

      {/* Layer Mode Segmented Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-2 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-1.5 p-1 bg-[#090d16] rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => onMultiLayerChange({ ...multiLayerState, mode: 'single' })}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              multiLayerState.mode === 'single'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Single Master Icon</span>
          </button>

          <button
            type="button"
            onClick={() => onMultiLayerChange({ ...multiLayerState, mode: 'multilayer' })}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              multiLayerState.mode === 'multilayer'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Multi-Layer (Adaptive & Themed)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 px-2">
          {multiLayerState.mode === 'single' ? (
            <span className="text-slate-400">
              Instant mode: standard square icon scaled across all targets.
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-cyan-300 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Full Android 13+ Themed Icons & iOS 18 Tinted support enabled
            </span>
          )}
        </div>
      </div>

      {/* SINGLE MASTER ICON MODE */}
      {multiLayerState.mode === 'single' && (
        <>
          {!sourceImage ? (
            <div
              onDragEnter={(e) => {
                e.preventDefault();
                setIsDragOverMaster(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragOverMaster(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOverMaster(false);
                if (e.dataTransfer.files?.[0]) handleMasterFile(e.dataTransfer.files[0]);
              }}
              onClick={() => masterInputRef.current?.click()}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-8 sm:p-12 transition-all duration-300 ${
                isDragOverMaster
                  ? 'border-cyan-400 bg-cyan-950/20 shadow-2xl shadow-cyan-500/10 scale-[1.01]'
                  : 'border-slate-700/80 bg-slate-900/40 hover:border-indigo-500/60 hover:bg-slate-900/70'
              }`}
            >
              <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-gradient-to-b from-indigo-500/15 via-cyan-500/10 to-transparent blur-3xl transition-opacity group-hover:opacity-100" />

              <div className="relative flex flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 shadow-xl group-hover:scale-110 group-hover:border-indigo-500/40 transition-all duration-300">
                  <UploadCloud className="h-8 w-8 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
                </div>

                <h3 className="text-lg font-semibold text-white tracking-tight sm:text-xl">
                  Drop your master app icon here
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-md">
                  Drag and drop, paste from clipboard (<kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[11px] font-mono text-slate-300 border border-slate-700">Ctrl+V</kbd>), or click to browse
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
                  <span className="rounded-full bg-slate-800/80 px-2.5 py-1 border border-slate-700/50">PNG, WEBP, SVG, JPG</span>
                  <span className="rounded-full bg-indigo-950/60 px-2.5 py-1 text-indigo-300 border border-indigo-800/40">
                    Recommended: 1024 × 1024 px
                  </span>
                  <span className="rounded-full bg-emerald-950/60 px-2.5 py-1 text-emerald-300 border border-emerald-800/40">
                    Zero upload • 100% in-browser
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-4 sm:p-6 shadow-xl backdrop-blur-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-700/80 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:8px_8px] p-1.5 shadow-md">
                    <img
                      src={sourceImage.dataUrl}
                      alt={sourceImage.name}
                      className="h-full w-full object-contain rounded-xl"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                        {sourceImage.name}
                      </h4>
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Ready
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="font-mono text-slate-300">
                        {sourceImage.width} × {sourceImage.height} px
                      </span>
                      <span>•</span>
                      <span>{sourceImage.format}</span>
                      <span>•</span>
                      <span>{formattedSize}</span>
                    </div>

                    {!isSquare && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        <span>Non-square image. Will be centered with safe-area padding.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => masterInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Replace</span>
                  </button>
                  <button
                    onClick={onClear}
                    className="rounded-xl border border-rose-900/40 bg-rose-950/20 px-3 py-2 text-xs font-medium text-rose-300 hover:bg-rose-900/30 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* MULTI-LAYER MODE */}
      {multiLayerState.mode === 'multilayer' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Foreground Layer (Logo / Glyph) */}
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDragOverFg(true);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragOverFg(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOverFg(false);
              if (e.dataTransfer.files?.[0]) handleFgFile(e.dataTransfer.files[0]);
            }}
            className={`relative rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
              isDragOverFg
                ? 'border-cyan-400 bg-cyan-950/25 shadow-lg shadow-cyan-500/10'
                : 'border-slate-800 bg-slate-900/50 hover:border-indigo-500/50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                    1
                  </span>
                  Foreground Layer
                </span>
                <span className="rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 text-[10px] font-semibold">
                  Required
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                App logo or glyph on a transparent background (PNG or SVG).
              </p>
            </div>

            <div className="mt-4">
              {multiLayerState.foreground ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-800/60 p-2.5">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="h-12 w-12 shrink-0 rounded-lg border border-slate-600/80 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:6px_6px] p-1">
                      <img
                        src={multiLayerState.foreground.dataUrl}
                        alt="Foreground"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-medium text-white truncate max-w-[120px]">
                        {multiLayerState.foreground.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {multiLayerState.foreground.width} × {multiLayerState.foreground.height}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => fgInputRef.current?.click()}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Replace"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        onMultiLayerChange({
                          ...multiLayerState,
                          foreground: null,
                        })
                      }
                      className="p-1 text-slate-400 hover:text-rose-400"
                      title="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fgInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-slate-700 hover:border-indigo-400 hover:bg-slate-800/40 cursor-pointer text-center group transition-all"
                >
                  <UploadCloud className="h-6 w-6 text-indigo-400 group-hover:scale-110 transition-transform mb-1.5" />
                  <span className="text-xs font-medium text-slate-200">Upload Foreground</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Drag & Drop or Browse</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Background Layer (Image or Color) */}
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDragOverBg(true);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragOverBg(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOverBg(false);
              if (e.dataTransfer.files?.[0]) handleBgFile(e.dataTransfer.files[0]);
            }}
            className={`relative rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
              isDragOverBg
                ? 'border-violet-400 bg-violet-950/25 shadow-lg shadow-violet-500/10'
                : 'border-slate-800 bg-slate-900/50 hover:border-violet-500/50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                    2
                  </span>
                  Background Layer
                </span>
                <span className="rounded bg-violet-500/15 text-violet-300 border border-violet-500/30 px-1.5 py-0.5 text-[10px] font-semibold">
                  Image or Color
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Background image texture, or automatic color fill from Step 2.
              </p>
            </div>

            <div className="mt-4">
              {multiLayerState.background ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-800/60 p-2.5">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="h-12 w-12 shrink-0 rounded-lg border border-slate-600/80 p-0.5 overflow-hidden">
                      <img
                        src={multiLayerState.background.dataUrl}
                        alt="Background"
                        className="h-full w-full object-cover rounded"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-medium text-white truncate max-w-[120px]">
                        {multiLayerState.background.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {multiLayerState.background.width} × {multiLayerState.background.height}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => bgInputRef.current?.click()}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Replace"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        onMultiLayerChange({
                          ...multiLayerState,
                          background: null,
                        })
                      }
                      className="p-1 text-slate-400 hover:text-rose-400"
                      title="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => bgInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-700 hover:border-violet-400 hover:bg-slate-800/40 cursor-pointer text-center group transition-all"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className="h-5 w-5 rounded-full border border-white/20 shadow-sm"
                      style={{
                        backgroundColor:
                          backgroundColor === 'transparent' ? '#0f172a' : backgroundColor,
                      }}
                    />
                    <Palette className="h-4 w-4 text-violet-400" />
                  </div>
                  <span className="text-xs font-medium text-slate-300">
                    Using Color ({backgroundColor === 'transparent' ? 'Solid #0F172A' : backgroundColor})
                  </span>
                  <span className="text-[10px] text-violet-300 mt-0.5 group-hover:underline">
                    Click to upload custom background image
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Monochrome Layer (Android 13+ & iOS 18 Tinted) */}
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDragOverMono(true);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragOverMono(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOverMono(false);
              if (e.dataTransfer.files?.[0]) handleMonoFile(e.dataTransfer.files[0]);
            }}
            className={`relative rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
              isDragOverMono
                ? 'border-cyan-400 bg-cyan-950/25 shadow-lg shadow-cyan-500/10'
                : 'border-slate-800 bg-slate-900/50 hover:border-cyan-500/50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-[#090d16]">
                    3
                  </span>
                  Monochrome Layer
                </span>
                <span className="rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 text-[10px] font-semibold">
                  Android 13+ / iOS 18
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Flat silhouette for system dynamic color tinting. Auto-derived if omitted.
              </p>
            </div>

            <div className="mt-4">
              {multiLayerState.monochrome ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-800/60 p-2.5">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="h-12 w-12 shrink-0 rounded-lg border border-slate-600/80 bg-slate-950 p-1">
                      <img
                        src={multiLayerState.monochrome.dataUrl}
                        alt="Monochrome"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-medium text-white truncate max-w-[120px]">
                        {multiLayerState.monochrome.name}
                      </div>
                      <div className="text-[10px] text-slate-400">Custom Silhouette</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => monoInputRef.current?.click()}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Replace"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        onMultiLayerChange({
                          ...multiLayerState,
                          monochrome: null,
                        })
                      }
                      className="p-1 text-slate-400 hover:text-rose-400"
                      title="Revert to Auto"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : synthMonoPreview ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-2.5">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="h-12 w-12 shrink-0 rounded-lg border border-cyan-500/40 bg-slate-950 p-1 flex items-center justify-center">
                      <img
                        src={synthMonoPreview}
                        alt="Auto Monochrome"
                        className="h-full w-full object-contain brightness-200"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-cyan-400 shrink-0" />
                        <span>Auto-Derived</span>
                      </div>
                      <div className="text-[10px] text-slate-400">From Foreground Alpha</div>
                    </div>
                  </div>
                  <button
                    onClick={() => monoInputRef.current?.click()}
                    className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[11px] font-medium text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                  >
                    Custom
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => monoInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-700 hover:border-cyan-400 hover:bg-slate-800/40 cursor-pointer text-center group transition-all"
                >
                  <Contrast className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform mb-1.5" />
                  <span className="text-xs font-medium text-slate-300">Auto from Foreground</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Or click to upload custom</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preset Samples Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-slate-800/60 bg-slate-900/30 px-3.5 py-2.5">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-medium text-slate-300">Don't have an icon yet?</span>
          <span className="text-slate-400">Try an example:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded-md flex items-center gap-1">
            Example Icons:
          </span>
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className="group flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-950/30 hover:text-white transition-all"
            >
              <img
                src={preset.svgDataUri}
                alt={preset.name}
                className="h-4 w-4 rounded object-contain transition-transform group-hover:scale-110"
              />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
