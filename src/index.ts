import ExpoTextExtractorModule from './ExpoTextExtractorModule';

// Export all types from types.ts
export * from './types';

// Import and re-export specific types from the module for use in function signatures
import type { TextBoundingBox, RecognizedText } from './ExpoTextExtractorModule';
export type { TextBoundingBox, RecognizedText };

/**
 * A boolean value that indicates whether the text extraction module is supported on the current device.
 *
 * @example
 * if (isSupported) {
 *   console.log('Text extraction is supported on this device.');
 * } else {
 *   console.log('Text extraction is not supported on this device.');
 * }
 */
export const isSupported = ExpoTextExtractorModule.isSupported;

/**
 * Extracts text from an image.
 *
 * @param {string} uri - The URI of the image to extract text from.
 * @returns {Promise<string[]>} A promise that fulfills with an array of recognized texts.
 */
export async function extractTextFromImage(uri: string): Promise<string[]> {
  const processedUri = uri.replace('file://', '');

  return ExpoTextExtractorModule.extractTextFromImage(processedUri);
}

/**
 * Extracts text from base64 encoded image data.
 *
 * @param {string} base64Data - The base64 encoded image data (without data URI prefix).
 * @returns {Promise<string[]>} A promise that fulfills with an array of recognized texts.
 *
 * @example
 * // From expo-camera
 * const photo = await camera.takePictureAsync({ base64: true });
 * const texts = await extractTextFromImageData(photo.base64);
 *
 * // From data URI
 * const dataUri = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...";
 * const base64 = dataUri.split(',')[1];
 * const texts = await extractTextFromImageData(base64);
 */
export async function extractTextFromImageData(base64Data: string): Promise<string[]> {
  return ExpoTextExtractorModule.extractTextFromImageData(base64Data);
}

/**
 * Extracts text from an image with detailed information including confidence scores and bounding boxes.
 *
 * @param {string} uri - The URI of the image to extract text from.
 * @returns {Promise<RecognizedText[]>} A promise that fulfills with an array of recognized texts with details.
 *
 * @example
 * const results = await extractTextFromImageWithDetails(imageUri);
 * results.forEach(result => {
 *   console.log(`Text: ${result.text}`);
 *   console.log(`Confidence: ${result.confidence}`);
 *   console.log(`Position: (${result.boundingBox.x}, ${result.boundingBox.y})`);
 * });
 */
export async function extractTextFromImageWithDetails(
  uri: string,
): Promise<RecognizedText[]> {
  const processedUri = uri.replace('file://', '');
  return ExpoTextExtractorModule.extractTextFromImageWithDetails(processedUri);
}

/**
 * Extracts text from base64 image data with detailed information including confidence scores and bounding boxes.
 *
 * @param {string} base64Data - The base64 encoded image data.
 * @returns {Promise<RecognizedText[]>} A promise that fulfills with an array of recognized texts with details.
 *
 * @example
 * const photo = await camera.takePictureAsync({ base64: true });
 * const results = await extractTextFromImageDataWithDetails(photo.base64);
 * results.forEach(result => {
 *   console.log(`Text: ${result.text}`);
 *   console.log(`Confidence: ${result.confidence}`);
 *   console.log(`Bounding box: ${JSON.stringify(result.boundingBox)}`);
 * });
 */
export async function extractTextFromImageDataWithDetails(
  base64Data: string,
): Promise<RecognizedText[]> {
  return ExpoTextExtractorModule.extractTextFromImageDataWithDetails(base64Data);
}
