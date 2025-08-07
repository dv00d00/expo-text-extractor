/**
 * Unified OCR Surface API
 * Platform-agnostic types that work across iOS Vision and Android ML Kit
 */

import { IOSVisionResult, VNTextObservation, VNRecognizedText } from './types.ios';
import { MLKitTextResult, MLKitTextBlock, MLKitTextLine, MLKitTextElement } from './types.android';

// ============================================================================
// Unified Basic Types
// ============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

/**
 * Unified bounding box (always in pixel coordinates)
 */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Optional corner points for rotated text */
  cornerPoints?: Point[];
  /** Rotation angle in degrees */
  angle?: number;
}

// ============================================================================
// Unified Text Recognition Types
// ============================================================================

/**
 * Unified confidence levels
 */
export enum ConfidenceLevel {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high'
}

/**
 * Language detection result
 */
export interface DetectedLanguage {
  /** ISO 639-1 language code */
  code: string;
  /** Human-readable name */
  name?: string;
  /** Confidence (0.0 - 1.0) */
  confidence: number;
}

/**
 * Text orientation and direction
 */
export interface TextOrientation {
  /** Rotation angle in degrees */
  angle: number;
  /** Writing direction */
  direction: 'ltr' | 'rtl' | 'ttb' | 'btt';
}

/**
 * Text style information
 */
export interface TextStyle {
  fontSize?: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderlined?: boolean;
  fontFamily?: string;
}

/**
 * Character-level recognition result
 */
export interface RecognizedCharacter {
  character: string;
  confidence: number;
  boundingBox: BoundingBox;
  alternatives?: string[];
}

/**
 * Word-level recognition result
 */
export interface RecognizedWord {
  text: string;
  confidence: number;
  boundingBox: BoundingBox;
  characters?: RecognizedCharacter[];
  alternatives?: string[];
  language?: DetectedLanguage;
  style?: TextStyle;
}

/**
 * Line-level recognition result
 */
export interface RecognizedLine {
  text: string;
  confidence: number;
  boundingBox: BoundingBox;
  words: RecognizedWord[];
  orientation?: TextOrientation;
  language?: DetectedLanguage;
  baseline?: Point[];
}

/**
 * Block/paragraph-level recognition result
 */
export interface RecognizedTextBlock {
  text: string;
  confidence: number;
  boundingBox: BoundingBox;
  lines: RecognizedLine[];
  blockType?: 'paragraph' | 'heading' | 'caption' | 'table' | 'list' | 'other';
  languages?: DetectedLanguage[];
  orientation?: TextOrientation;
  readingOrder?: number;
}

/**
 * Complete unified OCR result
 */
export interface OCRResult {
  /** All text blocks found */
  textBlocks: RecognizedTextBlock[];
  /** Overall confidence */
  confidence: number;
  /** Processing time in milliseconds */
  processingTime: number;
  /** Detected languages */
  languages?: DetectedLanguage[];
  /** Original image dimensions */
  imageSize: Size;
  /** Platform-specific metadata */
  platformMetadata: {
    platform: 'ios' | 'android';
    /** Raw platform result for advanced usage */
    rawResult: IOSVisionResult | MLKitTextResult;
  };
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Unified OCR options
 */
export interface OCROptions {
  /** Preferred languages */
  languages?: string[];
  /** Recognition accuracy vs speed */
  recognitionLevel?: 'fast' | 'accurate';
  /** Minimum confidence threshold */
  minConfidence?: number;
  /** Whether to use language correction */
  useLanguageCorrection?: boolean;
  /** Custom vocabulary */
  customWords?: string[];
  /** Include character-level results */
  includeCharacters?: boolean;
  /** Include word-level results */
  includeWords?: boolean;
  /** Detect text orientation */
  detectOrientation?: boolean;
  /** Detect text style */
  detectStyle?: boolean;
  /** Maximum processing time */
  timeout?: number;
  /** Platform-specific options */
  platformOptions?: {
    ios?: {
      minimumTextHeight?: number;
      automaticallyDetectsLanguage?: boolean;
    };
    android?: {
      enableTextStructure?: boolean;
      enableImageEnhancement?: boolean;
      processingMode?: 'on-device' | 'cloud';
    };
  };
}

// ============================================================================
// Error Handling
// ============================================================================

export enum OCRErrorCode {
  INVALID_IMAGE = 'INVALID_IMAGE',
  INVALID_BASE64 = 'INVALID_BASE64', 
  PROCESSING_FAILED = 'PROCESSING_FAILED',
  TIMEOUT = 'TIMEOUT',
  UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  MODEL_NOT_AVAILABLE = 'MODEL_NOT_AVAILABLE',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface OCRError {
  code: OCRErrorCode;
  message: string;
  platformError?: any;
}

// ============================================================================
// Progress and Callbacks
// ============================================================================

export interface OCRProgress {
  progress: number; // 0.0 - 1.0
  stage: 'loading' | 'preprocessing' | 'recognition' | 'postprocessing' | 'complete';
  estimatedTimeRemaining?: number;
}

export type OCRProgressCallback = (progress: OCRProgress) => void;

// ============================================================================
// Image Source Types
// ============================================================================

export type ImageSource = 
  | string // file path or URL
  | { uri: string }
  | { base64: string }
  | { buffer: ArrayBuffer };

// ============================================================================
// Advanced Features (Future)
// ============================================================================

export interface TableDetectionResult {
  boundingBox: BoundingBox;
  rows: RecognizedLine[][];
  columnCount: number;
  rowCount: number;
  confidence: number;
}

export interface FormFieldResult {
  label?: RecognizedWord;
  value?: RecognizedWord;
  fieldType: 'text' | 'checkbox' | 'radio' | 'signature' | 'date' | 'number';
  boundingBox: BoundingBox;
  isFilled?: boolean;
  confidence: number;
}

export interface DocumentStructure {
  title?: RecognizedTextBlock;
  headings: RecognizedTextBlock[];
  paragraphs: RecognizedTextBlock[];
  tables: TableDetectionResult[];
  formFields: FormFieldResult[];
  readingOrder: number[];
}

// ============================================================================
// Platform Converters (for internal use)
// ============================================================================

/**
 * Internal converter functions to transform platform-specific results
 * to unified format
 */
export interface PlatformConverters {
  /** Convert iOS Vision result to unified format */
  fromIOSVision: (result: IOSVisionResult, imageSize: Size) => OCRResult;
  
  /** Convert Android ML Kit result to unified format */
  fromAndroidMLKit: (result: MLKitTextResult) => OCRResult;
  
  /** Convert unified options to iOS-specific options */
  toIOSOptions: (options: OCROptions) => any;
  
  /** Convert unified options to Android-specific options */
  toAndroidOptions: (options: OCROptions) => any;
}

// ============================================================================
// Legacy Support (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use RecognizedTextBlock instead
 */
export interface LegacyRecognizedText {
  text: string;
  confidence: number;
  boundingBox: BoundingBox;
}

/**
 * @deprecated Use OCRResult instead
 */
export interface LegacyOCRResult {
  text: string;
  confidence: number;
  boundingBox: BoundingBox;
}
