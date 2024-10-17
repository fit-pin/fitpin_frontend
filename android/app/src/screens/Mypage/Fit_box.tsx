import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Modal,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUser } from '../UserContext';
import { RootStackParamList } from '../../../../../App';
import path from 'path';
import { DATA_URL } from '../../Constant';
import { reqGet } from '../../utills/Request';

type FitBoxNavigationProp = StackNavigationProp<RootStackParamList, 'Fit_box'>;
type FitBoxRouteProp = RouteProp<RootStackParamList, 'Fit_box'>;

const Fit_box: React.FC = () => {
  const { userEmail } = useUser();
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<FitBoxNavigationProp>();
  const route = useRoute<FitBoxRouteProp>();
  const isFromUpload = route.params?.fromUpload ?? false;
  const backPressed = useRef(false); // 뒤로가기 중복 방지

  useEffect(() => {
    const fetchImages = async () => {
      if (userEmail) {
        await fetchImagesFromBackend();
      }
    };
    fetchImages();
  }, [userEmail]);

  const fetchImagesFromBackend = async () => {
    try {
      const response = await reqGet(
        path.join(DATA_URL, 'api', 'fitStorageImages', 'user', userEmail!!)
      );
      const data = await response;

      if (Array.isArray(data)) {
        console.log('Fetched Data:', data);

        const sortedData = data
          .map(item => ({
            ...item,
            timestamp: extractTimestamp(item.fitStorageImg),
          }))
          .sort((a, b) => b.timestamp - a.timestamp); // 최신순 정렬

        const imageUrls = sortedData.map(item =>
          encodeURI(
            path.join(
              DATA_URL,
              'api',
              'img',
              'imgserve',
              'fitstorageimg',
              item.fitStorageImg!!
            )
          )
        );

        console.log('Sorted Image URLs:', imageUrls);
        setImages(imageUrls);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      Alert.alert('Error', 'Failed to fetch images.');
    } finally {
      setIsLoading(false);
    }
  };

  const extractTimestamp = (imageName: string): number => {
    const match = imageName.match(/^photo_(\d{8}T\d{6}\d{3}Z)\.jpg$/);

    if (match) {
      console.log(`Extracted Timestamp: ${match[1]}`);
      return new Date(match[1]).getTime(); // 타임스탬프 반환
    } else {
      console.warn(`Invalid image format: ${imageName}`);
      return 0; // 형식이 맞지 않는 경우 0 반환
    }
  };

  const selectImage = (imageUri: string) => {
    setSelectedImage(imageUri);
  };

  const deleteImage = async (imageUri: string) => {
    try {
      const imageName = imageUri.split('/').pop();
      const response = await fetch(
        path.join(DATA_URL, 'api', 'fitStorageImages', 'delete', imageName!!),
        { method: 'DELETE', headers: { Accept: 'application/json' } }
      );

      const result = await response.json();

      if (response.ok && result.message.includes('이미지 삭제 성공')) {
        setImages(images.filter(image => image !== imageUri));
        Alert.alert('Success', 'Image deleted successfully.');
      } else {
        Alert.alert('Error', result.message || 'Failed to delete image.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete image.');
    } finally {
      setSelectedImage(null);
    }
  };

  const navigateToReviewPage = (imageUri: string) => {
    navigation.navigate('WritePage', { selectedImageUri: imageUri });
  };

  return isLoading ? (
    <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />
  ) : (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatListContent}
        data={images}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => selectImage(item)}
            style={[
              styles.imageWrapper,
              index % 2 === 0 ? styles.leftAligned : {},
            ]}
          >
            <Image source={{ uri: item }} style={styles.image} />
          </TouchableOpacity>
        )}
      />

      {selectedImage && (
        <Modal visible transparent onRequestClose={() => setSelectedImage(null)}>
          <View style={styles.modalContainer}>
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedImage(null)}>
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteImage(selectedImage)}
              >
                <Text style={styles.deleteButtonText}>삭제</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() => navigateToReviewPage(selectedImage)}
              >
                <Text style={styles.reviewButtonText}>리뷰 작성</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatListContent: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 20,
  },
  imageWrapper: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth * 0.45,
  },
  leftAligned: {
    alignSelf: 'flex-start',
  },
  image: {
    width: screenWidth * 0.45,
    height: screenWidth * 0.45,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  fullImage: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.7,
    borderRadius: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth * 0.9,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  reviewButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Fit_box;