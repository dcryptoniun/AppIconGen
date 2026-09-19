import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: React.ReactNode;
  category: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    category: 'Privacy & Security',
    question: 'Are my icons or graphics ever uploaded to a server?',
    answer: (
      <p>
        <strong>No, never.</strong> IconForge Studio operates with a 100% client-side architecture. All image decoding, canvas-based stepped bicubic downsampling, binary ICO file encoding, and ZIP compression occur directly inside your browser's local sandbox memory using HTML5 Canvas and JSZip. Your images never touch a remote server, network socket, or cloud bucket. You can even use this app entirely offline.
      </p>
    ),
  },
  {
    category: 'Android',
    question: 'Why does my icon get cropped on modern Android devices?',
    answer: (
      <p>
        Starting with Android 8.0 (API 26) and refined in Android 13/14/15 Material You, Android uses <strong>Adaptive Icons</strong>. An adaptive icon has a total canvas size of 108dp × 108dp, but device manufacturers mask it using different shapes (circles, squircles, rounded squares). Only the inner <strong>72dp diameter</strong> is guaranteed to be visible. Use our <strong>Safe Area Inset (Padding)</strong> slider set between 12% and 18% to ensure your logo sits safely inside the visible circular region.
      </p>
    ),
  },
  {
    category: 'iOS & Xcode',
    question: 'How do I import the iOS bundle into Xcode?',
    answer: (
      <p>
        Unzip your downloaded bundle and locate the <code className="text-cyan-300">ios/AppIcon.appiconset</code> folder. Open your project in Xcode, navigate to <code className="text-cyan-300">Assets.xcassets</code>, delete the default empty AppIcon placeholder, and drag and drop our <code className="text-cyan-300">AppIcon.appiconset</code> folder directly into the asset catalog. The included <code className="text-cyan-300">Contents.json</code> automatically assigns all resolutions for iPhone, iPad, and App Store Marketing without manual drag-and-drop.
      </p>
    ),
  },
  {
    category: 'Favicon & Web',
    question: 'What is inside the multi-resolution favicon.ico?',
    answer: (
      <p>
        A true Windows/Web <code className="text-cyan-300">.ico</code> file is a container format containing multiple embedded image resolutions. Our in-browser binary encoder embeds <strong>16×16</strong> (standard browser tabs), <strong>32×32</strong> (Retina tabs and Windows taskbar), and <strong>48×48</strong> (desktop shortcuts) inside a single binary file. This ensures your favicon renders razor-sharp across all browser tabs and operating systems without blurry scaling artifacts.
      </p>
    ),
  },
  {
    category: 'macOS',
    question: 'How do I convert the macOS iconset into a .icns file?',
    answer: (
      <p>
        We generate an Apple-compliant <code className="text-cyan-300">AppIcon.iconset</code> folder containing 10 scaled PNGs (from 16×16 to 1024×1024 at 1x and 2x). On any Mac, open Terminal in that directory and run:
        <br />
        <code className="block mt-2 rounded bg-slate-950 p-2 font-mono text-xs text-indigo-300 border border-slate-800">
          iconutil -c icns AppIcon.iconset -o AppIcon.icns
        </code>
        We even include a pre-configured <code className="text-cyan-300">convert_to_icns.sh</code> shell script in the macOS archive folder so you can simply double-click it.
      </p>
    ),
  },
  {
    category: 'Best Practices',
    question: 'What source image dimensions provide the best output?',
    answer: (
      <p>
        For best results, upload a <strong>1024 × 1024 px</strong> or larger square image (1:1 aspect ratio) in PNG, WEBP, or vector SVG format. Because we use stepped downsampling (halving in recursive passes with high-quality bicubic smoothing), your master icon scales down cleanly to tiny 16px and 24px sizes without pixel jaggedness or aliasing.
      </p>
    ),
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div id="faq" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Frequently Asked Questions & Developer Guide
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Technical specifications, asset guidelines, and platform integration instructions
          </p>
        </div>
        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
          Developer Docs
        </span>
      </div>

      {/* FAQ Accordion */}
      <div className="divide-y divide-slate-800/80">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-4 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                className="flex w-full items-start justify-between gap-4 text-left transition-colors group"
              >
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                    {item.category}
                  </span>
                  <h4 className="text-sm sm:text-base font-medium text-white group-hover:text-cyan-300 transition-colors">
                    {item.question}
                  </h4>
                </div>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800/60 text-slate-400 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed pl-1 pr-8 animate-in fade-in duration-150">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
