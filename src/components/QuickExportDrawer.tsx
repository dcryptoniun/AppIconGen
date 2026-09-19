import React, { useState } from 'react';
import { Copy, Check, Download, Code2, Sparkles } from 'lucide-react';
import type { ResizeOptions, SourceImageMeta } from '../types';
import { exportSingleAsset } from '../engine/zipBuilder';
import { loadImage } from '../engine/resizerEngine';
import {
  generateHtmlHeadSnippet,
  generateLinuxDesktopFile,
  generateMacIcnsScript,
  generateWebManifest,
} from '../engine/platformSpecs';

interface QuickExportDrawerProps {
  sourceImage: SourceImageMeta | null;
  options: ResizeOptions;
  appName: string;
}

interface SingleExportTarget {
  id: string;
  name: string;
  filename: string;
  width: number;
  height: number;
  format: 'png' | 'ico';
  description: string;
  badge: string;
}

const QUICK_ASSETS: SingleExportTarget[] = [
  {
    id: 'favicon-ico',
    name: 'Multi-Res Favicon',
    filename: 'favicon.ico',
    width: 48,
    height: 48,
    format: 'ico',
    description: 'Embedded 16×16, 32×32, 48×48 frames in valid ICO container',
    badge: 'Favicon .ico',
  },
  {
    id: 'apple-touch',
    name: 'Apple Touch Icon',
    filename: 'apple-touch-icon.png',
    width: 180,
    height: 180,
    format: 'png',
    description: '180×180 px for iOS Safari homescreen bookmarking',
    badge: 'Web 180×180',
  },
  {
    id: 'playstore-512',
    name: 'Google Play Store',
    filename: 'playstore-512.png',
    width: 512,
    height: 512,
    format: 'png',
    description: '512×512 px 32-bit PNG required by Google Play Console',
    badge: 'Play Store 512',
  },
  {
    id: 'appstore-1024',
    name: 'App Store Marketing',
    filename: 'icon-1024.png',
    width: 1024,
    height: 1024,
    format: 'png',
    description: '1024×1024 px master asset for App Store Connect submission',
    badge: 'App Store 1024',
  },
  {
    id: 'windows-ico',
    name: 'Windows Desktop Icon',
    filename: 'app.ico',
    width: 256,
    height: 256,
    format: 'ico',
    description: 'Multi-resolution ICO containing 16, 24, 32, 48, 64, 128, 256 px',
    badge: 'Windows .ico',
  },
  {
    id: 'pwa-512',
    name: 'PWA Chrome 512',
    filename: 'android-chrome-512x512.png',
    width: 512,
    height: 512,
    format: 'png',
    description: '512×512 px PWA splash & launcher asset',
    badge: 'PWA 512×512',
  },
];

export const QuickExportDrawer: React.FC<QuickExportDrawerProps> = ({
  sourceImage,
  options,
  appName,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'snippets'>('single');
  const [activeSnippetTab, setActiveSnippetTab] = useState<'html' | 'pwa' | 'linux' | 'macos'>('html');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadSingle = async (target: SingleExportTarget) => {
    if (!sourceImage) return;
    try {
      setDownloadingId(target.id);
      const img = await loadImage(sourceImage.dataUrl);
      const { blob } = await exportSingleAsset(img, target.width, target.height, target.format, options);

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = target.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading single asset:', err);
      alert('Failed to export single asset.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCopySnippet = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const snippets = {
    html: generateHtmlHeadSnippet(),
    pwa: generateWebManifest(appName || 'MyApp'),
    linux: generateLinuxDesktopFile(appName || 'MyApp'),
    macos: generateMacIcnsScript(),
  };

  return (
    <div id="snippets" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl shadow-xl space-y-6">
      {/* Header and Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Developer Quick Tools & Snippets
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Export individual high-priority icons on demand or copy ready-to-use configuration files
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('single')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'single'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Single Asset Export</span>
          </button>
          <button
            onClick={() => setActiveTab('snippets')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'snippets'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Config Snippets</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Single Asset Export Grid */}
      {activeTab === 'single' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_ASSETS.map((asset) => (
            <div
              key={asset.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 hover:border-slate-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded bg-indigo-950/80 px-2 py-0.5 text-[10px] font-mono text-indigo-300 border border-indigo-800/40">
                    {asset.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{asset.filename}</span>
                </div>
                <h4 className="mt-2 text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {asset.name}
                </h4>
                <p className="mt-1 text-xs text-slate-400">{asset.description}</p>
              </div>

              <button
                disabled={!sourceImage || downloadingId === asset.id}
                onClick={() => handleDownloadSingle(asset)}
                className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 py-2 text-xs font-semibold text-white hover:bg-indigo-600 hover:border-indigo-500 disabled:opacity-40 disabled:pointer-events-none transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                <span>
                  {downloadingId === asset.id ? 'Generating...' : `Export ${asset.filename}`}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Code Snippets */}
      {activeTab === 'snippets' && (
        <div className="space-y-4">
          {/* Sub-tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/60 pb-3">
            {[
              { id: 'html', label: 'HTML <head> Meta Tags' },
              { id: 'pwa', label: 'site.webmanifest' },
              { id: 'linux', label: 'app-icon.desktop' },
              { id: 'macos', label: 'macOS iconutil script' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSnippetTab(tab.id as any)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  activeSnippetTab === tab.id
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={() => handleCopySnippet(activeSnippetTab, snippets[activeSnippetTab])}
              className="ml-auto flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors shadow"
            >
              {copiedKey === activeSnippetTab ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Snippet</span>
                </>
              )}
            </button>
          </div>

          {/* Snippet Code Box */}
          <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300">
            <pre className="overflow-x-auto whitespace-pre leading-relaxed">
              {snippets[activeSnippetTab]}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
