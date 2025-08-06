import {
  launchCameraAsync,
  launchImageLibraryAsync,
  PermissionStatus,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import { extractTextFromImage, extractTextFromImageData, isSupported } from 'expo-text-extractor';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function App() {
  const [result, setResult] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string>();
  const [cameraPermission, setCameraPermission] = useState<PermissionStatus | null>(null);
  const [galleryPermission, setGalleryPermission] = useState<PermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingMethod, setProcessingMethod] = useState<'file' | 'base64'>('file');

  useEffect(() => {
    const getPermissions = async () => {
      const cameraPermissionResult = await requestCameraPermissionsAsync();
      setCameraPermission(cameraPermissionResult.status);

      const galleryPermissionResult = await requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryPermissionResult.status);
    };

    getPermissions();
  }, []);

  const processImage = async (path?: string, base64?: string) => {
    if (!path && !base64) return;

    if (path) setImageUri(path);
    setIsLoading(true);
    setResult([]);

    if (isSupported) {
      try {
        let extractedTexts: string[];
        
        if (base64) {
          // Use new base64 method
          setProcessingMethod('base64');
          extractedTexts = await extractTextFromImageData(base64);
        } else if (path) {
          // Use existing file method
          setProcessingMethod('file');
          extractedTexts = await extractTextFromImage(path);
        } else {
          throw new Error('No image data provided');
        }
        
        setResult(extractedTexts);
      } catch (error) {
        if (error instanceof Error) Alert.alert('Text Extraction Error', error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      Alert.alert('Not Supported', 'Text extraction is not supported on this device');
    }
  };

  const handleImagePick = async () => {
    try {
      if (galleryPermission !== PermissionStatus.GRANTED) {
        Alert.alert(
          'Permission Required',
          'Please grant access to your photo library to use this feature',
        );
        const { status } = await requestMediaLibraryPermissionsAsync();
        setGalleryPermission(status);
        if (status !== PermissionStatus.GRANTED) return;
      }

      const result = await launchImageLibraryAsync({
        mediaTypes: ['images'],
        base64: true, // Enable base64 for demonstration
      });

      if (!result.canceled) {
        const asset = result.assets?.[0];
        if (asset) {
          // Demonstrate both methods
          if (asset.base64) {
            await processImage(asset.uri, asset.base64);
          } else {
            await processImage(asset.uri);
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert('Image Pick Error', error.message);
    }
  };

  const handleCameraCapture = async () => {
    try {
      if (cameraPermission !== PermissionStatus.GRANTED) {
        Alert.alert(
          'Permission Required',
          'Please grant access to your camera to use this feature',
        );
        const { status } = await requestCameraPermissionsAsync();
        setCameraPermission(status);
        if (status !== PermissionStatus.GRANTED) return;
      }

      const result = await launchCameraAsync({
        mediaTypes: ['images'],
        base64: true, // Enable base64 for demonstration
        quality: 0.8, // Optimize size for better performance
      });

      if (!result.canceled) {
        const asset = result.assets?.[0];
        if (asset) {
          // Demonstrate both methods
          if (asset.base64) {
            await processImage(asset.uri, asset.base64);
          } else {
            await processImage(asset.uri);
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert('Camera Error', error.message);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.imageContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, isLoading && styles.disabledButton]}
              onPress={handleImagePick}
              disabled={isLoading}>
              <Text style={styles.buttonText}>Pick Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, isLoading && styles.disabledButton]}
              onPress={handleCameraCapture}
              disabled={isLoading}>
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.previewContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <Text style={styles.placeholderText}>No image selected</Text>
            )}
          </View>
        </View>
        <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.scrollContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6858e9" />
              <Text style={styles.loadingText}>Extracting text...</Text>
            </View>
          ) : result.length > 0 ? (
            <>
              <View style={styles.methodIndicator}>
                <Text style={styles.methodText}>
                  Method: {processingMethod === 'base64' ? 'Base64 Data' : 'File URI'}
                </Text>
              </View>
              {result.map((line, index) => <Text key={index}>{line}</Text>)}
            </>
          ) : (
            <Text style={styles.noResultsText}>No text detected</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    rowGap: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
  },
  button: {
    backgroundColor: '#6858e9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#b3aedb',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  scrollContainer: {
    padding: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6858e9',
  },
  noResultsText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  methodIndicator: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  methodText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});
