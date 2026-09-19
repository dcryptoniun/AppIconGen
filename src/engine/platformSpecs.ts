import type { PlatformConfig, PlatformId } from '../types';

export interface FileSpec {
  path: string;
  width: number;
  height: number;
  shape?: 'default' | 'round' | 'foreground' | 'background' | 'monochrome' | 'dark' | 'tinted' | 'maskable';
  purpose?: string;
}

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'ios',
    name: 'iOS & iPadOS',
    description: 'Xcode asset catalog (AppIcon.appiconset) with iOS 18 Light, Dark, and Tinted appearances',
    iconName: 'Smartphone',
    fileCount: 22,
    highlightSpecs: ['AppIcon.appiconset', 'Contents.json', 'iOS 18 Dark & Tinted', '1024×1024 Store'],
    enabled: true,
    directoryPreview: 'ios/AppIcon.appiconset/Contents.json + 21 PNGs',
  },
  {
    id: 'android',
    name: 'Android',
    description: 'Modern Adaptive Icons + Android 13+ Themed Icons + legacy mipmaps + Play Store 512',
    iconName: 'SmartphoneCharging',
    fileCount: 23,
    highlightSpecs: ['Adaptive Foregrounds', 'Android 13+ Monochrome', 'XML Vectors', 'Play Store 512'],
    enabled: true,
    directoryPreview: 'android/res/mipmap-* + drawable + playstore-512.png',
  },
  {
    id: 'macos',
    name: 'macOS',
    description: 'Apple AppIcon.iconset hierarchy ready for terminal iconutil to .icns',
    iconName: 'Laptop',
    fileCount: 11,
    highlightSpecs: ['AppIcon.iconset', '16×16 to 1024×1024', '@1x and @2x', 'iconutil ready'],
    enabled: true,
    directoryPreview: 'macos/AppIcon.iconset/icon_* + convert_to_icns.sh',
  },
  {
    id: 'web',
    name: 'Web & PWA',
    description: 'Progressive Web App manifest, maskable icon, apple-touch-icon, and browserconfig.xml',
    iconName: 'Globe',
    fileCount: 10,
    highlightSpecs: ['site.webmanifest', 'Maskable 512×512', 'apple-touch-icon', 'HTML snippets'],
    enabled: true,
    directoryPreview: 'web/site.webmanifest + icons + HTML snippet',
  },
  {
    id: 'windows',
    name: 'Windows',
    description: 'Multi-resolution desktop app.ico plus Windows App SDK tile assets',
    iconName: 'Monitor',
    fileCount: 8,
    highlightSpecs: ['Multi-res app.ico (7 sizes)', 'Square44 to Square310', 'Wide310x150', 'StoreLogo'],
    enabled: true,
    directoryPreview: 'windows/app.ico + tiles/Square*Logo.png',
  },
  {
    id: 'linux',
    name: 'Linux',
    description: 'Freedesktop hicolor icon theme hierarchy and sample .desktop launcher',
    iconName: 'Terminal',
    fileCount: 9,
    highlightSpecs: ['hicolor/16 to 512', 'freedesktop spec', '.desktop entry', 'Linux Desktop ready'],
    enabled: true,
    directoryPreview: 'linux/hicolor/16x16 to 512x512 + app-icon.desktop',
  },
  {
    id: 'favicon',
    name: 'Favicon Package',
    description: 'True binary multi-resolution favicon.ico plus crisp PNG fallbacks',
    iconName: 'Sparkles',
    fileCount: 4,
    highlightSpecs: ['favicon.ico (16/32/48)', 'favicon-16.png', 'favicon-32.png', 'Zero dependencies'],
    enabled: true,
    directoryPreview: 'favicon/favicon.ico + PNGs',
  },
];

