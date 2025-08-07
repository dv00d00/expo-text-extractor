/**
 * OCR Types for Expo Text Extractor Module
 * Platform-specific implementations and unified surface API
 */

// ============================================================================
// Basic Geometric Types
// ============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============================================================================
// iOS Vision Framework Native Types
// ============================================================================

/**
 * iOS Vision framework VNRecognizedText equivalent
 */
export interface IOSRecognizedText {
  /** The recognized string */
  string: string;
  /** Confidence level (VNConfidenceLevel: .notSet, .low, .medium, .high) */
  confidence: number;
  /** Bounding box in normalized coordinates (0.0 - 1.0) */
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Corner points of the text region */
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;
  /** Character-level bounding boxes (if available) */
  characterBoxes?: Rect[];
}

/**
 * iOS Vision framework VNTextObservation equivalent
 */
export interface IOSTextObservation {
  /** Unique identifier for the observation */
  uuid: string;
  /** Confidence score (0.0 - 1.0) */
  confidence: number;
  /** Bounding box in normalized coordinates */
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Corner points */
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;
  /** Recognized text candidates */
  topCandidates: IOSRecognizedText[];
}

/**
 * iOS Vision framework complete result
 */
export interface IOSVisionResult {
  /** Array of text observations */
  observations: IOSTextObservation[];
  /** Processing time */
  processingTime: number;
  /** Image size that was processed */
  imageSize: Size;
}

// ============================================================================
// Android ML Kit Native Types
// ============================================================================

/**
 * Android ML Kit Text.Element equivalent
 */
export interface AndroidTextElement {
  /** The recognized text */
  text: string;
  /** Confidence score (0.0 - 1.0) */
  confidence: number;
  /** Bounding box in pixel coordinates */
  boundingBox: Rect;
  /** Corner points */
  cornerPoints: Point[];
  /** Recognized language */
  recognizedLanguage?: string;
  /** Text angle */
  angle?: number;
}

/**
 * Android ML Kit Text.Line equivalent
 */
export interface AndroidTextLine {
  /** The line text */
  text: string;
  /** Confidence score */
  confidence: number;
  /** Bounding box */
  boundingBox: Rect;
  /** Corner points */
  cornerPoints: Point[];
  /** Elements (words) in this line */
  elements: AndroidTextElement[];
  /** Recognized language */
  recognizedLanguage?: string;
  /** Text angle */
  angle?: number;
}

/**
 * Android ML Kit Text.TextBlock equivalent
 */
export interface AndroidTextBlock {
  /** The block text */
  text: string;
  /** Confidence score */
  confidence: number;
  /** Bounding box */
  boundingBox: Rect;
  /** Corner points */
  cornerPoints: Point[];
  /** Lines in this block */
  lines: AndroidTextLine[];
  /** Recognized language */
  recognizedLanguage?: string;
}

/**
 * Android ML Kit Text (FirebaseVisionText) equivalent
 */
export interface AndroidMLKitResult {
  /** The full text found */
  text: string;
  /** Text blocks */
  textBlocks: AndroidTextBlock[];
  /** Processing time */
  processingTime: number;
  /** Image size */
  imageSize: Size;
}

// ============================================================================
// Text Recognition Result Types
// ============================================================================

/**
 * Text bounding box with optional corner points
 * Coordinates are in image pixel space
 */
export interface TextBoundingBox extends Rect {
  /** Optional corner points for more precise boundaries (iOS Vision can provide this) */
  cornerPoints?: Point[];
  /** Rotation angle of the text in radians */
  angle?: number;
}

/**
 * Recognition confidence levels
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
  /** ISO 639-1 language code (e.g., 'en', 'es', 'fr') */
  code: string;
  /** Human readable language name */
  name?: string;
  /** Confidence score for this language detection (0.0 - 1.0) */
  confidence: number;
}

/**
 * Text orientation information
 */
export interface TextOrientation {
  /** Rotation angle in degrees */
  angle: number;
  /** Whether text is upside down */
  isUpsideDown: boolean;
  /** Writing direction */
  direction: 'ltr' | 'rtl' | 'ttb' | 'btt';
}

/**
 * Font and style information
 */
export interface TextStyle {
  /** Estimated font size in points */
  fontSize?: number;
  /** Whether text appears to be bold */
  isBold?: boolean;
  /** Whether text appears to be italic */
  isItalic?: boolean;
  /** Whether text appears to be underlined */
  isUnderlined?: boolean;
  /** Estimated font family name */
  fontFamily?: string;
}

/**
 * Individual character recognition result
 */
export interface RecognizedCharacter {
  /** The recognized character */
  character: string;
  /** Confidence score (0.0 - 1.0) */
  confidence: number;
  /** Bounding box of the character */
  boundingBox: TextBoundingBox;
  /** Alternative character candidates */
  alternatives?: string[];
}

/**
 * Word-level recognition result
 */
export interface RecognizedWord {
  /** The recognized word text */
  text: string;
  /** Confidence score (0.0 - 1.0) */
  confidence: number;
  /** Bounding box of the word */
  boundingBox: TextBoundingBox;
  /** Individual characters in the word */
  characters?: RecognizedCharacter[];
  /** Alternative word candidates */
  alternatives?: string[];
  /** Detected language for this word */
  language?: DetectedLanguage;
  /** Text style information */
  style?: TextStyle;
}

