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
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUser } from '../UserContext';
import { RootStackParamList } from '../../../../../App';
import { DATA_URL } from '../../Constant';

type FitBoxNavigationProp = StackNavigationProp<RootStackParamList, 'Fit_box'>;
type FitBoxRouteProp = RouteProp<RootStackParamList, 'Fit_box'>;

const Fit_box: React.FC = () => {
  const { userEmail } = useUser();
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<FitBoxNavigationProp>();

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
      // 중복된 슬래시 문제 해결
      const url = `${DATA_URL}/api/fitStorageImages/user/${userEmail}`.replace(/([^:]\/)\/+/g, "$1");
      console.log('API 호출 URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        console.error('API 호출 실패:', response.status);
        throw new Error(`Failed to fetch images: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const imageUrls = data.map(
          (item) => `${DATA_URL}/api/img/imgserve/fitstorageimg/${item.fitStorageImg}`
        );
        setImages(imageUrls);
      } else {
        Alert.alert('알림', '저장된 사진이 없습니다.');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      Alert.alert('Error', 'Failed to fetch images.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImage = async (imageUri: string) => {
    try {
      const imageName = imageUri.split('/').pop();
      const response = await fetch(
        `${DATA_URL}/api/fitStorageImages/delete/${imageName}`,
        { method: 'DELETE' }
      );

      const result = await response.json();

      if (response.ok) {
        setImages(images.filter((image) => image !== imageUri));
        Alert.alert('성공', '이미지가 삭제되었습니다.');
      } else {
        Alert.alert('Error', result.message || '이미지 삭제 실패');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      Alert.alert('Error', '이미지 삭제 중 오류가 발생했습니다.');
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
            onPress={() => setSelectedImage(item)}
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
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedImage(null)}
              >
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
    width: Dimensions.get('window').width * 0.45,
  },
  leftAligned: {
    alignSelf: 'flex-start',
  },
  image: {
    width: Dimensions.get('window').width * 0.45,
    height: Dimensions.get('window').width * 0.45,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  fullImage: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.7,
    borderRadius: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width * 0.9,
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