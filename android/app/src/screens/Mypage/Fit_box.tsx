import React, {useState, useEffect} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useUser} from '../UserContext';
import {RootStackParamList} from '../../../../../App';
import {DATA_URL} from '../../Constant';
import path from 'path';

type FitBoxNavigationProp = StackNavigationProp<RootStackParamList, 'Fit_box'>;

const Fit_box: React.FC = () => {
  const {userEmail} = useUser();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  const fetchImagesFromBackend = async () => {
    try {
      const url = path.join(
        DATA_URL,
        'api',
        'fitStorageImages',
        'user',
        userEmail,
      );

      console.log('API 호출 URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        console.error('API 호출 실패:', response.status);
        throw new Error(`Failed to fetch images: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        // 최신순 정렬 후 배열 역순으로 변경
        const sortedData = data
          .sort(
            (a, b) =>
              extractTimestamp(b.fitStorageImg) -
              extractTimestamp(a.fitStorageImg),
          )
          .reverse(); // 역순 정렬로 최신 사진이 위로 오도록

        const imageUrls = sortedData.map(item => item.fitStorageImg);

        console.log('Sorted Image URLs:', imageUrls);
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

  const extractTimestamp = (imageName: string): number => {
    const match = imageName.match(/photo_(\d{8}T\d{6}\d{3}Z)\.jpg$/);
    if (match) {
      return new Date(match[1]).getTime();
    }
    return 0; // 타임스탬프 추출 실패 시 0 반환
  };

  const deleteImage = async (imageUri: string) => {
    try {
      console.log('삭제 요청 이미지 이름:', imageUri);

      const url = path.join(
        DATA_URL,
        'api',
        'fitStorageImages',
        'delete',
        imageUri,
      );

      console.log('API 호출 URL:', url);

      const response = await fetch(url, {
        method: 'DELETE',
      });

      const result = await response.json();
      console.log('삭제 API 응답:', result);

      if (response.ok) {
        setImages(prevImages => prevImages.filter(image => image !== imageUri));
        Alert.alert('성공', '이미지가 삭제되었습니다.');
      } else if (response.status === 404) {
        Alert.alert('오류', '이미지를 찾을 수 없습니다.');
      } else {
        Alert.alert('오류', result.message || '이미지 삭제 실패');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      Alert.alert('오류', '이미지 삭제 중 오류가 발생했습니다.');
    } finally {
      setSelectedImage(null);
    }
  };

  const navigateToReviewPage = (imageUri: string) => {
    navigation.navigate('WritePage', {selectedImageUri: imageUri});
  };

  return isLoading ? (
    <ActivityIndicator size="large" color="#0000ff" style={{flex: 1}} />
  ) : (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatListContent}
        data={images} // 최신순으로 정렬된 데이터 전달
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => setSelectedImage(item)}
            style={styles.imageWrapper}>
            <Image
              source={{
                uri: path.join(
                  DATA_URL,
                  'api',
                  'img',
                  'imgserve',
                  'fitstorageimg',
                  item,
                ),
              }}
              style={styles.image}
              resizeMode="cover"
              onError={e =>
                console.error('Image Load Error:', e.nativeEvent.error)
              }
            />
          </TouchableOpacity>
        )}
      />

      {selectedImage && (
        <Modal
          visible
          transparent
          onRequestClose={() => setSelectedImage(null)}>
          <View style={styles.modalContainer}>
            <Image
              source={{
                uri: path.join(
                  DATA_URL,
                  'api',
                  'img',
                  'imgserve',
                  'fitstorageimg',
                  selectedImage,
                ),
              }}
              style={styles.fullImage}
              resizeMode="contain"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedImage(null)}>
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteImage(selectedImage)}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatListContent: {
    paddingVertical: 20,
  },
  imageWrapper: {
    margin: 10,
    width: Dimensions.get('window').width * 0.45,
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
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
