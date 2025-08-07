/**
 * Android ML Kit OCR Types
 * Based on Google's ML Kit Text Recognition API
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
 * Android uses pixel coordinates
 * Origin is top-left corner
 */
export interface Rect {
  left: number;   // pixels
  top: number;    // pixels
  right: number;  // pixels
  bottom: number; // pixels
}

// Alternative rect format that's more common
export interface BoundingRect {
  x: number;      // pixels
  y: number;      // pixels
  width: number;  // pixels
  height: number; // pixels
}

// ============================================================================
// Android ML Kit Native Types
// ============================================================================

/**
 * Text.Element equivalent
 * Represents a word or sequence of characters
 */
export interface MLKitTextElement {
  /** The recognized text content */
  text: string;
  
  /** Confidence score (0.0 - 1.0) */
  confidence: number;
  
  /** Bounding rectangle in pixel coordinates */
  boundingBox: Rect;
  
  /** Four corner points of the element (may be rotated) */
  cornerPoints: Point[];
  
  /** Detected language code (ISO 639-1) */
  recognizedLanguage?: string;
  
  /** Text rotation angle in degrees */
  angle: number;
  
  /** Whether this element is considered a word break */
  isWordBreak?: boolean;
  
  /** Font size estimation in pixels */
  fontSize?: number;
  
  /** Text style properties */
  isBold?: boolean;
  isItalic?: boolean;
  isUnderlined?: boolean;
  isStrikethrough?: boolean;
}

/**
 * Text.Line equivalent
 * Represents a line of text containing multiple elements
 */
export interface MLKitTextLine {
  /** The complete line text */
  text: string;
  
  /** Overall confidence for the line */
  confidence: number;
  
  /** Bounding rectangle of the entire line */
  boundingBox: Rect;
  
  /** Corner points of the line */
  cornerPoints: Point[];
  
  /** Individual elements (words) in this line */
  elements: MLKitTextElement[];
  
  /** Detected language for this line */
  recognizedLanguage?: string;
  
  /** Line rotation angle in degrees */
  angle: number;
  
  /** Baseline points (if available) */
  baseline?: Point[];
  
  /** Line spacing information */
  lineHeight?: number;
  
  /** Text direction */
  direction?: 'ltr' | 'rtl';
}

/**
 * Text.TextBlock equivalent
 * Represents a block of text (paragraph) containing multiple lines
 */
export interface MLKitTextBlock {
  /** The complete block text */
  text: string;
  
  /** Overall confidence for the block */
  confidence: number;
  
  /** Bounding rectangle of the entire block */
  boundingBox: Rect;
  
  /** Corner points of the block */
  cornerPoints: Point[];
  
  /** Lines contained in this block */
  lines: MLKitTextLine[];
  
  /** Detected language for this block */
  recognizedLanguage?: string;
  
  /** Block classification */
  blockType?: 'paragraph' | 'heading' | 'caption' | 'footer' | 'other';
  
  /** Text flow direction */
  direction?: 'ltr' | 'rtl' | 'ttb';
  
  /** Whether this appears to be a heading */
  isHeading?: boolean;
  
  /** Estimated reading order */
  readingOrder?: number;
}

/**
 * Text (FirebaseVisionText) equivalent
 * The complete OCR result containing all detected text
 */
export interface MLKitTextResult {
  /** The complete recognized text from the image */
  text: string;
  
  /** All text blocks found in the image */
  textBlocks: MLKitTextBlock[];
  
  /** Processing metadata */
  metadata: {
    /** Time taken for processing in milliseconds */
    processingTime: number;
    
    /** Original image dimensions */
    imageSize: Size;
    
    /** ML Kit model version */
    modelVersion?: string;
    
    /** Whether on-device or cloud processing was used */
    processingMode: 'on-device' | 'cloud';
  };
  
  /** Overall document confidence */
  confidence: number;
  
  /** Error information if processing failed */
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * TextRecognizer configuration options
 */
export interface MLKitTextRecognizerOptions {
  /** Recognition mode */
  mode: 'on-device' | 'cloud';
  
  /** Language hints for better recognition */
  languageHints?: string[]; // ISO 639-1 codes
  
