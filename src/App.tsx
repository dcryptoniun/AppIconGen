import React, { useState } from 'react';
import {
  Download,
  Sparkles,
  ArrowRight,
  Layers,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import type {
  GenerationProgress,
  MultiLayerState,
  PlatformId,
  ResizeOptions,
  SourceImageMeta,
} from './types';
import { PLATFORMS } from './engine/platformSpecs';
import { loadImage, type LayerInputImages } from './engine/resizerEngine';
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
  const [multiLayerState, setMultiLayerState] = useState<MultiLayerState>({
    mode: 'single',
    foreground: null,
    background: null,
    monochrome: null,
  });

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

  // Main Generator Orchestrator with Multi-Layer Support
  const handleGenerateBundle = async () => {
    const activeImage =
      multiLayerState.mode === 'multilayer'
        ? multiLayerState.foreground || sourceImage
        : sourceImage;

    if (!activeImage) {
      alert('Please upload an icon or pick an example preset in Step 1 first.');
      scrollToSection('step-1');
      return;
    }

    if (selectedPlatforms.length === 0) {
      alert('Please select at least one target platform in Step 3.');
      scrollToSection('step-3');
      return;
    }

    setGenerationProgress({
      isGenerating: true,
      progressPercent: 2,
      currentTask: 'Preparing asset layers...',
      totalFiles: 0,
      completedFiles: 0,
      downloadUrl: null,
      zipFileName: null,
      zipSize: null,
      error: null,
    });

    try {
      let layersInput: LayerInputImages;

      if (
        multiLayerState.mode === 'multilayer' &&
        (multiLayerState.foreground || multiLayerState.background)
      ) {
        const fgImg = multiLayerState.foreground
          ? await loadImage(multiLayerState.foreground.dataUrl)
          : activeImage
          ? await loadImage(activeImage.dataUrl)
          : null;
        const bgImg = multiLayerState.background
          ? await loadImage(multiLayerState.background.dataUrl)
          : null;
        const monoImg = multiLayerState.monochrome
          ? await loadImage(multiLayerState.monochrome.dataUrl)
          : null;

        layersInput = {
          foreground: fgImg,
          background: bgImg,
          monochrome: monoImg,
          master: fgImg,
        };
      } else {
        const img = await loadImage(activeImage.dataUrl);
        layersInput = { master: img };
      }

      const result = await buildPlatformBundle(
        layersInput,
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

  const hasLoadedAsset = Boolean(
    sourceImage || multiLayerState.foreground || multiLayerState.background
  );

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Sticky Navbar */}
      <Navbar onScrollToSection={scrollToSection} totalPlatforms={selectedPlatforms.length} />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <section className="relative text-center max-w-3xl mx-auto pt-4 sm:pt-6 space-y-4">
          <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-48 w-full max-w-lg rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-cyan-500/20 blur-3xl" />

          {/* Top Pill Badges */}
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
            Convert a single master icon or multi-layer assets into spec-compliant packages for{' '}
            <strong className="text-white">iOS</strong>, <strong className="text-white">Android</strong>,{' '}
            <strong className="text-white">macOS</strong>, <strong className="text-white">Web/PWA</strong>,{' '}
            <strong className="text-white">Windows</strong>, <strong className="text-white">Linux</strong>, and{' '}
            <strong className="text-white">Favicon (.ico)</strong>. 100% on-device with zero server uploads.
          </p>
        </section>

        {/* Interactive 4-Step Workflow Stepper */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-2 sm:p-3 backdrop-blur-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {/* Step 1 Pill */}
            <button
              type="button"
              onClick={() => scrollToSection('step-1')}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                hasLoadedAsset
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                  : 'border-indigo-500/40 bg-indigo-950/30 text-white shadow-sm'
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  hasLoadedAsset
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {hasLoadedAsset ? <CheckCircle2 className="h-4 w-4" /> : '1'}
              </span>
              <div className="overflow-hidden">
                <div className="font-bold text-[11px] uppercase tracking-wider opacity-70">
                  Step 1
                </div>
                <div className="font-semibold truncate">Select Asset(s)</div>
              </div>
            </button>

            {/* Step 2 Pill */}
            <button
              type="button"
              onClick={() => scrollToSection('step-2')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-800 bg-slate-950/40 text-left hover:border-slate-700 hover:text-white transition-all text-slate-300"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet-600/80 text-xs font-bold text-white">
                2
              </span>
              <div className="overflow-hidden">
                <div className="font-bold text-[11px] uppercase tracking-wider opacity-70 text-slate-400">
                  Step 2
                </div>
                <div className="font-semibold truncate">Customize & Preview</div>
              </div>
            </button>

            {/* Step 3 Pill */}
            <button
              type="button"
              onClick={() => scrollToSection('step-3')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-800 bg-slate-950/40 text-left hover:border-slate-700 hover:text-white transition-all text-slate-300"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-600/80 text-xs font-bold text-[#090d16]">
                3
              </span>
              <div className="overflow-hidden">
                <div className="font-bold text-[11px] uppercase tracking-wider opacity-70 text-slate-400">
                  Step 3
                </div>
                <div className="font-semibold truncate">
                  Platforms ({selectedPlatforms.length}/7)
                </div>
              </div>
            </button>

            {/* Step 4 Pill (Download) */}
            <button
              type="button"
              onClick={() => scrollToSection('step-4')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 to-cyan-950/40 text-left hover:border-cyan-400/50 transition-all text-cyan-200"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-xs font-bold text-[#090d16]">
                4
              </span>
              <div className="overflow-hidden">
                <div className="font-bold text-[11px] uppercase tracking-wider opacity-80 text-emerald-400">
                  Final Step
                </div>
                <div className="font-semibold truncate">Download ZIP Pack</div>
              </div>
            </button>
          </div>
        </section>

        {/* STEP 1: Asset Selection (Single or Multi-Layer) */}
        <section id="step-1" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 text-xs font-bold text-indigo-300">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-extrabold text-white">
                  1
                </span>
                STEP 1
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Select Icon Asset(s)
              </h2>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>Choose</span>
              <strong className="text-slate-200">Single Master</strong>
              <span>or</span>
              <strong className="text-cyan-300">Multi-Layer (Adaptive / Themed)</strong>
            </div>
          </div>

          <Dropzone
            sourceImage={sourceImage}
            multiLayerState={multiLayerState}
            onMultiLayerChange={setMultiLayerState}
            onImageSelected={(meta) => {
              setSourceImage(meta);
              const baseName = meta.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '');
              if (baseName && appName === 'AppIcon') {
                setAppName(baseName);
              }
            }}
            onClear={() => {
              setSourceImage(null);
              setMultiLayerState({
                mode: multiLayerState.mode,
                foreground: null,
                background: null,
                monochrome: null,
              });
            }}
            backgroundColor={options.backgroundColor}
          />
        </section>

        {/* STEP 2: Customization & Realistic Simulator */}
        <section id="step-2" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 px-3 py-1 text-xs font-bold text-violet-300">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-extrabold text-white">
                  2
                </span>
                STEP 2
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Customize & Preview in Live Simulator
              </h2>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-violet-400" />
              <span>Safe-area padding, colors & real-world OS mockups</span>
            </div>
          </div>

          <div id="simulator" className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Tuning Controls */}
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

            {/* Live Interactive Simulator */}
            <div className="xl:col-span-7">
              <DeviceSimulator
                sourceImage={sourceImage}
                multiLayerState={multiLayerState}
                options={options}
                appName={appName}
              />
            </div>
          </div>
        </section>

        {/* STEP 3: Target Platforms Selection */}
        <section id="step-3" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-300">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-extrabold text-[#090d16]">
                  3
                </span>
                STEP 3
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Select Target Platforms ({selectedPlatforms.length}/7 Selected)
              </h2>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span>Enable or inspect asset counts for each operating system</span>
            </div>
          </div>

          <PlatformSelector
            platforms={PLATFORMS}
            selectedPlatforms={selectedPlatforms}
            onTogglePlatform={handleTogglePlatform}
          />
        </section>

        {/* STEP 4 (FINAL STEP): Master Download Action Bar */}
        <section id="step-4" className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-extrabold text-[#090d16]">
                4
              </span>
              FINAL STEP
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Generate & Download Asset Package
            </h2>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/70 via-slate-900/95 to-cyan-950/70 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-36 w-96 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 blur-3xl" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {hasLoadedAsset ? 'Ready to Package' : 'Awaiting Icon'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedPlatforms.length} platform targets enabled
                  </span>
                  {multiLayerState.mode === 'multilayer' && (
                    <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[11px] font-medium text-cyan-300">
                      Multi-Layer Engine Active
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Package All Selected App Icons
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  {hasLoadedAsset ? (
                    <>
                      Creates{' '}
                      <strong className="text-white">
                        {totalFilesToGenerate} spec-accurate icon assets
                      </strong>{' '}
                      across <strong className="text-cyan-300">{selectedPlatforms.length} platforms</strong>{' '}
                      bundled in a single organized ZIP.
                    </>
                  ) : (
                    <span className="text-amber-300 font-medium">
                      Upload an icon or select an example in Step 1 to generate your package.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-2 w-full md:w-auto shrink-0">
                <button
                  onClick={handleGenerateBundle}
                  disabled={generationProgress.isGenerating || !hasLoadedAsset}
                  className="group relative flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/30 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
                >
                  <Download className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                  <span>
                    {hasLoadedAsset
                      ? `Generate & Download ${totalFilesToGenerate} Icons`
                      : 'Select an Icon in Step 1'}
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
          </div>
        </section>

        {/* Additional Utility: Quick Export Drawer & Code Snippets */}
        <section id="snippets">
          <QuickExportDrawer
            sourceImage={sourceImage || multiLayerState.foreground}
            options={options}
            appName={appName}
          />
        </section>

        {/* Section 5: Developer FAQ & Guarantees */}
        <section id="faq">
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
