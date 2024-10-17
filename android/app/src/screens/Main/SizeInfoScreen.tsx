import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUser } from '../UserContext';

type SizeInfoScreenRouteProp = RouteProp<RootStackParamList, 'SizeInfoScreen'>;
type SizeInfoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SizeInfoScreen'>;

const SizeInfoScreen: React.FC = () => {
  const route = useRoute<SizeInfoScreenRouteProp>();
  const navigation = useNavigation<SizeInfoScreenNavigationProp>();
  const { userEmail } = useUser();
  const { photoUri } = route.params;
  const [isUploading, setIsUploading] = useState(false);

  const generateTimestampedName = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    return `photo_${year}${month}${day}T${hours}${minutes}${seconds}${milliseconds}Z.jpg`;
  };

  const handleUploadImage = async () => {
    setIsUploading(true);
    const formData = new FormData();
    const timestampedName = generateTimestampedName();

    formData.append('userEmail', userEmail);
    formData.append('image', {
      uri: photoUri,
      type: 'image/jpeg',
      name: timestampedName,
    });

    try {
      console.log('Uploading image:', timestampedName);

      const response = await fetch(
        'http://fitpitback.kro.kr:8080/api/fitStorageImages/upload',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const result = await response.json();
      console.log('Upload result:', result);

      if (response.ok) {
        Alert.alert('성공', '사진이 핏 보관함에 저장되었습니다.');
        navigation.navigate('Fit_box', { fromUpload: true });
      } else {
        Alert.alert('업로드 실패', result.message || '업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('오류', '사진 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const goToWritePage = () => {
    navigation.navigate('WritePage', { selectedImageUri: photoUri });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>사이즈 정보를 알려드릴게요</Text>

      <View style={styles.imageContainer}>
        <Image source={{ uri: photoUri }} style={styles.image} />
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleUploadImage} 
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>사진 보관하기</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={goToWritePage}>
        <Text style={styles.buttonText}>다른 사람들과 사진 공유하기 →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 300,
    height: 400,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SizeInfoScreen;