// iOS AppIcon specs
export const IOS_FILE_SPECS: FileSpec[] = [
  { path: 'ios/AppIcon.appiconset/icon-20@2x.png', width: 40, height: 40, purpose: 'Notification' },
  { path: 'ios/AppIcon.appiconset/icon-20@3x.png', width: 60, height: 60, purpose: 'Notification' },
  { path: 'ios/AppIcon.appiconset/icon-29@2x.png', width: 58, height: 58, purpose: 'Settings' },
  { path: 'ios/AppIcon.appiconset/icon-29@3x.png', width: 87, height: 87, purpose: 'Settings' },
  { path: 'ios/AppIcon.appiconset/icon-40@2x.png', width: 80, height: 80, purpose: 'Spotlight' },
  { path: 'ios/AppIcon.appiconset/icon-40@3x.png', width: 120, height: 120, purpose: 'Spotlight' },
  { path: 'ios/AppIcon.appiconset/icon-60@2x.png', width: 120, height: 120, purpose: 'App Icon' },
  { path: 'ios/AppIcon.appiconset/icon-60@3x.png', width: 180, height: 180, purpose: 'App Icon' },
  { path: 'ios/AppIcon.appiconset/icon-20.png', width: 20, height: 20, purpose: 'iPad Notification' },
  { path: 'ios/AppIcon.appiconset/icon-29.png', width: 29, height: 29, purpose: 'iPad Settings' },
  { path: 'ios/AppIcon.appiconset/icon-40.png', width: 40, height: 40, purpose: 'iPad Spotlight' },
  { path: 'ios/AppIcon.appiconset/icon-76.png', width: 76, height: 76, purpose: 'iPad App' },
  { path: 'ios/AppIcon.appiconset/icon-76@2x.png', width: 152, height: 152, purpose: 'iPad App' },
  { path: 'ios/AppIcon.appiconset/icon-83.5@2x.png', width: 167, height: 167, purpose: 'iPad Pro App' },
  { path: 'ios/AppIcon.appiconset/icon-1024.png', width: 1024, height: 1024, purpose: 'App Store Marketing (Light)' },
  { path: 'ios/AppIcon.appiconset/icon-1024-dark.png', width: 1024, height: 1024, shape: 'dark', purpose: 'iOS 18 Dark Appearance' },
  { path: 'ios/AppIcon.appiconset/icon-1024-tinted.png', width: 1024, height: 1024, shape: 'tinted', purpose: 'iOS 18 Tinted Appearance' },
];

export function generateXcodeContentsJson(): string {
  const contents = {
    images: [
      { size: '20x20', idiom: 'iphone', filename: 'icon-20@2x.png', scale: '2x' },
      { size: '20x20', idiom: 'iphone', filename: 'icon-20@3x.png', scale: '3x' },
      { size: '29x29', idiom: 'iphone', filename: 'icon-29@2x.png', scale: '2x' },
      { size: '29x29', idiom: 'iphone', filename: 'icon-29@3x.png', scale: '3x' },
      { size: '40x40', idiom: 'iphone', filename: 'icon-40@2x.png', scale: '2x' },
      { size: '40x40', idiom: 'iphone', filename: 'icon-40@3x.png', scale: '3x' },
      { size: '60x60', idiom: 'iphone', filename: 'icon-60@2x.png', scale: '2x' },
      { size: '60x60', idiom: 'iphone', filename: 'icon-60@3x.png', scale: '3x' },
      { size: '20x20', idiom: 'ipad', filename: 'icon-20.png', scale: '1x' },
      { size: '20x20', idiom: 'ipad', filename: 'icon-20@2x.png', scale: '2x' },
      { size: '29x29', idiom: 'ipad', filename: 'icon-29.png', scale: '1x' },
      { size: '29x29', idiom: 'ipad', filename: 'icon-29@2x.png', scale: '2x' },
      { size: '40x40', idiom: 'ipad', filename: 'icon-40.png', scale: '1x' },
      { size: '40x40', idiom: 'ipad', filename: 'icon-40@2x.png', scale: '2x' },
      { size: '76x76', idiom: 'ipad', filename: 'icon-76.png', scale: '1x' },
      { size: '76x76', idiom: 'ipad', filename: 'icon-76@2x.png', scale: '2x' },
      { size: '83.5x83.5', idiom: 'ipad', filename: 'icon-83.5@2x.png', scale: '2x' },
      { size: '1024x1024', idiom: 'ios-marketing', filename: 'icon-1024.png', scale: '1x' },
      {
        size: '1024x1024',
        idiom: 'universal',
        platform: 'ios',
        appearances: [{ appearance: 'luminosity', value: 'dark' }],
        filename: 'icon-1024-dark.png',
        scale: '1x',
      },
      {
        size: '1024x1024',
        idiom: 'universal',
        platform: 'ios',
        appearances: [{ appearance: 'luminosity', value: 'tinted' }],
        filename: 'icon-1024-tinted.png',
        scale: '1x',
      },
    ],
    info: {
      version: 1,
      author: 'IconForge Studio',
    },
  };
  return JSON.stringify(contents, null, 2);
}

