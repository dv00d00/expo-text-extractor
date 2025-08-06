import { requireNativeModule } from 'expo-modules-core';

export interface TextBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RecognizedText {
  text: string;
  confidence: number;
  boundingBox: TextBoundingBox;
}

interface ExpoTextExtractorModule {
  isSupported: boolean;
  extractTextFromImage: (uri: string) => Promise<string[]>;
  extractTextFromImageData: (base64Data: string) => Promise<string[]>;
  extractTextFromImageWithDetails: (uri: string) => Promise<RecognizedText[]>;
  extractTextFromImageDataWithDetails: (base64Data: string) => Promise<RecognizedText[]>;
}

export default requireNativeModule<ExpoTextExtractorModule>('ExpoTextExtractor');
