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

  // 라우트 타입 정의 수정
  const route = useRoute<RouteProp<RootStackParamList, 'Fit_box'>>(); 

  // 백엔드에서 이미지 목록 불러오기
  const fetchImagesFromBackend = async () => {
    try {
      const response = await fetch(`http://fitpitback.kro.kr:8080/api/fitStorageImages/user/${userEmail}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        const imageUrls = data.map(item => `http://fitpitback.kro.kr:8080${item.fitStorageImgURL}`);
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
      console.log('New image uploaded to Fit_box:', route.params.newPhotoUri); // 로그 추가
      fetchImagesFromBackend(); // 새로운 이미지가 업로드되었을 때 다시 불러오기
    }
  }, [route.params?.newPhotoUri]);

  // 이미지 삭제 기능
  const deleteImage = async (imageUri: string) => {
    try {
      const imagePath = imageUri.replace('http://fitpitback.kro.kr:8080', ''); // 서버 경로 추출

      // FormData 사용
      const formData = new FormData();
      formData.append('fitStorageImgURL', imagePath);
      formData.append('userEmail', userEmail);

      const response = await fetch('http://fitpitback.kro.kr:8080/api/fitStorageImages/delete', {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
        body: formData, // JSON 대신 FormData 전송
      });

      const result = await response.json();

      if (response.ok && result.message.includes('이미지 삭제 성공')) {
        setImages(images.filter(image => image !== imageUri)); // 삭제된 이미지 목록에서 제거
        Alert.alert('Success', 'Image deleted successfully.');
      } else if (response.status === 404) {
        Alert.alert('Error', 'Image not found.');
      } else {
        throw new Error(result.message || 'Failed to delete image.');
      }
    } catch (error) {
      // Error 객체로 캐스팅하여 처리
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error deleting image:', errorMessage);
      Alert.alert('Error', `Failed to delete image: ${errorMessage}`);
    }
  };

  // 이미지 클릭 처리 수정
  const selectImage = (imageUri: string) => {
    setSelectedImage(imageUri);  // 이미지를 선택해서 모달을 표시
  };

  // 모달 내에서 리뷰 작성 페이지로 이동
  const navigateToReviewPage = (imageUri: string) => {
    setSelectedImage(null); // 모달을 닫기
    navigation.navigate('WritePage', { selectedImageUri: imageUri }); // 리뷰 작성 페이지로 이동
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
    justifyContent: 'space-between', // 버튼 간격을 더 많이 띄움
    width: screenWidth * 0.9, // 버튼들이 더 넓은 공간을 차지하도록 설정
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10, // 버튼 크기와 패딩을 조금 줄임
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10, // 패딩을 조금 줄임
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