  /** Enable text structure detection */
  enableTextStructure?: boolean;
  
  /** Minimum confidence threshold */
  minConfidence?: number;
  
  /** Maximum processing time in milliseconds */
  timeout?: number;
  
  /** Whether to enable automatic language detection */
  autoDetectLanguage?: boolean;
}

/**
 * Cloud-specific options (when using cloud API)
 */
export interface MLKitCloudOptions extends MLKitTextRecognizerOptions {
  mode: 'cloud';
  
  /** API key for cloud processing */
  apiKey?: string;
  
  /** Enable advanced OCR features */
  enableAdvancedOCR?: boolean;
  
  /** Enable handwriting recognition */
  enableHandwritingRecognition?: boolean;
  
  /** Dense text detection */
  enableDenseText?: boolean;
  
  /** Image enhancement before processing */
  enableImageEnhancement?: boolean;
}

/**
 * Document scanner specific types
 */
export interface MLKitDocumentScanResult {
  /** Scanned pages */
  pages: {
    /** Page image data */
    imageData: string; // base64 or file path
    
    /** OCR results for this page */
    textResult: MLKitTextResult;
    
    /** Page quality score */
    quality: number;
    
    /** Detected page boundaries */
    pageBounds?: Point[];
  }[];
  
  /** Overall scan quality */
  overallQuality: number;
  
  /** Scan session metadata */
  sessionMetadata: {
    scanTime: number;
    deviceInfo: string;
    lightingConditions?: 'good' | 'poor' | 'low';
  };
}

/**
 * Advanced ML Kit features
 */
export interface MLKitAdvancedFeatures {
  /** Form detection */
  formDetection?: {
    fields: {
      label?: MLKitTextElement;
      value?: MLKitTextElement;
      fieldType: 'text' | 'checkbox' | 'signature' | 'date';
      confidence: number;
    }[];
  };
  
  /** Table detection */
  tableDetection?: {
    tables: {
      boundingBox: Rect;
      rows: MLKitTextLine[][];
      columnCount: number;
      rowCount: number;
      confidence: number;
    }[];
  };
  
  /** Barcode/QR code detection (if enabled) */
  barcodeDetection?: {
    barcodes: {
      rawValue: string;
      format: string;
      boundingBox: Rect;
      cornerPoints: Point[];
    }[];
  };
  
  /** Face detection (if enabled alongside text) */
  faceDetection?: {
    faces: {
      boundingBox: Rect;
      landmarks?: Point[];
      confidence: number;
    }[];
  };
}

// ============================================================================
// Error Types
// ============================================================================

export enum MLKitErrorCode {
  UNKNOWN = 0,
  INVALID_ARGUMENT = 3,
  DEADLINE_EXCEEDED = 4,
  NOT_FOUND = 5,
  ALREADY_EXISTS = 6,
  PERMISSION_DENIED = 7,
  RESOURCE_EXHAUSTED = 8,
  FAILED_PRECONDITION = 9,
  ABORTED = 10,
  OUT_OF_RANGE = 11,
  UNIMPLEMENTED = 12,
  INTERNAL = 13,
  UNAVAILABLE = 14,
  DATA_LOSS = 15,
  UNAUTHENTICATED = 16,
  MODEL_NOT_DOWNLOADED = 17,
  NETWORK_ISSUE = 18
}

export interface MLKitError {
  code: MLKitErrorCode;
  message: string;
  details?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Coordinate conversion utilities
 */
export interface AndroidCoordinateUtils {
  /** Convert Rect to BoundingRect format */
  rectToBoundingRect: (rect: Rect) => BoundingRect;
  
  /** Convert BoundingRect to Rect format */
  boundingRectToRect: (boundingRect: BoundingRect) => Rect;
  
  /** Calculate area of a rectangle */
  calculateArea: (rect: Rect | BoundingRect) => number;
  
  /** Check if two rectangles overlap */
  isOverlapping: (rect1: Rect, rect2: Rect) => boolean;
  
  /** Merge overlapping rectangles */
  mergeRects: (rects: Rect[]) => Rect[];
}
