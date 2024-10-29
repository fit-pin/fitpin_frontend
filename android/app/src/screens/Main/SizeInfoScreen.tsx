import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  LayoutChangeEvent,
  Dimensions,
} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../../App';
import {useUser} from '../UserContext';

type SizeInfoScreenRouteProp = RouteProp<RootStackParamList, 'SizeInfoScreen'>;
type SizeInfoScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SizeInfoScreen'
>;

const SizeInfoScreen: React.FC = () => {
  const route = useRoute<SizeInfoScreenRouteProp>();
  const navigation = useNavigation<SizeInfoScreenNavigationProp>();
  const {userEmail} = useUser();
  const {photoUri} = route.params;
  const [isUploading, setIsUploading] = useState(false);
  const [imageWidth, setImageWidth] = useState(300); // 초기 값 설정

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
        },
      );

      const result = await response.json();
      console.log('Upload result:', result);

      if (response.ok) {
        Alert.alert('성공', '사진이 핏 보관함에 저장되었습니다.');
        navigation.navigate('Fit_box', {fromUpload: true});
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
    navigation.navigate('WritePage', {selectedImageUri: photoUri});
  };

  const handleImageLayout = (event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    setImageWidth(width); // 이미지의 실제 가로 길이 저장
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>사이즈 정보를 알려드릴게요</Text>

      <View style={styles.imageContainer}>
        <Image
          source={{uri: photoUri}}
          style={styles.image}
          onLayout={handleImageLayout}
        />
      </View>

      <View style={[styles.buttonContainer, {width: imageWidth}]}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleUploadImage}
          disabled={isUploading}>
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
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.03,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    textAlign: 'left',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
    marginLeft: width * 0.08,
    marginBottom: height * 0.02,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  image: {
    width: width * 0.9,
    height: height * 0.5,
    resizeMode: 'contain',
    marginBottom: height * 0.02,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: height * 0.018,
    marginVertical: height * 0.01,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: height * 0.015,
    width: width * 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.042,
    fontWeight: 'bold',
  },
});

export default SizeInfoScreen;
