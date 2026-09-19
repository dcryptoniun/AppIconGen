import React, { useState } from 'react';
import {
  Smartphone,
  SmartphoneCharging,
  Laptop,
  Globe,
  Monitor,
  Terminal,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FolderTree,
  FileCheck,
} from 'lucide-react';
import type { PlatformConfig, PlatformId } from '../types';
import {
  ANDROID_FILE_SPECS,
  FAVICON_FILE_SPECS,
  IOS_FILE_SPECS,
  LINUX_FILE_SPECS,
  MACOS_FILE_SPECS,
  WEB_FILE_SPECS,
  WINDOWS_FILE_SPECS,
} from '../engine/platformSpecs';

interface PlatformSelectorProps {
  platforms: PlatformConfig[];
  selectedPlatforms: PlatformId[];
  onTogglePlatform: (id: PlatformId) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  platforms,
  selectedPlatforms,
  onTogglePlatform,
}) => {
  const [expandedPlatform, setExpandedPlatform] = useState<PlatformId | null>(null);

  const getPlatformIcon = (id: PlatformId) => {
    switch (id) {
      case 'ios':
        return <Smartphone className="h-5 w-5 text-indigo-400" />;
      case 'android':
        return <SmartphoneCharging className="h-5 w-5 text-emerald-400" />;
      case 'macos':
        return <Laptop className="h-5 w-5 text-sky-400" />;
      case 'web':
        return <Globe className="h-5 w-5 text-cyan-400" />;
      case 'windows':
        return <Monitor className="h-5 w-5 text-blue-400" />;
      case 'linux':
        return <Terminal className="h-5 w-5 text-amber-400" />;
      case 'favicon':
        return <Sparkles className="h-5 w-5 text-rose-400" />;
    }
  };

  const getFilesList = (id: PlatformId) => {
    switch (id) {
      case 'ios':
        return IOS_FILE_SPECS.map((s) => ({ path: s.path, size: `${s.width}×${s.height}`, note: s.purpose }));
      case 'android':
        return ANDROID_FILE_SPECS.map((s) => ({ path: s.path, size: `${s.width}×${s.height}`, note: s.shape }));
      case 'macos':
        return MACOS_FILE_SPECS.map((s) => ({ path: s.path, size: `${s.width}×${s.height}`, note: 'macOS iconset' }));
      case 'web':
        return [
          { path: 'web/favicon.ico', size: '16/32/48 multi-res', note: 'Multi-res binary ICO' },
          ...WEB_FILE_SPECS.map((s) => ({ path: s.path, size: `${s.width}×${s.height}`, note: 'PWA Web icon' })),
          { path: 'web/site.webmanifest', size: 'JSON', note: 'PWA manifest' },
          { path: 'web/browserconfig.xml', size: 'XML', note: 'Windows tile config' },
          { path: 'web/html_snippet.html', size: 'HTML', note: 'Copyable <head> code' },
        ];
      case 'windows':
        return [
          { path: 'windows/app.ico', size: '16..256 multi-res (7 sizes)', note: 'Windows desktop ICO' },
          ...WINDOWS_FILE_SPECS.map((s) => ({ path: s.path, size: `${s.width}×${s.height}`, note: 'Modern App tile' })),
        ];
      case 'linux':
        return [
          ...LINUX_FILE_SPECS.map((s) => ({ path: s.path, size: `${s.width}×${s.height}`, note: 'Hicolor freedesktop' })),
          { path: 'linux/app-icon.desktop', size: 'Desktop entry', note: 'Application launcher' },
        ];
      case 'favicon':
        return [
          { path: 'favicon/favicon.ico', size: '16/32/48 multi-res', note: 'Direct ICO container' },
          ...FAVICON_FILE_SPECS.map((s) => ({ path: s.path, size: `${s.width}×${s.height}`, note: 'Favicon PNG' })),
        ];
    }
  };

  const totalFilesSelected = platforms
    .filter((p) => selectedPlatforms.includes(p.id))
    .reduce((acc, p) => acc + p.fileCount, 0);

  return (
    <div id="platforms" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight sm:text-lg">
            Target Platforms & File Specifications
          </h3>
          <p className="text-xs text-slate-400">
            Select the platforms you want to generate. Every file is named and structured to official developer specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-700">
            {selectedPlatforms.length} of {platforms.length} Platforms Active
          </span>
          <span className="rounded-full bg-cyan-950/80 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-800/40">
            {totalFilesSelected} Files Ready
          </span>
        </div>
      </div>

      {/* Grid of Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          const isExpanded = expandedPlatform === platform.id;
          const files = getFilesList(platform.id);

          return (
            <div
              key={platform.id}
              className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? 'border-indigo-500/50 bg-gradient-to-b from-indigo-950/30 via-slate-900/60 to-slate-950/80 shadow-lg shadow-indigo-950/30'
                  : 'border-slate-800/80 bg-slate-900/30 opacity-60 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              <div className="p-4 sm:p-5">
                {/* Top Row: Icon, Title, Checkbox */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700/80 shadow-inner">
                      {getPlatformIcon(platform.id)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {platform.name}
                      </h4>
                      <span className="text-[11px] font-medium text-slate-400">
                        {platform.fileCount} output files
                      </span>
                    </div>
                  </div>

                  {/* Custom Checkbox Toggle */}
                  <button
                    onClick={() => onTogglePlatform(platform.id)}
                    className={`relative flex h-6 w-6 items-center justify-center rounded-lg border transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                        : 'border-slate-700 bg-slate-800/50 text-transparent hover:border-slate-600'
                    }`}
                  >
                    <CheckCircle2 className={`h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  </button>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs text-slate-400 line-clamp-2">
                  {platform.description}
                </p>

                {/* Highlight badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {platform.highlightSpecs.map((spec, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700/50"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Drawer Button */}
              <div className="border-t border-slate-800/60 px-4 py-2.5 bg-slate-950/30 rounded-b-2xl flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-500 truncate max-w-[200px]">
                  {platform.directoryPreview}
                </span>
                <button
                  type="button"
                  onClick={() => setExpandedPlatform(isExpanded ? null : platform.id)}
                  className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                  <FolderTree className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>

              {/* Expandable File List */}
              {isExpanded && (
                <div className="border-t border-slate-800 bg-slate-950/80 p-3 max-h-56 overflow-y-auto rounded-b-2xl text-[11px]">
                  <div className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Included Files in Bundle:</span>
                  </div>
                  <div className="space-y-1.5">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 border-b border-slate-800/40 pb-1">
                        <span className="font-mono text-slate-300 truncate">{f.path}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="font-mono text-slate-400">{f.size}</span>
                          {f.note && (
                            <span className="text-[10px] rounded bg-slate-800 px-1 text-slate-400">
                              {f.note}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
