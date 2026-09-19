import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import type { IconPreset, SourceImageMeta } from '../types';
import { SAMPLE_PRESETS } from '../sampleIcons/presets';

interface DropzoneProps {
  sourceImage: SourceImageMeta | null;
  onImageSelected: (meta: SourceImageMeta) => void;
  onClear: () => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ sourceImage, onImageSelected, onClear }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        onImageSelected({
          file,
          name: file.name,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          dataUrl,
          sizeBytes: file.size,
          format: file.type.split('/')[1]?.toUpperCase() || 'IMAGE',
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  // Support Ctrl+V paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData?.items) return;
      for (const item of e.clipboardData.items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handlePresetSelect = (preset: IconPreset) => {
    const img = new Image();
    img.onload = () => {
      onImageSelected({
        file: null,
        name: `${preset.name}.svg`,
        width: 512,
        height: 512,
        dataUrl: preset.svgDataUri,
        sizeBytes: preset.svgDataUri.length,
        format: 'SVG',
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
    <div className="w-full">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
          }
        }}
      />

      {!sourceImage ? (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-8 sm:p-12 transition-all duration-300 ${
            isDragOver
              ? 'border-cyan-400 bg-cyan-950/20 shadow-2xl shadow-cyan-500/10 scale-[1.01]'
              : 'border-slate-700/80 bg-slate-900/40 hover:border-indigo-500/60 hover:bg-slate-900/70'
          }`}
        >
          {/* Subtle Ambient Radial Glow */}
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
        /* Image Loaded Card */
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-4 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left: Thumbnail & Info */}
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
                    <span>Image is not square ({sourceImage.width}x{sourceImage.height}). Icons will be centered with safe padding.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => fileInputRef.current?.click()}
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

      {/* Preset Samples Bar */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-slate-800/60 bg-slate-900/30 px-3.5 py-2.5">
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
