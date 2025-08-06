# Expo Text Extractor

Expo Text Extractor is a library that enables text recognition (OCR) using Google ML Kit on Android and Apple Vision on iOS.

### Platform Compatibility

| Android Device | Android Emulator | iOS Device | iOS Simulator | Web |
| -------------- | ---------------- | ---------- | ------------- | --- |
| ✅             | ✅               | ✅         | ✅            | ❌  |

### Demo

<p align="center">
	<img src="https://github.com/pchalupa/readme-assets/blob/main/expo-text-extractor.gif" alt="demo" width="75%" />
</p>

## Installation

To get started, install the library using Expo CLI:

```sh
npx expo install expo-text-extractor
```

> Ensure your project is running Expo SDK 52+.

### API Documentation

Check the [example app](https://github.com/pchalupa/expo-text-extractor/blob/main/example/App.tsx) for more details.

#### Supports Text Extraction

A boolean value indicating whether the current device supports text extraction.

```ts
const isSupported: boolean;
```

#### Extract Text From Image

Extracts text from an image file and returns the recognized text as an array.

```ts
async function extractTextFromImage(uri: string): Promise<string[]>;
```

#### Extract Text From Image Data

Extracts text from base64 encoded image data and returns the recognized text as an array.

```ts
async function extractTextFromImageData(base64Data: string): Promise<string[]>;
```

**Usage with expo-camera:**

```ts
import { Camera } from 'expo-camera';
import { extractTextFromImageData } from 'expo-text-extractor';

// Take a photo with base64 data
const photo = await camera.takePictureAsync({
  base64: true,
  quality: 0.8,
});

// Extract text from base64 data
const texts = await extractTextFromImageData(photo.base64);
```

**Usage with data URIs:**

```ts
// If you have a data URI, extract the base64 part
const dataUri = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...";
const base64Data = dataUri.split(',')[1];
const texts = await extractTextFromImageData(base64Data);
```
