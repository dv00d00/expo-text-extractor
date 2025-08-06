import ExpoModulesCore
import Vision

public class ExpoTextExtractorModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ExpoTextExtractor")

        Constants([
            "isSupported": true
        ])

        AsyncFunction("extractTextFromImage") { (url: URL, promise: Promise) in
            do {
                let imageData = try Data(contentsOf: url)
                let image = UIImage(data: imageData)
                guard let cgImage = image?.cgImage else {
                    throw Exception.init(name: "err", description: "err")
                }

                let requestHandler = VNImageRequestHandler(cgImage: cgImage)
                let request = VNRecognizeTextRequest { (request, error ) in
                    guard let observations = request.results as? [VNRecognizedTextObservation] else {
                        return promise.resolve([])
                    }

                    let recognizedTexts = observations.compactMap { observation in
                        observation.topCandidates(1).first?.string
                    }

                    promise.resolve(recognizedTexts)
                }

                try requestHandler.perform([request])
            } catch {
                promise.reject(error)
            }
        }

        AsyncFunction("extractTextFromImageData") { (base64Data: String, promise: Promise) in
            do {
                guard let imageData = Data(base64Encoded: base64Data) else {
                    throw Exception.init(name: "INVALID_BASE64", description: "Invalid base64 data")
                }
                
                let image = UIImage(data: imageData)
                guard let cgImage = image?.cgImage else {
                    throw Exception.init(name: "INVALID_IMAGE", description: "Unable to create image from data")
                }

                let requestHandler = VNImageRequestHandler(cgImage: cgImage)
                let request = VNRecognizeTextRequest { (request, error ) in
                    guard let observations = request.results as? [VNRecognizedTextObservation] else {
                        return promise.resolve([])
                    }

                    let recognizedTexts = observations.compactMap { observation in
                        observation.topCandidates(1).first?.string
                    }

                    promise.resolve(recognizedTexts)
                }

                try requestHandler.perform([request])
            } catch {
                promise.reject(error)
            }
        }
        
        AsyncFunction("extractTextFromImageWithDetails") { (url: URL, promise: Promise) in
            do {
                let imageData = try Data(contentsOf: url)
                let image = UIImage(data: imageData)
                guard let cgImage = image?.cgImage else {
                    throw Exception.init(name: "INVALID_IMAGE", description: "Unable to create image from file")
                }

                let requestHandler = VNImageRequestHandler(cgImage: cgImage)
                let request = VNRecognizeTextRequest { (request, error) in
                    guard let observations = request.results as? [VNRecognizedTextObservation] else {
                        return promise.resolve([])
                    }

                    let results = observations.compactMap { observation -> [String: Any]? in
                        guard let topCandidate = observation.topCandidates(1).first else { return nil }
                        
                        let boundingBox = observation.boundingBox
                        let imageSize = CGSize(width: cgImage.width, height: cgImage.height)
                        
                        // Convert normalized coordinates to pixel coordinates
                        let x = boundingBox.origin.x * imageSize.width
                        let y = (1.0 - boundingBox.origin.y - boundingBox.height) * imageSize.height // Flip Y coordinate
                        let width = boundingBox.width * imageSize.width
                        let height = boundingBox.height * imageSize.height
                        
                        return [
                            "text": topCandidate.string,
                            "confidence": topCandidate.confidence,
                            "boundingBox": [
                                "x": x,
                                "y": y,
                                "width": width,
                                "height": height
                            ]
                        ]
                    }

                    promise.resolve(results)
                }

                try requestHandler.perform([request])
            } catch {
                promise.reject(error)
            }
        }
        
        AsyncFunction("extractTextFromImageDataWithDetails") { (base64Data: String, promise: Promise) in
            do {
                guard let imageData = Data(base64Encoded: base64Data) else {
                    throw Exception.init(name: "INVALID_BASE64", description: "Invalid base64 data")
                }
                
                let image = UIImage(data: imageData)
                guard let cgImage = image?.cgImage else {
                    throw Exception.init(name: "INVALID_IMAGE", description: "Unable to create image from data")
                }

                let requestHandler = VNImageRequestHandler(cgImage: cgImage)
                let request = VNRecognizeTextRequest { (request, error) in
                    guard let observations = request.results as? [VNRecognizedTextObservation] else {
                        return promise.resolve([])
                    }

                    let results = observations.compactMap { observation -> [String: Any]? in
                        guard let topCandidate = observation.topCandidates(1).first else { return nil }
                        
                        let boundingBox = observation.boundingBox
                        let imageSize = CGSize(width: cgImage.width, height: cgImage.height)
                        
                        // Convert normalized coordinates to pixel coordinates
                        let x = boundingBox.origin.x * imageSize.width
                        let y = (1.0 - boundingBox.origin.y - boundingBox.height) * imageSize.height // Flip Y coordinate
                        let width = boundingBox.width * imageSize.width
                        let height = boundingBox.height * imageSize.height
                        
                        return [
                            "text": topCandidate.string,
                            "confidence": topCandidate.confidence,
                            "boundingBox": [
                                "x": x,
                                "y": y,
                                "width": width,
                                "height": height
                            ]
                        ]
                    }

                    promise.resolve(results)
                }

                try requestHandler.perform([request])
            } catch {
                promise.reject(error)
            }
        }
    }
}