// Android Specs
export const ANDROID_FILE_SPECS: FileSpec[] = [
  // Standard square icons
  { path: 'android/res/mipmap-mdpi/ic_launcher.png', width: 48, height: 48 },
  { path: 'android/res/mipmap-hdpi/ic_launcher.png', width: 72, height: 72 },
  { path: 'android/res/mipmap-xhdpi/ic_launcher.png', width: 96, height: 96 },
  { path: 'android/res/mipmap-xxhdpi/ic_launcher.png', width: 144, height: 144 },
  { path: 'android/res/mipmap-xxxhdpi/ic_launcher.png', width: 192, height: 192 },
  // Round icons for circular launchers
  { path: 'android/res/mipmap-mdpi/ic_launcher_round.png', width: 48, height: 48, shape: 'round' },
  { path: 'android/res/mipmap-hdpi/ic_launcher_round.png', width: 72, height: 72, shape: 'round' },
  { path: 'android/res/mipmap-xhdpi/ic_launcher_round.png', width: 96, height: 96, shape: 'round' },
  { path: 'android/res/mipmap-xxhdpi/ic_launcher_round.png', width: 144, height: 144, shape: 'round' },
  { path: 'android/res/mipmap-xxxhdpi/ic_launcher_round.png', width: 192, height: 192, shape: 'round' },
  // Adaptive icon foregrounds (transparent centered asset)
  { path: 'android/res/drawable-nodpi/ic_launcher_foreground.png', width: 432, height: 432, shape: 'foreground' },
  { path: 'android/res/drawable-nodpi/ic_launcher_background.png', width: 432, height: 432, shape: 'background' },
  // Android 13+ (API 33+) Themed / Monochrome icon
  { path: 'android/res/drawable-nodpi/ic_launcher_monochrome.png', width: 432, height: 432, shape: 'monochrome', purpose: 'Themed Monochrome Icon' },
  // Notification icons
  { path: 'android/res/drawable-mdpi/ic_stat_notify.png', width: 24, height: 24 },
  { path: 'android/res/drawable-hdpi/ic_stat_notify.png', width: 36, height: 36 },
  { path: 'android/res/drawable-xhdpi/ic_stat_notify.png', width: 48, height: 48 },
  { path: 'android/res/drawable-xxhdpi/ic_stat_notify.png', width: 72, height: 72 },
  { path: 'android/res/drawable-xxxhdpi/ic_stat_notify.png', width: 96, height: 96 },
  // Google Play Store asset
  { path: 'android/playstore-512.png', width: 512, height: 512, purpose: 'Google Play Store 32-bit' },
];

export function generateAndroidAdaptiveXml(): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
    <monochrome android:drawable="@drawable/ic_launcher_monochrome" />
</adaptive-icon>
`;
}

// macOS Specs
export const MACOS_FILE_SPECS: FileSpec[] = [
  { path: 'macos/AppIcon.iconset/icon_16x16.png', width: 16, height: 16 },
  { path: 'macos/AppIcon.iconset/icon_16x16@2x.png', width: 32, height: 32 },
  { path: 'macos/AppIcon.iconset/icon_32x32.png', width: 32, height: 32 },
  { path: 'macos/AppIcon.iconset/icon_32x32@2x.png', width: 64, height: 64 },
  { path: 'macos/AppIcon.iconset/icon_128x128.png', width: 128, height: 128 },
  { path: 'macos/AppIcon.iconset/icon_128x128@2x.png', width: 256, height: 256 },
  { path: 'macos/AppIcon.iconset/icon_256x256.png', width: 256, height: 256 },
  { path: 'macos/AppIcon.iconset/icon_256x256@2x.png', width: 512, height: 512 },
  { path: 'macos/AppIcon.iconset/icon_512x512.png', width: 512, height: 512 },
  { path: 'macos/AppIcon.iconset/icon_512x512@2x.png', width: 1024, height: 1024 },
];

export function generateMacIcnsScript(): string {
  return `#!/bin/bash
