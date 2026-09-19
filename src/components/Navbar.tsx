import React from 'react';
import { ShieldCheck, Zap, Sparkles, Layers, Terminal, ExternalLink, Heart, Coffee } from 'lucide-react';

interface NavbarProps {
  onScrollToSection: (id: string) => void;
  totalPlatforms: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToSection, totalPlatforms }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#080b11]/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        {/* Logo, Brand & Badges */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#090d16]">
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400 transition-transform duration-300 hover:scale-110"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 4L27 10.35V21.65L16 28L5 21.65V10.35L16 4Z"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 11L22 14.5V20.5L16 24L10 20.5V14.5L16 11Z"
                  fill="url(#logoGrad)"
                />
                <circle cx="16" cy="17.5" r="2.5" fill="#FFFFFF" />
                <defs>
                  <linearGradient id="logoGrad" x1="10" y1="11" x2="22" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366F1" />
                    <stop offset="1" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-base sm:text-lg font-bold tracking-tight text-transparent">
                IconForge
              </span>
              <a
                href="https://www.gerstudio.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Visit Ger Studio (opens in new tab)"
                className="group inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-indigo-500/15 to-violet-500/15 hover:from-indigo-500/25 hover:to-cyan-500/25 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-wide text-indigo-300 hover:text-cyan-300 border border-indigo-500/30 hover:border-cyan-400/40 transition-all shadow-sm"
              >
                <span>by Ger Studio</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </a>
              <a
                href="https://github.com/dcryptoniun/AppIconGen"
                target="_blank"
                rel="noopener noreferrer"
                title="Open Source on GitHub"
                className="hidden lg:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300 hover:bg-emerald-500/20 transition-all"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span>Open Source</span>
              </a>
            </div>
            <p className="text-[11px] font-medium text-slate-400 hidden md:block">
              Universal App Icon Engine • 7 Targets
            </p>
          </div>
        </div>

        {/* Center Badges (Privacy & Speed) */}
        <div className="hidden xl:flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>100% Client-Side (No Uploads)</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 shadow-sm">
            <Zap className="h-3.5 w-3.5" />
            <span>Instant Zero-Latency</span>
          </div>
        </div>

        {/* Quick Nav Actions & Open Source CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onScrollToSection('simulator')}
            className="hidden sm:flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span>Mockups</span>
          </button>
          <button
            onClick={() => onScrollToSection('platforms')}
            className="hidden sm:flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <span>Platforms ({totalPlatforms})</span>
          </button>
          <button
            onClick={() => onScrollToSection('snippets')}
            className="hidden md:flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
            <span>Snippets</span>
          </button>
          <button
            onClick={() => onScrollToSection('faq')}
            className="hidden lg:block rounded-lg px-2 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            FAQ
          </button>

          {/* Sponsor Button */}
          <a
            href="https://github.com/sponsors/dcryptoniun"
            target="_blank"
            rel="noopener noreferrer"
            title="Sponsor on GitHub Sponsors (opens in new tab)"
            className="flex items-center gap-1.5 rounded-lg border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 px-2.5 py-1.5 text-xs font-semibold text-pink-300 hover:text-pink-200 transition-all shadow-sm"
          >
            <Heart className="h-3.5 w-3.5 fill-pink-500/40 text-pink-400" />
            <span className="hidden sm:inline">Sponsor</span>
          </a>

          {/* Buy Me a Coffee Button */}
          <a
            href="https://buymeacoffee.com/mayankmeena"
            target="_blank"
            rel="noopener noreferrer"
            title="Buy me a coffee on buymeacoffee.com (opens in new tab)"
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-all shadow-sm"
          >
            <Coffee className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden md:inline">Buy Me a Coffee</span>
            <span className="hidden sm:inline md:hidden">Coffee</span>
          </a>

          {/* GitHub Repo Button */}
          <a
            href="https://github.com/dcryptoniun/AppIconGen"
            target="_blank"
            rel="noopener noreferrer"
            title="View open source repository on GitHub"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 hover:bg-slate-700 hover:border-slate-600 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-sm"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
