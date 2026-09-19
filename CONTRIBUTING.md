# Contributing to IconForge Studio

Thank you for your interest in contributing to **IconForge Studio**, an open-source, 100% client-side app icon generation engine created by [Ger Studio](https://www.gerstudio.com/) and [Mayank Meena](https://github.com/gerstudio).

## How to Contribute

We welcome contributions of all kinds:
- 🐛 **Bug Reports**: Open an issue describing the bug, steps to reproduce, and your browser/OS version.
- 💡 **Feature Requests**: Propose new platforms, asset specifications, or UI enhancements.
- 🔧 **Code Pull Requests**: Fix bugs, optimize downsampling, or add support for new device dimensions.
- 📖 **Documentation**: Improve guides, FAQs, and developer tips.

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dcryptoniun/AppIconGen.git
   cd AppIconGen
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Verify TypeScript build:**
   ```bash
   npm run build
   ```

## Code Standards
- **Static Typing**: Maintain 100% TypeScript type safety with strict mode enabled.
- **Client-Side Only**: Do not introduce external server processing or upload dependencies. All image transformations must remain local in the browser.
- **Formatting**: Keep clean, accessible markup and semantic Tailwind CSS styling.

## Reporting Issues & Feature Requests
- Issues: [https://github.com/dcryptoniun/AppIconGen/issues](https://github.com/dcryptoniun/AppIconGen/issues)
- Official Website: [https://appicon.gerstudio.com](https://appicon.gerstudio.com)
- Ger Studio: [https://www.gerstudio.com](https://www.gerstudio.com)
