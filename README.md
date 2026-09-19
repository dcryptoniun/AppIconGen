# 🚀 IconForge Studio — Universal Local-First App Icon Resizer

[![Live Website](https://img.shields.io/badge/Live_Website-appicon.gerstudio.com-6366F1?style=for-the-badge&logo=safari&logoColor=white)](https://appicon.gerstudio.com)
[![GitHub License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)
[![Ger Studio](https://img.shields.io/badge/Created_By-Ger_Studio-06B6D4?style=for-the-badge&logo=appveyor)](https://www.gerstudio.com)
[![Zero Uploads](https://img.shields.io/badge/Privacy-100%25_Client--Side-green?style=for-the-badge&logo=shield)](https://appicon.gerstudio.com)

**IconForge Studio** is a privacy-first, open-source web application for developers and designers to convert a single master icon into production-ready, spec-compliant asset packages for **iOS**, **Android**, **macOS**, **Web / PWA**, **Windows**, **Linux**, and **Favicon (.ico)** directly on device with zero server uploads.

🌐 **Live URL**: [https://appicon.gerstudio.com](https://appicon.gerstudio.com)  
🏢 **Studio**: [Ger Studio](https://www.gerstudio.com) — *Indie Studio for Apps & Game Development*  
👤 **Author**: [Mayank Meena](https://www.gerstudio.com)

---

## ✨ Features

- 🔒 **100% Client-Side & Private**: All image processing, canvas downsampling, binary ICO encoding, and ZIP compression run entirely in browser memory. Zero bytes are transmitted to any server. Works completely offline.
- 📱 **All Major Platforms Supported**:
  - **iOS & iPadOS**: Xcode-ready `AppIcon.appiconset` with complete `Contents.json` (all scales @1x, @2x, @3x from 20pt to 1024pt App Store).
  - **Android**: Full `res/mipmap-*` density tree (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`), round icon variants, adaptive `ic_launcher_foreground.png`, adaptive vector XMLs, notification icons, and `playstore-512.png`.
  - **macOS**: `AppIcon.iconset` (16×16 to 1024×1024 @1x/@2x) plus automated `convert_to_icns.sh` shell script.
  - **Web & PWA**: `site.webmanifest`, `browserconfig.xml`, `apple-touch-icon.png` (180×180), Chrome 192/512, and copyable HTML meta tags.
  - **Windows**: Multi-resolution `app.ico` (7 embedded sizes: 16 to 256) + Modern App tiles (`Square44`, `Square71`, `Square150`, `Square310`, `Wide310x150`, `StoreLogo`).
  - **Linux**: Freedesktop `hicolor` hierarchy (`16x16/apps` to `512x512/apps`) + sample `app-icon.desktop` launcher.
  - **Favicon (.ico)**: True binary multi-resolution `favicon.ico` (16, 32, 48) generated via pure client-side buffer encoding + crisp PNG fallbacks.
- 🎨 **Stepped Bicubic Downscaling**: Prevents pixel skipping, artifacts, and blurriness when downsizing high-res 1024px master icons to tiny 16px and 24px assets.
- 🛡️ **Safe Area Inset (Padding) Control**: Avoids icon clipping on Android circular launchers with 0% - 30% safe-zone padding slider.
- 👁️ **Live Interactive Device Simulator**: Authentic real-world mockups for **iPhone 16 Pro** (iOS 18), **Android 14 Pixel** (Material You), **macOS Sequoia Dock**, **Windows 11 Taskbar**, and **Web Browser Tab** with dynamic Quick Shape Masks (`Squircle`, `Circle`, `Rounded`, `Square`, `Auto`).
- ⚡ **Instant 1-Click Exports**: Single-file downloads for `favicon.ico`, `playstore-512.png`, `apple-touch-icon.png`, and copyable `<head>` code snippets.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript (strict mode)
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Packaging**: JSZip (in-browser compression)
- **Animations**: Canvas Confetti
- **Deployment Target**: `https://appicon.gerstudio.com`

---

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dcryptoniun/AppIconGen.git
   cd AppIconGen
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build production bundle:**
   ```bash
   npm run build
   ```

---

## 🤝 Community & Support

- 🐛 **Report a Bug**: [Open an issue](https://github.com/dcryptoniun/AppIconGen/issues)
- 💡 **Request a Feature**: [Feature request](https://github.com/dcryptoniun/AppIconGen/issues/new)
- 💖 **Sponsor Ger Studio**: [Support on GitHub / Website](https://www.gerstudio.com/)
- 📜 **Contribution Guidelines**: See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by **[Mayank Meena](https://www.gerstudio.com)** at **[Ger Studio](https://www.gerstudio.com)**.
