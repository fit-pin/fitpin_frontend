import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../../App';
import {reqFileUpload} from '../../utills/Request'; // API 요청 함수
import {useUser} from '../UserContext'; // 유저 정보를 가져오는 컨텍스트
import {DATA_URL} from '../../Constant';
import path from 'path';

type CameraBodyPhotoNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CameraBodyPhoto'
>;

const CameraBodyPhoto = () => {
  const {userEmail} = useUser(); // 유저 이메일 가져오기
  const [hasPermission, setHasPermission] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<RNCamera | null>(null);
  const navigation = useNavigation<CameraBodyPhotoNavigationProp>();

  const requestCameraPermission = async () => {
    const result =
      Platform.OS === 'android'
        ? await request(PERMISSIONS.ANDROID.CAMERA)
        : await request(PERMISSIONS.IOS.CAMERA);

    if (result === RESULTS.GRANTED) {
      setHasPermission(true);
    } else {
      setHasPermission(false);
      if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
        Alert.alert(
          'Permission Denied',
          'Camera permission is required to take photos.',
        );
      }
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <TouchableOpacity
          onPress={() =>
            openSettings().catch(() => console.warn('Cannot open settings'))
          }
          style={styles.settingsButton}>
          <Text style={styles.buttonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const data = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: false,
        });
        setPhotoUri(data.uri);
      } catch (error) {
        console.error('Failed to take picture', error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const uploadToBackend = async (localUri: string) => {
    const formData = new FormData();
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');

    formData.append('image', {
      uri: localUri,
      name: `photo_${timestamp}.jpg`,
      type: 'image/jpeg',
    });
    formData.append('userEmail', userEmail);

    try {
      // 이미지 업로드
      const response = await reqFileUpload(
        path.join(DATA_URL, 'api', 'fitStorageImages', 'upload'),
        formData,
      );

      if (response.ok) {
        console.log('업로드 성공:', response.data);
        return response.data; // 업로드 성공 시 서버 응답 반환
      } else {
        throw new Error(response.data);
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      Alert.alert('Error', 'Failed to upload image.');
    }
  };

  const confirmPicture = async () => {
    if (photoUri) {
      const uploadResponse = await uploadToBackend(photoUri);
      if (uploadResponse) {
        Alert.alert('Success', 'Image uploaded successfully.' + uploadResponse);
        navigation.replace('Fit_box');
      } else {
        Alert.alert('Error', 'Failed to upload image.');
      }
      setPhotoUri(null);
    }
  };

  const retakePicture = () => {
    setPhotoUri(null);
  };

  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{uri: photoUri}} style={styles.preview} />
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={confirmPicture}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={retakePicture}>
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RNCamera ref={cameraRef} style={styles.preview} captureAudio={false} />
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#fff',
  },
  innerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  actionButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
  },
  settingsButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default CameraBodyPhoto;
