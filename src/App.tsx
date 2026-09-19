import React, { useState } from 'react';
import {
  Download,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import type { GenerationProgress, PlatformId, ResizeOptions, SourceImageMeta } from './types';
import { PLATFORMS } from './engine/platformSpecs';
import { loadImage } from './engine/resizerEngine';
import { buildPlatformBundle } from './engine/zipBuilder';
import { Navbar } from './components/Navbar';
import { Dropzone } from './components/Dropzone';
import { DeviceSimulator } from './components/DeviceSimulator';
import { ControlPanel } from './components/ControlPanel';
import { PlatformSelector } from './components/PlatformSelector';
import { QuickExportDrawer } from './components/QuickExportDrawer';
import { GenerationModal } from './components/GenerationModal';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // Start with clean state on launch (no default preset selected)
  const [sourceImage, setSourceImage] = useState<SourceImageMeta | null>(null);
  const [appName, setAppName] = useState<string>('AppIcon');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([
    'ios',
    'android',
    'macos',
    'web',
    'windows',
    'linux',
    'favicon',
  ]);

  const [options, setOptions] = useState<ResizeOptions>({
    padding: 10,
    backgroundColor: 'transparent',
    backgroundMode: 'transparent',
    cornerRadius: 22,
    autoTrimWhitespace: false,
  });

  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    isGenerating: false,
    progressPercent: 0,
    currentTask: '',
    totalFiles: 0,
    completedFiles: 0,
    downloadUrl: null,
    zipFileName: null,
    zipSize: null,
    error: null,
  });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTogglePlatform = (id: PlatformId) => {
    if (selectedPlatforms.includes(id)) {
      if (selectedPlatforms.length === 1) {
        alert('You must have at least one platform selected.');
        return;
      }
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== id));
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  };

  const handleSelectAllPlatforms = () => {
    setSelectedPlatforms(PLATFORMS.map((p) => p.id));
  };

  const handleDeselectAllPlatforms = () => {
    setSelectedPlatforms(['favicon']); // Keep at least one
  };

  // Main Generator Orchestrator
  const handleGenerateBundle = async () => {
    if (!sourceImage) {
      alert('Please upload an icon or pick a preset first.');
      return;
    }

    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform.');
      return;
    }

    setGenerationProgress({
      isGenerating: true,
      progressPercent: 2,
      currentTask: 'Loading master icon...',
      totalFiles: 0,
      completedFiles: 0,
      downloadUrl: null,
      zipFileName: null,
      zipSize: null,
      error: null,
    });

    try {
      const img = await loadImage(sourceImage.dataUrl);

      const result = await buildPlatformBundle(
        img,
        selectedPlatforms,
        options,
        appName || 'AppIcon',
        (progressPercent, currentTask, completedFiles, totalFiles) => {
          setGenerationProgress((prev) => ({
            ...prev,
            progressPercent,
            currentTask,
            completedFiles,
            totalFiles,
          }));
        }
      );

      const downloadUrl = URL.createObjectURL(result.blob);

      setGenerationProgress((prev) => ({
        ...prev,
        isGenerating: false,
        progressPercent: 100,
        currentTask: 'Complete!',
        downloadUrl,
        zipFileName: result.fileName,
        zipSize: result.sizeBytes,
        completedFiles: result.totalFiles,
      }));

      // Trigger automatic download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setGenerationProgress((prev) => ({
        ...prev,
        isGenerating: false,
        error: err?.message || 'Failed to generate icon bundle. Please try again.',
      }));
    }
  };

  const totalFilesToGenerate = PLATFORMS.filter((p) => selectedPlatforms.includes(p.id)).reduce(
    (acc, p) => acc + p.fileCount,
    0
  );

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Sticky Navbar */}
      <Navbar onScrollToSection={scrollToSection} totalPlatforms={selectedPlatforms.length} />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <section className="relative text-center max-w-3xl mx-auto pt-4 sm:pt-8 space-y-4">
          {/* Subtle glow backdrop */}
          <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-48 w-full max-w-lg rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-cyan-500/20 blur-3xl" />

          {/* Badges */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1 text-xs font-medium text-indigo-300 shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Local-First Icon Resizer & Asset Forge</span>
            <span className="h-1 w-1 rounded-full bg-indigo-400"></span>
            <span className="text-cyan-300">7 Operating Systems</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Resize Your App Icon for{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              Every Device.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Convert a single master icon into production-ready, spec-compliant asset packages for{' '}
            <strong className="text-white">iOS</strong>, <strong className="text-white">Android</strong>,{' '}
            <strong className="text-white">macOS</strong>, <strong className="text-white">Web/PWA</strong>,{' '}
            <strong className="text-white">Windows</strong>, <strong className="text-white">Linux</strong>, and{' '}
            <strong className="text-white">Favicon (.ico)</strong>. Runs 100% on device with zero server uploads.
          </p>

        </section>

        {/* Section 1: Dropzone & Master Asset Input */}
        <section className="space-y-4">
          <Dropzone
            sourceImage={sourceImage}
            onImageSelected={(meta) => {
              setSourceImage(meta);
              // Set default app name from file if user hasn't custom typed one
              const baseName = meta.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '');
              if (baseName && appName === 'AppIcon') {
                setAppName(baseName);
              }
            }}
            onClear={() => setSourceImage(null)}
          />
        </section>

        {/* Section 2: Tuning Controls & Device Simulator */}
        <section id="simulator" className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Controls: 5 cols on xl */}
          <div className="xl:col-span-5 space-y-6">
            <ControlPanel
              options={options}
              onOptionsChange={setOptions}
              appName={appName}
              onAppNameChange={setAppName}
              selectedPlatforms={selectedPlatforms}
              onTogglePlatform={handleTogglePlatform}
              onSelectAll={handleSelectAllPlatforms}
              onDeselectAll={handleDeselectAllPlatforms}
            />
          </div>

          {/* Live Interactive Simulator: 7 cols on xl */}
          <div className="xl:col-span-7">
            <DeviceSimulator
              sourceImage={sourceImage}
              options={options}
              appName={appName}
            />
          </div>
        </section>

        {/* Master Action Bar (Placed directly below Customisation & Preview) */}
        <section className="relative overflow-hidden rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/70 via-slate-900/95 to-cyan-950/70 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-36 w-96 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {sourceImage ? 'Icon Loaded & Configured' : 'Awaiting Icon'}
                </span>
                <span className="text-xs text-slate-400">
                  {selectedPlatforms.length} platform targets enabled
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Package All Selected App Icons
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {sourceImage ? (
                  <>
                    Creates <strong className="text-white">{totalFilesToGenerate} spec-accurate icon assets</strong> across{' '}
                    <strong className="text-cyan-300">{selectedPlatforms.length} platforms</strong> bundled in a single organized ZIP.
                  </>
                ) : (
                  <span className="text-amber-300 font-medium">
                    Upload an icon or select an example above to generate all platform assets.
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2 w-full md:w-auto shrink-0">
              <button
                onClick={handleGenerateBundle}
                disabled={generationProgress.isGenerating || !sourceImage}
                className="group relative flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/30 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
              >
                <Download className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                <span>
                  {sourceImage
                    ? `Generate & Download ${totalFilesToGenerate} Icons`
                    : 'Select an Icon to Generate'}
                </span>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-mono">
                  ZIP
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <span className="text-[11px] text-slate-400 font-medium">
                100% on device • Zero server transmission
              </span>
            </div>
          </div>
        </section>

        {/* Section 3: Target Platforms Grid */}
        <section>
          <PlatformSelector
            platforms={PLATFORMS}
            selectedPlatforms={selectedPlatforms}
            onTogglePlatform={handleTogglePlatform}
          />
        </section>

        {/* Section 4: Quick Export Drawer & Code Snippets */}
        <section>
          <QuickExportDrawer
            sourceImage={sourceImage}
            options={options}
            appName={appName}
          />
        </section>

        {/* Section 5: Developer FAQ */}
        <section>
          <FaqSection />
        </section>
      </main>

      {/* Generation Progress & Download Modal */}
      <GenerationModal
        progress={generationProgress}
        appName={appName}
        onClose={() =>
          setGenerationProgress((prev) => ({
            ...prev,
            isGenerating: false,
            downloadUrl: null,
            error: null,
          }))
        }
      />

      {/* Footer */}
      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
};

export default App;
