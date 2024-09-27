import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  ScrollView,
  Modal,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUser } from '../UserContext'; // 유저 이메일 정보 가져오기
import { RootStackParamList } from '../../../../../App';

type FitBoxNavigationProp = StackNavigationProp<RootStackParamList, 'Fit_box'>;

const Fit_box: React.FC = () => {
  const { userEmail } = useUser(); // 유저 이메일 가져오기
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigation = useNavigation<FitBoxNavigationProp>();

  const route = useRoute<RouteProp<RootStackParamList, 'Fit_box'>>(); 

  const fetchImagesFromBackend = async () => {
    try {
      const response = await fetch(`http://fitpitback.kro.kr:8080/api/fitStorageImages/user/${userEmail}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });
      const data = await response.json();
  
      console.log('Fetched data:', data);
  
      if (Array.isArray(data)) {
        // 타임스탬프 추출 후 최신순 정렬
        const sortedData = data.sort((a, b) => {
          const extractTimestamp = (fitStorageImgURL: string) => {
            const match = fitStorageImgURL.match(/photo_(\d{8}T\d{6}\d{3}Z)\.jpg$/);
            if (match) {
              const timestamp = match[1];
              // 날짜 형식을 변환하여 new Date()가 인식할 수 있도록 변경
              const formattedTimestamp = `${timestamp.slice(0, 4)}-${timestamp.slice(4, 6)}-${timestamp.slice(6, 8)}T${timestamp.slice(9, 11)}:${timestamp.slice(11, 13)}:${timestamp.slice(13, 15)}Z`;
              console.log(`Formatted timestamp: ${formattedTimestamp}`);
              return new Date(formattedTimestamp).getTime();
            }
            return 0;
          };
  
          const timeA = extractTimestamp(a.fitStorageImg);
          const timeB = extractTimestamp(b.fitStorageImg);
  
          console.log(`Time A: ${timeA}, Time B: ${timeB}`); // 타임스탬프 확인
          return timeB - timeA; // 최신순 정렬
        });
  
        // 정렬된 데이터를 기반으로 이미지 URL 생성
        const imageUrls = sortedData.map(item => 
          `http://fitpitback.kro.kr:8080/api/img/imgserve/fitstorageimg/${item.fitStorageImg}`
        );
        console.log('Sorted images:', imageUrls); // 정렬된 이미지 URL 확인
        setImages(imageUrls);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      Alert.alert('Error', 'Failed to fetch images.');
    }
  };
  
  useEffect(() => {
    fetchImagesFromBackend(); // 컴포넌트 마운트 시 이미지 목록 불러오기
  }, [userEmail]);

  useEffect(() => {
    if (route.params?.newPhotoUri) {
      console.log('New image uploaded to Fit_box:', route.params.newPhotoUri); 
      fetchImagesFromBackend(); 
    }
  }, [route.params?.newPhotoUri]);

  const deleteImage = async (imageUri: string) => {
    try {
      const imageName = imageUri.split('/').pop(); // 이미지 이름만 추출
      const response = await fetch(`http://fitpitback.kro.kr:8080/api/fitStorageImages/delete/${imageName}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.message.includes('이미지 삭제 성공')) {
        setImages(images.filter(image => image !== imageUri));
        Alert.alert('Success', 'Image deleted successfully.');
      } else if (response.status === 404) {
        Alert.alert('Error', 'Image not found.');
      } else {
        throw new Error(result.message || 'Failed to delete image.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error deleting image:', errorMessage);
      Alert.alert('Error', `Failed to delete image: ${errorMessage}`);
    }
  };

  const selectImage = (imageUri: string) => {
    setSelectedImage(imageUri); 
  };

  const navigateToReviewPage = (imageUri: string) => {
    navigation.navigate({
      name: 'WritePage',
      params: { selectedImageUri: imageUri },
    });
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.row}>
        {images.map((imageUri, index) => (
          <TouchableOpacity key={index} onPress={() => selectImage(imageUri)}>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
      {selectedImage && (
        <Modal
          visible={true}
          transparent={true}
          onRequestClose={() => setSelectedImage(null)}>
          <View style={styles.modalContainer}>
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedImage(null)}>
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  deleteImage(selectedImage);
                  setSelectedImage(null);
                }}>
                <Text style={styles.deleteButtonText}>삭제</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() => navigateToReviewPage(selectedImage)}>
                <Text style={styles.reviewButtonText}>리뷰 작성</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  image: {
    width: screenWidth * 0.45,
    height: screenWidth * 0.45,
    borderRadius: 10,
    marginBottom: 10,
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
