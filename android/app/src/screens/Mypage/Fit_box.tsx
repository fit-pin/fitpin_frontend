import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, ScrollView, Platform } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { RootStackParamList } from '../../../../../App';

type FitBoxRouteProp = RouteProp<RootStackParamList, 'Fit_box'>;

const Fit_box = () => {
  const [images, setImages] = useState<string[]>([]);
  const route = useRoute<FitBoxRouteProp>();
  const newPhotoUri = route.params?.newPhotoUri;

  useEffect(() => {
    if (newPhotoUri) {
      setImages((prevImages) => [...prevImages, newPhotoUri]);
    }
  }, [newPhotoUri]);

  useEffect(() => {
    const loadSavedImages = async () => {
      try {
        const dir = Platform.OS === 'android' ? `${RNFS.ExternalDirectoryPath}/FitBox` : `${RNFS.DocumentDirectoryPath}/FitBox`;
        const files = await RNFS.readDir(dir);
        const imageFiles = files.filter((file) => file.name.endsWith('.jpg') || file.name.endsWith('.png'));

        // 파일명을 기준으로 정렬 (오래된 사진이 뒤로)
        const sortedImageFiles = imageFiles.sort((a, b) => (a.name < b.name ? 1 : -1));

        const imageUris = sortedImageFiles.map((file) => `file://${file.path}`);
        setImages(imageUris);
      } catch (error) {
        console.error('Error loading saved images:', error);
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
          <Image key={index} source={{ uri: imageUri }} style={styles.image} />
        ))}
      </View>
    </ScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;

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
});

export default Fit_box;