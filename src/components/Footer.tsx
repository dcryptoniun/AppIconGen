import React from 'react';
import { ShieldCheck, Sparkles, Heart, ExternalLink, GitPullRequest, Bug, Star } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#06080d] py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800/60">
          {/* Brand Info */}
          <div className="space-y-3.5 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 via-violet-500 to-cyan-400 p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#090d16]">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-base font-bold tracking-tight text-white">IconForge</span>
              <a
                href="https://www.gerstudio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-0.5 text-[11px] font-semibold text-indigo-300 hover:text-cyan-300 border border-indigo-500/20 transition-all"
              >
                <span>by Ger Studio</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open-source, privacy-first app icon converter and resizing engine. Generates verified assets for iOS, Android, macOS, Web, Windows, Linux, and Favicon (.ico) directly on your device.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                🌐 <code className="text-cyan-300">appicon.gerstudio.com</code>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                MIT License
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h5 className="font-semibold uppercase tracking-wider text-slate-300 text-xs mb-3">Tool Navigation</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onScrollToSection('simulator')} className="hover:text-cyan-400 transition-colors">
                  Device Simulator & Mockups
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('platforms')} className="hover:text-cyan-400 transition-colors">
                  Platform Specifications (7 Targets)
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('snippets')} className="hover:text-cyan-400 transition-colors">
                  Manifest & HTML Code Snippets
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('faq')} className="hover:text-cyan-400 transition-colors">
                  Developer FAQ & Privacy Guarantee
                </button>
              </li>
            </ul>
          </div>

          {/* Open Source & Community */}
          <div>
            <h5 className="font-semibold uppercase tracking-wider text-slate-300 text-xs mb-3">Open Source & Community</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://github.com/dcryptoniun/AppIconGen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Star className="h-3.5 w-3.5 text-amber-400" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/dcryptoniun/AppIconGen/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-rose-300 transition-colors"
                >
                  <Bug className="h-3.5 w-3.5 text-rose-400" />
                  <span>Report an Issue</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/dcryptoniun/AppIconGen/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Feature Request</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/dcryptoniun/AppIconGen/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
                >
                  <GitPullRequest className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Contribution Guide</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sponsors/dcryptoniun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-pink-400 hover:text-pink-300 transition-colors font-medium"
                >
                  <Heart className="h-3.5 w-3.5 fill-pink-500/30 text-pink-400" />
                  <span>GitHub Sponsors</span>
                </a>
              </li>
              <li>
                <a
                  href="https://buymeacoffee.com/mayankmeena"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-medium"
                >
                  <span className="text-xs">☕</span>
                  <span>Buy Me a Coffee</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Ger Studio Info */}
          <div>
            <h5 className="font-semibold uppercase tracking-wider text-slate-300 text-xs mb-3">Created By</h5>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <a
                  href="https://www.gerstudio.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-indigo-300 hover:text-cyan-300 font-semibold transition-colors"
                >
                  <span>Ger Studio</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
              <li className="text-slate-300 font-medium">
                Indie Studio for Apps & Game Development
              </li>
              <li className="text-[11px] text-slate-400 leading-relaxed">
                Crafting High-Performance Apps, Games & Next-Gen Developer Tools.
              </li>
              <li className="pt-1">
                <a
                  href="https://www.gerstudio.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                  <span>Explore Portfolio & Games</span>
                  <span>→</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-slate-300">
              © {currentYear} <a href="https://www.gerstudio.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white underline decoration-slate-600 transition-colors">Ger Studio</a>.
            </span>
            <span>All rights reserved.</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <a
              href="https://appicon.gerstudio.com"
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              appicon.gerstudio.com
            </a>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <div className="inline-flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>100% Client-Side Local</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 font-medium bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800 shadow-sm">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>by</span>
            <a
              href="https://www.gerstudio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-cyan-300 underline decoration-indigo-500 font-semibold transition-colors"
            >
              Mayank Meena (gerstudio)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
