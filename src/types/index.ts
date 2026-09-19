export type PlatformId = 'ios' | 'android' | 'macos' | 'web' | 'windows' | 'linux' | 'favicon';

export type MaskShape = 'squircle' | 'circle' | 'rounded' | 'square';

export type BackgroundMode = 'transparent' | 'color' | 'gradient';

export interface IconPreset {
  id: string;
  name: string;
  category: string;
  svgDataUri: string;
}

export interface PlatformItemSpec {
  name: string;
  width: number;
  height: number;
  folder: string;
  purpose?: string;
  scale?: number;
  idiom?: string;
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  description: string;
  iconName: string;
  fileCount: number;
  highlightSpecs: string[];
  enabled: boolean;
  directoryPreview: string;
}

export interface ResizeOptions {
  padding: number; // 0 to 40% inset
  backgroundColor: string; // hex or 'transparent'
  backgroundMode: BackgroundMode;
  gradientStart?: string;
  gradientEnd?: string;
  gradientAngle?: number; // in degrees
  cornerRadius: number; // 0 to 50%
  autoTrimWhitespace?: boolean;
}

export interface SourceImageMeta {
  file: File | null;
  name: string;
  width: number;
  height: number;
  dataUrl: string;
  sizeBytes: number;
  format: string;
}

export interface GenerationProgress {
  isGenerating: boolean;
  progressPercent: number;
  currentTask: string;
  totalFiles: number;
  completedFiles: number;
  downloadUrl: string | null;
  zipFileName: string | null;
  zipSize: number | null;
  error: string | null;
}

export interface IndividualAssetExport {
  id: string;
  label: string;
  platform: PlatformId;
  width: number;
  height: number;
  extension: 'png' | 'ico' | 'svg';
  description: string;
}
