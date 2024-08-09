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
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { RootStackParamList } from '../../../../../App';
import { reqPost } from '../../utills/Request';
import { StackNavigationProp } from '@react-navigation/stack';

type FitBoxRouteProp = RouteProp<RootStackParamList, 'Fit_box'>;
type FitBoxNavigationProp = StackNavigationProp<RootStackParamList, 'Fit_box'>;

const Fit_box: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigation = useNavigation<FitBoxNavigationProp>();
  const route = useRoute<FitBoxRouteProp>();
  const newPhotoUri = route.params?.newPhotoUri;

  useEffect(() => {
    if (newPhotoUri) {
      setImages(prevImages => [...prevImages, newPhotoUri]);
    }
  }, [newPhotoUri]);

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

        const sortedImageFiles = imageFiles.sort((a, b) =>
          a.name < b.name ? 1 : -1,
        );

        const imageUris = sortedImageFiles.map(file => `file://${file.path}`);
        setImages(imageUris);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadSavedImages();
  }, []);

  const deleteImage = async (filePath: string) => {
    try {
      await RNFS.unlink(filePath);
      setImages(images.filter(image => image !== filePath));
      await reqPost('http://fitpitback.kro.kr:8080/api/deleteImage', { imageUri: filePath });
    } catch (error) {
      console.error('Error deleting image:', error);
      Alert.alert('Error', 'Failed to delete image.');
    }
  };

  const selectImage = (imageUri: string) => {
    navigation.navigate('WritePage', { selectedImageUri: imageUri });
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.row}>
        {images.map((imageUri, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => selectImage(imageUri)}>
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
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
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
});

export default Fit_box;