# Convert AppIcon.iconset into macOS .icns file
iconutil -c icns AppIcon.iconset -o AppIcon.icns
echo "Created AppIcon.icns successfully!"
`;
}

// Web / PWA Specs
export const WEB_FILE_SPECS: FileSpec[] = [
  { path: 'web/favicon-16x16.png', width: 16, height: 16 },
  { path: 'web/favicon-32x32.png', width: 32, height: 32 },
  { path: 'web/apple-touch-icon.png', width: 180, height: 180 },
  { path: 'web/android-chrome-192x192.png', width: 192, height: 192 },
  { path: 'web/android-chrome-512x512.png', width: 512, height: 512 },
  { path: 'web/maskable-icon-512x512.png', width: 512, height: 512, shape: 'maskable', purpose: 'PWA Maskable Icon (80% Safe Zone)' },
  { path: 'web/mstile-150x150.png', width: 150, height: 150 },
];

export function generateWebManifest(appName: string = 'My Application'): string {
  const manifest = {
    name: appName,
    short_name: appName,
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    theme_color: '#0a0d14',
    background_color: '#0a0d14',
    display: 'standalone',
  };
  return JSON.stringify(manifest, null, 2);
}

export function generateBrowserConfigXml(): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/mstile-150x150.png"/>
            <TileColor>#0a0d14</TileColor>
        </tile>
    </msapplication>
</browserconfig>
`;
}

export function generateHtmlHeadSnippet(): string {
  return `<!-- Favicon and App Icon Meta Tags -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="msapplication-TileColor" content="#0a0d14" />
<meta name="msapplication-config" content="/browserconfig.xml" />
<meta name="theme-color" content="#0a0d14" />
`;
}

// Windows Specs
export const WINDOWS_FILE_SPECS: FileSpec[] = [
  { path: 'windows/tiles/Square44x44Logo.png', width: 44, height: 44 },
  { path: 'windows/tiles/Square71x71Logo.png', width: 71, height: 71 },
  { path: 'windows/tiles/Square150x150Logo.png', width: 150, height: 150 },
  { path: 'windows/tiles/Square310x310Logo.png', width: 310, height: 310 },
  { path: 'windows/tiles/Wide310x150Logo.png', width: 310, height: 150 },
  { path: 'windows/tiles/StoreLogo.png', width: 50, height: 50 },
];

// Linux Specs
export const LINUX_FILE_SPECS: FileSpec[] = [
  { path: 'linux/hicolor/16x16/apps/app-icon.png', width: 16, height: 16 },
  { path: 'linux/hicolor/24x24/apps/app-icon.png', width: 24, height: 24 },
  { path: 'linux/hicolor/32x32/apps/app-icon.png', width: 32, height: 32 },
  { path: 'linux/hicolor/48x48/apps/app-icon.png', width: 48, height: 48 },
  { path: 'linux/hicolor/64x64/apps/app-icon.png', width: 64, height: 64 },
  { path: 'linux/hicolor/128x128/apps/app-icon.png', width: 128, height: 128 },
  { path: 'linux/hicolor/256x256/apps/app-icon.png', width: 256, height: 256 },
  { path: 'linux/hicolor/512x512/apps/app-icon.png', width: 512, height: 512 },
];

export function generateLinuxDesktopFile(appName: string = 'MyApp'): string {
  return `[Desktop Entry]
Version=1.0
Type=Application
Name=${appName}
Comment=Launch ${appName}
Exec=${appName.toLowerCase()}
Icon=app-icon
Terminal=false
Categories=Utility;Application;
StartupNotify=true
`;
}

// Favicon Specs
export const FAVICON_FILE_SPECS: FileSpec[] = [
  { path: 'favicon/favicon-16x16.png', width: 16, height: 16 },
  { path: 'favicon/favicon-32x32.png', width: 32, height: 32 },
  { path: 'favicon/favicon-48x48.png', width: 48, height: 48 },
];

