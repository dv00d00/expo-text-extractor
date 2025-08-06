package expo.modules.textextractor

import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Base64
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File

class ExpoTextExtractorModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoTextExtractor")

    Constants(
      "isSupported" to true
    )

    AsyncFunction("extractTextFromImage") { uriString: String, promise: Promise ->
      try {
        val context = appContext.reactContext!!
        val uri = if (uriString.startsWith("content://")) {
          Uri.parse(uriString)
        } else {
          val file = File(uriString)
          if (!file.exists()) {
            throw Exception("File not found: $uriString")
          }
          Uri.fromFile(file)
        }

        val inputImage = InputImage.fromFilePath(context, uri)
        val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

        recognizer.process(inputImage)
          .addOnSuccessListener { visionText ->
            val recognizedTexts = visionText.textBlocks.map { it.text }

            promise.resolve(recognizedTexts)
          }
          .addOnFailureListener { error ->
            promise.reject(CodedException("err", error))
          }
      } catch (error: Exception) {
        promise.reject(CodedException("UNKNOWN_ERROR", error.message ?: "Unknown error", error))
      }
    }

    AsyncFunction("extractTextFromImageData") { base64Data: String, promise: Promise ->
      try {
        val imageBytes = Base64.decode(base64Data, Base64.DEFAULT)
        val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
        
        if (bitmap == null) {
          promise.reject(CodedException("INVALID_IMAGE", "Unable to decode image from base64 data"))
          return@AsyncFunction
        }

        val inputImage = InputImage.fromBitmap(bitmap, 0)
        val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

        recognizer.process(inputImage)
          .addOnSuccessListener { visionText ->
            val recognizedTexts = visionText.textBlocks.map { it.text }
            promise.resolve(recognizedTexts)
          }
          .addOnFailureListener { error ->
            promise.reject(CodedException("TEXT_RECOGNITION_ERROR", error.message ?: "Text recognition failed", error))
          }
      } catch (error: Exception) {
        promise.reject(CodedException("UNKNOWN_ERROR", error.message ?: "Unknown error", error))
      }
    }

    AsyncFunction("extractTextFromImageWithDetails") { uriString: String, promise: Promise ->
      try {
        val context = appContext.reactContext!!
        val uri = if (uriString.startsWith("content://")) {
          Uri.parse(uriString)
        } else {
          val file = File(uriString)
          if (!file.exists()) {
            throw Exception("File not found: $uriString")
          }
          Uri.fromFile(file)
        }

        val inputImage = InputImage.fromFilePath(context, uri)
        val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

        recognizer.process(inputImage)
          .addOnSuccessListener { visionText ->
            val results = visionText.textBlocks.map { textBlock ->
              mapOf(
                "text" to textBlock.text,
                "confidence" to (textBlock.confidence ?: 0.5f), // ML Kit doesn't always provide confidence
                "boundingBox" to mapOf(
                  "x" to textBlock.boundingBox?.left,
                  "y" to textBlock.boundingBox?.top,
                  "width" to textBlock.boundingBox?.width(),
                  "height" to textBlock.boundingBox?.height()
                )
              )
            }
            promise.resolve(results)
          }
          .addOnFailureListener { error ->
            promise.reject(CodedException("TEXT_RECOGNITION_ERROR", error.message ?: "Text recognition failed", error))
          }
      } catch (error: Exception) {
        promise.reject(CodedException("UNKNOWN_ERROR", error.message ?: "Unknown error", error))
      }
    }

    AsyncFunction("extractTextFromImageDataWithDetails") { base64Data: String, promise: Promise ->
      try {
        val imageBytes = Base64.decode(base64Data, Base64.DEFAULT)
        val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
        
        if (bitmap == null) {
          promise.reject(CodedException("INVALID_IMAGE", "Unable to decode image from base64 data"))
          return@AsyncFunction
        }

        val inputImage = InputImage.fromBitmap(bitmap, 0)
        val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

        recognizer.process(inputImage)
          .addOnSuccessListener { visionText ->
            val results = visionText.textBlocks.map { textBlock ->
              mapOf(
                "text" to textBlock.text,
                "confidence" to (textBlock.confidence ?: 0.5f), // ML Kit doesn't always provide confidence
                "boundingBox" to mapOf(
                  "x" to textBlock.boundingBox?.left,
                  "y" to textBlock.boundingBox?.top,
                  "width" to textBlock.boundingBox?.width(),
                  "height" to textBlock.boundingBox?.height()
                )
              )
            }
            promise.resolve(results)
          }
          .addOnFailureListener { error ->
            promise.reject(CodedException("TEXT_RECOGNITION_ERROR", error.message ?: "Text recognition failed", error))
          }
      } catch (error: Exception) {
        promise.reject(CodedException("UNKNOWN_ERROR", error.message ?: "Unknown error", error))
      }
    }
  }
}
