import React, { useState } from 'react';
import { Smartphone, Monitor, Globe, Laptop, Eye, Sparkles } from 'lucide-react';
import type { MaskShape, ResizeOptions, SourceImageMeta } from '../types';

interface DeviceSimulatorProps {
  sourceImage: SourceImageMeta | null;
  options: ResizeOptions;
  appName: string;
}

type DeviceMode = 'ios' | 'android' | 'macos' | 'windows' | 'web';

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({ sourceImage, options, appName }) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('ios');
  // 'auto' uses the native OS shape; selecting a shape forces that mask on the mockup
  const [maskOverride, setMaskOverride] = useState<MaskShape | 'auto'>('auto');

  const getMaskClass = (shape: MaskShape) => {
    switch (shape) {
      case 'squircle':
        return 'rounded-[22%]'; // Apple squircle approximation
      case 'circle':
        return 'rounded-full'; // Android Material You
      case 'rounded':
        return 'rounded-2xl'; // macOS / Modern
      case 'square':
        return 'rounded-none'; // Windows Tile
      default:
        return 'rounded-[22%]';
    }
  };

  const currentIconUrl = sourceImage?.dataUrl || '';

  // Render the icon with user's background color, safe padding, and dynamic mask
  const renderMockupIcon = (sizeClass: string = 'h-14 w-14', defaultDeviceShape: MaskShape = 'squircle') => {
    const effectiveShape: MaskShape = maskOverride === 'auto' ? defaultDeviceShape : maskOverride;
    const shapeClass = getMaskClass(effectiveShape);
    const paddingVal = `${options.padding}%`;

    return (
      <div
        className={`relative ${sizeClass} ${shapeClass} overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 shrink-0`}
        style={{
          backgroundColor: options.backgroundColor === 'transparent' ? 'transparent' : options.backgroundColor,
          background:
            options.backgroundMode === 'gradient' && options.gradientStart && options.gradientEnd
              ? `linear-gradient(${options.gradientAngle || 135}deg, ${options.gradientStart}, ${options.gradientEnd})`
              : options.backgroundColor !== 'transparent'
              ? options.backgroundColor
              : undefined,
        }}
      >
        {currentIconUrl ? (
          <img
            src={currentIconUrl}
            alt={appName}
            className="h-full w-full object-contain"
            style={{ padding: paddingVal }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-800/80 border border-dashed border-indigo-400/40 text-indigo-300">
            <Sparkles className="h-4 w-4 text-cyan-400 opacity-70" />
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Icon</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl shadow-xl">
      {/* Header & Device Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Live Interactive Device Simulator
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Preview how your icon looks in authentic real-world operating system environments
          </p>
        </div>

        {/* Device Switcher Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-950/80 p-1 border border-slate-800 max-w-full">
          <button
            onClick={() => setDeviceMode('ios')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              deviceMode === 'ios'
                ? 'bg-indigo-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>iPhone</span>
          </button>

          <button
            onClick={() => setDeviceMode('android')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              deviceMode === 'android'
                ? 'bg-indigo-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Android</span>
          </button>

          <button
            onClick={() => setDeviceMode('macos')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              deviceMode === 'macos'
                ? 'bg-indigo-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Laptop className="h-3.5 w-3.5" />
            <span>macOS</span>
          </button>

          <button
            onClick={() => setDeviceMode('windows')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              deviceMode === 'windows'
                ? 'bg-indigo-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Windows</span>
          </button>

          <button
            onClick={() => setDeviceMode('web')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              deviceMode === 'web'
                ? 'bg-indigo-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Web Tab</span>
          </button>
        </div>
      </div>

      {/* Mockup Canvas Stage */}
      <div className="mt-6 flex items-center justify-center overflow-x-auto rounded-2xl border border-slate-800 bg-[#06080d] p-3 sm:p-6 min-h-[380px]">
        {/* 1. iOS 18 iPhone Mockup */}
        {deviceMode === 'ios' && (
          <div className="relative w-full max-w-[300px] sm:max-w-[330px] rounded-[44px] sm:rounded-[48px] border-[5px] sm:border-[6px] border-slate-700 bg-gradient-to-b from-indigo-950 via-slate-900 to-black p-3.5 sm:p-4 shadow-2xl overflow-hidden ring-1 ring-white/10 mx-auto">
            {/* Dynamic Island */}
            <div className="mx-auto mb-5 sm:mb-6 h-5 sm:h-6 w-20 sm:w-24 rounded-full bg-black shadow-inner flex items-center justify-between px-3">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-slate-800"></span>
              <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800"></span>
            </div>

            {/* iOS Status Bar */}
            <div className="mb-5 sm:mb-6 flex items-center justify-between px-3 text-[11px] font-semibold text-white/80">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white/80"></span>
                <span>5G</span>
                <span className="h-2.5 w-4 rounded-sm border border-white/80 p-0.5"><div className="h-full w-2.5 bg-white/80 rounded-2xs"></div></span>
              </div>
            </div>

            {/* App Grid */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4 px-1 sm:px-2 py-2 sm:py-4">
              {/* Target App Icon with spotlight pulse */}
              <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
                <div className="relative">
                  {renderMockupIcon('h-12 w-12 sm:h-14 sm:w-14', 'squircle')}
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow">
                    1
                  </span>
                </div>
                <span className="text-[10px] font-medium text-white truncate max-w-[58px] sm:max-w-[62px] text-center drop-shadow">
                  {appName || 'IconForge'}
                </span>
              </div>

              {/* Context filler apps */}
              {[
                { name: 'Photos', bg: 'bg-gradient-to-br from-amber-400 to-rose-500' },
                { name: 'Camera', bg: 'bg-slate-700' },
                { name: 'Maps', bg: 'bg-gradient-to-br from-emerald-500 to-teal-700' },
                { name: 'Weather', bg: 'bg-gradient-to-br from-sky-400 to-blue-600' },
                { name: 'Clock', bg: 'bg-black border border-white/20' },
                { name: 'Calendar', bg: 'bg-white text-rose-600 font-bold' },
                { name: 'Settings', bg: 'bg-gradient-to-b from-slate-500 to-slate-700' },
              ].map((app, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 opacity-60">
                  <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-[22%] ${app.bg} shadow-md flex items-center justify-center text-[10px] text-white`}>
                    {app.name[0]}
                  </div>
                  <span className="text-[10px] font-medium text-white/80 truncate max-w-[58px] sm:max-w-[62px]">
                    {app.name}
                  </span>
                </div>
              ))}
            </div>

            {/* iOS Bottom Dock */}
            <div className="mt-6 sm:mt-8 rounded-[24px] sm:rounded-[28px] bg-white/10 backdrop-blur-md p-2 sm:p-2.5 flex items-center justify-around border border-white/15">
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-[22%] bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow">📞</div>
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-[22%] bg-blue-500 flex items-center justify-center text-white text-xs font-bold shadow">💬</div>
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-[22%] bg-sky-400 flex items-center justify-center text-white text-xs font-bold shadow">🧭</div>
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-[22%] bg-rose-500 flex items-center justify-center text-white text-xs font-bold shadow">🎵</div>
            </div>

            {/* Home Bar */}
            <div className="mx-auto mt-3 sm:mt-4 h-1 w-24 sm:w-28 rounded-full bg-white/50"></div>
          </div>
        )}

        {/* 2. Android 14 Pixel Mockup */}
        {deviceMode === 'android' && (
          <div className="relative w-full max-w-[300px] sm:max-w-[330px] rounded-[40px] sm:rounded-[44px] border-[5px] sm:border-[6px] border-slate-700 bg-gradient-to-b from-slate-900 via-[#10141f] to-[#0a0d14] p-3.5 sm:p-4 shadow-2xl overflow-hidden ring-1 ring-white/10 mx-auto">
            {/* Punch-hole camera */}
            <div className="mx-auto mb-3 sm:mb-4 h-3.5 w-3.5 rounded-full bg-black ring-1 ring-slate-800"></div>

            {/* Android Status Bar */}
            <div className="mb-3 sm:mb-4 flex items-center justify-between px-3 text-[11px] font-medium text-slate-300">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">LTE</span>
                <span className="h-2.5 w-4 rounded-sm border border-slate-400 p-0.5"><div className="h-full w-2 bg-slate-300"></div></span>
              </div>
            </div>

            {/* Date & Weather Widget */}
            <div className="mb-5 sm:mb-6 px-2 sm:px-3">
              <p className="text-xs font-medium text-cyan-300">Wednesday, Sep 19</p>
              <p className="text-sm font-semibold text-white">72°F • Sunny</p>
            </div>

            {/* Android App Grid with Circle Icons */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4 px-1 sm:px-2 py-2 sm:py-4">
              <div className="flex flex-col items-center gap-1.5 cursor-pointer">
                {renderMockupIcon('h-12 w-12 sm:h-14 sm:w-14', 'circle')}
                <span className="text-[10px] font-medium text-white truncate max-w-[58px] sm:max-w-[62px] text-center">
                  {appName || 'IconForge'}
                </span>
              </div>

              {['Chrome', 'Gmail', 'Play Store', 'YouTube', 'Drive', 'Keep', 'Files'].map((app, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 opacity-60">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
                    {app[0]}
                  </div>
                  <span className="text-[10px] font-medium text-slate-300 truncate max-w-[58px] sm:max-w-[62px]">
                    {app}
                  </span>
                </div>
              ))}
            </div>

            {/* Android Google Search Pill */}
            <div className="mt-6 sm:mt-8 flex items-center justify-between rounded-full bg-slate-800/80 px-3.5 py-2 sm:py-2.5 border border-slate-700 text-xs text-slate-400 shadow-md">
              <span className="font-medium text-slate-300">G Search</span>
              <div className="flex items-center gap-2">
                <span>🎙️</span>
                <span>📷</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. macOS Sequoia Dock Mockup */}
        {deviceMode === 'macos' && (
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-700/60 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-6 shadow-2xl flex flex-col items-center justify-between min-h-[300px] overflow-hidden">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-2">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-white">Finder</span>
                <span className="hidden sm:inline">File</span>
                <span className="hidden sm:inline">Edit</span>
                <span className="hidden sm:inline">View</span>
                <span className="hidden sm:inline">Window</span>
              </div>
              <span>Wed 9:41 AM</span>
            </div>

            <div className="text-center py-4 sm:py-6">
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">macOS Desktop</h4>
              <p className="text-xs text-slate-400 mt-1">Dock preview with responsive scale</p>
            </div>

            {/* macOS Translucent Dock */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-2xl p-2 sm:p-2.5 flex items-end gap-2 sm:gap-3 border border-white/20 shadow-2xl max-w-full overflow-x-auto">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-500 shadow flex items-center justify-center text-sm sm:text-lg shrink-0">📁</div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-sky-400 shadow flex items-center justify-center text-sm sm:text-lg shrink-0">🧭</div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-emerald-500 shadow flex items-center justify-center text-sm sm:text-lg shrink-0">💬</div>
              
              {/* User App Icon with indicator dot */}
              <div className="flex flex-col items-center gap-1 group shrink-0">
                <div className="transition-transform duration-200 group-hover:-translate-y-2">
                  {renderMockupIcon('h-11 w-11 sm:h-13 sm:w-13', 'rounded')}
                </div>
                <div className="h-1 w-1 rounded-full bg-white shadow-glow"></div>
              </div>

              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-purple-500 shadow flex items-center justify-center text-sm sm:text-lg shrink-0">⚙️</div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-amber-500 shadow flex items-center justify-center text-sm sm:text-lg shrink-0">📝</div>
              <div className="h-6 sm:h-8 border-r border-white/20 mx-1 self-center shrink-0"></div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-700 shadow flex items-center justify-center text-sm sm:text-lg shrink-0">🗑️</div>
            </div>
          </div>
        )}

        {/* 4. Windows 11 Taskbar Mockup */}
        {deviceMode === 'windows' && (
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-700/60 bg-gradient-to-b from-[#0f172a] to-[#020617] p-4 sm:p-6 shadow-2xl flex flex-col justify-between min-h-[300px] overflow-hidden">
            <div className="text-center py-6">
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">Windows 11 Desktop</h4>
              <p className="text-xs text-slate-400 mt-1">Pinned to the centered taskbar</p>
            </div>

            {/* Windows 11 Taskbar */}
            <div className="rounded-xl bg-[#090d16]/90 backdrop-blur-xl px-3 sm:px-4 py-2 flex items-center justify-between border border-slate-800 shadow-xl overflow-x-auto">
              {/* Left Widget Icon */}
              <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2">
                <span>🌤️ 72°F</span>
              </div>

              {/* Centered App Icons */}
              <div className="flex items-center gap-1.5 sm:gap-2 mx-auto">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-md bg-blue-600/20 hover:bg-blue-600/30 flex items-center justify-center text-blue-400 text-sm">🪟</div>
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 text-sm">🔍</div>
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-amber-400 text-sm">📁</div>
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-sky-400 text-sm">🌐</div>

                {/* Target App */}
                <div className="relative flex flex-col items-center">
                  <div className="rounded-md bg-white/10 p-1 border border-white/20">
                    {renderMockupIcon('h-6 w-6 sm:h-7 sm:w-7', 'square')}
                  </div>
                  <div className="absolute -bottom-1 h-0.5 w-4 rounded-full bg-cyan-400"></div>
                </div>

                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-rose-400 text-sm">🎮</div>
              </div>

              {/* Right System Tray */}
              <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-2">
                <span>ENG</span>
                <span>9:41 AM</span>
              </div>
            </div>
          </div>
        )}

        {/* 5. Web Browser Tab Mockup */}
        {deviceMode === 'web' && (
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden">
            {/* Browser Header Bar */}
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-950 px-3 sm:px-4 py-2 sm:py-2.5 border-b border-slate-800">
              {/* Window Dots */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-500"></span>
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-500"></span>
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500"></span>
              </div>

              {/* Active Tab */}
              <div className="flex items-center gap-2 rounded-t-lg bg-slate-900 px-2.5 sm:px-3 py-1.5 text-xs text-white border-t border-x border-slate-800 max-w-xs shadow min-w-0">
                {renderMockupIcon('h-3.5 w-3.5 sm:h-4 sm:w-4', 'squircle')}
                <span className="truncate font-medium">{appName || 'IconForge'} — Universal Resizer</span>
                <span className="text-slate-500 hover:text-white cursor-pointer ml-1">×</span>
              </div>

              {/* New Tab Button */}
              <span className="text-slate-500 hover:text-white text-sm cursor-pointer">+</span>
            </div>

            {/* Address Bar */}
            <div className="flex items-center gap-2 bg-slate-900 px-3 sm:px-4 py-1.5 sm:py-2 border-b border-slate-800">
              <div className="hidden sm:flex items-center gap-2 text-slate-500 text-xs">
                <span>←</span>
                <span>→</span>
                <span>↻</span>
              </div>
              <div className="flex-1 flex items-center gap-2 rounded-md bg-slate-950 px-2.5 py-1 text-xs text-slate-300 border border-slate-800 min-w-0">
                <span className="text-emerald-400">🔒</span>
                <span className="text-slate-400 hidden sm:inline">https://</span>
                <span className="text-white font-mono truncate">{appName ? appName.toLowerCase().replace(/\s+/g, '') : 'myapp'}.com</span>
              </div>
            </div>

            {/* Bookmarks Bar */}
            <div className="flex items-center gap-3 sm:gap-4 bg-slate-950/60 px-3 sm:px-4 py-1.5 text-[11px] text-slate-400 border-b border-slate-800/60 overflow-x-auto">
              <div className="flex items-center gap-1.5 text-slate-200 shrink-0">
                {renderMockupIcon('h-3.5 w-3.5', 'squircle')}
                <span>{appName || 'IconForge'}</span>
              </div>
              <span className="shrink-0">GitHub</span>
              <span className="shrink-0">Docs</span>
              <span className="shrink-0">Dashboard</span>
            </div>

            {/* Browser Content Dummy Area */}
            <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-slate-900 to-[#080b11] min-h-[140px] flex flex-col items-center justify-center">
              <div className="mb-2">
                {renderMockupIcon('h-12 w-12 sm:h-16 sm:w-16', 'squircle')}
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white">{appName || 'My Web Application'}</h4>
              <p className="text-xs text-slate-400 mt-1">Favicon displayed in tab header, address bar, and bookmarks</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Shape Mask Filter Controls below the mockup */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800/60 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-slate-300 mr-1 text-xs">Quick Shape Mask:</span>
          
          <button
            type="button"
            onClick={() => setMaskOverride('auto')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              maskOverride === 'auto'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Auto (OS Default)
          </button>

          {(['squircle', 'circle', 'rounded', 'square'] as MaskShape[]).map((shape) => (
            <button
              key={shape}
              type="button"
              onClick={() => setMaskOverride(shape)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-all ${
                maskOverride === shape
                  ? 'bg-indigo-600 text-cyan-300 border border-indigo-400/50 shadow-sm font-semibold'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {shape}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          <span>Active safe padding: <strong className="text-slate-200">{options.padding}%</strong></span>
        </div>
      </div>
    </div>
  );
};