/**
 * Line-level recognition result
 */
export interface RecognizedLine {
  /** The recognized line text */
  text: string;
  /** Overall confidence score (0.0 - 1.0) */
  confidence: number;
  /** Bounding box of the entire line */
  boundingBox: TextBoundingBox;
  /** Words in this line */
  words: RecognizedWord[];
  /** Text orientation information */
  orientation?: TextOrientation;
  /** Detected language for this line */
  language?: DetectedLanguage;
  /** Line baseline information */
  baseline?: Point[];
}

/**
 * Paragraph/Block-level recognition result
 */
export interface RecognizedTextBlock {
  /** The recognized block text */
  text: string;
  /** Overall confidence score (0.0 - 1.0) */
  confidence: number;
  /** Bounding box of the entire block */
  boundingBox: TextBoundingBox;
  /** Lines in this block */
  lines: RecognizedLine[];
  /** Block type classification */
  blockType?: 'paragraph' | 'heading' | 'caption' | 'table' | 'list' | 'other';
  /** Detected languages in this block */
  languages?: DetectedLanguage[];
  /** Text orientation for the block */
  orientation?: TextOrientation;
}

/**
 * Complete OCR document result
 */
export interface OCRResult {
  /** All recognized text blocks */
  textBlocks: RecognizedTextBlock[];
  /** Overall document confidence */
  confidence: number;
  /** Total processing time in milliseconds */
  processingTime?: number;
  /** Detected languages in the document */
  languages?: DetectedLanguage[];
  /** Image dimensions that were processed */
  imageSize: Size;
  /** Whether the image was rotated during processing */
  imageRotation?: number;
}

// ============================================================================
// Legacy Support Types (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use TextBoundingBox instead
 */
export interface BoundingBox extends Rect {}

/**
 * @deprecated Use RecognizedWord or RecognizedLine instead
 */
export interface RecognizedText {
  text: string;
  confidence: number;
  boundingBox: TextBoundingBox;
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * OCR processing options
 */
export interface OCROptions {
  /** Preferred recognition languages (ISO 639-1 codes) */
  languages?: string[];
  /** Minimum confidence threshold (0.0 - 1.0) */
  minConfidence?: number;
  /** Whether to return character-level results */
  includeCharacters?: boolean;
  /** Whether to return word-level results */
  includeWords?: boolean;
  /** Whether to return line-level results */
  includeLines?: boolean;
  /** Whether to detect text orientation */
  detectOrientation?: boolean;
  /** Whether to detect text style information */
  detectStyle?: boolean;
  /** Maximum processing time in milliseconds */
  timeout?: number;
}

/**
 * Error types that can occur during OCR processing
 */
export enum OCRErrorCode {
  INVALID_IMAGE = 'INVALID_IMAGE',
  INVALID_BASE64 = 'INVALID_BASE64',
  PROCESSING_FAILED = 'PROCESSING_FAILED',
  TIMEOUT = 'TIMEOUT',
  UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * OCR processing error
 */
export interface OCRError {
  code: OCRErrorCode;
  message: string;
  details?: any;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Progress callback for long-running OCR operations
 */
export interface OCRProgress {
  /** Progress percentage (0.0 - 1.0) */
  progress: number;
  /** Current processing stage */
  stage: 'loading' | 'preprocessing' | 'recognition' | 'postprocessing' | 'complete';
  /** Estimated time remaining in milliseconds */
  estimatedTimeRemaining?: number;
}

/**
 * Callback function type for progress updates
 */
export type OCRProgressCallback = (progress: OCRProgress) => void;

/**
 * Image source types
 */
export type ImageSource = string | { uri: string } | { base64: string };

// ============================================================================
// Advanced OCR Features (for future implementation)
// ============================================================================

/**
 * Table detection result
 */
export interface DetectedTable {
  /** Table bounding box */
  boundingBox: TextBoundingBox;
  /** Table rows */
  rows: RecognizedLine[][];
  /** Number of columns */
  columnCount: number;
  /** Number of rows */
  rowCount: number;
}

/**
 * Form field detection result
 */
export interface DetectedFormField {
  /** Field label */
  label?: string;
  /** Field value */
  value?: string;
  /** Field type */
  type: 'text' | 'checkbox' | 'radio' | 'signature' | 'date' | 'number';
  /** Field bounding box */
  boundingBox: TextBoundingBox;
  /** Whether the field is filled */
  isFilled?: boolean;
}

/**
 * Document structure analysis
 */
export interface DocumentStructure {
  /** Detected title */
  title?: RecognizedTextBlock;
  /** Detected headings */
  headings: RecognizedTextBlock[];
  /** Detected paragraphs */
  paragraphs: RecognizedTextBlock[];
  /** Detected tables */
  tables: DetectedTable[];
  /** Detected form fields */
  formFields: DetectedFormField[];
  /** Reading order of text blocks */
  readingOrder: number[];
}