/**
 * Generates the root README.txt included in every ZIP package.
 */
export function generateRootReadme(appName: string, selectedPlatforms: PlatformId[]): string {
  const currentYear = new Date().getFullYear();
  const dateStr = new Date().toISOString().split('T')[0];

  const platformNames: Record<PlatformId, string> = {
    ios: 'iOS & iPadOS (AppIcon.appiconset with iOS 18 Light, Dark, and Tinted appearances)',
    android: 'Android (Adaptive Foregrounds, Monochrome Themed Icons, and Play Store 512×512)',
    macos: 'macOS (AppIcon.iconset up to 1024×1024 + convert_to_icns.sh)',
    web: 'Web & PWA (Favicons, Maskable 512×512, site.webmanifest, and HTML snippets)',
    windows: 'Windows (Multi-resolution app.ico 16–256px + Windows App SDK Tile assets)',
    linux: 'Linux (Hicolor icon theme hierarchy + app-icon.desktop launcher)',
    favicon: 'Favicon (.ico multi-res 16/32/48px and high-res PNG favicons)',
  };

  const platformsFormatted = selectedPlatforms
    .map((p) => `  • ${platformNames[p] || p}`)
    .join('\n');

  return `========================================================================
APP ICON BUNDLE — GENERATED WITH ICONFORGE
Website:   https://appicon.gerstudio.com/
Author:    Ger Studio (https://www.gerstudio.com/)
Created:   ${dateStr} (${currentYear})
App Name:  ${appName || 'AppIcon'}
========================================================================

Thank you for using IconForge by Ger Studio!
This icon bundle was generated 100% locally and privately inside your web browser.
Zero images or network requests were sent to any remote server.

Every PNG and ICO image in this package contains embedded metadata:
  • Software: IconForge by Ger Studio (https://appicon.gerstudio.com/)
  • Author:   Ger Studio (https://www.gerstudio.com/)
  • Website:  https://appicon.gerstudio.com/
  • Source:   https://appicon.gerstudio.com/

------------------------------------------------------------------------
TARGET PLATFORMS INCLUDED IN THIS PACKAGE:
------------------------------------------------------------------------
${platformsFormatted}

------------------------------------------------------------------------
QUICK INTEGRATION INSTRUCTIONS:
------------------------------------------------------------------------
• iOS / iPadOS:
  Copy the 'ios/AppIcon.appiconset' directory directly into your Xcode project's
  Assets.xcassets catalog.

• Android:
  Copy 'android/res/' into your Android project's 'app/src/main/res/' directory.
  For Google Play Store submission, use 'android/playstore-512.png'.

• macOS:
  Add 'macos/AppIcon.iconset' to your Xcode project, or run:
    sh macos/convert_to_icns.sh
  in Terminal on a Mac to compile a native AppIcon.icns file.

• Web & PWA:
  Place 'web/favicon.ico' and related web icons in your site's root or public
  directory, and paste the contents of 'web/html_snippet.html' into your <head>.

• Windows:
  Use 'windows/app.ico' as your Windows application executable icon.
  Use 'windows/tiles/' for Windows App SDK and Store manifests.

• Linux:
  Copy icons from 'linux/hicolor/' to '~/.local/share/icons/hicolor/'
  or '/usr/share/icons/hicolor/'.

• Favicons:
  Upload 'favicon/favicon.ico' to your website's root directory.

------------------------------------------------------------------------
COMMUNITY & DEVELOPER SUPPORT:
------------------------------------------------------------------------
• Web App:         https://appicon.gerstudio.com/
• Ger Studio:      https://www.gerstudio.com/
• GitHub Repo:     https://github.com/dcryptoniun/AppIconGen
• Report an Issue: https://github.com/dcryptoniun/AppIconGen/issues
• GitHub Sponsor:  https://github.com/sponsors/dcryptoniun
• Buy Me a Coffee: https://buymeacoffee.com/mayankmeena

========================================================================
IconForge is free & open-source software licensed under MIT.
Made with ❤️ by Mayank Meena (Ger Studio)
`;
}
