/**
 * iOS Vision Framework OCR Types
 * Based on Apple's Vision framework VNRecognizeTextRequest and related classes
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

/**
 * iOS Vision uses normalized coordinates (0.0 - 1.0)
 * Origin is bottom-left corner
 */
export interface VNRect {
  x: number; // 0.0 - 1.0
  y: number; // 0.0 - 1.0
  width: number; // 0.0 - 1.0
  height: number; // 0.0 - 1.0
}

// ============================================================================
// iOS Vision Framework Native Types
// ============================================================================

/**
 * VNConfidenceLevel enum equivalent
 */
export enum VNConfidenceLevel {
  notSet = 0,
  low = 1,
  medium = 2,
  high = 3
}

/**
 * VNRecognizedText equivalent
 * Represents a single piece of recognized text with confidence and location
 */
export interface VNRecognizedText {
  /** The recognized string */
  string: string;
  
  /** Confidence level as enum */
  confidenceLevel: VNConfidenceLevel;
  
  /** Numeric confidence score (0.0 - 1.0) */
  confidence: number;
  
  /** Bounding box in normalized coordinates */
  boundingBox: VNRect;
  
  /** All four corner points of the text region */
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;
  
  /** Character-level bounding boxes (available via characterBoxes method) */
  characterBoxes?: VNRect[];
  
  /** Range of characters this observation covers in the full string */
  range?: {
    location: number;
    length: number;
  };
}

/**
 * VNTextObservation equivalent
 * Contains multiple text recognition candidates for a detected text region
 */
export interface VNTextObservation {
  /** Unique identifier for the observation */
  uuid: string;
  
  /** Overall confidence for this text region */
  confidence: number;
  
  /** Bounding box of the entire text observation */
  boundingBox: VNRect;
  
  /** Corner points of the observation region */
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;
  
  /** Top N recognition candidates, ordered by confidence */
  topCandidates: VNRecognizedText[];
  
  /** Maximum number of candidates requested */
  maximumCandidates: number;
  
  /** Whether this observation represents a complete word/line/block */
  completeness?: 'character' | 'word' | 'line' | 'block';
}

/**
 * VNRecognizeTextRequest configuration equivalent
 */
export interface VNRecognizeTextRequestOptions {
  /** Recognition level: fast vs accurate */
  recognitionLevel: 'fast' | 'accurate';
  
  /** Preferred languages (ISO 639-1 codes) */
  recognitionLanguages?: string[];
  
  /** Whether to use language correction */
  usesLanguageCorrection: boolean;
  
  /** Custom words to help recognition */
  customWords?: string[];
  
  /** Minimum text height as fraction of image height */
  minimumTextHeight?: number;
  
  /** Whether to automatically detect language */
  automaticallyDetectsLanguage: boolean;
}

/**
 * Complete iOS Vision OCR result
 */
export interface IOSVisionResult {
  /** Array of text observations found in the image */
  observations: VNTextObservation[];
  
  /** Processing time in milliseconds */
  processingTime: number;
  
  /** Original image dimensions */
  imageSize: Size;
  
  /** Request options used */
  requestOptions: VNRecognizeTextRequestOptions;
  
  /** Error if processing failed */
  error?: {
    code: number;
    localizedDescription: string;
    domain: string;
  };
  
  /** iOS version and Vision framework version */
  systemInfo?: {
    iosVersion: string;
    visionVersion: string;
  };
}

/**
 * Document camera specific types (if using VNDocumentCameraViewController)
 */
export interface VNDocumentCameraScan {
  /** Number of pages scanned */
  pageCount: number;
  
  /** Individual page results */
  pages: {
    /** Page image */
    image: string; // base64 or file path
    
    /** OCR results for this page */
    textObservations: VNTextObservation[];
    
    /** Page title if detected */
    title?: string;
  }[];
}

/**
 * Advanced iOS Vision features
 */
export interface IOSAdvancedFeatures {
  /** Text skew detection */
  textSkew?: {
    angle: number; // in radians
    confidence: number;
  };
  
  /** Language detection per observation */
  languageDetection?: {
    [observationId: string]: {
      language: string; // ISO 639-1
      confidence: number;
    };
  };
  
  /** Reading order analysis */
  readingOrder?: {
    observations: string[]; // observation IDs in reading order
    confidence: number;
  };
}

// ============================================================================
// Utility Functions Types
// ============================================================================

/**
 * Coordinate conversion utilities
 */
export interface IOSCoordinateUtils {
  /** Convert Vision normalized coordinates to pixel coordinates */
  normalizedToPixel: (normalized: VNRect, imageSize: Size) => {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  
  /** Convert pixel coordinates to Vision normalized coordinates */
  pixelToNormalized: (pixel: { x: number; y: number; width: number; height: number }, imageSize: Size) => VNRect;
  
  /** Flip Y coordinate (Vision uses bottom-left origin) */
  flipYCoordinate: (point: Point, imageHeight: number) => Point;
}
