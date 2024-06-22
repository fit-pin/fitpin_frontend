import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  ScrollView,
  Modal,
  TouchableOpacity,
  Platform,
  Text,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import {RootStackParamList} from '../../../../../App';

type FitBoxRouteProp = RouteProp<RootStackParamList, 'Fit_box'>;

const Fit_box = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const route = useRoute<FitBoxRouteProp>();
  const newPhotoUri = route.params?.newPhotoUri;

  // 새로운 사진이 추가되었을 때 이미지를 상태에 추가
  useEffect(() => {
    if (newPhotoUri) {
      setImages(prevImages => [...prevImages, newPhotoUri]);
    }
  }, [newPhotoUri]);

  // 기존 저장된 이미지를 로드
  useEffect(() => {
    const loadSavedImages = async () => {
      try {
        const dir =
          Platform.OS === 'android'
            ? `${RNFS.ExternalDirectoryPath}/FitBox`
            : `${RNFS.DocumentDirectoryPath}/FitBox`;
        const files = await RNFS.readDir(dir);
        const imageFiles = files.filter(
          file => file.name.endsWith('.jpg') || file.name.endsWith('.png'),
        );

        // 파일명 기준 정렬 (오래된 사진이 뒤로)
        const sortedImageFiles = imageFiles.sort((a, b) =>
          a.name < b.name ? 1 : -1,
        );

        const imageUris = sortedImageFiles.map(file => `file://${file.path}`);
        setImages(imageUris);
      } catch (error) {
        console.error('이미지를 로드하는 중 오류 발생:', error);
      }
    };

    loadSavedImages();
  }, []);

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.row}>
        {images.map((imageUri, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedImage(imageUri)}>
            <Image source={{uri: imageUri}} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
      {selectedImage && (
        <Modal
          visible={true}
          transparent={true}
          onRequestClose={() => setSelectedImage(null)}>
          <View style={styles.modalContainer}>
            <Image source={{uri: selectedImage}} style={styles.fullImage} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedImage(null)}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
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
  closeButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default Fit_box;
