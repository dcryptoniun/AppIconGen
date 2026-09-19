import React, { useEffect } from 'react';
import { CheckCircle2, Download, Loader2, Sparkles, X, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { GenerationProgress } from '../types';

interface GenerationModalProps {
  progress: GenerationProgress;
  onClose: () => void;
  appName: string;
}

export const GenerationModal: React.FC<GenerationModalProps> = ({ progress, onClose, appName }) => {
  const isComplete = progress.progressPercent >= 100 && !!progress.downloadUrl;

  useEffect(() => {
    if (isComplete) {
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#EC4899'],
        });
      } catch (err) {
        console.log('Confetti trigger skipped', err);
      }
    }
  }, [isComplete]);

  if (!progress.isGenerating && !progress.downloadUrl && !progress.error) {
    return null;
  }

  const formattedZipSize = progress.zipSize
    ? progress.zipSize > 1024 * 1024
      ? `${(progress.zipSize / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(progress.zipSize / 1024)} KB`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl shadow-indigo-950/50">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-44 w-80 rounded-full bg-gradient-to-b from-indigo-500/20 via-cyan-500/15 to-transparent blur-3xl" />

        {/* Close Button if finished or error */}
        {(isComplete || progress.error) && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="relative flex flex-col items-center text-center">
          {/* Status Icon */}
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700 shadow-xl">
            {progress.error ? (
              <X className="h-10 w-10 text-rose-500" />
            ) : isComplete ? (
              <CheckCircle2 className="h-10 w-10 text-emerald-400 animate-bounce" />
            ) : (
              <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white tracking-tight sm:text-2xl">
            {progress.error
              ? 'Generation Failed'
              : isComplete
              ? 'Icon Bundle Ready!'
              : 'Forging App Icons...'}
          </h3>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-md">
            {progress.error
              ? progress.error
              : isComplete
              ? `All selected platform assets have been converted and packaged into ${progress.zipFileName}.`
              : progress.currentTask || 'Processing high-fidelity downsampling...'}
          </p>

          {/* Progress Bar & Status */}
          {!progress.error && !isComplete && (
            <div className="mt-6 w-full space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-cyan-300 truncate max-w-[300px]">
                  {progress.currentTask}
                </span>
                <span className="font-mono font-bold text-white">{progress.progressPercent}%</span>
              </div>

              {/* Progress Bar Track */}
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800 border border-slate-700/80 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 transition-all duration-200"
                  style={{ width: `${progress.progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Rendering to pixel spec</span>
                <span>
                  {progress.completedFiles} of {progress.totalFiles} tasks
                </span>
              </div>
            </div>
          )}

          {/* Complete Summary Box */}
          {isComplete && (
            <div className="mt-6 w-full space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Application Name:</span>
                  <span className="font-semibold text-white">{appName || 'AppIcon'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Archive File:</span>
                  <span className="font-mono text-indigo-300">{progress.zipFileName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Assets Created:</span>
                  <span className="font-bold text-emerald-400">{progress.completedFiles} files</span>
                </div>
                {formattedZipSize && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">ZIP File Size:</span>
                    <span className="font-mono text-slate-200">{formattedZipSize}</span>
                  </div>
                )}
              </div>

              {/* Download Button */}
              {progress.downloadUrl && (
                <a
                  href={progress.downloadUrl}
                  download={progress.zipFileName || 'AppIcons-bundle.zip'}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] hover:shadow-cyan-500/25 transition-all"
                >
                  <Download className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                  <span>Download ZIP Bundle Now</span>
                  <Sparkles className="h-4 w-4 text-amber-300" />
                </a>
              )}

              <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Zero server transmission. Processed 100% on your device.</span>
              </p>
            </div>
          )}

          {/* Close on error */}
          {progress.error && (
            <button
              onClick={onClose}
              className="mt-6 rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
