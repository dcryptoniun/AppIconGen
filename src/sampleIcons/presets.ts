import type { IconPreset } from '../types';

// Helper to convert inline SVG string to clean Data URI
function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const SAMPLE_PRESETS: IconPreset[] = [
  {
    id: 'orbit-rocket',
    name: 'AeroLaunch',
    category: 'Productivity',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4F46E5"/>
            <stop offset="50%" stop-color="#7C3AED"/>
            <stop offset="100%" stop-color="#EC4899"/>
          </linearGradient>
          <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF"/>
            <stop offset="100%" stop-color="#E2E8F0"/>
          </linearGradient>
          <linearGradient id="flame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FDE047"/>
            <stop offset="50%" stop-color="#F97316"/>
            <stop offset="100%" stop-color="#EF4444"/>
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
        <rect width="512" height="512" rx="120" fill="url(#bg)"/>
        <!-- Star particles -->
        <circle cx="120" cy="140" r="6" fill="#FFFFFF" opacity="0.8"/>
        <circle cx="380" cy="110" r="8" fill="#FFFFFF" opacity="0.6"/>
        <circle cx="100" cy="360" r="5" fill="#FFFFFF" opacity="0.5"/>
        <circle cx="420" cy="380" r="7" fill="#FFFFFF" opacity="0.7"/>
        <!-- Rocket Flame -->
        <path d="M 180 340 C 160 380, 150 430, 160 450 C 180 430, 230 420, 250 390 Z" fill="url(#flame)" filter="url(#glow)"/>
        <!-- Rocket Fins -->
        <path d="M 180 300 L 130 350 L 180 380 Z" fill="#3B82F6"/>
        <path d="M 300 180 L 350 130 L 380 180 Z" fill="#3B82F6"/>
        <!-- Rocket Fuselage -->
        <path d="M 190 350 C 180 260, 260 140, 390 120 C 370 250, 250 330, 190 350 Z" fill="url(#rocketBody)" stroke="#E0E7FF" stroke-width="4"/>
        <!-- Porthole -->
        <circle cx="290" cy="220" r="32" fill="#0EA5E9" stroke="#FFFFFF" stroke-width="6"/>
        <circle cx="282" cy="212" r="10" fill="#BAE6FD"/>
      </svg>
    `),
  },
  {
    id: 'prism-ai',
    name: 'NeuralPulse',
    category: 'AI & Machine Learning',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
        <defs>
          <linearGradient id="prismBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0F172A"/>
            <stop offset="50%" stop-color="#1E1B4B"/>
            <stop offset="100%" stop-color="#020617"/>
          </linearGradient>
          <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#22D3EE"/>
            <stop offset="100%" stop-color="#0284C7"/>
          </linearGradient>
          <linearGradient id="neonViolet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#C084FC"/>
            <stop offset="100%" stop-color="#7C3AED"/>
          </linearGradient>
          <linearGradient id="neonAmber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FBBF24"/>
            <stop offset="100%" stop-color="#F59E0B"/>
          </linearGradient>
          <filter id="prismGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="18" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
        <rect width="512" height="512" rx="120" fill="url(#prismBg)"/>
        <!-- Background Grid Rings -->
        <circle cx="256" cy="256" r="170" fill="none" stroke="#312E81" stroke-width="2" stroke-dasharray="8 8" opacity="0.6"/>
        <circle cx="256" cy="256" r="210" fill="none" stroke="#1E1B4B" stroke-width="2" opacity="0.4"/>
        <!-- Intersecting Crystal Tetrahedron -->
        <polygon points="256,100 390,320 256,270" fill="url(#neonCyan)" opacity="0.9" filter="url(#prismGlow)"/>
        <polygon points="256,100 122,320 256,270" fill="url(#neonViolet)" opacity="0.9" filter="url(#prismGlow)"/>
        <polygon points="122,320 390,320 256,270" fill="url(#neonAmber)" opacity="0.85"/>
        <circle cx="256" cy="256" r="14" fill="#FFFFFF" filter="url(#prismGlow)"/>
      </svg>
    `),
  },
  {
    id: 'fintech-vault',
    name: 'ApexVault',
    category: 'Finance & Crypto',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
        <defs>
          <linearGradient id="vaultBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#064E3B"/>
            <stop offset="60%" stop-color="#022C22"/>
            <stop offset="100%" stop-color="#011611"/>
          </linearGradient>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FDE047"/>
            <stop offset="50%" stop-color="#EAB308"/>
            <stop offset="100%" stop-color="#CA8A04"/>
          </linearGradient>
          <linearGradient id="emeraldGleam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#34D399"/>
            <stop offset="100%" stop-color="#059669"/>
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="120" fill="url(#vaultBg)"/>
        <!-- Outer Shield Hexagon -->
        <polygon points="256,90 390,165 390,345 256,420 122,345 122,165" fill="none" stroke="url(#emeraldGleam)" stroke-width="8" opacity="0.5"/>
        <!-- Inner Geometric Core -->
        <polygon points="256,125 365,188 365,324 256,387 147,324 147,188" fill="#042F2E" stroke="url(#goldGradient)" stroke-width="6"/>
        <!-- Vault Emblem / Diamond Spark -->
        <path d="M 256 160 L 320 256 L 256 352 L 192 256 Z" fill="url(#goldGradient)"/>
        <circle cx="256" cy="256" r="28" fill="#022C22" stroke="#FEF08A" stroke-width="4"/>
        <circle cx="256" cy="256" r="10" fill="#FDE047"/>
      </svg>
    `),
  },
  {
    id: 'synth-controller',
    name: 'GameVerse',
    category: 'Gaming & Entertainment',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
        <defs>
          <linearGradient id="gameBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#18181B"/>
            <stop offset="50%" stop-color="#27272A"/>
            <stop offset="100%" stop-color="#09090B"/>
          </linearGradient>
          <linearGradient id="gameAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#EC4899"/>
            <stop offset="100%" stop-color="#8B5CF6"/>
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="120" fill="url(#gameBg)"/>
        <!-- Ambient neon glow -->
        <circle cx="256" cy="256" r="120" fill="url(#gameAccent)" opacity="0.25" filter="blur(30px)"/>
        <!-- Controller Body -->
        <rect x="130" y="190" width="252" height="140" rx="60" fill="#18181B" stroke="url(#gameAccent)" stroke-width="8"/>
        <!-- D-Pad -->
        <rect x="180" y="240" width="16" height="40" rx="4" fill="#A1A1AA"/>
        <rect x="168" y="252" width="40" height="16" rx="4" fill="#A1A1AA"/>
        <!-- Action Buttons -->
        <circle cx="310" cy="245" r="9" fill="#EC4899"/>
        <circle cx="330" cy="265" r="9" fill="#06B6D4"/>
        <circle cx="290" cy="265" r="9" fill="#EAB308"/>
        <circle cx="310" cy="285" r="9" fill="#10B981"/>
        <!-- Center Emblem -->
        <polygon points="256,245 266,265 246,265" fill="#FAFAFA"/>
      </svg>
    `),
  },
];
