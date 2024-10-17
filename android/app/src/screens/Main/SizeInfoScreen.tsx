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
  const { userEmail } = useUser(); // 유저 이메일 가져오기
  const { photoUri } = route.params; // 전달된 이미지 URI
  const [isUploading, setIsUploading] = useState(false); // 업로드 로딩 상태

  // 이미지 업로드 핸들러
  const handleUploadImage = async () => {
    setIsUploading(true);
    const formData = new FormData();
    const imageName = photoUri.split('/').pop(); // 이미지 이름 추출

    formData.append('userEmail', userEmail);
    formData.append('image', {
      uri: photoUri,
      type: 'image/jpeg',
      name: imageName,
    });

    try {
      const response = await fetch(
        'http://fitpitback.kro.kr:8080/api/fitStorageImages/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert('성공', '사진이 핏 보관함에 저장되었습니다.');
        navigation.navigate('Fit_box'); // Fit_box 페이지로 이동
      } else {
        Alert.alert('업로드 실패', result.message);
      }
    } catch (error) {
      Alert.alert('오류', '사진 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const goToWritePage = () => {
    navigation.navigate('WritePage', { selectedImageUri: photoUri }); // WritePage로 이동
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