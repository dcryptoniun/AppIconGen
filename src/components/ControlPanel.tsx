import React from 'react';
import { Sliders, Palette, Shield, Sparkles } from 'lucide-react';
import type { BackgroundMode, PlatformId, ResizeOptions } from '../types';
import { PLATFORMS } from '../engine/platformSpecs';

interface ControlPanelProps {
  options: ResizeOptions;
  onOptionsChange: (options: ResizeOptions) => void;
  appName: string;
  onAppNameChange: (name: string) => void;
  selectedPlatforms: PlatformId[];
  onTogglePlatform: (id: PlatformId) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const COLOR_PRESETS = [
  { name: 'Transparent', value: 'transparent', border: 'border-slate-600' },
  { name: 'Pure White', value: '#FFFFFF', border: 'border-slate-300' },
  { name: 'Obsidian', value: '#0A0D14', border: 'border-slate-800' },
  { name: 'Slate Dark', value: '#0F172A', border: 'border-slate-700' },
  { name: 'Indigo', value: '#4F46E5', border: 'border-indigo-600' },
  { name: 'Cyber Cyan', value: '#06B6D4', border: 'border-cyan-500' },
  { name: 'Emerald', value: '#10B981', border: 'border-emerald-600' },
  { name: 'Rose', value: '#F43F5E', border: 'border-rose-600' },
  { name: 'Amber Gold', value: '#F59E0B', border: 'border-amber-600' },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  options,
  onOptionsChange,
  appName,
  onAppNameChange,
  selectedPlatforms,
  onTogglePlatform,
  onSelectAll,
  onDeselectAll,
}) => {
  const handlePaddingChange = (val: number) => {
    onOptionsChange({
      ...options,
      padding: val,
    });
  };

  const handleBackgroundMode = (mode: BackgroundMode) => {
    onOptionsChange({
      ...options,
      backgroundMode: mode,
      backgroundColor:
        mode === 'transparent'
          ? 'transparent'
          : options.backgroundColor === 'transparent'
          ? '#0A0D14'
          : options.backgroundColor,
    });
  };

  const handleColorChange = (color: string) => {
    onOptionsChange({
      ...options,
      backgroundColor: color,
      backgroundMode: color === 'transparent' ? 'transparent' : 'color',
    });
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Icon Tuning & Configuration
          </h3>
        </div>
        <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-400 border border-indigo-500/20">
          Real-Time
        </span>
      </div>

      <div className="space-y-6">
        {/* 1. Application Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Application Name
          </label>
          <input
            type="text"
            value={appName}
            onChange={(e) => onAppNameChange(e.target.value)}
            placeholder="e.g. AeroLaunch, MyCryptoWallet"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Used for zip bundle file name, site.webmanifest, and Linux .desktop launcher.
          </p>
        </div>

        {/* 2. Safe Area Inset (Padding) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-cyan-400" />
              <span>Safe Area Inset (Padding)</span>
            </label>
            <span className="rounded-md bg-indigo-950/80 px-2 py-0.5 text-xs font-mono font-bold text-indigo-300 border border-indigo-800/40">
              {options.padding}%
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400">Quick presets:</span>
            <button
              type="button"
              onClick={() => handlePaddingChange(0)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                options.padding === 0
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              0% Flush
            </button>
            <button
              type="button"
              onClick={() => handlePaddingChange(10)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                options.padding === 10
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              10% Standard
            </button>
            <button
              type="button"
              onClick={() => handlePaddingChange(18)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                options.padding === 18
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-200 border border-indigo-800/40'
              }`}
            >
              18% Android Safe
            </button>
          </div>

          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={options.padding}
            onChange={(e) => handlePaddingChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-1"
          />

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Recommended: 12% - 18% prevents icons from being cut off on Android circular launchers.
          </p>
        </div>

        {/* 3. Background Color & Transparency */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5 text-cyan-400" />
            <span>Background Color & Transparency</span>
          </label>

          {/* Full-width 3-tab Segmented Control */}
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => handleBackgroundMode('transparent')}
              className={`py-1.5 rounded-lg text-center transition-all ${
                options.backgroundMode === 'transparent'
                  ? 'bg-indigo-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Transparent
            </button>
            <button
              type="button"
              onClick={() => handleBackgroundMode('color')}
              className={`py-1.5 rounded-lg text-center transition-all ${
                options.backgroundMode === 'color'
                  ? 'bg-indigo-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Solid Color
            </button>
            <button
              type="button"
              onClick={() => handleBackgroundMode('gradient')}
              className={`py-1.5 rounded-lg text-center transition-all ${
                options.backgroundMode === 'gradient'
                  ? 'bg-indigo-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gradient
            </button>
          </div>

          {/* Controls based on active mode */}
          {options.backgroundMode === 'transparent' ? (
            <p className="text-[11px] text-slate-400 bg-slate-950/40 rounded-xl p-3 border border-slate-800/60">
              Preserves PNG alpha transparency. Ideal for transparent logo PNGs and Android adaptive foregrounds.
            </p>
          ) : options.backgroundMode === 'color' ? (
            <div className="space-y-3 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.filter((c) => c.value !== 'transparent').map((color) => {
                  const isSelected = options.backgroundColor.toLowerCase() === color.value.toLowerCase();
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => handleColorChange(color.value)}
                      title={color.name}
                      className={`group relative flex h-7 w-7 items-center justify-center rounded-lg border transition-all ${
                        color.border
                      } ${
                        isSelected
                          ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                      {isSelected && (
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            color.value === '#FFFFFF' ? 'bg-black' : 'bg-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}

                {/* Hex Picker Box */}
                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-2.5 py-1 ml-auto">
                  <input
                    type="color"
                    value={options.backgroundColor === 'transparent' ? '#0a0d14' : options.backgroundColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="h-5 w-5 rounded border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={options.backgroundColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="#000000"
                    className="w-16 bg-transparent text-xs font-mono text-white focus:outline-none uppercase"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Gradient Controls */
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] text-slate-400 font-medium">Gradient Start</label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-2.5 py-1 mt-1">
                  <input
                    type="color"
                    value={options.gradientStart || '#4F46E5'}
                    onChange={(e) =>
                      onOptionsChange({
                        ...options,
                        gradientStart: e.target.value,
                      })
                    }
                    className="h-5 w-5 rounded border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={options.gradientStart || '#4F46E5'}
                    onChange={(e) =>
                      onOptionsChange({
                        ...options,
                        gradientStart: e.target.value,
                      })
                    }
                    className="w-full bg-transparent text-xs font-mono text-white focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-medium">Gradient End</label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-2.5 py-1 mt-1">
                  <input
                    type="color"
                    value={options.gradientEnd || '#06B6D4'}
                    onChange={(e) =>
                      onOptionsChange({
                        ...options,
                        gradientEnd: e.target.value,
                      })
                    }
                    className="h-5 w-5 rounded border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={options.gradientEnd || '#06B6D4'}
                    onChange={(e) =>
                      onOptionsChange({
                        ...options,
                        gradientEnd: e.target.value,
                      })
                    }
                    className="w-full bg-transparent text-xs font-mono text-white focus:outline-none uppercase"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Target Platform Filter (Every platform separately) */}
        <div className="border-t border-slate-800/80 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-200 font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Target Platform Filter</span>
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[11px] font-mono text-indigo-300 border border-indigo-500/20">
                {selectedPlatforms.length} of {PLATFORMS.length}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={onSelectAll}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Select All
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={onDeselectAll}
                className="text-xs text-slate-400 hover:text-slate-300 font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Individual Platform Buttons */}
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform.id);
              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => onTogglePlatform(platform.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600/25 text-cyan-300 border border-indigo-500/60 shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full transition-colors ${
                      isSelected ? 'bg-cyan-400 shadow-glow' : 'bg-slate-600'
                    }`}
                  />
                  <span>{platform.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({platform.fileCount})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
